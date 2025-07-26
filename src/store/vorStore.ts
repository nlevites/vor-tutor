import { create } from 'zustand';

export interface VORStation {
  id: string;
  name: string;
  frequency: string;
  latitude: number;
  longitude: number;
  declination: number; // Magnetic declination for this area
}

export interface AircraftState {
  latitude: number;
  longitude: number;
  heading: number; // Aircraft heading in degrees
  altitude: number;
  speed: number; // Groundspeed in knots
  isAutopilotEnabled: boolean;
}

export interface VORReceiver {
  frequency: string;
  obs: number; // Omnibearing Selector (0-359 degrees)
  cdi: number; // Course Deviation Indicator (-10 to +10, 0 is centered)
  toFrom: 'TO' | 'FROM' | 'OFF';
  stationInRange: boolean;
  selectedStation: VORStation | null;
  radial: number; // Current radial aircraft is on
  distance: number; // Distance to station in nautical miles
}

export interface SimulationState {
  isRunning: boolean;
  speed: number; // Simulation speed multiplier
  autoFly: boolean; // Auto-fly mode for demonstrations
}

export interface VORStore {
  aircraft: AircraftState;
  vorReceiver: VORReceiver;
  simulation: SimulationState;
  stations: VORStation[];
  selectedScenario: string | null;
  
  // Actions
  updateAircraftPosition: (lat: number, lng: number) => void;
  updateAircraftHeading: (heading: number) => void;
  moveAircraftForward: (distance: number) => void;
  moveAircraftBackward: (distance: number) => void;
  setAircraftSpeed: (speed: number) => void;
  toggleAutopilot: () => void;
  setOBS: (obs: number) => void;
  tuneFrequency: (frequency: string) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  calculateVORData: () => void;
  selectScenario: (scenarioId: string) => void;
  resetToScenario: (scenarioId: string) => void;
}

// Sample VOR stations for training
const sampleStations: VORStation[] = [
  {
    id: 'LAX',
    name: 'Los Angeles VOR',
    frequency: '113.60',
    latitude: 33.9425,
    longitude: -118.4081,
    declination: 12
  },
  {
    id: 'SAN',
    name: 'San Diego VOR', 
    frequency: '117.80',
    latitude: 32.7353,
    longitude: -117.1900,
    declination: 12
  },
  {
    id: 'SFO',
    name: 'San Francisco VOR',
    frequency: '115.80',
    latitude: 37.6213,
    longitude: -122.3790,
    declination: 14
  }
];

