// src/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur de réponse : redirige vers /login uniquement si on n'est pas déjà sur /login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            window.location.pathname !== "/login"
        ) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
