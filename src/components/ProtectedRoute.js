import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, userType } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userType)) {
        return <Navigate to="/dashboard" />; // 🔹 Redirige si l'utilisateur n'a pas le bon rôle
    }

    return <Outlet />;
};

export default ProtectedRoute;
