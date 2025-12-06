// app/(tabs)/profile.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "@/src/api/client";
import { useTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { theme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();
  const isDark = theme === "dark";

  useEffect(() => {
    API.get("/me")
      .then((res) => setProfile(res.data))
      .catch(() => Alert.alert("Error", "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.post("/me", {
        name: profile?.name,
        mobile: profile?.mobile,
      });
      Alert.alert("✅ Success", "Profile updated successfully!");
    } catch (err: any) {
      console.log("Profile save error:", err.response?.data || err.message);
      Alert.alert("Error", "Could not save profile");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: isDark ? "#000" : "#fff" }]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#ff5757" />
        <Text style={{ marginTop: 10, color: isDark ? "#fff" : "#000" }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: isDark ? "#111" : "#ff5757" },
        ]}
      >
        <Text style={[styles.headerText, { color: "#fff" }]}>
          👤 Organizer Profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Name */}
        <Text
          style={[
            styles.label,
            { color: isDark ? "#ddd" : "#555" },
          ]}
        >
          Name
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#111" : "#fff",
              borderColor: isDark ? "#444" : "#ddd",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Name"
          placeholderTextColor={isDark ? "#777" : "#999"}
          value={profile?.name || ""}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
        />

        {/* Email */}
        <Text
          style={[
            styles.label,
            { color: isDark ? "#ddd" : "#555" },
          ]}
        >
          Email
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#222" : "#f8f8f8",
              borderColor: isDark ? "#444" : "#ddd",
              color: isDark ? "#aaa" : "#555",
            },
          ]}
          placeholder="Email"
          editable={false}
          value={profile?.email || ""}
        />

        {/* Phone */}
        <Text
          style={[
            styles.label,
            { color: isDark ? "#ddd" : "#555" },
          ]}
        >
          Phone
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#111" : "#fff",
              borderColor: isDark ? "#444" : "#ddd",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Phone"
          placeholderTextColor={isDark ? "#777" : "#999"}
          value={profile?.mobile || ""}
          onChangeText={(text) => setProfile({ ...profile, mobile: text })}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            {
              backgroundColor: isDark ? "#ff5757" : "#ff5757",
            },
            saving && { opacity: 0.7 },
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { backgroundColor: isDark ? "#222" : "#eee" },
          ]}
          onPress={handleLogout}
        >
          <Text
            style={[
              styles.logoutText,
              { color: isDark ? "#ff7777" : "#cc0000" },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 3,
  },
  headerText: { fontSize: 20, fontWeight: "700" },
  container: { padding: 20 },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: { fontWeight: "700", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
