import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://eventib.com/api', // ✅ your Laravel API
  timeout: 15000,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    console.log("✅ Setting Bearer token:",  token.slice(0, 8) + "...");
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    console.log("❌ Removing token");
    delete API.defaults.headers.common.Authorization;
  }
};
