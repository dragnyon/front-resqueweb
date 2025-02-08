import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import DashboardPage from "../pages/DashboardPage";

const MainRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

            {/* 🔹 Protéger tout le Dashboard, mais sans cacher la Navbar */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}>
                <Route path="/dashboard/*" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
    );
};

export default MainRoutes;
