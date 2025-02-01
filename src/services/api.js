import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 Ajoute un interceptor pour inclure le token JWT dans toutes les requêtes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // 🔹 Récupère le token JWT
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 🔹 Ajoute le token dans le header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
