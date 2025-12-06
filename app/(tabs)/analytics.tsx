// app/(tabs)/analytics.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/context/ThemeContext";
import { API } from "@/src/api/client";

type DashboardKpis = {
  year: number;
  events_count: number;
  total_earnings: number; // minor units (pence)
  total_attendees: number;
  total_checkins: number;
};

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const res = await API.get<DashboardKpis>("/mobile/dashboard");
      setData(res.data);
    } catch (e) {
      console.error(e);
      setError("Unable to load analytics. Pull to refresh to try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const bg = isDark ? "#000" : "#f5f5f5";
  const cardBg = isDark ? "#111" : "#fff";
  const textMain = isDark ? "#fff" : "#111";
  const textMuted = isDark ? "#9ca3af" : "#6b7280";

  const formatMoney = (minor: number | undefined) => {
    if (typeof minor !== "number") return "£0.00";
    return "£" + (minor / 100).toFixed(2);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.title, { color: textMain }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          Quick view of your organiser performance.
        </Text>

        {loading && !data ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF7A00" />
            <Text style={{ marginTop: 8, color: textMuted }}>
              Loading analytics…
            </Text>
          </View>
        ) : (
          <>
            {error && (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: isDark ? "#451a1a" : "#fee2e2" },
                ]}
              >
                <Text
                  style={{
                    color: isDark ? "#fecaca" : "#991b1b",
                    fontSize: 13,
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

            {data && (
              <>
                <Text
                  style={[
                    styles.yearLabel,
                    { color: textMuted, marginBottom: 12 },
                  ]}
                >
                  Year: {data.year}
                </Text>

                <View style={styles.grid}>
                  <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <Text style={[styles.cardLabel, { color: textMuted }]}>
                      Events posted
                    </Text>
                    <Text style={[styles.cardValue, { color: textMain }]}>
                      {data.events_count ?? 0}
                    </Text>
                  </View>

                  <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <Text style={[styles.cardLabel, { color: textMuted }]}>
                      Total earnings
                    </Text>
                    <Text style={[styles.cardValue, { color: textMain }]}>
                      {formatMoney(data.total_earnings)}
                    </Text>
                  </View>

                  <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <Text style={[styles.cardLabel, { color: textMuted }]}>
                      Registered attendees
                    </Text>
                    <Text style={[styles.cardValue, { color: textMain }]}>
                      {data.total_attendees ?? 0}
                    </Text>
                  </View>

                  <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <Text style={[styles.cardLabel, { color: textMuted }]}>
                      Total check-ins
                    </Text>
                    <Text style={[styles.cardValue, { color: textMain }]}>
                      {data.total_checkins ?? 0}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
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
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  center: {
    marginTop: 40,
    alignItems: "center",
  },
  errorBox: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  yearLabel: {
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  } as any,
  card: {
    flexBasis: "48%",
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
  },
});
