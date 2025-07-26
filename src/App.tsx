import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVORStore } from './store/vorStore';
import VORInstrument from './components/VORInstrument';
import FrequencyTuner from './components/FrequencyTuner';
import AircraftControls from './components/AircraftControls';
import MapView from './components/MapView';
import TrainingScenarios from './components/TrainingScenarios';
import VORStatusDisplay from './components/VORStatusDisplay';
import { GraduationCap, Plane, BookOpen, X, Menu, HelpCircle, Info } from 'lucide-react';

function App() {
  const { calculateVORData } = useVORStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize VOR calculations on app load
  useEffect(() => {
    calculateVORData();
  }, [calculateVORData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="p-2 bg-aviation-primary rounded-lg"
              >
                <Plane className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">VOR Tutor</h1>
                <p className="text-sm sm:text-base text-gray-600">Interactive VOR Navigation Training</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuickRef(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Quick Reference Guide"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quick Ref</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTheory(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                title="VOR Navigation Theory"
              >
                <Info className="w-4 h-4" />
                <span>Theory</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTutorial(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-aviation-primary text-white rounded-lg hover:bg-aviation-secondary transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Tutorial</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPractice(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-aviation-primary text-aviation-primary rounded-lg hover:bg-aviation-primary hover:text-white transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Practice</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setShowQuickRef(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Quick Reference</span>
                </button>
                <button
                  onClick={() => {
                    setShowTheory(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
                >
                  <Info className="w-4 h-4" />
                  <span>Theory</span>
                </button>
                <button
                  onClick={() => {
                    setShowTutorial(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-aviation-primary text-white rounded-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Tutorial</span>
                </button>
                <button
                  onClick={() => {
                    setShowPractice(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-aviation-primary text-aviation-primary rounded-lg"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Practice</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-8">
        {/* Top Section - 4 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 items-start">
          
          {/* Left Column - Frequency Tuner */}
          <div className="lg:col-span-2 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FrequencyTuner />
            </motion.div>
          </div>

          {/* Second Column - VOR Instrument */}
          <div className="lg:col-span-3 w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-3"
            >
              <h2 className="text-base font-semibold text-gray-900 mb-3 text-center">
                VOR Course Deviation Indicator
              </h2>
              <div className="flex justify-center">
                <VORInstrument />
              </div>
            </motion.div>
          </div>

          {/* Third Column - Map View */}
          <div className="lg:col-span-4 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MapView />
            </motion.div>
          </div>
          
          {/* Fourth Column - VOR Status Display */}
          <div className="lg:col-span-3 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <VORStatusDisplay />
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Aircraft Controls (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <AircraftControls />
        </motion.div>
      </main>

      {/* Quick Reference Modal */}
      {showQuickRef && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQuickRef(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Quick Reference</h2>
                <button
                  onClick={() => setShowQuickRef(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3 text-sm text-gray-800">
                <div><strong>Scroll wheel:</strong> Adjust OBS on VOR instrument</div>
                <div><strong>CDI needle:</strong> Shows course deviation (left/right)</div>
                <div><strong>TO/FROM flag:</strong> Indicates course direction relative to station</div>
                <div><strong>Map click:</strong> Place aircraft at new position</div>
                <div><strong>Auto Flight:</strong> Aircraft flies automatically at set speed/heading</div>
                <div><strong>Manual controls:</strong> Use arrow buttons to move aircraft manually</div>
                <div><strong>Heading:</strong> Click compass or use turn buttons to change direction</div>
                <div><strong>Speed:</strong> Use +/- buttons or input field to adjust aircraft speed</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Theory Modal */}
      {showTheory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTheory(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">VOR Navigation Theory</h2>
                <button
                  onClick={() => setShowTheory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <strong className="text-aviation-primary">Radials:</strong> 
                  <p className="mt-1">Imaginary lines extending outward from a VOR station (0-359°). Aircraft position is described by which radial they're on.</p>
                </div>
                <div>
                  <strong className="text-aviation-primary">OBS (Omnibearing Selector):</strong>
                  <p className="mt-1">Dial used to select the desired course. When properly set, CDI needle shows deviation from that course.</p>
                </div>
                <div>
                  <strong className="text-aviation-primary">CDI (Course Deviation Indicator):</strong>
                  <p className="mt-1">Vertical needle showing lateral displacement from selected course. Each dot represents 2° of deviation.</p>
                </div>
                <div>
                  <strong className="text-aviation-primary">TO/FROM Flag:</strong>
                  <p className="mt-1">Shows whether following the OBS course will take you TO the station or FROM the station.</p>
                </div>
                
                <hr className="my-4" />
                
                <div>
                  <strong className="text-gray-800">Intercepting a Course:</strong>
                  <ol className="mt-1 ml-4 list-decimal space-y-1">
                    <li>Set OBS to desired course</li>
                    <li>Turn to intercept heading (usually 30-45°)</li>
                    <li>When CDI needle starts moving, turn to course</li>
                    <li>Make small corrections to keep needle centered</li>
                  </ol>
                </div>
                <div>
                  <strong className="text-gray-800">Navigation Tips:</strong>
                  <ul className="mt-1 ml-4 list-disc space-y-1">
                    <li>Center the CDI needle by turning toward it</li>
                    <li>Use TO flag when flying to the station</li>
                    <li>Use FROM flag when flying away from station</li>
                    <li>Stay within VOR range (typically 25-50nm)</li>
                    <li>Use small heading changes (5-10°) when close to course</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTutorial(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">VOR Navigation Tutorial</h2>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <h3>What is VOR Navigation?</h3>
                <p>VOR (VHF Omnidirectional Range) is a type of short-range radio navigation system for aircraft. It enables aircraft to determine their position and stay on course by receiving radio signals transmitted by a network of fixed ground radio beacons.</p>
                
                <h3>Key Components</h3>
                <ul>
                  <li><strong>VOR Station:</strong> Ground-based radio transmitter broadcasting on specific frequencies</li>
                  <li><strong>OBS (Omnibearing Selector):</strong> Allows you to select a course (0-359°)</li>
                  <li><strong>CDI (Course Deviation Indicator):</strong> Shows whether you're left or right of the selected course</li>
                  <li><strong>TO/FROM Flag:</strong> Indicates if the selected course leads TO or FROM the VOR station</li>
                </ul>

                <h3>Basic Operation</h3>
                <ol>
                  <li>Tune your radio to a VOR frequency</li>
                  <li>Set the OBS to your desired course</li>
                  <li>Observe the CDI needle and TO/FROM flag</li>
                  <li>Adjust your heading to center the CDI needle</li>
                </ol>

                <h3>Getting Started</h3>
                <p>Use the controls on the left to move your aircraft and adjust settings. The VOR instrument in the center shows your current navigation status. The map on the right provides a visual reference of your position relative to VOR stations.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Practice Scenarios Modal */}
      {showPractice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPractice(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg max-w-md w-full max-h-96 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Practice Scenarios</h2>
              <button
                onClick={() => setShowPractice(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-0">
              <TrainingScenarios />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default App;

