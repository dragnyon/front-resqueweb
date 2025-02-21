// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, userInfo } = useContext(AuthContext);
    const userType = userInfo ? userInfo.typeUtilisateur : null;

    // Si l'utilisateur n'est pas authentifié, redirige vers /login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Si le type d'utilisateur n'est pas encore chargé, on peut afficher un loader
    if (userType === null) {
        return <div>Loading...</div>;
    }

    // Si des rôles autorisés sont définis et que le type d'utilisateur n'est pas autorisé,
    // on redirige vers /dashboard (ou une page d'erreur selon votre logique)
    if (allowedRoles && !allowedRoles.includes(userType)) {
        return <Navigate to="/dashboard" />;
    }

    // Sinon, on rend les enfants via Outlet
    return <Outlet />;
};

export default ProtectedRoute;
