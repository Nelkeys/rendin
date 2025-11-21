import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Automatically attach Firebase Token
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const token = await auth.currentUser.getIdToken(true);
      //console.log("Fresh token:", token);
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error fetching Firebase token:", error);
    }
  }
  return config;
});

export default api;
