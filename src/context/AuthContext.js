// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // instance axios configurée

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // Au chargement, on vérifie si le cookie JWT est valide via /auth/me
    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                setIsAuthenticated(true);
                setUserInfo(res.data);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setUserInfo(null);
            });
    }, []);

    // Fonction login centralisée
    // On envoie également le champ clientType (défini par défaut sur "backoffice")
    const login = async (email, password, clientType = "backoffice") => {
        try {
            // Tentative d'appel au login pour déposer le cookie JWT
            await api.post("/auth/login", { email, password, clientType });
        } catch (error) {
            // Si le serveur retourne un 403, on transmet l'erreur avec le message renvoyé
            if (error.response && error.response.status === 403) {
                throw new Error(error.response.data || "Accès interdit !");
            }
            throw error;
        }
        // Récupération des infos utilisateur via /auth/me
        const meResp = await api.get("/auth/me");
        setIsAuthenticated(true);
        setUserInfo(meResp.data);
        navigate("/dashboard");
    };

    // Fonction logout
    const logout = async () => {
        await api.post("/auth/logout");
        setIsAuthenticated(false);
        setUserInfo(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
