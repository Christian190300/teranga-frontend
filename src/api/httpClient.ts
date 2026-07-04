import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
});

// Attache automatiquement le token JWT à chaque requête vers le backend.
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ts_access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});