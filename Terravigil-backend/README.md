# TerraVigil Backend (FastAPI)

AI-Powered Mining Activity Detection & Monitoring Tool.

## Setup

1. Create and activate a virtual environment (optional but recommended).
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the server

```bash
uvicorn api:app --reload
```

Then open `http://127.0.0.1:8000/docs` for Swagger UI.

## Project Structure

```
Terravigil-backend/
├── api.py
├── detection.py
├── boundary_check.py
├── volume_estimation.py
├── utils/
│   └── geo_utils.py
├── data/
├── requirements.txt
└── README.md
```

## Endpoints

- `GET /` → Health message
- `POST /detect_mining` → Upload satellite GeoTIFF. Returns mining polygons (GeoJSON) and area (ha).
- `POST /illegal_mining` → Upload mining polygons (GeoJSON) and boundary (zipped shapefile or GeoJSON). Returns legal vs illegal polygons and area stats.
- `POST /volume_estimation` → Upload DEM (GeoTIFF) and optional mining GeoJSON. Returns baseline elevation, depths, and volume using Simpson’s rule.

## Example cURL

Detect mining:

```bash
curl -X POST -F "file=@data/sentinel.tif" http://127.0.0.1:8000/detect_mining
```

Illegal vs legal mining:

```bash
curl -X POST \
  -F "mining_geojson_file=@data/mining.geojson" \
  -F "boundary_file=@data/boundary.zip" \
  http://127.0.0.1:8000/illegal_mining
```

Volume estimation:

```bash
curl -X POST \
  -F "dem_file=@data/dem.tif" \
  -F "mining_geojson_file=@data/mining.geojson" \
  http://127.0.0.1:8000/volume_estimation
```

## Notes

- DEM and imagery should be georeferenced GeoTIFFs.
- For shapefiles, provide a ZIP containing all necessary files (.shp, .shx, .dbf, .prj).
- Areas are computed in an equal-area projection when possible.


