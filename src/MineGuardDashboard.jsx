import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import axios from 'axios';

// --- API Service ---
const BACKEND_URL = 'http://127.0.0.1:8000';

const api = {
  getDashboardStats: () => {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            totalMiningArea: 12.5,
            illegalMiningArea: 1.8,
            volumeExtracted: 85000,
          });
        }, 1500);
      });
  },

  detectMining: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await axios.post(`${BACKEND_URL}/detect_mining`, formData);
    return response.data;
  },

  // NEW: Async mining detection with progress tracking
  detectMiningAsync: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await axios.post(`${BACKEND_URL}/detect_mining_async`, formData);
    return response.data;
  },

  // NEW: Check task status
  getTaskStatus: async (taskId) => {
    const response = await axios.get(`${BACKEND_URL}/task_status/${taskId}`);
    return response.data;
  },

  // NEW: Get sample data for testing
  getSampleData: async () => {
    const response = await axios.get(`${BACKEND_URL}/test_sample_data`);
    return response.data;
  },

  // NEW: Health check
  healthCheck: async () => {
    const response = await axios.get(`${BACKEND_URL}/health`);
    return response.data;
  },

  // NEW: API function to get the 3D data
  get3DData: async (demFile, miningGeoJSON) => {
    const formData = new FormData();
    formData.append('dem_file', demFile);
    // Ensure only GeoJSON FeatureCollection is sent
    const geojson = miningGeoJSON?.geojson ? miningGeoJSON.geojson : miningGeoJSON;
    formData.append('mining_geojson_str', JSON.stringify(geojson));
    
    const response = await axios.post(`${BACKEND_URL}/volume_estimation`, formData);
    return response.data;
  },

  // NEW: API to auto-fetch DEM and get 3D data
  get3DDataAuto: async (miningGeoJSON, demType = 'COP30') => {
    const formData = new FormData();
    const geojson = miningGeoJSON?.geojson ? miningGeoJSON.geojson : miningGeoJSON;
    formData.append('mining_geojson_str', JSON.stringify(geojson));
    formData.append('demtype', demType);
    const response = await axios.post(`${BACKEND_URL}/auto_volume_estimation`, formData);
    return response.data;
  },

  getMiningZones: () => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        legalZones: { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[-74.0, 40.7], [-74.0, 40.8], [-73.9, 40.8], [-73.9, 40.7], [-74.0, 40.7]]] } }] },
        illegalZones: { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[-73.9, 40.75], [-73.9, 40.85], [-73.85, 40.85], [-73.85, 40.75], [-73.9, 40.75]]] } }] }
      });
    }, 800);
  }),
};

// --- Palantir-style SVG Icons ---
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10v11h6v-7h6v7h6V10L12 3 3 10z"></path></svg>;
const MapIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const CubeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path></svg>;
const FileTextIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><path d="M14 2v6h6M16 13H8M16 17H8"></path></svg>;

// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState('home');
  // NEW: State to hold the 3D data, shared between views
  const [threeDData, setThreeDData] = useState(null);
  // NEW: Latest analysis summary to show on dashboard
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  return (
    <div className="flex h-screen bg-[#0D1117] text-gray-300 font-sans">
      <Sidebar setActiveView={setActiveView} activeView={activeView} />
      <main className="flex-1 p-8 overflow-y-auto bg-dots">
        <div style={{ display: activeView === 'home' ? 'block' : 'none' }}><DashboardHome latestAnalysis={latestAnalysis} /></div>
        <div style={{ display: activeView === 'map' ? 'block' : 'none' }}><MapView isActive={activeView === 'map'} latestAnalysis={latestAnalysis} /></div>
        {/* Pass the 3D data and setter to the views */}
        <div style={{ display: activeView === '3d' ? 'block' : 'none' }}><ThreeDView isActive={activeView === '3d'} threeDData={threeDData} /></div>
        <div style={{ display: activeView === 'reports' ? 'block' : 'none' }}><ReportsView setThreeDData={setThreeDData} setActiveView={setActiveView} setLatestAnalysis={setLatestAnalysis}/></div>
      </main>
      <style>{`
        .bg-dots {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

// --- Components ---
function Sidebar({ setActiveView, activeView }) {
    const navItems = [
    { id: 'home', icon: <HomeIcon />, label: 'Dashboard' },
    { id: 'map', icon: <MapIcon />, label: 'Map Viewer' },
    { id: '3d', icon: <CubeIcon />, label: '3D Terrain' },
    { id: 'reports', icon: <FileTextIcon />, label: 'Run Analysis' },
  ];
  return (
    <nav className="w-64 bg-[#0D1117] border-r border-gray-800 p-5 flex flex-col">
      <div className="flex items-center space-x-3 mb-12">
        <div className="w-10 h-10 bg-[#00BFFF] rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="text-[#0D1117]" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <h1 className="text-xl font-bold text-white">TerraVigil</h1>
      </div>
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.id}>
            <button onClick={() => setActiveView(item.id)} className={`w-full flex items-center space-x-3 p-3 rounded-md transition-all duration-200 text-sm font-medium ${activeView === item.id ? 'bg-[#00BFFF] text-white shadow-[0_0_15px_rgba(0,191,255,0.5)]' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <div className="w-6 h-6">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto text-center text-gray-600 text-xs"><p>&copy; 2025 TerraVigil Inc.</p></div>
    </nav>
  );
}
function DashboardHome({ latestAnalysis }) {
  return (
    <div>
      <h2 className="text-3xl font-light mb-8 text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Total Mining Area</div>
          <div className="text-3xl text-white mt-2">{latestAnalysis?.area_ha?.toFixed?.(2) || '—'} ha</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Features Detected</div>
          <div className="text-3xl text-white mt-2">{latestAnalysis?.geojson?.features?.length ?? '—'}</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm">Mask Size</div>
          <div className="text-3xl text-white mt-2">{latestAnalysis?.mask_shape ? `${latestAnalysis.mask_shape[0]}×${latestAnalysis.mask_shape[1]}` : '—'}</div>
        </div>
      </div>
      {!latestAnalysis && (
        <p className="text-gray-500 mt-6">Run an analysis to see results here.</p>
      )}
    </div>
  );
}
function FitBounds({ geojson }) {
  const map = useMap();
  useEffect(() => {
    if (!geojson || !geojson.features || geojson.features.length === 0) return;
    try {
      const coords = [];
      geojson.features.forEach(f => {
        const geom = f.geometry;
        if (!geom) return;
        if (geom.type === 'Polygon') coords.push(...geom.coordinates.flat());
        if (geom.type === 'MultiPolygon') coords.push(...geom.coordinates.flat(2));
      });
      if (coords.length > 0) {
        const latlngs = coords.map(([lng, lat]) => [lat, lng]);
        map.fitBounds(latlngs);
      }
    } catch (_) {}
  }, [geojson, map]);
  return null;
}

function MapView({ isActive, latestAnalysis }) {
  return (
    <div>
      <h2 className="text-3xl font-light mb-8 text-white">2D Map Viewer</h2>
      <div className="h-[75vh] w-full rounded-lg border border-gray-800 overflow-hidden">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {latestAnalysis?.geojson && (
            <>
              <GeoJSON data={latestAnalysis.geojson} style={{ color: '#00BFFF', weight: 2, fillOpacity: 0.15 }} />
              <FitBounds geojson={latestAnalysis.geojson} />
            </>
          )}
        </MapContainer>
      </div>
      {!latestAnalysis?.geojson && (
        <p className="text-gray-500 mt-4">Run an analysis to visualize detected mining areas on the map.</p>
      )}
    </div>
  );
}

// UPDATED: To handle real 3D data from props
function ThreeDView({ isActive, threeDData }) {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const animationFrameIdRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current || rendererRef.current) return;

        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.minDistance = 2;
        controls.maxDistance = 50; // Increased max distance

        // --- REAL TERRAIN LOGIC ---
        let geometry;
        if (threeDData && threeDData.dem_data) {
            const demData = threeDData.dem_data;
            const width = demData[0].length;
            const height = demData.length;
            geometry = new THREE.PlaneGeometry(10, 10, width - 1, height - 1);

            const vertices = geometry.attributes.position.array;
            let vertexIndex = 0;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const elevation = demData[i][j];
                    // Normalize and scale elevation for better visuals
                    vertices[vertexIndex + 2] = (elevation / 100); 
                    vertexIndex += 3;
                }
            }
            geometry.attributes.position.needsUpdate = true;
            geometry.computeVertexNormals();
        } else {
            // Fallback to placeholder geometry if no data
            geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
            const vertices = geometry.attributes.position.array;
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i]; const y = vertices[i + 1]; const dist = Math.sqrt(x*x + y*y);
                vertices[i+2] = Math.sin(x * 2) * 0.2 + Math.cos(y * 2) * 0.2 - (Math.max(0, 1.5 - dist) * 0.8) + (Math.random() - 0.5) * 0.05;
            }
            geometry.attributes.position.needsUpdate = true;
            geometry.computeVertexNormals();
        }
        
        const solidMaterial = new THREE.MeshStandardMaterial({ color: 0x005f7f, wireframe: false, transparent: true, opacity: 0.2, roughness: 0.9 });
        const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00BFFF, wireframe: true, transparent: true, opacity: 0.5 });
        
        const group = new THREE.Group();
        group.add(new THREE.Mesh(geometry, solidMaterial));
        group.add(new THREE.Mesh(geometry, wireframeMaterial));
        group.rotation.x = -Math.PI / 2;
        scene.add(group);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        camera.position.z = 6;
        camera.position.y = 4;
        camera.lookAt(0, 0, 0);

        rendererRef.current = renderer;
        sceneRef.current = scene;
        cameraRef.current = camera;
        controlsRef.current = controls;

        const handleResize = () => { /* ... */ };
        window.addEventListener('resize', handleResize);
        return () => { /* ... */ };
    }, [threeDData]); // Re-run effect when threeDData changes

    useEffect(() => {
        const animate = () => { /* ... */ };
        if (isActive && rendererRef.current) animate();
        else if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        return () => { /* ... */ };
    }, [isActive]);

    return (
        <div>
            <h2 className="text-3xl font-light mb-8 text-white">3D Terrain Visualization</h2>
            <div className="relative h-[75vh] w-full rounded-lg border border-gray-800 p-4">
                <div ref={mountRef} className="absolute inset-0"></div>
                <div className="absolute top-8 left-8 bg-gray-900/70 backdrop-blur-md border border-gray-800 p-4 rounded-lg pointer-events-none">
                    <h3 className="font-semibold text-sm uppercase tracking-wider">Pit Statistics</h3>
                    {/* Display real or placeholder stats */}
                    <p className="text-xs mt-2">Max Depth: <span className="font-mono text-[#00BFFF] text-base">{threeDData?.max_depth_m ?? 'N/A'} meters</span></p>
                    <p className="text-xs">Volume: <span className="font-mono text-[#00BFFF] text-base">{(threeDData?.volume_m3 ?? undefined)?.toLocaleString?.() || threeDData?.volume_m3 || 'N/A'} m³</span></p>
                </div>
            </div>
        </div>
    );
}

