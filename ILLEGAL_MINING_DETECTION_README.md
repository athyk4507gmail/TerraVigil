# Illegal Mining Detection Feature

## Overview
This document describes the new illegal mining detection feature added to TerraVigil. The system now supports a complete workflow for detecting and analyzing legal vs illegal mining activities.

## Workflow

### Step 1: Mining Detection
- Upload satellite imagery (.TIF, .TIFF, .JPG, .PNG)
- AI-powered detection identifies potential mining areas
- Results include GeoJSON polygons and area calculations

### Step 2: Legal/Illegal Classification
- Upload boundary files (.ZIP shapefiles or .GeoJSON)
- System compares detected mining areas with legal boundaries
- Classifies mining as legal (within boundaries) or illegal (outside boundaries)

### Step 3: Volume Estimation & 3D Visualization
- Upload Digital Elevation Model (DEM) files
- Calculate mining volume and depth
- Generate 3D terrain visualization
- Optional: Auto-fetch DEM data from OpenTopography

## Features

### Interactive Map Visualization
- **Blue**: All detected mining areas
- **Green**: Legal mining areas (within permitted boundaries)
- **Red**: Illegal mining areas (outside permitted boundaries)
- Real-time legend showing color coding

### Dashboard Statistics
- Total mining area detected
- Number of mining features
- Legal vs illegal mining areas
- Volume and depth calculations

### 3D Terrain View
- Real-time 3D visualization using Three.js
- Terrain elevation data from DEM files
- Mining pit statistics (depth, volume)
- Interactive camera controls

## API Endpoints

### Core Detection
- `POST /detect_mining_async` - Start mining detection (async)
- `GET /task_status/{task_id}` - Check detection progress
- `GET /test_sample_data` - Get sample data for testing

### Illegal Mining Detection
- `POST /illegal_mining` - Detect legal/illegal mining
- Input: Mining GeoJSON + Boundary files
- Output: Legal/illegal area calculations and GeoJSON

### Volume Estimation
- `POST /volume_estimation` - Calculate mining volume
- `POST /auto_volume_estimation` - Auto-fetch DEM and estimate volume

## File Formats Supported

### Input Files
- **Satellite Images**: .TIF, .TIFF, .JPG, .PNG
- **Boundary Files**: .ZIP (shapefiles), .GeoJSON
- **DEM Files**: .TIF, .TIFF

### Output Formats
- **GeoJSON**: Standard format for all spatial data
- **Statistics**: Area calculations in hectares
- **3D Data**: Elevation arrays for terrain visualization

## Usage Instructions

1. **Start the Application**
   ```bash
   # Backend (Terminal 1)
   cd Terravigil-backend
   python api.py
   
   # Frontend (Terminal 2)
   cd TerraVigil
   npm run dev
   ```

2. **Run Analysis**
   - Navigate to "Run Analysis" tab
   - Upload satellite image for Step 1
   - Upload boundary files for Step 2 (optional)
   - Upload DEM files for Step 3
   - View results on Dashboard, Map, and 3D views

3. **Sample Data**
   - Use "Use Sample Data for Testing" button for quick testing
   - Sample boundary file provided: `sample_legal_mining_boundary.geojson`

## Technical Implementation

### Frontend (React)
- Multi-step workflow with progress tracking
- Real-time map visualization with Leaflet
- 3D terrain rendering with Three.js
- Responsive UI with Tailwind CSS

### Backend (FastAPI)
- Async processing for large files
- Progress tracking with task IDs
- Geospatial analysis with GeoPandas
- Automatic DEM fetching from OpenTopography

### Key Algorithms
- **Mining Detection**: NDVI-based analysis for exposed soil
- **Boundary Checking**: Geometric intersection analysis
- **Volume Estimation**: DEM-based pit volume calculation

## Error Handling

- File size limits (1GB max for uploads)
- Progress tracking for long-running operations
- Graceful error messages and recovery
- Automatic cleanup of temporary files

## Future Enhancements

- Integration with government mining databases
- Real-time satellite data feeds
- Machine learning model improvements
- Mobile app support
- Batch processing capabilities

## Dependencies

### Frontend
- React 19.1.1
- Three.js (for 3D visualization)
- Leaflet (for maps)
- Axios (for API calls)

### Backend
- FastAPI
- GeoPandas
- Rasterio
- NumPy
- OpenTopography API

## Testing

Use the provided sample data to test the complete workflow:
1. Upload any satellite image
2. Use sample data for quick testing
3. Upload the sample boundary file
4. Test the 3D visualization

The system is designed to handle real-world mining detection scenarios with high accuracy and user-friendly interfaces.


