import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API } from '../api/client';
import { useRoute } from '@react-navigation/native';

export default function ScannerScreen() {
  const route = useRoute<any>();
  const { eventId, sessionId } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const busy = useRef(false);
  const [last, setLast] = useState<string | null>(null);

  const handleScan = useCallback(async (r: { data: string }) => {
    if (busy.current) return;
    busy.current = true;

    try {
      const res = await API.post('/check-in', {
        // IMPORTANT: matches your Laravel controller: uses `payload`
        payload: r.data,
        event_id: eventId,
        session_id: sessionId ?? null,
      });

      const status = res.data.status;
      setLast(status);

      if (status === 'valid') Alert.alert('✅ Success', 'Ticket checked in');
      else if (status === 'already') Alert.alert('⚠️ Already checked in');
      else Alert.alert('❌ Invalid', res.data.message ?? 'Not recognized');
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Unable to verify ticket';
      Alert.alert('Error', msg);
    } finally {
      setTimeout(() => { busy.current = false; }, 800);
    }
  }, [eventId, sessionId]);

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera access is required.</Text>
        <Text onPress={requestPermission} style={styles.link}>Grant permission</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <View style={styles.footer}>
        <Text>Event #{eventId} {sessionId ? `• Session #${sessionId}` : ''}</Text>
        {last ? <Text>Last: {last}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'white' },
  link: { color: '#007aff' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(255,255,255,0.9)' },
});