export const useVORStore = create<VORStore>((set, get) => ({
  aircraft: {
    latitude: 34.0522,
    longitude: -118.2437,
    heading: 90,
    altitude: 5000,
    speed: 120, // 120 knots
    isAutopilotEnabled: false
  },
  
  vorReceiver: {
    frequency: '113.60',
    obs: 0,
    cdi: 0,
    toFrom: 'OFF',
    stationInRange: false,
    selectedStation: null,
    radial: 0,
    distance: 0
  },
  
  simulation: {
    isRunning: false,
    speed: 1,
    autoFly: false
  },
  
  stations: sampleStations,
  selectedScenario: null,
  
  updateAircraftPosition: (lat, lng) => {
    set((state) => ({
      aircraft: { ...state.aircraft, latitude: lat, longitude: lng }
    }));
    get().calculateVORData();
  },
  
  updateAircraftHeading: (heading) => {
    const normalizedHeading = ((heading % 360) + 360) % 360;
    set((state) => ({
      aircraft: { ...state.aircraft, heading: normalizedHeading }
    }));
    get().calculateVORData();
  },

  moveAircraftForward: (distance) => {
    const { aircraft } = get();
    const headingRad = (aircraft.heading * Math.PI) / 180;
    
    // Standard aviation navigation formulas:
    // North displacement = distance * cos(heading)
    // East displacement = distance * sin(heading)
    // Where heading is measured clockwise from North (0° = North, 90° = East)
    const deltaLat = (distance / 60) * Math.cos(headingRad);
    const deltaLng = (distance / 60) * Math.sin(headingRad) / Math.cos(aircraft.latitude * Math.PI / 180);
    
    const newLat = aircraft.latitude + deltaLat;
    const newLng = aircraft.longitude + deltaLng;
    
    get().updateAircraftPosition(newLat, newLng);
  },

  moveAircraftBackward: (distance) => {
    get().moveAircraftForward(-distance);
  },

  setAircraftSpeed: (speed) => {
    set((state) => ({
      aircraft: { ...state.aircraft, speed: Math.max(0, Math.min(300, speed)) }
    }));
  },

  toggleAutopilot: () => {
    set((state) => ({
      aircraft: { ...state.aircraft, isAutopilotEnabled: !state.aircraft.isAutopilotEnabled }
    }));
  },
  
  setOBS: (obs) => {
    const normalizedOBS = ((obs % 360) + 360) % 360;
    set((state) => ({
      vorReceiver: { ...state.vorReceiver, obs: normalizedOBS }
    }));
    get().calculateVORData();
  },
  
  tuneFrequency: (frequency) => {
    const station = get().stations.find(s => s.frequency === frequency);
    set((state) => ({
      vorReceiver: { 
        ...state.vorReceiver, 
        frequency,
        selectedStation: station || null
      }
    }));
    get().calculateVORData();
  },
  
  startSimulation: () => {
    set((state) => ({
      simulation: { ...state.simulation, isRunning: true }
    }));
  },
  
  stopSimulation: () => {
    set((state) => ({
      simulation: { ...state.simulation, isRunning: false }
    }));
  },
  
  setSimulationSpeed: (speed) => {
    set((state) => ({
      simulation: { ...state.simulation, speed: Math.max(0.1, Math.min(100, speed)) }
    }));
  },
  
  calculateVORData: () => {
    const { aircraft, vorReceiver, stations } = get();
    const station = stations.find(s => s.frequency === vorReceiver.frequency);
    
    if (!station) {
      set((state) => ({
        vorReceiver: {
          ...state.vorReceiver,
          cdi: 0,
          toFrom: 'OFF',
          stationInRange: false,
          selectedStation: null,
          radial: 0,
          distance: 0
        }
      }));
      return;
    }
    
    // Calculate distance to station
    const distance = calculateDistance(
      aircraft.latitude, aircraft.longitude,
      station.latitude, station.longitude
    );
    
    // VOR range varies with altitude: approximately 1.23 * √altitude in nautical miles
    // At 5000ft: ~87nm, but we'll use a simplified 100nm for training
    const maxRange = Math.min(200, 1.23 * Math.sqrt(aircraft.altitude));
    const stationInRange = distance <= maxRange;
    
    if (!stationInRange) {
      set((state) => ({
        vorReceiver: {
          ...state.vorReceiver,
          cdi: 0,
          toFrom: 'OFF',
          stationInRange: false,
          selectedStation: station,
          radial: 0,
          distance: Math.round(distance * 10) / 10
        }
      }));
      return;
    }
    
    // Calculate bearing from station to aircraft (true bearing)
    const bearing = calculateBearing(
      station.latitude, station.longitude,
      aircraft.latitude, aircraft.longitude
    );
    
    // Calculate radial aircraft is on (magnetic bearing from station)
    const radial = Math.round(bearing);
    
    // SIMPLIFIED VOR CALCULATION:
    // Use sine/cosine to avoid discontinuities at ±180°
    const obsRadians = (vorReceiver.obs * Math.PI) / 180;
    const radialRadians = (radial * Math.PI) / 180;
    
    // Calculate the cross product to determine left/right deviation
    const crossProduct = Math.sin(radialRadians - obsRadians);
    
    // Calculate the dot product to determine TO/FROM
    const dotProduct = Math.cos(radialRadians - obsRadians);
    
    // CDI deflection in degrees (±10° full scale)
    const cdiAngle = Math.asin(Math.max(-1, Math.min(1, crossProduct))) * (180 / Math.PI);
    let cdi = Math.max(-10, Math.min(10, cdiAngle));
    
    // TO/FROM determination
    const toFrom: 'TO' | 'FROM' = dotProduct < 0 ? 'TO' : 'FROM';
    
    // In TO mode, the CDI deflection is reversed
    if (toFrom === 'TO') {
      cdi = -cdi;
    }
    
    set((state) => ({
      vorReceiver: {
        ...state.vorReceiver,
        cdi: Math.round(cdi * 10) / 10,
        toFrom,
        stationInRange: true,
        selectedStation: station,
        radial,
        distance: Math.round(distance * 10) / 10
      }
    }));
  },
  
  selectScenario: (scenarioId) => {
    set({ selectedScenario: scenarioId });
  },
  
  resetToScenario: (scenarioId) => {
    // This will be implemented when we create scenario definitions
    console.log('Resetting to scenario:', scenarioId);
  }
}));

// Utility functions for navigation calculations
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3440.065; // Earth's radius in nautical miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = toRadians(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRadians(lat2));
  const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
           Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLng);
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
} 