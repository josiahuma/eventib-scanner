// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing details", "Please enter email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);

      // ✅ IMPORTANT: go straight to the tabs layout, not "/"
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Login error:", err?.response?.data || err?.message);
      Alert.alert(
        "Login failed",
        err?.response?.data?.message ?? "Check your credentials"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // very simple strength helper – just for user feedback
  const getPasswordStrength = () => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Medium";
    return "Strong";
  };

  const strength = getPasswordStrength();

  return (
    <LinearGradient
      colors={["#fca9a9", "#ff5757", "#fc3d3d"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to continue</Text>

              {/* Email */}
              <TextInput
                placeholder="Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              {/* Password + eye icon */}
              <View style={styles.passwordRow}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#777"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              {/* Strength indicator */}
              {strength !== "" && (
                <Text
                  style={[
                    styles.strengthText,
                    strength === "Weak" && { color: "#d9534f" },
                    strength === "Medium" && { color: "#f0ad4e" },
                    strength === "Strong" && { color: "#5cb85c" },
                  ]}
                >
                  Password strength: {strength}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.button, submitting && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={submitting}
              >
                <Text style={styles.buttonText}>
                  {submitting ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 25,
    color: "#666",
  },

  input: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  passwordRow: {
    position: "relative",
    justifyContent: "center",
  },

  passwordInput: {
    paddingRight: 44, // space for eye icon
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
  },

  strengthText: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 10,
    textAlign: "right",
  },

  button: {
    backgroundColor: "#ff5757",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
