import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- Mock API Service ---
const api = {
  getDashboardStats: () => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalMiningArea: 12.5,
        illegalMiningArea: 1.8,
        volumeExtracted: 85000,
      });
    }, 1500);
  }),
  getMiningZones: () => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        legalZones: {
          type: "FeatureCollection",
          features: [{
            type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[-74.0, 40.7], [-74.0, 40.8], [-73.9, 40.8], [-73.9, 40.7], [-74.0, 40.7]]] }
          }]
        },
        illegalZones: {
          type: "FeatureCollection",
          features: [{
            type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[-73.9, 40.75], [-73.9, 40.85], [-73.85, 40.85], [-73.85, 40.75], [-73.9, 40.75]]] }
          }]
        }
      });
    }, 800);
  }),
};

// --- NEW Palantir-style SVG Icons ---
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10v11h6v-7h6v7h6V10L12 3 3 10z"></path></svg>;
const MapIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const CubeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path></svg>;
const FileTextIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><path d="M14 2v6h6M16 13H8M16 17H8"></path></svg>;

// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState('home');

  return (
    <div className="flex h-screen bg-[#0D1117] text-gray-300 font-sans">
      <Sidebar setActiveView={setActiveView} activeView={activeView} />
      <main className="flex-1 p-8 overflow-y-auto bg-dots">
        <div style={{ display: activeView === 'home' ? 'block' : 'none' }}><DashboardHome /></div>
        <div style={{ display: activeView === 'map' ? 'block' : 'none' }}><MapView isActive={activeView === 'map'} /></div>
        <div style={{ display: activeView === '3d' ? 'block' : 'none' }}><ThreeDView isActive={activeView === '3d'} /></div>
        <div style={{ display: activeView === 'reports' ? 'block' : 'none' }}><ReportsView /></div>
      </main>
      {/* Add global styles for the background pattern */}
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
    { id: 'reports', icon: <FileTextIcon />, label: 'Generate Report' },
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

function DashboardHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.getDashboardStats().then(data => setStats(data)); }, []);

  const SkeletonCard = () => (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-10 bg-gray-700 rounded w-3/4"></div>
    </div>
  );

  if (!stats) {
    return (
      <div>
        <h2 className="text-3xl font-light mb-8 text-white">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }
  
  const StatCard = ({ title, value, unit, isViolation=false }) => (
    <div className={`p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 ${isViolation ? 'bg-red-900/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-gray-900/50 border-gray-800'}`}>
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-4xl font-semibold mt-2 text-white">{value} <span className="text-2xl text-gray-500">{unit}</span></p>
      {isViolation && <p className="text-red-400 mt-2 font-bold text-xs uppercase tracking-widest">Violation Detected</p>}
    </div>
  );

  return (
    <div>
      <h2 className="text-3xl font-light mb-8 text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Mining Area" value={stats.totalMiningArea} unit="sq km" />
        <StatCard title="Illegal Mining Area" value={stats.illegalMiningArea} unit="sq km" isViolation={stats.illegalMiningArea > 0} />
        <StatCard title="Estimated Volume Extracted" value={stats.volumeExtracted.toLocaleString()} unit="m³" />
      </div>
    </div>
  );
}

