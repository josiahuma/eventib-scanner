// src/context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Load saved theme (or fall back to system)
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("eventib-theme");
        if (stored === "light" || stored === "dark") {
          setThemeState(stored);
        } else {
          const sys = Appearance.getColorScheme();
          setThemeState(sys === "dark" ? "dark" : "light");
        }
      } catch {
        const sys = Appearance.getColorScheme();
        setThemeState(sys === "dark" ? "dark" : "light");
      }
    })();
  }, []);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    AsyncStorage.setItem("eventib-theme", value).catch(() => {});
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
