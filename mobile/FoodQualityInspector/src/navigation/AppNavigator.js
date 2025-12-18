import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FormDetailScreen from '../screens/FormDetailScreen';
import { isLoggedIn } from '../services/authService';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ 
            title: 'Inspector Dashboard',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen 
          name="FormDetail" 
          component={FormDetailScreen}
          options={{ title: 'Fill Form' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;