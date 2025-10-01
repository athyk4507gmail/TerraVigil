from typing import Dict, Any
import numpy as np
import rasterio
from rasterio.transform import Affine
import geopandas as gpd

from utils.geo_utils import load_raster, raster_mask_to_polygons, geojson_from_gdf, calculate_area_ha


def _pick_bands_for_ndvi(dataset: rasterio.io.DatasetReader):
    # Try common band index patterns (1-based): Sentinel-2: B4=Red, B8=NIR; Landsat-8: B4=Red, B5=NIR
    band_count = dataset.count
    red_index = None
    nir_index = None

    # Heuristics: prefer 4/8, else 3/4, else try last bands
    candidates = [(4, 8), (3, 4), (2, 3)]
    for r, n in candidates:
        if r <= band_count and n <= band_count:
            red_index, nir_index = r, n
            break

    if red_index is None or nir_index is None:
        return None, None
    return red_index, nir_index


def detect_mining(image_path: str) -> Dict[str, Any]:
    with load_raster(image_path) as src:
        transform: Affine = src.transform
        crs = src.crs
        band_count = src.count

        red_index, nir_index = _pick_bands_for_ndvi(src)

        if red_index is not None and nir_index is not None:
            red = src.read(red_index).astype(np.float32)
            nir = src.read(nir_index).astype(np.float32)
            denom = (nir + red)
            denom[denom == 0] = 1e-6
            ndvi = (nir - red) / denom
            mining_mask = (ndvi < 0.2) & ~np.isnan(ndvi)
        else:
            # Fallback to brightness: if high reflectance area considered as exposed soil/mining
            # Use first band as proxy
            band1 = src.read(1).astype(np.float32)
            # Normalize by 99th percentile
            p99 = np.percentile(band1[~np.isnan(band1)], 99) if np.any(~np.isnan(band1)) else 1.0
            if p99 == 0:
                p99 = 1.0
            norm = band1 / p99
            mining_mask = norm > 0.6

        mask_uint8 = mining_mask.astype(np.uint8)
        geojson = raster_mask_to_polygons(mask_uint8, transform, crs)

        # area in hectares
        gdf = gpd.GeoDataFrame.from_features(geojson.get("features", []), crs=crs)
        area_ha = calculate_area_ha(gdf)

        return {
            "area_ha": float(area_ha),
            "geojson": geojson,
            "mask_shape": [int(mask_uint8.shape[0]), int(mask_uint8.shape[1])]
        }


