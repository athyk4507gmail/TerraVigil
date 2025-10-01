from typing import Dict, Any, Optional
import json
import geopandas as gdf
import geopandas as gpd

from utils.geo_utils import load_shapefile_from_zip, geojson_from_gdf, calculate_area_ha


def check_boundary(mining_geojson: Dict[str, Any], boundary_path: Optional[str] = None, boundary_geojson: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    mining = gpd.GeoDataFrame.from_features(mining_geojson.get("features", []))

    if boundary_geojson is not None:
        boundary = gpd.GeoDataFrame.from_features(boundary_geojson.get("features", []))
    elif boundary_path is not None:
        boundary = load_shapefile_from_zip(boundary_path)
    else:
        raise ValueError("Either boundary_path (zip) or boundary_geojson must be provided")

    # Ensure CRS alignment
    if mining.crs is None:
        mining = mining.set_crs(boundary.crs or 4326, allow_override=True)
    if boundary.crs is None:
        boundary = boundary.set_crs(mining.crs, allow_override=True)
    if mining.crs != boundary.crs:
        boundary = boundary.to_crs(mining.crs)

    mining = mining.explode(index_parts=False, ignore_index=True)
    boundary = boundary.explode(index_parts=False, ignore_index=True)

    # Legal: intersection; Illegal: mining difference boundary union
    boundary_union = boundary.unary_union
    legal = gpd.overlay(mining, gpd.GeoDataFrame(geometry=[boundary_union], crs=mining.crs), how="intersection")
    illegal = gpd.overlay(mining, gpd.GeoDataFrame(geometry=[boundary_union], crs=mining.crs), how="difference")

    legal_area_ha = calculate_area_ha(legal)
    illegal_area_ha = calculate_area_ha(illegal)

    legal_geojson = geojson_from_gdf(legal) if not legal.empty else {"type": "FeatureCollection", "features": []}
    illegal_geojson = geojson_from_gdf(illegal) if not illegal.empty else {"type": "FeatureCollection", "features": []}

    return {
        "legal_area_ha": float(legal_area_ha),
        "illegal_area_ha": float(illegal_area_ha),
        "legal_geojson": legal_geojson,
        "illegal_geojson": illegal_geojson
    }


