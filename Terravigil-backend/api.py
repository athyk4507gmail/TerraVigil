from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from typing import Optional
import json
import os
import tempfile

from detection import detect_mining
from boundary_check import check_boundary
from volume_estimation import estimate_volume
from utils.geo_utils import save_upload_file_tmp


app = FastAPI(title="TerraVigil Backend", description="AI-Powered Mining Activity Detection & Monitoring Tool", version="1.0.0")


@app.get("/")
async def root():
    return {"message": "MineGuard backend running. Visit /docs for API UI."}


@app.post("/detect_mining")
async def detect_mining_endpoint(file: UploadFile = File(...)):
    try:
        tmp_path = save_upload_file_tmp(file)
        result = detect_mining(tmp_path)
        try:
            os.remove(tmp_path)
        except Exception:
            pass
        return JSONResponse(content=result)
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
                # zipped shapefile
                boundary_path = save_upload_file_tmp(boundary_file)
            else:
                # assume geojson
                boundary_geojson = json.loads((await boundary_file.read()).decode("utf-8"))

        result = check_boundary(mining_geojson=mining_geojson, boundary_path=boundary_path, boundary_geojson=boundary_geojson)

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
    mining_geojson_file: Optional[UploadFile] = File(None)
):
    try:
        dem_path = save_upload_file_tmp(dem_file)
        mask_geojson = None
        if mining_geojson_file is not None:
            mask_geojson = json.loads((await mining_geojson_file.read()).decode("utf-8"))

        result = estimate_volume(dem_path, mask_geojson=mask_geojson)

        try:
            os.remove(dem_path)
        except Exception:
            pass

        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)


