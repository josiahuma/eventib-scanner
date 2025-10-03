import axios from 'axios';

export const API = axios.create({
  // CHANGE THIS to your LAN or ngrok/prod URL
  baseURL: 'https://eventib.com/api',
  timeout: 15000,
});

export const setAuthToken = (token?: string) => {
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete API.defaults.headers.common.Authorization;
};

export const getCheckedIn = (eventId: number) =>
  API.get(`/events/${eventId}/checked-in`).then(res => res.data);

