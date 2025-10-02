from fastapi import FastAPI, UploadFile, File, HTTPException, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.multipart import MultipartMiddleware
from typing import Optional, Dict, Any
import json
import os
import asyncio
import uuid
import time
from threading import Lock
import tempfile
import urllib.request

import geopandas as gpd

from detection import detect_mining
from boundary_check import check_boundary
from volume_estimation import estimate_volume
from utils.geo_utils import save_upload_file_tmp


app = FastAPI(title="TerraVigil Backend", description="AI-Powered Mining Activity Detection & Monitoring Tool", version="1.0.0")

# --- Global task storage for progress tracking ---
task_storage: Dict[str, Dict[str, Any]] = {}
task_lock = Lock()

# --- CORS Middleware Configuration ---
# This allows your React frontend to communicate with this backend
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Increase multipart upload limits to allow large GeoTIFF/DEM files (e.g., up to 1 GB)
app.add_middleware(MultipartMiddleware, max_file_size=1024 * 1024 * 1024)


def update_task_status(task_id: str, status: str, progress: int = 0, result: Any = None, error: str = None):
    """Update task status in global storage"""
    with task_lock:
        if task_id in task_storage:
            task_storage[task_id].update({
                "status": status,
                "progress": progress,
                "updated_at": time.time()
            })
            if result is not None:
                task_storage[task_id]["result"] = result
            if error is not None:
                task_storage[task_id]["error"] = error


def run_detection_task(task_id: str, file_path: str):
    """Background task for mining detection"""
    try:
        update_task_status(task_id, "processing", 5)
        
        # Check file size and give progress updates
        file_size = os.path.getsize(file_path)
        update_task_status(task_id, "processing", 15)
        
        # Run detection with progress updates
        update_task_status(task_id, "processing", 25)
        result = detect_mining(file_path)
        update_task_status(task_id, "processing", 90)
        
        update_task_status(task_id, "completed", 100, result)
        
        # Cleanup
        try:
            os.remove(file_path)
        except Exception:
            pass
            
    except Exception as e:
        update_task_status(task_id, "failed", 0, error=str(e))
        # Cleanup on error
        try:
            os.remove(file_path)
        except Exception:
            pass


@app.get("/")
async def root():
    return {"message": "TerraVigil backend running. Visit /docs for API UI."}


