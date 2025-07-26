import React from 'react';
import { useVORStore } from '../store/vorStore';
import { Radio, Activity } from 'lucide-react';

const VORStatusDisplay: React.FC = () => {
  const { vorReceiver, aircraft } = useVORStore();

  const formatRadial = (radial: number): string => {
    return radial.toString().padStart(3, '0') + '°';
  };

  const formatDistance = (distance: number): string => {
    return distance.toFixed(1) + ' nm';
  };

  const getCDIStatus = (cdi: number): { text: string; color: string } => {
    if (Math.abs(cdi) < 1) {
      return { text: 'CENTERED', color: 'text-green-400' };
    } else if (Math.abs(cdi) < 5) {
      return { text: cdi > 0 ? 'RIGHT' : 'LEFT', color: 'text-yellow-400' };
    } else {
      return { text: cdi > 0 ? 'FULL RIGHT' : 'FULL LEFT', color: 'text-red-400' };
    }
  };

  if (!vorReceiver.selectedStation) {
    return (
      <div className="aviation-panel">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-semibold">VOR Status</h3>
        </div>
        <div className="text-center py-8">
          <Radio className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No VOR station tuned</p>
          <p className="text-gray-500 text-xs">Select a frequency to begin navigation</p>
        </div>
      </div>
    );
  }

  const cdiStatus = getCDIStatus(vorReceiver.cdi);

  return (
    <div className="aviation-panel">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-semibold">VOR Status</h3>
      </div>

      {/* Station Information - Fixed spacing */}
      <div className="mb-4 p-3 bg-gray-800 border border-gray-600 rounded">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium text-sm">
            {vorReceiver.selectedStation.id} VOR
          </span>
        </div>
        <div className="text-xs text-gray-400 mb-1">
          {vorReceiver.selectedStation.name}
        </div>
        <div className="text-xs text-gray-400">
          {vorReceiver.frequency} MHz
        </div>
      </div>

      {/* Navigation Data */}
      {vorReceiver.stationInRange ? (
        <div className="space-y-3">
          {/* Grid layout for better spacing */}
          <div className="grid grid-cols-2 gap-2">
            {/* Current Radial */}
            <div className="p-2 bg-gray-800 rounded">
              <div className="text-gray-400 text-xs mb-1">Radial</div>
              <div className="text-white font-mono text-sm font-semibold">
                {formatRadial(vorReceiver.radial)}
              </div>
            </div>

            {/* Distance */}
            <div className="p-2 bg-gray-800 rounded">
              <div className="text-gray-400 text-xs mb-1">Distance</div>
              <div className="text-white font-mono text-sm font-semibold">
                {formatDistance(vorReceiver.distance)}
              </div>
            </div>

            {/* Selected Course (OBS) */}
            <div className="p-2 bg-gray-800 rounded">
              <div className="text-gray-400 text-xs mb-1">OBS Course</div>
              <div className="text-white font-mono text-sm font-semibold">
                {formatRadial(vorReceiver.obs)}
              </div>
            </div>

            {/* Aircraft Heading */}
            <div className="p-2 bg-gray-800 rounded">
              <div className="text-gray-400 text-xs mb-1">Heading</div>
              <div className="text-white font-mono text-sm font-semibold">
                {aircraft.heading.toString().padStart(3, '0')}°
              </div>
            </div>
          </div>

          {/* CDI Status - Full width */}
          <div className="p-3 bg-gray-800 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">CDI Status</span>
              <span className={`font-mono text-sm font-bold ${cdiStatus.color}`}>
                {cdiStatus.text}
              </span>
            </div>
            
            <div className="text-gray-400 text-xs mb-2">
              Deflection: {vorReceiver.cdi > 0 ? '+' : ''}{vorReceiver.cdi.toFixed(1)}°
            </div>
            
            {/* Visual CDI Scale */}
            <div className="relative w-full h-3 bg-gray-700 rounded mb-2">
              {/* Center line */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white transform -translate-x-1/2"></div>
              
              {/* CDI dots */}
              {[-2, -1, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className="absolute w-1 h-1 bg-gray-500 rounded-full top-1"
                  style={{ 
                    left: `${50 + dot * 12.5}%`, 
                    transform: 'translateX(-50%)' 
                  }}
                />
              ))}
              
              {/* CDI needle position */}
              <div
                className="absolute w-1 h-3 bg-white rounded-sm transition-all duration-300"
                style={{
                  left: `${50 + Math.max(-25, Math.min(25, vorReceiver.cdi * 2.5))}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>L</span>
              <span>R</span>
            </div>
          </div>

          {/* TO/FROM Flag - Full width */}
          <div className="p-3 bg-gray-800 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Navigation Flag</span>
              <span className={`font-bold text-sm px-3 py-1 rounded min-w-[3rem] text-center ${
                vorReceiver.toFrom === 'TO' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                {vorReceiver.toFrom}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-red-400 font-semibold mb-2 text-lg">OUT OF RANGE</div>
          <div className="text-gray-400 text-sm mb-1">
            Distance: {formatDistance(vorReceiver.distance)}
          </div>
          <div className="text-gray-500 text-xs">
            Move closer to receive signals
          </div>
        </div>
      )}
    </div>
  );
};

export default VORStatusDisplay; 