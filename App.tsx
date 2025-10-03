import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import EventsScreen from './src/screens/EventsScreen';
import SessionsScreen from './src/screens/SessionsScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import CheckedInScreen from './src/screens/CheckedInScreen';

// Create navigators
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

/** Custom drawer with logout button */
function CustomDrawerContent(props: any) {
  const { logout } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={logout}
      />
    </DrawerContentScrollView>
  );
}

/** Drawer navigator for logged-in users */
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Events"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen name="Events" component={EventsScreen} />
      <Drawer.Screen name="Sessions" component={SessionsScreen} />
      <Drawer.Screen name="Scanner" component={ScannerScreen} />
      <Drawer.Screen name="CheckedIn" component={CheckedInScreen} />
    </Drawer.Navigator>
  );
}

/** Root navigation: login or main app */
function RootNavigator() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/** App root */
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