@app.post("/detect_mining")
async def detect_mining_endpoint(file: UploadFile = File(...)):
    """Legacy synchronous endpoint - may timeout on large files"""
    try:
        tmp_path = save_upload_file_tmp(file)
        # Run the heavy AI function in a background thread to keep the server responsive
        result = await asyncio.to_thread(detect_mining, tmp_path)
        try:
            os.remove(tmp_path)
        except Exception:
            pass
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/detect_mining_async")
async def detect_mining_async_endpoint(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Start mining detection as background task - returns task ID for progress tracking"""
    try:
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Save uploaded file
        tmp_path = save_upload_file_tmp(file)
        
        # Initialize task in storage
        with task_lock:
            task_storage[task_id] = {
                "status": "queued",
                "progress": 0,
                "created_at": time.time(),
                "updated_at": time.time(),
                "filename": file.filename
            }
        
        # Start background task
        background_tasks.add_task(run_detection_task, task_id, tmp_path)
        
        return JSONResponse(content={
            "task_id": task_id,
            "status": "queued",
            "message": "Mining detection started. Use /task_status/{task_id} to check progress."
        })
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/task_status/{task_id}")
async def get_task_status(task_id: str):
    """Get status of background task"""
    with task_lock:
        if task_id not in task_storage:
            raise HTTPException(status_code=404, detail="Task not found")
        
        task_info = task_storage[task_id].copy()
    
    return JSONResponse(content=task_info)


@app.delete("/task/{task_id}")
async def cancel_task(task_id: str):
    """Cancel/delete a task"""
    with task_lock:
        if task_id not in task_storage:
            raise HTTPException(status_code=404, detail="Task not found")
        
        task_storage[task_id]["status"] = "cancelled"
    
    return JSONResponse(content={"message": "Task cancelled"})


@app.get("/tasks")
async def list_tasks():
    """List all tasks"""
    with task_lock:
        tasks = task_storage.copy()
    
    return JSONResponse(content=tasks)


def _download_dem_from_opentopography(west: float, south: float, east: float, north: float, demtype: str = "COP30") -> str:
    """Download a DEM GeoTIFF covering the bbox from OpenTopography GlobalDEM API and return temp file path.
    demtype options include: COP30 (global 30m), SRTMGL1 (1 arc-sec), SRTMGL3 (3 arc-sec).
    """
    # Ensure bbox ordering and clamp
    west, south, east, north = float(west), float(south), float(east), float(north)
    if east < west:
        west, east = east, west
    if north < south:
        south, north = north, south

    base_url = (
        "https://portal.opentopography.org/API/globaldem?"
        f"demtype={demtype}&west={west}&south={south}&east={east}&north={north}&outputFormat=GTiff"
    )
    fd, tmp_path = tempfile.mkstemp(suffix=".tif")
    os.close(fd)
    try:
        urllib.request.urlretrieve(base_url, tmp_path)
        if os.path.getsize(tmp_path) == 0:
            raise RuntimeError("Downloaded DEM is empty")
        return tmp_path
    except Exception as e:
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass
        raise HTTPException(status_code=502, detail=f"DEM download failed: {str(e)}")


@app.post("/auto_volume_estimation")
async def auto_volume_estimation_endpoint(
    mining_geojson_str: str = Form(...),
    demtype: str = Form("COP30")
):
    """Fetch DEM automatically for the mining area and run volume estimation.
    Accepts GeoJSON (string) describing the mining polygons.
    """
    try:
        geojson_data = json.loads(mining_geojson_str)
        gdf = gpd.GeoDataFrame.from_features(geojson_data.get("features", []), crs=4326)
        if gdf.empty:
            raise HTTPException(status_code=400, detail="Empty GeoJSON provided")
        # Compute bbox in lon/lat
        minx, miny, maxx, maxy = gdf.total_bounds

        # Download DEM from OpenTopography
        dem_path = await asyncio.to_thread(_download_dem_from_opentopography, minx, miny, maxx, maxy, demtype)

        # Run volume estimation
        result = await asyncio.to_thread(estimate_volume, dem_path, geojson_data)

        try:
            os.remove(dem_path)
        except Exception:
            pass

        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/illegal_mining")
async def illegal_mining_endpoint(
    mining_geojson_file: UploadFile = File(...),
    boundary_file: Optional[UploadFile] = File(None)
):
    try:
        mining_geojson = json.loads((await mining_geojson_file.read()).decode("utf-8"))

        boundary_path = None
        boundary_geojson = None
        if boundary_file is not None:
            filename = boundary_file.filename or "boundary"
            if filename.lower().endswith(".zip"):
                boundary_path = save_upload_file_tmp(boundary_file)
            else:
                boundary_geojson = json.loads((await boundary_file.read()).decode("utf-8"))

        # Run the heavy check in a background thread
        result = await asyncio.to_thread(check_boundary, mining_geojson=mining_geojson, boundary_path=boundary_path, boundary_geojson=boundary_geojson)

        if boundary_path and os.path.exists(boundary_path):
            try:
                os.remove(boundary_path)
            except Exception:
                pass
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/volume_estimation")
async def volume_estimation_endpoint(
    dem_file: UploadFile = File(...),
    # UPDATED to correctly receive the GeoJSON string from the FormData
    mining_geojson_str: str = Form(...)
):
    try:
        dem_path = save_upload_file_tmp(dem_file)
        mask_geojson = None
        if mining_geojson_str:
            # Load the JSON from the string sent by the frontend
            mask_geojson = json.loads(mining_geojson_str)

        # Run the heavy estimation in a background thread
        result = await asyncio.to_thread(estimate_volume, dem_path, mask_geojson=mask_geojson)

        try:
            os.remove(dem_path)
        except Exception:
            pass
        return JSONResponse(content=result)
    except Exception as e:
        # Return richer error context for debugging
        raise HTTPException(status_code=400, detail=f"volume_estimation failed: {type(e).__name__}: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
