// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles}) => {
    const { isAuthenticated, userInfo } = useContext(AuthContext);
    const userType = userInfo ? userInfo.typeUtilisateur : null;
console.log(userType);
    // Si l'utilisateur n'est pas authentifié, redirige vers /login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Tant que le rôle n'est pas chargé, afficher un loader
    if (!userType) {
        return <div>Loading...</div>;
    }

    // Si des rôles autorisés sont définis et que le rôle de l'utilisateur ne figure pas dans la liste, redirige vers /dashboard
    if (allowedRoles && !allowedRoles.includes(userType)) {
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
