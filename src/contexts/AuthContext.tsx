import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, setAuthToken } from '../api/client';

type AuthContextType = {
  token: string | null;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('token');
      if (saved) {
        setTokenState(saved);
        setAuthToken(saved);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await API.post('/login', { email, password });
    const t = res.data.token as string;
    setAuthToken(t);
    setTokenState(t);
    await AsyncStorage.setItem('token', t);
  };

  const logout = async () => {
    try { await API.post('/logout'); } catch {}
    await AsyncStorage.removeItem('token');
    setAuthToken(undefined);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
