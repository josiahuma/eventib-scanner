import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(true);

  useEffect(() => {
    if (confirming) {
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel", onPress: () => router.back() },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              setConfirming(false);
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
    }
  }, []);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#FF7A00" />
      <Text>Preparing logout...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
