import React, { useState, useEffect } from 'react';
import { useVORStore } from '../store/vorStore';
import { Plane, Radio } from 'lucide-react';

const MapView: React.FC = () => {
  const { aircraft, stations, vorReceiver, simulation, updateAircraftPosition } = useVORStore();

  // Map view state - tracks the center of the current view
  const [mapCenter, setMapCenter] = useState({
    lat: aircraft.latitude,
    lng: aircraft.longitude
  });

  // Add flag to prevent auto-recentering when user manually places aircraft
  const [manualPlacementMode, setManualPlacementMode] = useState(false);

  // Center map on aircraft when simulation starts or aircraft position changes significantly
  useEffect(() => {
    // Don't auto-recenter if in manual placement mode
    if (manualPlacementMode) return;

    const distance = Math.sqrt(
      Math.pow(aircraft.latitude - mapCenter.lat, 2) + 
      Math.pow(aircraft.longitude - mapCenter.lng, 2)
    );
    
    // If aircraft is far from current center (more than ~0.1 degrees), recenter immediately
    if (distance > 0.1) {
      setMapCenter({
        lat: aircraft.latitude,
        lng: aircraft.longitude
      });
    }
  }, [aircraft.latitude, aircraft.longitude, manualPlacementMode]);

  const mapWidth = 480;
  const mapHeight = 380;
  const scale = 1200; // Pixels per degree
  
  // Edge threshold - how close to edge before recentering (in pixels)
  const edgeThreshold = 40; // Give more room before recentering

  const projectPosition = (lat: number, lng: number) => {
    const deltaLat = lat - mapCenter.lat;
    const deltaLng = lng - mapCenter.lng;
    
    const x = deltaLng * scale * Math.cos(mapCenter.lat * Math.PI / 180) + mapWidth / 2;
    const y = -deltaLat * scale + mapHeight / 2;
    
    return { x, y };
  };

  // Convert screen coordinates to lat/lng
  const screenToLatLng = (screenX: number, screenY: number) => {
    const x = screenX - mapWidth / 2;
    const y = screenY - mapHeight / 2;
    
    const deltaLng = x / (scale * Math.cos(mapCenter.lat * Math.PI / 180));
    const deltaLat = -y / scale;
    
    return {
      lat: mapCenter.lat + deltaLat,
      lng: mapCenter.lng + deltaLng
    };
  };

  // Handle map click to place aircraft
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const newPosition = screenToLatLng(clickX, clickY);
    
    // Enable manual placement mode temporarily
    setManualPlacementMode(true);
    
    // Update aircraft position
    updateAircraftPosition(newPosition.lat, newPosition.lng);
    
    // Clear manual placement mode after a short delay to allow auto-recentering to resume
    setTimeout(() => {
      setManualPlacementMode(false);
    }, 1000);
  };

  // Smooth auto-centering with animation
  useEffect(() => {
    // Don't auto-recenter if in manual placement mode
    if (manualPlacementMode) return;

    const aircraftPos = projectPosition(aircraft.latitude, aircraft.longitude);
    
    // Check if aircraft is near any edge
    const nearLeftEdge = aircraftPos.x < edgeThreshold;
    const nearRightEdge = aircraftPos.x > mapWidth - edgeThreshold;
    const nearTopEdge = aircraftPos.y < edgeThreshold;
    const nearBottomEdge = aircraftPos.y > mapHeight - edgeThreshold;
    
    const needsRecentering = nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge;

    if (needsRecentering) {
      // Always center on both axes when recentering for better user experience
      const newCenterLat = aircraft.latitude;
      const newCenterLng = aircraft.longitude;
      
      // Only update if the change is significant (avoid micro-adjustments)
      const latDiff = Math.abs(newCenterLat - mapCenter.lat);
      const lngDiff = Math.abs(newCenterLng - mapCenter.lng);
      
      if (latDiff > 0.001 || lngDiff > 0.001) {
        setMapCenter({
          lat: newCenterLat,
          lng: newCenterLng
        });
      }
    }
  }, [aircraft.latitude, aircraft.longitude, mapCenter.lat, mapCenter.lng, manualPlacementMode]);

  const aircraftPos = projectPosition(aircraft.latitude, aircraft.longitude);

  // Calculate if recentering is happening
  const isRecentering = !manualPlacementMode && (
    aircraftPos.x < edgeThreshold || 
    aircraftPos.x > mapWidth - edgeThreshold ||
    aircraftPos.y < edgeThreshold || 
    aircraftPos.y > mapHeight - edgeThreshold
  );

  return (
    <div className="aviation-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Situational Map</h3>
        <div className="text-xs text-gray-400">
          Click to place aircraft
        </div>
      </div>

      <div 
        className="relative bg-gray-900 border border-gray-600 rounded overflow-hidden cursor-crosshair mb-2 mx-auto"
        style={{ width: `${mapWidth}px`, height: `${mapHeight}px`, maxWidth: '100%' }}
        onClick={handleMapClick}
        title="Click anywhere to place aircraft"
      >
        {/* Grid system */}
        <svg 
          className="absolute inset-0 pointer-events-none" 
          width={mapWidth} 
          height={mapHeight}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        >
          {/* Grid lines every 25 pixels */}
          {Array.from({ length: Math.ceil(mapWidth / 25) + 1 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 25}
              y1={0}
              x2={i * 25}
              y2={mapHeight}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          {Array.from({ length: Math.ceil(mapHeight / 25) + 1 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * 25}
              x2={mapWidth}
              y2={i * 25}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          
          {/* Center crosshairs */}
          <line 
            x1={mapWidth / 2} 
            y1={0} 
            x2={mapWidth / 2} 
            y2={mapHeight} 
            stroke="#4B5563" 
            strokeWidth="2" 
            opacity="0.5" 
          />
          <line 
            x1={0} 
            y1={mapHeight / 2} 
            x2={mapWidth} 
            y2={mapHeight / 2} 
            stroke="#4B5563" 
            strokeWidth="2" 
            opacity="0.5" 
          />
          
          {/* Compass rose */}
          <text x={mapWidth / 2} y="20" textAnchor="middle" fill="#9CA3AF" fontSize="12" fontWeight="bold">N</text>
          <text x={mapWidth - 80} y={mapHeight / 2 + 4} textAnchor="middle" fill="#9CA3AF" fontSize="12" fontWeight="bold">E</text>
          <text x={mapWidth / 2} y={mapHeight - 10} textAnchor="middle" fill="#9CA3AF" fontSize="12" fontWeight="bold">S</text>
          <text x="25" y={mapHeight / 2 + 4} textAnchor="middle" fill="#9CA3AF" fontSize="12" fontWeight="bold">W</text>
        </svg>

        {/* VOR Stations */}
        {stations.map((station) => {
          const pos = projectPosition(station.latitude, station.longitude);
          const isSelected = vorReceiver.frequency === station.frequency;
          
          // Only render if within reasonable view
          if (pos.x < -50 || pos.x > mapWidth + 50 || pos.y < -50 || pos.y > mapHeight + 50) return null;
          
          return (
            <div key={station.id}>
              {/* VOR Station Marker */}
              <div
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none ${
                  isSelected ? 'text-blue-400' : 'text-green-400'
                }`}
                style={{ left: pos.x, top: pos.y }}
              >
                <Radio size={16} />
              </div>
              
              {/* Station Label */}
              <div
                className={`absolute text-xs font-mono px-1 rounded z-10 pointer-events-none ${
                  isSelected 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}
                style={{ 
                  left: pos.x + 12, 
                  top: pos.y - 8,
                }}
              >
                {station.id}
              </div>

              {/* VOR Range Circle (if selected and in range) */}
              {isSelected && vorReceiver.stationInRange && (
                <div
                  className="absolute border-2 border-blue-400 rounded-full opacity-20 pointer-events-none"
                  style={{
                    left: pos.x - 80,
                    top: pos.y - 80,
                    width: 160,
                    height: 160,
                  }}
                />
              )}

              {/* Selected radial lines from VOR station */}
              {isSelected && vorReceiver.stationInRange && (
                <svg 
                  className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                >
                  {/* OBS Course line (both directions) */}
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={pos.x + 100 * Math.cos((vorReceiver.obs - 90) * Math.PI / 180)}
                    y2={pos.y + 100 * Math.sin((vorReceiver.obs - 90) * Math.PI / 180)}
                    stroke="#ff4444"
                    strokeWidth="2"
                    opacity="0.8"
                    strokeDasharray="4,4"
                  />
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={pos.x - 100 * Math.cos((vorReceiver.obs - 90) * Math.PI / 180)}
                    y2={pos.y - 100 * Math.sin((vorReceiver.obs - 90) * Math.PI / 180)}
                    stroke="#ff4444"
                    strokeWidth="2"
                    opacity="0.8"
                    strokeDasharray="4,4"
                  />
                  
                  {/* Current aircraft radial */}
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={pos.x + 120 * Math.cos((vorReceiver.radial - 90) * Math.PI / 180)}
                    y2={pos.y + 120 * Math.sin((vorReceiver.radial - 90) * Math.PI / 180)}
                    stroke="#00ff00"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </svg>
              )}
            </div>
          );
        })}

        {/* Aircraft */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 z-20 transition-all duration-300 ease-out pointer-events-none"
          style={{ 
            left: Math.max(10, Math.min(mapWidth - 10, aircraftPos.x)), 
            top: Math.max(10, Math.min(mapHeight - 10, aircraftPos.y)),
            transform: `translate(-50%, -50%) rotate(${aircraft.heading - 45}deg)`
          }}
        >
          <Plane size={20} />
        </div>



        {/* Recentering indicator */}
        {isRecentering && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded animate-pulse pointer-events-none">
            Recentering...
          </div>
        )}

        {/* Flight simulation indicator */}
        {simulation.isRunning && (
          <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1 pointer-events-none">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Flight Sim ON
          </div>
        )}
      </div>

      {/* Compact Map Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <Plane size={10} className="text-yellow-400" />
          <span className="text-gray-300">Aircraft</span>
        </div>
        <div className="flex items-center gap-1">
          <Radio size={10} className="text-green-400" />
          <span className="text-gray-300">VOR</span>
        </div>
        <div className="flex items-center gap-1">
          <Radio size={10} className="text-blue-400" />
          <span className="text-gray-300">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-red-400 opacity-70"></div>
          <span className="text-gray-300">OBS</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-green-400 opacity-60"></div>
          <span className="text-gray-300">Radial</span>
        </div>
      </div>
    </div>
  );
};

export default MapView; 