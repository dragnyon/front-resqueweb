import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const typeUtilisateur = localStorage.getItem("typeUtilisateur");

        if (token) {
            setIsAuthenticated(true);
            setUserType(typeUtilisateur);
        }
    }, []);

    const login = (token, typeUtilisateur) => {
        localStorage.setItem("token", token);
        localStorage.setItem("typeUtilisateur", typeUtilisateur);
        setIsAuthenticated(true);
        setUserType(typeUtilisateur);
        navigate("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("typeUtilisateur");
        setIsAuthenticated(false);
        setUserType(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
