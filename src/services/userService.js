import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@user_profile';

export const userService = {
  async getUserProfile() {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      
      // Default user profile
      const defaultUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        points: 150,
        level: 'Bronze',
        contributedSpots: 3,
        joinedDate: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    }
  },

  async updateUserPoints(newPoints) {
    try {
      const user = await this.getUserProfile();
      const updatedUser = { ...user, points: newPoints };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user points:', error);
      throw error;
    }
  },

  // TODO: Backend integration
  async syncUserWithBackend(userData) {
    // Placeholder for API call
  },
};
