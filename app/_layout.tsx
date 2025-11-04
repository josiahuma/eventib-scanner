// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AuthProvider } from "@/src/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Main tab layout */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Auth */}
          <Stack.Screen name="login" options={{ title: "Login" }} />

          {/* Events */}
          <Stack.Screen name="events/[id]" options={{ title: "Event Details" }} />
          <Stack.Screen name="events/[id]/sessions" options={{ title: "Sessions" }} />

          {/* ✅ Add the scanner page */}
          <Stack.Screen
            name="scanner"
            options={{
              title: "Scanner",
              presentation: "modal", // 👈 optional — opens it as a modal overlay
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
