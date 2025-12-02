import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { API } from "@/src/api/client";

export default function ScannerScreen() {
  const { eventId, sessionId } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(0);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    const now = Date.now();
    if (scanning || now - lastScan < 2000) return; // ⏳ throttle to 2s
    setLastScan(now);
    setScanning(true);

    console.log("📸 QR Payload:", data);
    try {
      const res = await API.post("/check-in", {
        payload: data,
        event_id: eventId,
        session_id: sessionId ?? null,
      });

      const status = res.data.status;
      if (status === "valid") {
        Alert.alert("✅ Success", `${res.data.data.name} checked in successfully!`);
      } else if (status === "already") {
        Alert.alert("⚠️ Already Checked In", res.data.message);
      } else {
        Alert.alert("❌ Invalid", res.data.message || "Ticket not valid");
      }
    } catch (err: any) {
      console.log("❌ Check-in error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message ?? "Server error during check-in.");
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff5757" />
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera access is required for scanning.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417", "code128"] }}
      />
      <View style={styles.overlay}>
        {scanning ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Checking in...</Text>
          </View>
        ) : (
          <Text style={styles.instruction}>Align QR code within frame</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 60,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  instruction: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  loadingBox: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    borderRadius: 8,
  },
  loadingText: { color: "#fff", marginTop: 10 },
  permissionButton: {
    marginTop: 15,
    backgroundColor: "#ff5757",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  permissionText: { color: "#fff", fontWeight: "600" },
});
