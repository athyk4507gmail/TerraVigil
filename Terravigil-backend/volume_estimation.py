from typing import Dict, Any, Optional
import numpy as np
import rasterio
from rasterio.mask import mask as rio_mask
import json

from utils.geo_utils import load_raster, mask_raster_with_geojson


def _simpsons_rule_column(values: np.ndarray, dx: float) -> float:
    n = len(values)
    if n < 2:
        return 0.0
    if n % 2 == 0:
        # If even count, drop last to make odd (Simpson requires odd number of points)
        n = n - 1
        values = values[:n]
    # Simpson's 1/3 rule
    coef = np.ones(n)
    coef[1:-1:2] = 4
    coef[2:-1:2] = 2
    return float((dx / 3.0) * np.sum(coef * values))


def estimate_volume(dem_path: str, mask_geojson: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    with load_raster(dem_path) as src:
        dem = src.read(1).astype(np.float32)
        transform = src.transform
        pixel_width = abs(transform.a)
        pixel_height = abs(transform.e)

        if mask_geojson is not None:
            masked, _ = mask_raster_with_geojson(src, mask_geojson)
            # masked shape (bands, rows, cols)
            dem_masked = masked[0]
            mask_bool = np.where(np.isnan(dem_masked), False, True)
            dem = np.where(mask_bool, dem_masked, np.nan)

        valid = dem[~np.isnan(dem)]
        if valid.size == 0:
            return {
                "baseline_reference_elevation": None,
                "max_depth_m": 0.0,
                "avg_depth_m": 0.0,
                "volume_m3": 0.0
            }

        baseline = float(np.percentile(valid, 95))
        depth = baseline - dem
        depth[~np.isfinite(depth)] = 0.0
        depth[depth < 0] = 0.0

        # Integrate depth to volume: integrate along rows using Simpson per column, then multiply by pixel width
        # dx along rows is pixel_height, and width accumulation multiplies by pixel_width
        volume_columns = []
        for col in range(depth.shape[1]):
            col_values = depth[:, col]
            # Only positive values contribute
            col_values = np.where(col_values > 0, col_values, 0.0)
            vol_col = _simpsons_rule_column(col_values, pixel_height) * pixel_width
            volume_columns.append(vol_col)
        volume_m3 = float(np.nansum(volume_columns))

        max_depth = float(np.nanmax(depth)) if np.any(np.isfinite(depth)) else 0.0
        avg_depth = float(np.nanmean(depth[depth > 0])) if np.any(depth > 0) else 0.0

        return {
            "baseline_reference_elevation": baseline,
            "max_depth_m": max_depth,
            "avg_depth_m": avg_depth,
            "volume_m3": volume_m3
        }


