import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "@/src/api/client";
import { useTheme } from "@/src/context/ThemeContext";

export default function SessionsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!id) return;
    API.get(`/events/${id}/sessions`)
      .then((res) => setSessions(res.data))
      .catch((err) =>
        console.log(
          "❌ Error fetching sessions:",
          err.response?.data || err.message
        )
      )
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
        <ActivityIndicator size="large" color="#ff5757" />
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          Loading sessions...
        </Text>
      </SafeAreaView>
    );

  if (!sessions.length)
    return (
      <SafeAreaView
        style={[
          styles.center,
          { backgroundColor: isDark ? "#000" : "#fff" },
        ]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          No sessions found.
        </Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#000" : "#f9f9f9" }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <FlatList
        data={sessions}
        keyExtractor={(s) => s.id.toString()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => {
          // 🔹 Determine if the session is in the past
          const isPast =
            item.session_date &&
            new Date(item.session_date) < new Date();

          return (
            <View
              style={[
                styles.card,
                isDark && {
                  backgroundColor: "#111",
                  borderWidth: 1,
                  borderColor: "#333",
                  shadowOpacity: 0, // no visible shadow on black bg
                },
              ]}
            >
              <Text
                style={[
                  styles.name,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                {item.session_name || item.name}
              </Text>

              <Text
                style={[
                  styles.date,
                  { color: isDark ? "#d1d5db" : "#666" },
                ]}
              >
                {item.session_date
                  ? new Date(item.session_date).toLocaleString()
                  : ""}
              </Text>

              {/* Scan QR Code */}
              <TouchableOpacity
                style={[
                  styles.scanButton,
                  isPast && {
                    backgroundColor: isDark ? "#444" : "#ccc",
                  },
                ]}
                disabled={isPast}
                onPress={() =>
                  router.push({
                    pathname: "/scanner",
                    params: { eventId: id, sessionId: item.id },
                  })
                }
              >
                <Text
                  style={[
                    styles.scanButtonText,
                    isPast && { color: "#eee" },
                  ]}
                >
                  {isPast ? "Session ended" : "📷 Scan QR Code"}
                </Text>
              </TouchableOpacity>

              {/* View Check-ins */}
              <TouchableOpacity
                style={[
                  styles.checkinsButton,
                  isDark && { backgroundColor: "#222" },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/events/[id]/checkins",
                    params: { id: Array.isArray(id) ? id[0] : id },
                  })
                }
              >
                <Text
                  style={[
                    styles.checkinsButtonText,
                    { color: isDark ? "#ddd" : "#333" },
                  ]}
                >
                  👥 View Check-ins
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  name: { fontSize: 18, fontWeight: "bold", color: "#000" },
  date: { fontSize: 14, color: "#666", marginBottom: 10 },

  scanButton: {
    backgroundColor: "#ff5757",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  scanButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  checkinsButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderRadius: 6,
  },
  checkinsButtonText: {
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
});