// UPDATED: New workflow for multi-step analysis
function ReportsView({ setThreeDData, setActiveView, setLatestAnalysis }) {
    const [imageFile, setImageFile] = useState(null);
    const [demFile, setDemFile] = useState(null); // New state for the DEM file
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null); // Results from step 1
    const [step, setStep] = useState(1); // Control which step of the workflow we are on
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');

    // Poll task status
    const pollTaskStatus = async (taskId) => {
        try {
            const status = await api.getTaskStatus(taskId);
            setProgress(status.progress || 0);
            setStatusMessage(status.status || '');
            
            if (status.status === 'completed' && status.result) {
                setAnalysisResults(status.result);
                setLatestAnalysis(status.result);
                setStep(2);
                setIsLoading(false);
                setCurrentTaskId(null);
            } else if (status.status === 'failed') {
                alert(`Analysis failed: ${status.error || 'Unknown error'}`);
                setIsLoading(false);
                setCurrentTaskId(null);
            } else if (status.status === 'processing' || status.status === 'queued') {
                // Continue polling
                setTimeout(() => pollTaskStatus(taskId), 2000);
            }
        } catch (error) {
            console.error("Error checking task status:", error);
            setIsLoading(false);
            setCurrentTaskId(null);
        }
    };

    const handleDetectMining = async () => {
        if (!imageFile) { alert("Please select a satellite image file."); return; }
        setIsLoading(true);
        setAnalysisResults(null);
        setProgress(0);
        try {
            // Use async endpoint for large files
            const taskResponse = await api.detectMiningAsync(imageFile);
            setCurrentTaskId(taskResponse.task_id);
            setStatusMessage('Analysis started...');
            
            // Start polling for status
            pollTaskStatus(taskResponse.task_id);
            
        } catch (error) { 
            console.error("Detection failed:", error); 
            alert("Error starting mining detection."); 
            setIsLoading(false);
        }
    };

    const handleUseSampleData = async () => {
        try {
            setIsLoading(true);
            const sampleData = await api.getSampleData();
            setAnalysisResults(sampleData);
            setLatestAnalysis(sampleData);
            setStep(2);
            setIsLoading(false);
        } catch (error) {
            console.error("Error loading sample data:", error);
            alert("Error loading sample data");
            setIsLoading(false);
        }
    };

    const handleVolumeEstimation = async () => {
        if (!demFile) { alert("Please select a DEM file."); return; }
        setIsLoading(true);
        try {
            const results = await api.get3DData(demFile, analysisResults);
            setThreeDData(results); // Set the global state for the 3D view
            setActiveView('3d'); // Automatically switch to the 3D view
        } catch (error) {
            console.error("Volume estimation failed:", error);
            const msg = error?.response?.data?.detail || error?.message || 'Error in volume estimation.';
            alert(msg);
        }
        setIsLoading(false);
    };

    const handleAutoVolume = async () => {
        setIsLoading(true);
        try {
            const results = await api.get3DDataAuto(analysisResults, 'COP30');
            setThreeDData(results);
            setActiveView('3d');
        } catch (error) {
            console.error('Auto volume estimation failed:', error);
            const msg = error?.response?.data?.detail || error?.message || 'Auto volume estimation failed';
            alert(msg);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-3xl font-light mb-8 text-white">Run New Analysis</h2>
            {/* Step 1: Detect Mining */}
            {step === 1 && (
                 <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-lg max-w-lg mx-auto text-center">
                    <h3 className="text-xl font-semibold mb-2 text-white">Step 1: Detect Mining Zones</h3>
                    <p className="mb-6 text-gray-400">Upload a satellite image (.TIF) to identify potential mining activity.</p>
                    
                    {/* Progress bar when loading */}
                    {isLoading && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">{statusMessage}</span>
                                <span className="text-sm text-[#00BFFF]">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-[#00BFFF] h-2 rounded-full transition-all duration-300" 
                                     style={{ width: `${progress}%` }}></div>
                            </div>
                            {currentTaskId && (
                                <p className="text-xs text-gray-500 mt-2">Task ID: {currentTaskId}</p>
                            )}
                        </div>
                    )}
                    
                    <div className="mb-8 text-left">
                        <label className="block mb-2 text-sm font-medium text-gray-400">Satellite Image File</label>
                        <input type="file" accept=".tif,.tiff,.jpg,.jpeg,.png" onChange={(e) => setImageFile(e.target.files[0])} 
                               className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"/>
                    </div>
                    
                    <div className="space-y-3">
                        <button onClick={handleDetectMining} disabled={isLoading || !imageFile} 
                                className="w-full bg-[#00BFFF] text-white py-3 px-6 rounded-md font-medium hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {isLoading ? 'Analyzing...' : 'Detect Mining Activity'}
                        </button>
                        
                        <div className="text-gray-500 text-sm">OR</div>
                        
                        <button onClick={handleUseSampleData} disabled={isLoading}
                                className="w-full bg-gray-700 text-white py-2 px-6 rounded-md font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Use Sample Data for Testing
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Estimate Volume */}
            {step === 2 && (
                <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-lg max-w-lg mx-auto text-center">
                    <h3 className="text-xl font-semibold mb-2 text-white">Step 2: Estimate Volume & Visualize</h3>
                    <p className="mb-2 text-green-400">✓ Mining detection successful!</p>
                    <p className="mb-2 text-gray-300">Found {analysisResults?.area_ha?.toFixed(2)} hectares of mining activity</p>
                    <p className="mb-6 text-gray-400">Upload a Digital Elevation Model (DEM) file to calculate volume and generate 3D visualization.</p>
                     
                     <div className="mb-8 text-left">
                        <label className="block mb-2 text-sm font-medium text-gray-400">DEM File (.tif, .tiff)</label>
                        <input type="file" accept=".tif,.tiff" onChange={(e) => setDemFile(e.target.files[0])} 
                               className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"/>
                    </div>
                    
                    <div className="space-y-3">
                        <button onClick={handleVolumeEstimation} disabled={isLoading || !demFile} 
                                className="w-full bg-[#00BFFF] text-white py-3 px-6 rounded-md font-medium hover:bg-[#0099CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {isLoading ? 'Calculating...' : 'Generate 3D Visualization'}
                        </button>
                        <button onClick={handleAutoVolume} disabled={isLoading} 
                                className="w-full bg-emerald-600 text-white py-2 px-6 rounded-md font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Auto Fetch DEM & Visualize (COP30)
                        </button>
                        
                        <button onClick={() => setStep(1)} disabled={isLoading}
                                className="w-full bg-gray-700 text-white py-2 px-6 rounded-md font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            ← Back to Step 1
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}