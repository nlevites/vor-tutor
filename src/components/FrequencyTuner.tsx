import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useVORStore } from '../store/vorStore';
import { Radio } from 'lucide-react';

const FrequencyTuner: React.FC = () => {
  const { vorReceiver, stations, tuneFrequency } = useVORStore();
  const [displayFreq, setDisplayFreq] = useState(vorReceiver.frequency);

  const handleFrequencyChange = (direction: 'up' | 'down') => {
    const freq = parseFloat(displayFreq);
    const increment = direction === 'up' ? 0.05 : -0.05;
    const newFreq = Math.max(108.00, Math.min(118.00, freq + increment));
    const formattedFreq = newFreq.toFixed(2);
    setDisplayFreq(formattedFreq);
    tuneFrequency(formattedFreq);
  };

  const handleStationSelect = (frequency: string) => {
    setDisplayFreq(frequency);
    tuneFrequency(frequency);
  };

  const currentStation = stations.find(s => s.frequency === vorReceiver.frequency);

  return (
    <div className="aviation-panel">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-semibold">VOR Frequency</h3>
      </div>
      
      {/* Main frequency display */}
      <div className="mb-4">
        <div className="frequency-display text-center text-2xl mb-2">
          {displayFreq}
        </div>
        
        {/* Frequency adjustment controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleFrequencyChange('down')}
            className="course-selector w-10 h-10 text-lg hover:bg-gray-700 transition-colors"
            title="Decrease frequency"
          >
            ↓
          </button>
          <div className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm">
            MHz
          </div>
          <button
            onClick={() => handleFrequencyChange('up')}
            className="course-selector w-10 h-10 text-lg hover:bg-gray-700 transition-colors"
            title="Increase frequency"
          >
            ↑
          </button>
        </div>
      </div>

      {/* Station information */}
      {currentStation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-gray-800 border border-gray-600 rounded"
        >
          <div className="text-white font-semibold text-sm">{currentStation.name}</div>
          <div className="text-gray-400 text-xs">ID: {currentStation.id}</div>
          <div className="text-gray-400 text-xs">
            {currentStation.latitude.toFixed(4)}°, {currentStation.longitude.toFixed(4)}°
          </div>
        </motion.div>
      )}

      {/* Station presets */}
      <div className="space-y-2">
        <div className="text-white text-sm font-medium mb-2">Quick Tune:</div>
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => handleStationSelect(station.frequency)}
            className={`w-full p-2 rounded text-left text-sm transition-colors ${
              vorReceiver.frequency === station.frequency
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{station.id}</span>
              <span className="text-xs">{station.frequency}</span>
            </div>
            <div className="text-xs opacity-75">{station.name}</div>
          </button>
        ))}
      </div>

      {/* Signal strength indicator */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Signal:</span>
          <div className="flex items-center gap-1">
            {vorReceiver.stationInRange ? (
              <>
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded ${
                      i < 4 ? 'bg-green-500' : 'bg-green-300'
                    }`}
                  />
                ))}
                <span className="text-green-400 text-xs ml-2">STRONG</span>
              </>
            ) : (
              <>
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="w-1 h-3 rounded bg-gray-600"
                  />
                ))}
                <span className="text-red-400 text-xs ml-2">NO SIGNAL</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyTuner; 