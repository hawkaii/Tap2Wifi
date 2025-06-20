import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wifiService } from '../services/wifiService';

const WiFiContext = createContext();

const initialState = {
  wifiSpots: [],
  nearbySpots: [],
  loading: false,
  error: null,
};

function wifiReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_WIFI_SPOTS':
      return { ...state, wifiSpots: action.payload, loading: false };
    case 'SET_NEARBY_SPOTS':
      return { ...state, nearbySpots: action.payload };
    case 'ADD_WIFI_SPOT':
      return { 
        ...state, 
        wifiSpots: [...state.wifiSpots, action.payload],
        nearbySpots: [...state.nearbySpots, action.payload]
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function WiFiProvider({ children }) {
  const [state, dispatch] = useReducer(wifiReducer, initialState);

  useEffect(() => {
    loadWiFiData();
  }, []);

  const loadWiFiData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const spots = await wifiService.getWiFiSpots();
      dispatch({ type: 'SET_WIFI_SPOTS', payload: spots });
      
      // Load nearby spots (mock location-based)
      const nearby = spots.slice(0, 5);
      dispatch({ type: 'SET_NEARBY_SPOTS', payload: nearby });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addWiFiSpot = async (wifiData) => {
    try {
      const newSpot = await wifiService.addWiFiSpot(wifiData);
      dispatch({ type: 'ADD_WIFI_SPOT', payload: newSpot });
      return newSpot;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const value = {
    ...state,
    addWiFiSpot,
    refreshData: loadWiFiData,
  };

  return <WiFiContext.Provider value={value}>{children}</WiFiContext.Provider>;
}

export const useWiFi = () => {
  const context = useContext(WiFiContext);
  if (!context) {
    throw new Error('useWiFi must be used within a WiFiProvider');
  }
  return context;
};