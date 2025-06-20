import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WiFiProvider } from './src/context/WiFiContext';
import { UserProvider } from './src/context/UserContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import WiFiListScreen from './src/screens/WiFiListScreen';
import AddWiFiScreen from './src/screens/AddWiFiScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WiFiDetailScreen from './src/screens/WiFiDetailScreen';
import RewardsScreen from './src/screens/RewardsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const WiFiStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="WiFiList" component={WiFiListScreen} options={{ title: 'WiFi Spots' }} />
    <Stack.Screen name="WiFiDetail" component={WiFiDetailScreen} options={{ title: 'WiFi Details' }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    <Stack.Screen name="Rewards" component={RewardsScreen} options={{ title: 'Rewards' }} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home': iconName = 'home'; break;
          case 'WiFi': iconName = 'wifi'; break;
          case 'Add': iconName = 'add-circle'; break;
          case 'Profile': iconName = 'person'; break;
          default: iconName = 'help';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="WiFi" component={WiFiStack} options={{ headerShown: false }} />
    <Tab.Screen name="Add" component={AddWiFiScreen} options={{ title: 'Share WiFi' }} />
    <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <UserProvider>
      <WiFiProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </WiFiProvider>
    </UserProvider>
  );
}