import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './components/Navigators/TabNavigator.js';
import LoginScreen from './components/Screens/Login.js';
import SignupScreen from './components/Screens/Signup.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }} // Hide the header for the tab navigator
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
