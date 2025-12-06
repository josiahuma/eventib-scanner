import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "@/src/api/client";
import { useTheme } from "@/src/context/ThemeContext";

export default function CheckinsScreen() {
  const { id } = useLocalSearchParams();
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!id) return;
    API.get(`/events/${id}/checked-in`)
      .then((res) => setCheckins(res.data))
      .catch((err) =>
        console.log(
          "❌ Error fetching check-ins:",
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
          Loading check-ins...
        </Text>
      </SafeAreaView>
    );

  if (!checkins.length)
    return (
      <SafeAreaView
        style={[
          styles.center,
          { backgroundColor: isDark ? "#000" : "#fff" },
        ]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          No check-ins yet.
        </Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#f9f9f9",
      }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <FlatList
        data={checkins}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              isDark && {
                backgroundColor: "#111",
                borderWidth: 1,
                borderColor: "#333",
                shadowOpacity: 0,
              },
            ]}
          >
            <Text
              style={[
                styles.name,
                { color: isDark ? "#fff" : "#000" },
              ]}
            >
              {item.name}
            </Text>

            <Text
              style={[
                styles.email,
                { color: isDark ? "#ccc" : "#555" },
              ]}
            >
              {item.email}
            </Text>

            <Text
              style={[
                styles.time,
                { color: isDark ? "#aaa" : "#888" },
              ]}
            >
              {new Date(item.checked_in_at).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
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
