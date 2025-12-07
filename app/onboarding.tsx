// app/onboarding.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Slide = {
  key: string;
  title: string;
  text: string;
  image: ImageSourcePropType;
};

const slides: Slide[] = [
  {
    key: "one",
    title: "Welcome to Eventib Scanner",
    text: "Your fast and secure event check-in tool.",
    image: require("../assets/intro1.png"),
  },
  {
    key: "two",
    title: "Scan QR Codes",
    text: "Quickly scan attendee tickets using your camera.",
    image: require("../assets/intro2.png"),
  },
  {
    key: "three",
    title: "View Sessions",
    text: "Pick a session and manage all its check-ins.",
    image: require("../assets/intro3.png"),
  },
  {
    key: "four",
    title: "Track Check-ins",
    text: "See who has arrived and when they checked in.",
    image: require("../assets/intro4.png"),
  },
];

export default function Onboarding() {
  const router = useRouter();

  const done = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    } catch (e) {
      console.warn("Error saving hasSeenOnboarding:", e);
    }
    router.replace("/login");
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>

      <Text style={styles.helperText}>Swipe or tap “Next” to continue</Text>
    </View>
  );

  const renderNextButton = () => (
    <View style={styles.button}>
      <Text style={styles.buttonText}>Next</Text>
    </View>
  );

  const renderDoneButton = () => (
    <View style={styles.button}>
      <Text style={styles.buttonText}>Done</Text>
    </View>
  );

  const renderSkipButton = () => (
    <View style={styles.skipButton}>
      <Text style={styles.skipText}>Skip</Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        onDone={done}
        showSkipButton
        onSkip={done}
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderSkipButton={renderSkipButton}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 40, // 👈 lifts dots & buttons above Android nav bar
    backgroundColor: "#f5f5f5",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  image: {
    width: 260,
    height: 240,
    marginBottom: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    paddingHorizontal: 10,
  },
  helperText: {
    marginTop: 24,
    fontSize: 13,
    color: "#888",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff5757",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  dot: {
    backgroundColor: "#ddd",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#ff5757",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});
