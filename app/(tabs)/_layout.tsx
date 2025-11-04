import { Tabs, Redirect } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/src/context/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { token, ready } = useAuth();

  // Wait for AsyncStorage to load the token
  if (!ready) return null;

  // Not logged in? Send to /login and don't render the tabs.
  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          if (route.name === "index") iconName = "calendar-outline";
          else if (route.name === "profile") iconName = "person-outline";
          else if (route.name === "logout") iconName = "log-out-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Events",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Logout",
        }}
      />
    </Tabs>
  );
}
