import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { API } from "@/src/api/client";

export default function CheckinsScreen() {
  const { id } = useLocalSearchParams();
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    API.get(`/events/${id}/checked-in`)
      .then((res) => setCheckins(res.data))
      .catch((err) => console.log("❌ Error fetching check-ins:", err.response?.data || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff5757" />
        <Text>Loading check-ins...</Text>
      </View>
    );

  if (!checkins.length)
    return (
      <View style={styles.center}>
        <Text>No check-ins yet.</Text>
      </View>
    );

  return (
    <FlatList
      data={checkins}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.time}>{new Date(item.checked_in_at).toLocaleString()}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 15 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#000" },
  email: { color: "#555" },
  time: { color: "#888", fontSize: 13, marginTop: 5 },
});
