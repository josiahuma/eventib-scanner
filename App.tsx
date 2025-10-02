import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import EventsScreen from './src/screens/EventsScreen';
import SessionsScreen from './src/screens/SessionsScreen';
import ScannerScreen from './src/screens/ScannerScreen';


const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { token } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Staff Login' }} />
        ) : (
          <>
            <Stack.Screen name="Events" component={EventsScreen} options={{ title: 'Select Event' }} />
            <Stack.Screen name="Sessions" component={SessionsScreen} options={{ title: 'Select Session' }} />
            <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Scan Tickets' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
