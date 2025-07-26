import React from 'react';
import { motion } from 'framer-motion';
import { useVORStore } from '../store/vorStore';
import { BookOpen, Target, MapPin, CheckCircle } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  initialPosition: { lat: number; lng: number; heading: number };
  targetFrequency: string;
  targetOBS: number;
  instructions: string[];
}

const scenarios: Scenario[] = [
  {
    id: 'basic-identification',
    title: 'VOR Station Identification',
    description: 'Learn to identify and tune to a VOR station',
    difficulty: 'Beginner',
    objectives: [
      'Tune to LAX VOR (113.60)',
      'Confirm signal reception',
      'Identify station information'
    ],
    initialPosition: { lat: 33.9425, lng: -118.4081, heading: 90 },
    targetFrequency: '113.60',
    targetOBS: 90,
    instructions: [
      'Use the frequency tuner to select 113.60 MHz',
      'Verify the signal strength indicator shows "STRONG"',
      'Note the station ID and name in the frequency panel',
      'The aircraft is positioned near the LAX VOR station'
    ]
  },
  {
    id: 'radial-intercept',
    title: 'Intercepting a Radial',
    description: 'Practice intercepting and tracking a specific radial',
    difficulty: 'Intermediate',
    objectives: [
      'Intercept the 090° radial FROM LAX VOR',
      'Center the CDI needle',
      'Understand TO/FROM flag operation'
    ],
    initialPosition: { lat: 33.9525, lng: -118.5081, heading: 45 },
    targetFrequency: '113.60',
    targetOBS: 90,
    instructions: [
      'Set OBS to 090°',
      'Note the CDI needle deflection and TO/FROM flag',
      'Move aircraft to center the CDI needle',
      'Observe how the flag changes from TO to FROM as you cross the station'
    ]
  },
  {
    id: 'course-tracking',
    title: 'Course Tracking',
    description: 'Track a course TO a VOR station',
    difficulty: 'Intermediate',
    objectives: [
      'Track the 270° course TO LAX VOR',
      'Maintain course centerline',
      'Understand course corrections'
    ],
    initialPosition: { lat: 33.9425, lng: -117.9000, heading: 270 },
    targetFrequency: '113.60',
    targetOBS: 270,
    instructions: [
      'Set OBS to 270° (west)',
      'Verify TO flag is displayed',
      'Keep CDI needle centered by adjusting aircraft position',
      'Track the course directly to the VOR station'
    ]
  },
  {
    id: 'station-passage',
    title: 'VOR Station Passage',
    description: 'Recognize and navigate through station passage',
    difficulty: 'Advanced',
    objectives: [
      'Approach LAX VOR on the 090° radial',
      'Identify station passage',
      'Continue on the reciprocal bearing'
    ],
    initialPosition: { lat: 33.9425, lng: -118.6000, heading: 90 },
    targetFrequency: '113.60',
    targetOBS: 90,
    instructions: [
      'Set OBS to 090° and track TO the station',
      'Watch for CDI sensitivity increase near the station',
      'Note the TO/FROM flag reversal at station passage',
      'Continue tracking away from the station on the same radial'
    ]
  }
];

const TrainingScenarios: React.FC = () => {
  const { 
    updateAircraftPosition, 
    updateAircraftHeading,
    tuneFrequency,
    setOBS,
    selectedScenario,
    selectScenario 
  } = useVORStore();

  const handleScenarioStart = (scenario: Scenario) => {
    // Set up the scenario
    updateAircraftPosition(scenario.initialPosition.lat, scenario.initialPosition.lng);
    updateAircraftHeading(scenario.initialPosition.heading);
    tuneFrequency(scenario.targetFrequency);
    setOBS(scenario.targetOBS);
    selectScenario(scenario.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="aviation-panel max-h-96 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-semibold">Training Scenarios</h3>
      </div>

      <div className="space-y-4">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all ${
              selectedScenario === scenario.id
                ? 'bg-blue-900 border-blue-400'
                : 'bg-gray-800 border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-medium text-sm">{scenario.title}</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                {scenario.difficulty}
              </span>
            </div>
            
            <p className="text-gray-300 text-xs mb-3">{scenario.description}</p>
            
            <div className="mb-3">
              <h5 className="text-gray-400 text-xs font-medium mb-1">Objectives:</h5>
              <ul className="space-y-1">
                {scenario.objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <Target className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {selectedScenario === scenario.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mb-3 p-3 bg-gray-900 rounded border border-blue-500"
              >
                <h5 className="text-blue-400 text-xs font-medium mb-2">Instructions:</h5>
                <ol className="space-y-1">
                  {scenario.instructions.map((instruction, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex gap-2">
                      <span className="text-blue-400 font-mono">{idx + 1}.</span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleScenarioStart(scenario)}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
              >
                Start Scenario
              </button>
              {selectedScenario !== scenario.id && (
                <button
                  onClick={() => selectScenario(scenario.id)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
                >
                  View
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Progress:</span>
          <div className="flex items-center gap-1">
            {scenarios.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < 2 ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingScenarios; 