function MapView({ isActive }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const legalLayerRef = useRef(null);
    const illegalLayerRef = useRef(null);
    const isInitialized = useRef(false);
    const [showLegal, setShowLegal] = useState(true);
    const [showIllegal, setShowIllegal] = useState(true);

    useEffect(() => {
        if (!isActive || isInitialized.current) return;
        if (!window.L) return;
        
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = window.L.map(mapContainerRef.current, { center: [40.75, -73.95], zoom: 12 });
            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; CARTO',
            }).addTo(mapRef.current);
        }

        api.getMiningZones().then(data => {
            if (mapRef.current) {
                const legalStyle = { color: "#00BFFF", weight: 2, fillOpacity: 0.2 };
                legalLayerRef.current = window.L.geoJSON(data.legalZones, { style: legalStyle }).bindPopup("Legal Mining Zone");

                const illegalStyle = { color: "#FF4136", weight: 2, fillOpacity: 0.4 };
                illegalLayerRef.current = window.L.geoJSON(data.illegalZones, { style: illegalStyle }).bindPopup("Illegal Mining Zone");

                if (showLegal) legalLayerRef.current.addTo(mapRef.current);
                if (showIllegal) illegalLayerRef.current.addTo(mapRef.current);
            }
        });
        isInitialized.current = true;
    }, [isActive]);

    useEffect(() => {
        if (!mapRef.current || !legalLayerRef.current) return;
        if (showLegal && !mapRef.current.hasLayer(legalLayerRef.current)) mapRef.current.addLayer(legalLayerRef.current);
        else if (!showLegal && mapRef.current.hasLayer(legalLayerRef.current)) mapRef.current.removeLayer(legalLayerRef.current);
    }, [showLegal]);

    useEffect(() => {
        if (!mapRef.current || !illegalLayerRef.current) return;
        if (showIllegal && !mapRef.current.hasLayer(illegalLayerRef.current)) mapRef.current.addLayer(illegalLayerRef.current);
        else if (!showIllegal && mapRef.current.hasLayer(illegalLayerRef.current)) mapRef.current.removeLayer(illegalLayerRef.current);
    }, [showIllegal]);

    return (
        <div>
            <h2 className="text-3xl font-light mb-8 text-white">Interactive Map Viewer</h2>
            <div className="relative rounded-lg border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div ref={mapContainerRef} className="h-[75vh] w-full rounded-lg"></div>
                <div className="absolute top-4 right-4 z-[1000] bg-gray-900/70 backdrop-blur-md border border-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="font-semibold mb-2 text-white">Layers</h3>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={showLegal} onChange={() => setShowLegal(!showLegal)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#00BFFF] focus:ring-0"/>
                            <span style={{color: '#00BFFF'}}>Legal Zones</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={showIllegal} onChange={() => setShowIllegal(!showIllegal)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#FF4136] focus:ring-0"/>
                            <span style={{color: '#FF4136'}}>Illegal Zones</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThreeDView({ isActive }) {
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
        controls.maxDistance = 15;

        const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
        
        // VISIBILITY FIX: Using two meshes for a better holographic effect
        const solidMaterial = new THREE.MeshStandardMaterial({
            color: 0x005f7f, // Darker cyan for the base
            wireframe: false,
            transparent: true,
            opacity: 0.1,
            roughness: 0.9,
        });

        const wireframeMaterial = new THREE.MeshBasicMaterial({ // Basic material isn't affected by light, so it always glows
            color: 0x00BFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
        });
        
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i]; const y = vertices[i + 1]; const dist = Math.sqrt(x*x + y*y);
            vertices[i+2] = Math.sin(x * 2) * 0.2 + Math.cos(y * 2) * 0.2 - (Math.max(0, 1.5 - dist) * 0.8) + (Math.random() - 0.5) * 0.05;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        const group = new THREE.Group();
        const solidMesh = new THREE.Mesh(geometry, solidMaterial);
        const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
        
        group.add(solidMesh);
        group.add(wireframeMesh);
        group.rotation.x = -Math.PI / 2;
        scene.add(group);
        
        // VISIBILITY FIX: Using a more robust lighting setup
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

        const handleResize = () => {
            if(mount) {
              camera.aspect = mount.clientWidth / mount.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(mount.clientWidth, mount.clientHeight);
            }
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (mount && renderer.domElement) {
              mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            controlsRef.current.update(); 
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        if (isActive && rendererRef.current) animate();
        else if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

        return () => { if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current); };
    }, [isActive]);

    return (
        <div>
            <h2 className="text-3xl font-light mb-8 text-white">3D Terrain Visualization</h2>
            <div className="relative h-[75vh] w-full rounded-lg border border-gray-800 p-4">
                <div ref={mountRef} className="absolute inset-0"></div>
                <div className="absolute top-8 left-8 bg-gray-900/70 backdrop-blur-md border border-gray-800 p-4 rounded-lg pointer-events-none">
                    <h3 className="font-semibold text-sm uppercase tracking-wider">Pit Statistics</h3>
                    <p className="text-xs mt-2">Max Depth: <span className="font-mono text-[#00BFFF] text-base">45 meters</span></p>
                    <p className="text-xs">Volume: <span className="font-mono text-[#00BFFF] text-base">85,000 m³</span></p>
                </div>
            </div>
        </div>
    );
}

function ReportsView() {
    const [stats, setStats] = useState(null);
    useEffect(() => { api.getDashboardStats().then(data => setStats(data)); }, []);
    const generateReport = () => {
        if (!stats || !window.jspdf) { console.error("jsPDF is not loaded or stats are missing!"); return; }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(22); doc.setTextColor('#00BFFF'); doc.text("TerraVigil Compliance Report", 105, 20, null, null, "center");
        doc.setFontSize(12); doc.setTextColor(150); doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.setFontSize(16); doc.setTextColor(50); doc.text("Analysis Summary", 20, 60); doc.setLineWidth(0.5); doc.line(20, 62, 190, 62);
        doc.setFontSize(12); doc.text(`- Total Mining Area:`, 30, 75); doc.setFont(undefined, 'bold'); doc.text(`${stats.totalMiningArea} sq km`, 80, 75);
        doc.setFont(undefined, 'normal'); doc.text(`- Illegal Mining Area:`, 30, 85); doc.setFont(undefined, 'bold'); doc.setTextColor('#FF4136'); doc.text(`${stats.illegalMiningArea} sq km (VIOLATION)`, 80, 85);
        doc.setTextColor(50); doc.setFont(undefined, 'normal'); doc.text(`- Estimated Volume Extracted:`, 30, 95); doc.setFont(undefined, 'bold'); doc.text(`${stats.volumeExtracted.toLocaleString()} m³`, 80, 95);
        doc.setFontSize(14); doc.setTextColor(150); doc.text("Map Snapshot:", 20, 115); doc.rect(20, 120, 170, 100); doc.text("[Map image would be rendered here]", 105, 170, null, null, "center");
        doc.setTextColor(150); doc.text("Report automatically generated by TerraVigil.", 105, 280, null, null, "center");
        doc.save("TerraVigil_Compliance_Report.pdf");
    };
    return (
        <div>
            <h2 className="text-3xl font-light mb-8 text-white">Report Generation</h2>
            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-lg max-w-lg mx-auto text-center">
                <p className="mb-6 text-gray-400">Generate a comprehensive PDF report containing all key metrics, violation details, and visual evidence for official records.</p>
                <button onClick={generateReport} disabled={!stats} className="bg-[#00BFFF] text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,191,255,0.4)]">
                    <div className="w-5 h-5 mr-2"><FileTextIcon /></div>
                    <span>Download PDF Report</span>
                </button>
            </div>
        </div>
    );
}