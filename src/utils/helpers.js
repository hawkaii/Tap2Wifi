import { LEVELS } from './constants';

export const calculateLevel = (points) => {
  if (points >= LEVELS.PLATINUM.min) return LEVELS.PLATINUM.name;
  if (points >= LEVELS.GOLD.min) return LEVELS.GOLD.name;
  if (points >= LEVELS.SILVER.min) return LEVELS.SILVER.name;
  return LEVELS.BRONZE.name;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 1000; // Return in meters
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
};

export const validateWiFiForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'WiFi network name is required';
  }
  
  if (!formData.password?.trim()) {
    errors.password = 'WiFi password is required';
  }
  
  if (!formData.locationName?.trim()) {
    errors.locationName = 'Location name is required';
  }
  
  if (!formData.address?.trim()) {
    errors.address = 'Address is required';
  }
  
  if (!formData.category?.trim()) {
    errors.category = 'Category is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};