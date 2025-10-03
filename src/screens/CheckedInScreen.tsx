import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getCheckedIn } from '../api/client';

export default function CheckedInScreen({ route }: any) {
  const { eventId } = route.params;
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCheckedIn(eventId)
      .then(data => setAttendees(data))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <Text style={styles.text}>Loading...</Text>;

  if (attendees.length === 0)
    return <Text style={styles.text}>No attendees checked in yet.</Text>;

  return (
    <FlatList
      data={attendees}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.time}>
            Checked in at {new Date(item.checked_in_at).toLocaleTimeString()}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#666' },
  time: { fontSize: 12, color: '#999' },
  text: { padding: 20, textAlign: 'center' },
});
