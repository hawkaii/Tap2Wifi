import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockWiFiData } from '../data/mockData';

const WIFI_STORAGE_KEY = '@wifi_spots';

export const wifiService = {
  // Get all WiFi spots (offline-first)
  async getWiFiSpots() {
    try {
      // Try to get from local storage first
      const storedData = await AsyncStorage.getItem(WIFI_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
      
      // If no local data, use mock data and store it
      await AsyncStorage.setItem(WIFI_STORAGE_KEY, JSON.stringify(mockWiFiData));
      return mockWiFiData;
    } catch (error) {
      console.error('Error loading WiFi spots:', error);
      return mockWiFiData; // Fallback to mock data
    }
  },

  // Add new WiFi spot
  async addWiFiSpot(wifiData) {
    try {
      const currentSpots = await this.getWiFiSpots();
      const newSpot = {
        id: Date.now().toString(),
        ...wifiData,
        createdAt: new Date().toISOString(),
        contributorId: '1', // Current user ID
        verified: false,
        upvotes: 0,
        downvotes: 0,
      };
      
      const updatedSpots = [...currentSpots, newSpot];
      await AsyncStorage.setItem(WIFI_STORAGE_KEY, JSON.stringify(updatedSpots));
      
      // TODO: Sync with backend API when online
      // await this.syncWithBackend(newSpot);
      
      return newSpot;
    } catch (error) {
      console.error('Error adding WiFi spot:', error);
      throw error;
    }
  },

  // Get nearby WiFi spots (mock implementation)
  async getNearbySpots(latitude = 0, longitude = 0, radius = 1000) {
    const allSpots = await this.getWiFiSpots();
    // Mock: return first 5 spots as "nearby"
    return allSpots.slice(0, 5);
  },

  // Vote on WiFi spot
  async voteOnSpot(spotId, vote) {
    try {
      const spots = await this.getWiFiSpots();
      const updatedSpots = spots.map(spot => {
        if (spot.id === spotId) {
          return {
            ...spot,
            upvotes: vote === 'up' ? spot.upvotes + 1 : spot.upvotes,
            downvotes: vote === 'down' ? spot.downvotes + 1 : spot.downvotes,
          };
        }
        return spot;
      });
      
      await AsyncStorage.setItem(WIFI_STORAGE_KEY, JSON.stringify(updatedSpots));
      return updatedSpots.find(spot => spot.id === spotId);
    } catch (error) {
      console.error('Error voting on spot:', error);
      throw error;
    }
  },

  // TODO: Backend integration methods
  async syncWithBackend(spotData) {
    // Placeholder for API call
    // try {
    //   const response = await fetch('/api/wifi-spots', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(spotData),
    //   });
    //   return await response.json();
    // } catch (error) {
    //   console.error('Backend sync failed:', error);
    // }
  },
};
