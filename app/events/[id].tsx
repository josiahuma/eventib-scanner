// app/events/[id].tsx
import { useLocalSearchParams, Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "@/src/api/client";
import { useTheme } from "@/src/context/ThemeContext";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!id) return;
    API.get(`/events/${id}`)
      .then((res) => {
        console.log("✅ Event data:", res.data);
        setEvent(res.data);
      })
      .catch((err) => {
        console.log("❌ Error fetching event:", err.response?.data || err.message);
        Alert.alert("Error", "Could not load event details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <SafeAreaView
        style={[
          styles.center,
          { backgroundColor: isDark ? "#000" : "#fff" },
        ]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          Loading event details...
        </Text>
      </SafeAreaView>
    );

  if (!event)
    return (
      <SafeAreaView
        style={[
          styles.center,
          { backgroundColor: isDark ? "#000" : "#fff" },
        ]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          No event details found.
        </Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#000" : "#fff" }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={[
            styles.title,
            { color: isDark ? "#fff" : "#000" },
          ]}
        >
          {event.name}
        </Text>

        <Text
          style={[
            styles.location,
            { color: isDark ? "#d1d5db" : "#555" },
          ]}
        >
          {event.location}
        </Text>

        {event.description ? (
          <Text
            style={[
              styles.description,
              { color: isDark ? "#e5e7eb" : "#333" },
            ]}
          >
            {event.description}
          </Text>
        ) : null}

        <Link
          href={{
            pathname: "/events/[id]/sessions",
            params: { id: event.public_id || event.id.toString() },
          }}
        >
          <Text
            style={[
              styles.link,
              { color: isDark ? "#4da3ff" : "#007BFF" },
            ]}
          >
            📅 View Sessions
          </Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  location: { fontSize: 16, color: "#555", marginBottom: 10 },
  description: { fontSize: 15, color: "#333", lineHeight: 22 },
  link: {
    marginTop: 20,
    color: "#007BFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
