import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useVORStore } from '../store/vorStore';

const VORInstrument: React.FC = () => {
  const { vorReceiver, setOBS } = useVORStore();
  
  // Track the visual rotation for smooth animation across 360°/0° boundary
  const [visualRotation, setVisualRotation] = useState(vorReceiver.obs);
  const lastOBSRef = useRef(vorReceiver.obs);
  
  // Update visual rotation smoothly when OBS changes
  React.useEffect(() => {
    const currentOBS = vorReceiver.obs;
    const lastOBS = lastOBSRef.current;
    
    let rotationDelta = currentOBS - lastOBS;
    
    // Handle wraparound - always take the shortest path
    if (rotationDelta > 180) {
      rotationDelta -= 360;
    } else if (rotationDelta < -180) {
      rotationDelta += 360;
    }
    
    // Update visual rotation by adding the delta
    setVisualRotation(prev => prev + rotationDelta);
    lastOBSRef.current = currentOBS;
  }, [vorReceiver.obs]);
  
  const handleOBSChange = (direction: 'left' | 'right') => {
    const increment = direction === 'right' ? 10 : -10;
    const newOBS = (vorReceiver.obs + increment + 360) % 360;
    setOBS(newOBS);
  };

  const handleOBSWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Precise scroll wheel - use 1 degree increments for fine control
    const sensitivity = 1; // degrees per scroll step
    const direction = event.deltaY > 0 ? sensitivity : -sensitivity;
    const newOBS = (vorReceiver.obs + direction + 360) % 360;
    setOBS(newOBS);
  };

  // Calculate CDI needle position (-10 to +10 maps to -50px to +50px for better scaling)
  const cdiNeedlePosition = Math.max(-50, Math.min(50, vorReceiver.cdi * 5));
  
  return (
    <div className="vor-instrument w-80 h-80 mx-auto relative">
      {/* Outer ring with degree markings */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 320 320" className="overflow-visible">
          {/* Outer circle background */}
          <circle 
            cx="160" 
            cy="160" 
            r="150" 
            fill="#000" 
            stroke="#444" 
            strokeWidth="4"
          />
          
          {/* Degree markings */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = i * 10;
            const isCardinal = angle % 30 === 0;
            const x1 = 160 + (isCardinal ? 110 : 125) * Math.cos((angle - 90) * Math.PI / 180);
            const y1 = 160 + (isCardinal ? 110 : 125) * Math.sin((angle - 90) * Math.PI / 180);
            const x2 = 160 + (isCardinal ? 95 : 115) * Math.cos((angle - 90) * Math.PI / 180);
            const y2 = 160 + (isCardinal ? 95 : 115) * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#fff"
                strokeWidth={isCardinal ? "3" : "1"}
              />
            );
          })}
          
          {/* Cardinal direction labels */}
          <text x="160" y="35" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">N</text>
          <text x="285" y="170" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">E</text>
          <text x="160" y="295" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">S</text>
          <text x="35" y="170" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">W</text>
          
          {/* OBS selector triangle and course line - smooth rotation */}
          <motion.g
            style={{ 
              transformOrigin: '160px 160px'
            }}
            animate={{
              rotate: visualRotation
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <polygon
              points="160,45 168,60 152,60"
              fill="#ff4444"
              stroke="#fff"
              strokeWidth="1"
            />
            
            {/* OBS course line */}
            <line
              x1="160"
              y1="40"
              x2="160" 
              y2="280"
              stroke="#ff4444"
              strokeWidth="3"
            />
          </motion.g>
        </svg>
      </div>
      
      {/* CDI (Course Deviation Indicator) - Scaled back up */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4">
        <div className="relative w-32 h-4 bg-gray-800 border-2 border-gray-500 rounded">
          {/* CDI scale dots */}
          {[-2, -1, 0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={`absolute w-2 h-2 rounded-full top-1 ${
                dot === 0 ? 'bg-white border border-gray-300' : 'bg-gray-400'
              }`}
              style={{ left: `${50 + dot * 20}%`, transform: 'translateX(-50%)' }}
            />
          ))}
          
          {/* CDI needle */}
          <motion.div
            className="absolute w-1 h-6 bg-yellow-400 border border-yellow-300 top-0 left-1/2 rounded-sm shadow-lg"
            style={{ 
              transform: `translateX(calc(-50% + ${cdiNeedlePosition}px))`,
            }}
            animate={{ 
              x: cdiNeedlePosition 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
      
      {/* TO/FROM flag - Larger spacing */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-10">
        <div className={`
          px-2 py-1 rounded text-xs font-bold border min-w-[3rem] text-center
          ${vorReceiver.toFrom === 'TO' ? 'bg-green-600 text-white border-green-400' : 
            vorReceiver.toFrom === 'FROM' ? 'bg-blue-600 text-white border-blue-400' :
            'bg-red-600 text-white border-red-400'}
        `}>
          {vorReceiver.toFrom === 'OFF' ? 'OFF' : vorReceiver.toFrom}
        </div>
      </div>
      
      {/* Center hub - Larger */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-gray-800 border-2 border-gray-600 rounded-full"></div>
      </div>
      
      {/* OBS Control Knobs - Larger */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 items-center">
        <button
          onClick={() => handleOBSChange('left')}
          className="course-selector text-sm hover:bg-gray-700 transition-colors w-8 h-8"
          title="Decrease OBS by 10°"
        >
          ←
        </button>
        <div className="frequency-display text-sm min-w-[3rem] text-center px-2 py-1">
          {vorReceiver.obs.toString().padStart(3, '0')}°
        </div>
        <button
          onClick={() => handleOBSChange('right')}
          className="course-selector text-sm hover:bg-gray-700 transition-colors w-8 h-8"
          title="Increase OBS by 10°"
        >
          →
        </button>
      </div>
      
      {/* Interactive OBS wheel overlay - Larger */}
      <div 
        className="absolute inset-4 cursor-grab active:cursor-grabbing rounded-full"
        onWheel={handleOBSWheel}
        title="Scroll to adjust OBS setting (1° per scroll)"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};

export default VORInstrument; 