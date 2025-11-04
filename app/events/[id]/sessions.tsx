import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { API } from "@/src/api/client";

export default function SessionsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    API.get(`/events/${id}/sessions`)
      .then((res) => setSessions(res.data))
      .catch((err) => console.log("❌ Error fetching sessions:", err.response?.data || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text>Loading sessions...</Text>
      </View>
    );

  if (!sessions.length)
    return (
      <View style={styles.center}>
        <Text>No sessions found.</Text>
      </View>
    );

  return (
    <FlatList
      data={sessions}
      keyExtractor={(s) => s.id.toString()}
      contentContainerStyle={{ padding: 15 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.session_name || item.name}</Text>
          <Text style={styles.date}>
            {item.session_date ? new Date(item.session_date).toLocaleString() : ""}
          </Text>

          {/* Scan QR Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() =>
              router.push({
                pathname: "/scanner",
                params: { eventId: id, sessionId: item.id },
              })
            }
          >
            <Text style={styles.scanButtonText}>📷 Scan QR Code</Text>
          </TouchableOpacity>

          {/* View Check-ins Button */}
          <TouchableOpacity
            style={styles.checkinsButton}
            onPress={() =>
              router.push({
                pathname: "/events/[id]/checkins",
                params: { id: Array.isArray(id) ? id[0] : id },
              })
            }
          >
            <Text style={styles.checkinsButtonText}>👥 View Check-ins</Text>
          </TouchableOpacity>
        </View>
      )}
    />
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
    backgroundColor: "#FF7A00",
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
