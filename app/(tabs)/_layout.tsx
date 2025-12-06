// app/(tabs)/_layout.tsx
import { Tabs, Redirect } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";

export default function TabLayout() {
  const { token, ready } = useAuth();
  const { theme } = useTheme(); // "light" | "dark"

  if (!ready) return null;

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[theme].background,
          borderTopColor: Colors[theme].tabIconDefault + "33",
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "index") iconName = "calendar-outline";
          else if (route.name === "analytics") iconName = "bar-chart-outline";
          else if (route.name === "profile") iconName = "person-outline";
          else if (route.name === "settings") iconName = "settings-outline";

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
        name="analytics"
        options={{
          title: "Analytics",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
