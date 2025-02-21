// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // instance axios configurée

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // Au chargement, on essaie de récupérer /auth/me pour voir si le cookie JWT est valide
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
    const login = async (email, password) => {
        // Appel au login pour déposer le cookie JWT
        await api.post("/auth/login", { email, password });
        // Récupération des infos utilisateur via /auth/me
        const meResp = await api.get("/auth/me");
        // Vérification du type utilisateur
        if (meResp.data.typeUtilisateur === "USER") {
            // Si l'utilisateur n'a pas le droit d'accéder (ex : accès interdit)
            throw new Error("Accès interdit !");
        }
        // Sinon, on met à jour l'état global et on redirige
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
