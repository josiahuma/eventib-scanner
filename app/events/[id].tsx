// app/events/[id].tsx
import { useLocalSearchParams, Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import { API } from "@/src/api/client";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading event details...</Text>
      </View>
    );

  if (!event)
    return (
      <View style={styles.center}>
        <Text>No event details found.</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.location}>{event.location}</Text>
      {event.description ? <Text style={styles.description}>{event.description}</Text> : null}

      <Link
          href={{
            pathname: "/events/[id]/sessions",
            params: { id: event.public_id || event.id.toString() },
          }}
        >

        <Text style={styles.link}>📅 View Sessions</Text>
      </Link>
    </ScrollView>
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
