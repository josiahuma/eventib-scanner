import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { API } from '../api/client';
import { useRoute, useNavigation } from '@react-navigation/native';

type SessionItem = { id: number; name: string; session_date?: string };

export default function SessionsScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { eventId, eventName } = route.params;

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/events/${eventId}/sessions`);
        setSessions(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (sessions.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text>No sessions — you can still scan at event level.</Text>
        <Pressable
          style={[styles.card, { marginTop: 8 }]}
          onPress={() => nav.navigate('Scanner', { eventId, sessionId: null, title: eventName })}
        >
          <Text style={styles.title}>Scan for entire event</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16, gap: 8 }}
      data={sessions}
      keyExtractor={(s) => String(s.id)}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => nav.navigate('Scanner', { eventId, sessionId: item.id, title: item.name })}
        >
          <Text style={styles.title}>{item.name}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, backgroundColor: 'white' },
  title: { fontWeight: '600', fontSize: 16 },
});
