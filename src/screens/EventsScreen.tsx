import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { API } from '../api/client';
import { useNavigation } from '@react-navigation/native';

type EventItem = { id: number; name: string; location?: string };

export default function EventsScreen() {
  const nav = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/events');
        setEvents(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <FlatList
      contentContainerStyle={{ padding: 16, gap: 8 }}
      data={events}
      keyExtractor={(e) => String(e.id)}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => nav.navigate('Sessions', { eventId: item.id, eventName: item.name })}
        >
          <Text style={styles.title}>{item.name}</Text>
          {item.location ? <Text>{item.location}</Text> : null}

          {/* 👇 Add button to go to Checked-In list */}
          <Pressable
            style={styles.checkInBtn}
            onPress={() => nav.navigate('CheckedIn', { eventId: item.id })}
          >
            <Text style={styles.checkInText}>View Checked-In</Text>
          </Pressable>
        </Pressable>
      )}

      ListEmptyComponent={<Text>No events found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  title: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
  checkInBtn: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  checkInText: { color: 'white', fontWeight: '600' },
});

