// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { API } from "@/src/api/client";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log("❌ Error fetching events:", err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🎟️ Upcoming Events</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A00" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.noEvents}>No events found.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.public_id || item.id.toString()}
          contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/events/[id]", params: { id: item.public_id || item.id.toString() } }}
              asChild
            >
              <TouchableOpacity style={styles.card}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.location}>{item.location || "No location specified"}</Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f9f9f9", 
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: "600", color: "#000" },
  location: { fontSize: 14, color: "#666", marginTop: 4 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { marginTop: 10, color: "#555" },
  noEvents: { color: "#555", fontSize: 16 },
});
