import os
import io
import json
import tempfile
from typing import Tuple, Optional, Dict, Any

import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.transform import Affine
from rasterio.mask import mask as rio_mask
import geopandas as gpd
from shapely.geometry import shape, mapping, Polygon, MultiPolygon
from fastapi import UploadFile


def load_raster(path: str):
    return rasterio.open(path)


def save_upload_file_tmp(upload_file: UploadFile) -> str:
    suffix = os.path.splitext(upload_file.filename or "upload.bin")[1]
    fd, tmp_path = tempfile.mkstemp(suffix=suffix)
    with os.fdopen(fd, "wb") as out:
        out.write(upload_file.file.read())
    return tmp_path


def raster_mask_to_polygons(mask: np.ndarray, transform: Affine, crs: Any) -> Dict[str, Any]:
    mask = mask.astype(np.uint8)
    results = []
    for geom, val in shapes(mask, mask=mask.astype(bool), transform=transform):
        if val == 1:
            results.append({
                "type": "Feature",
                "properties": {},
                "geometry": geom
            })
    geojson = {"type": "FeatureCollection", "features": results}
    # Clean invalid geometries via GeoPandas buffer(0)
    if len(results) > 0:
        gdf = gpd.GeoDataFrame.from_features(results, crs=crs)
        gdf["geometry"] = gdf["geometry"].buffer(0)
        return geojson_from_gdf(gdf)
    return geojson


def load_shapefile_from_zip(zip_path: str) -> gpd.GeoDataFrame:
    # geopandas can read from zip file directly using the path with 'zip://' prefix
    return gpd.read_file(f"zip://{zip_path}")


def geojson_from_gdf(gdf: gpd.GeoDataFrame) -> Dict[str, Any]:
    gdf = gdf.explode(index_parts=False, ignore_index=True)
    return json.loads(gdf.to_json())


def calculate_area_ha(gdf: gpd.GeoDataFrame) -> float:
    if gdf.empty:
        return 0.0
    # Reproject to equal-area projection if geographic
    if gdf.crs is None:
        # assume EPSG:4326 and project to World Cylindrical Equal Area
        gdf = gdf.set_crs(4326, allow_override=True)
    try:
        area_gdf = gdf.to_crs(6933)  # World Cylindrical Equal Area
    except Exception:
        # fallback to Web Mercator
        area_gdf = gdf.to_crs(3857)
    area_m2 = area_gdf.geometry.area.sum()
    return float(area_m2 / 10000.0)


def mask_raster_with_geojson(src: rasterio.io.DatasetReader, mask_geojson: Dict[str, Any]):
    geometries = [feat["geometry"] for feat in mask_geojson.get("features", [])]
    if not geometries:
        return src.read(), src.transform
    out_image, out_transform = rio_mask(src, geometries, crop=False)
    return out_image, out_transform


