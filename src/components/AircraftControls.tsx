import React, { useEffect } from 'react';
import { useVORStore } from '../store/vorStore';
import { Play, Pause, Plane, Gauge, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, RotateCw } from 'lucide-react';

const AircraftControls: React.FC = () => {
  const { 
    aircraft, 
    simulation, 
    updateAircraftPosition, 
    updateAircraftHeading, 
    moveAircraftForward,
    setAircraftSpeed,
    startSimulation, 
    stopSimulation, 
    setSimulationSpeed 
  } = useVORStore();

  // Autopilot movement effect
  useEffect(() => {
    if (!simulation.isRunning) return;

    const updateInterval = Math.max(10, 1000 / simulation.speed); // Minimum 10ms interval, faster updates at high speeds
    
    const interval = setInterval(() => {
      // Move aircraft forward based on speed
      // Convert knots to nautical miles per second, then scale by update interval and simulation speed
      const distancePerSecond = aircraft.speed / 3600; // knots to nm/second
      const movementDistance = distancePerSecond * (updateInterval / 1000) * simulation.speed; // Scale by interval and simulation speed
      moveAircraftForward(movementDistance);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [aircraft.speed, simulation.isRunning, simulation.speed, moveAircraftForward]);

  const handleCircularHeadingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    // Calculate angle in degrees (0° = North, 90° = East, etc.)
    let angle = Math.atan2(deltaX, -deltaY) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    
    updateAircraftHeading(Math.round(angle));
  };

  const handleHeadingInput = (value: string) => {
    const heading = parseInt(value);
    if (!isNaN(heading) && heading >= 0 && heading <= 359) {
      updateAircraftHeading(heading);
    }
  };

  const adjustHeading = (delta: number) => {
    const newHeading = (aircraft.heading + delta + 360) % 360;
    updateAircraftHeading(newHeading);
  };

  const adjustSpeed = (delta: number) => {
    const newSpeed = Math.max(0, Math.min(300, aircraft.speed + delta));
    setAircraftSpeed(newSpeed);
  };

  const handleManualMove = (direction: 'forward' | 'backward' | 'left' | 'right') => {
    const moveDistance = 0.01; // Small movement in degrees
    const headingRad = aircraft.heading * Math.PI / 180;
    
    let deltaLat = 0;
    let deltaLng = 0;
    
    switch (direction) {
      case 'forward':
        deltaLat = moveDistance * Math.cos(headingRad);
        deltaLng = moveDistance * Math.sin(headingRad);
        break;
      case 'backward':
        deltaLat = -moveDistance * Math.cos(headingRad);
        deltaLng = -moveDistance * Math.sin(headingRad);
        break;
      case 'left':
        deltaLat = -moveDistance * Math.sin(headingRad);
        deltaLng = moveDistance * Math.cos(headingRad);
        break;
      case 'right':
        deltaLat = moveDistance * Math.sin(headingRad);
        deltaLng = -moveDistance * Math.cos(headingRad);
        break;
    }
    
    updateAircraftPosition(aircraft.latitude + deltaLat, aircraft.longitude + deltaLng);
  };

  const getCardinalDirection = (heading: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(heading / 22.5) % 16;
    return directions[index];
  };

  const handleQuickPosition = (lat: number, lng: number, heading: number) => {
    updateAircraftPosition(lat, lng);
    updateAircraftHeading(heading);
  };

  return (
    <div className="aviation-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Plane size={18} />
          Aircraft Controls
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <Gauge size={12} className="text-blue-400" />
          <span className="text-gray-300">{aircraft.speed} kts</span>
        </div>
      </div>

      {/* Current Position & Heading - Horizontal Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="space-y-1">
          <div className="text-gray-400">Latitude</div>
          <div className="font-mono text-green-400">
            {aircraft.latitude.toFixed(4)}°
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-gray-400">Longitude</div>
          <div className="font-mono text-green-400">
            {aircraft.longitude.toFixed(4)}°
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-gray-400">Heading</div>
          <div className="font-mono text-green-400">
            {aircraft.heading.toString().padStart(3, '0')}°
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-gray-400">Direction</div>
          <div className="font-mono text-green-400">
            {getCardinalDirection(aircraft.heading)}
          </div>
        </div>
      </div>

      {/* Main Controls - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Manual Movement Controls */}
        <div className="p-3 bg-gray-800/50 rounded">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUp size={16} className="text-blue-400" />
            <span className="text-gray-400 text-sm font-medium">Move</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1 max-w-24 mx-auto">
            <div></div>
            <button
              onClick={() => handleManualMove('forward')}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
              title="Move forward"
            >
              <ArrowUp size={14} />
            </button>
            <div></div>
            
            <button
              onClick={() => handleManualMove('left')}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
              title="Move left"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => handleManualMove('backward')}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
              title="Move backward"
            >
              <ArrowDown size={14} />
            </button>
            <button
              onClick={() => handleManualMove('right')}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
              title="Move right"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Heading Control */}
        <div className="p-3 bg-gray-800/50 rounded">
          <div className="flex items-center gap-2 mb-3">
            <Compass size={16} className="text-blue-400" />
            <span className="text-gray-400 text-sm font-medium">Heading</span>
          </div>
          
          <div className="space-y-2">
            {/* Circular compass - smaller */}
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-full border-2 border-gray-600 bg-gray-800 cursor-pointer hover:border-blue-400 transition-colors relative"
                  onClick={handleCircularHeadingClick}
                  title="Click to set heading"
                >
                  {/* Compass markings */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">N</div>
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">E</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-xs text-gray-400 font-bold">S</div>
                    <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">W</div>
                  </div>
                  
                  {/* Heading indicator */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 pointer-events-none"
                    style={{
                      transform: `rotate(${aircraft.heading}deg)`
                    }}
                  >
                    <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-yellow-400 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Turn buttons */}
            <div className="flex items-center gap-1 justify-center">
              <button
                onClick={() => adjustHeading(-10)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
                title="Turn left 10°"
              >
                <RotateCcw size={12} />
              </button>
              <button
                onClick={() => adjustHeading(-1)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
                title="Turn left 1°"
              >
                <RotateCcw size={10} />
              </button>
              
              <input
                type="number"
                min="0"
                max="359"
                value={aircraft.heading}
                onChange={(e) => handleHeadingInput(e.target.value)}
                className="w-16 px-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white text-center font-mono"
                placeholder="000"
              />
              
              <button
                onClick={() => adjustHeading(1)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
                title="Turn right 1°"
              >
                <RotateCw size={10} />
              </button>
              <button
                onClick={() => adjustHeading(10)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white"
                title="Turn right 10°"
              >
                <RotateCw size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Speed Control */}
        <div className="p-3 bg-gray-800/50 rounded">
          <div className="flex items-center gap-2 mb-3">
            <Gauge size={16} className="text-blue-400" />
            <span className="text-gray-400 text-sm font-medium">Speed</span>
          </div>
          
          <div className="space-y-2">
            <div className="text-center">
              <div className="text-lg font-mono text-green-400">
                {aircraft.speed}
              </div>
              <div className="text-xs text-gray-500">
                knots
              </div>
            </div>
            
            <div className="flex items-center gap-1 justify-center">
              <button
                onClick={() => adjustSpeed(-10)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white text-xs"
                title="Decrease speed by 10 kts"
              >
                -10
              </button>
              <button
                onClick={() => adjustSpeed(-1)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white text-xs"
                title="Decrease speed by 1 kt"
              >
                -1
              </button>
              
              <input
                type="number"
                min="0"
                max="300"
                value={aircraft.speed}
                onChange={(e) => setAircraftSpeed(parseInt(e.target.value) || 0)}
                className="w-16 px-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white text-center font-mono"
                placeholder="120"
              />
              
              <button
                onClick={() => adjustSpeed(1)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white text-xs"
                title="Increase speed by 1 kt"
              >
                +1
              </button>
              <button
                onClick={() => adjustSpeed(10)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white text-xs"
                title="Increase speed by 10 kts"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* Auto Flight Control */}
        <div className="p-3 bg-gray-800/50 rounded">
          <div className="flex items-center gap-2 mb-3">
            {simulation.isRunning ? <Pause size={16} className="text-red-400" /> : <Play size={16} className="text-green-400" />}
            <span className="text-gray-400 text-sm font-medium">Auto Flight</span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={simulation.isRunning ? stopSimulation : startSimulation}
              className={`w-full flex items-center justify-center gap-1 px-2 py-2 rounded text-xs transition-colors ${
                simulation.isRunning
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {simulation.isRunning ? <Pause size={12} /> : <Play size={12} />}
              {simulation.isRunning ? 'Stop' : 'Start'}
            </button>
            
            {simulation.isRunning && (
              <>
                <div className="text-center">
                  <div className="text-sm font-mono text-green-400">
                    {simulation.speed}x
                  </div>
                  <div className="text-xs text-gray-500">
                    time speed
                  </div>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={simulation.speed}
                  onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Position Presets - Horizontal */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-gray-400 text-sm mb-2">Quick Positions</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => handleQuickPosition(33.9425, -118.4081, 90)}
            className="text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
          >
            <div className="font-medium text-white">LAX Area</div>
            <div className="text-gray-400">33.9425°, -118.4081°</div>
          </button>
          <button
            onClick={() => handleQuickPosition(32.7353, -117.1900, 180)}
            className="text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
          >
            <div className="font-medium text-white">San Diego</div>
            <div className="text-gray-400">32.7353°, -117.1900°</div>
          </button>
          <button
            onClick={() => handleQuickPosition(37.6213, -122.3790, 270)}
            className="text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
          >
            <div className="font-medium text-white">San Francisco</div>
            <div className="text-gray-400">37.6213°, -122.3790°</div>
          </button>
        </div>
      </div>
    </div>
  );
  };

export default AircraftControls; 