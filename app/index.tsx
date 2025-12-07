// app/index.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import useFirstTime from "@/src/hooks/useFirstTime";

export default function Index() {
  const [first] = useFirstTime("hasSeenOnboarding");

  // Still loading AsyncStorage
  if (first === null) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (first) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/login" />;
}
