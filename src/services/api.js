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
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🔹 Ajoute un interceptor pour gérer les erreurs 401 (Token expiré ou invalide)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token"); // Supprime le token
            window.location.href = "/login"; // Redirige vers la page de connexion
        }
        return Promise.reject(error);
    }
);

export default api;
