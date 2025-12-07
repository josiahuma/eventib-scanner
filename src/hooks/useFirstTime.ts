// src/hooks/useFirstTime.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function useFirstTime(key: string) {
  // null = still loading, true/false = resolved
  const [first, setFirst] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const v = await AsyncStorage.getItem(key);
        if (!mounted) return;

        // If not explicitly "true", treat as first time
        if (v !== "true") {
          setFirst(true);
        } else {
          setFirst(false);
        }
      } catch (e) {
        console.warn(`Error reading ${key} from AsyncStorage`, e);
        if (mounted) setFirst(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [key]);

  const markDone = async () => {
    try {
      await AsyncStorage.setItem(key, "true");
    } catch (e) {
      console.warn(`Error setting ${key} in AsyncStorage`, e);
    }
    setFirst(false);
  };

  return [first, markDone] as const;
}
