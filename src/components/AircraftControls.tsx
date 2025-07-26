import React, { useEffect } from 'react';
import { useVORStore } from '../store/vorStore';
import { Play, Pause, Plane, Gauge, Compass } from 'lucide-react';

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

      {/* Current Position & Heading */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="space-y-1">
          <div className="text-gray-400">Position</div>
          <div className="font-mono text-green-400">
            {aircraft.latitude.toFixed(4)}°, {aircraft.longitude.toFixed(4)}°
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-gray-400">Heading</div>
          <div className="font-mono text-green-400">
            {aircraft.heading.toString().padStart(3, '0')}° ({getCardinalDirection(aircraft.heading)})
          </div>
        </div>
      </div>

      {/* Aircraft Control Section */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded">
        <div className="flex items-center gap-2 mb-3">
          <Compass size={16} className="text-blue-400" />
          <span className="text-gray-400 text-sm font-medium">Aircraft Control</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Circular Heading Control */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">Heading (°)</label>
            <div className="flex flex-col items-center gap-2">
              {/* Circular heading control */}
              <div className="relative">
                <div 
                  className="w-20 h-20 rounded-full border-2 border-gray-600 bg-gray-800 cursor-pointer hover:border-blue-400 transition-colors relative"
                  onClick={handleCircularHeadingClick}
                  title="Click to set heading direction"
                >
                  {/* Compass markings */}
                  <div className="absolute inset-0">
                    {/* Cardinal directions */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">N</div>
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">E</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-xs text-gray-400">S</div>
                    <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">W</div>
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
              
              {/* Heading input */}
              <input
                type="number"
                min="0"
                max="359"
                value={aircraft.heading}
                onChange={(e) => handleHeadingInput(e.target.value)}
                className="w-16 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white text-center font-mono"
                placeholder="000"
              />
              <div className="text-xs text-gray-500 text-center">
                {getCardinalDirection(aircraft.heading)}
              </div>
            </div>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">Speed (kts)</label>
            <input
              type="number"
              min="0"
              max="300"
              value={aircraft.speed}
              onChange={(e) => setAircraftSpeed(parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white text-center font-mono"
              placeholder="120"
            />
            <div className="text-xs text-gray-500 text-center">
              Ground Speed
            </div>
          </div>
        </div>
      </div>



      {/* Flight Simulation Controls */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-gray-400 text-sm">Flight Simulation</span>
            <div className="text-xs text-gray-500">Controls automatic flight</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={simulation.isRunning ? stopSimulation : startSimulation}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                simulation.isRunning
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {simulation.isRunning ? <Pause size={12} /> : <Play size={12} />}
              {simulation.isRunning ? 'Stop Flight' : 'Start Flight'}
            </button>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 block mb-1">Time Speed: {simulation.speed}x</label>
          {/* Speed slider: 0.1x to 100x simulation speed */}
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={simulation.speed}
            onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
            disabled={!simulation.isRunning}
          />
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>0.1x</span>
            <span>
              {simulation.isRunning 
                ? `Aircraft moving at ${simulation.speed}x speed`
                : 'Start flight simulation to enable speed control'
              }
            </span>
            <span>100x</span>
          </div>
        </div>
        
        {simulation.isRunning && (
          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Flying {getCardinalDirection(aircraft.heading)} at {aircraft.speed} kts (Time: {simulation.speed}x)
          </div>
        )}
      </div>

      {/* Quick Position Presets */}
      <div>
        <div className="text-gray-400 text-sm mb-2">Quick Positions</div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <button
            onClick={() => handleQuickPosition(33.9425, -118.4081, 90)}
            className="text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
          >
            <div className="font-medium text-white">LAX Area</div>
            <div className="text-gray-400">33.9425°, -118.4081° (Heading 090°)</div>
          </button>
          <button
            onClick={() => handleQuickPosition(32.7353, -117.1900, 180)}
            className="text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
          >
            <div className="font-medium text-white">San Diego</div>
            <div className="text-gray-400">32.7353°, -117.1900° (Heading 180°)</div>
          </button>
          <button
            onClick={() => handleQuickPosition(37.6213, -122.3790, 270)}
            className="text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
          >
            <div className="font-medium text-white">San Francisco</div>
            <div className="text-gray-400">37.6213°, -122.3790° (Heading 270°)</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AircraftControls; 