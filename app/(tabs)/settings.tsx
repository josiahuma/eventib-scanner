// app/(tabs)/settings.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const isDark = theme === "dark";

  const openTerms = () => {
    Linking.openURL("https://eventib.com/terms").catch(() => {});
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              Alert.alert("Logged out", "You have been signed out.");
              router.replace("/login");
            } catch {
              Alert.alert("Error", "Logout failed. Please try again.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#000" : "#f5f5f5" },
      ]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
          Settings
        </Text>

        {/* Appearance */}
        <View style={[styles.section, isDark && { backgroundColor: "#111" }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            Appearance
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: isDark ? "#fff" : "#111" }]}>
              Dark mode
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        {/* Legal */}
        <View style={[styles.section, isDark && { backgroundColor: "#111" }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#fff" : "#111" },
            ]}
          >
            Legal
          </Text>

          <TouchableOpacity style={styles.row} onPress={openTerms}>
            <Text
              style={[
                styles.linkText,
                { color: isDark ? "#4da3ff" : "#0066cc" },
              ]}
            >
              View Terms of Service
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 15,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
