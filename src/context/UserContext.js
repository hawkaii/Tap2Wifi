import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userService } from '../services/userService';

const UserContext = createContext();

const initialState = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    points: 0,
    level: 'Bronze',
    contributedSpots: 0,
  },
  loading: false,
};

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_POINTS':
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.payload,
          contributedSpots: state.user.contributedSpots + 1,
        }
      };
    case 'REDEEM_POINTS':
      return {
        ...state,
        user: {
          ...state.user,
          points: Math.max(0, state.user.points - action.payload),
        }
      };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await userService.getUserProfile();
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const addPoints = (points) => {
    dispatch({ type: 'ADD_POINTS', payload: points });
    userService.updateUserPoints(state.user.points + points);
  };

  const redeemPoints = (points) => {
    if (state.user.points >= points) {
      dispatch({ type: 'REDEEM_POINTS', payload: points });
      userService.updateUserPoints(state.user.points - points);
      return true;
    }
    return false;
  };

  const value = {
    ...state,
    addPoints,
    redeemPoints,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
