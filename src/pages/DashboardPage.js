import React from "react";
import { useNavigate } from "react-router-dom";
import UsersPage from "./UsersPage";
import EntreprisesPage from "./EntreprisePage";

function DashboardPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Suppression du token
        navigate("/login"); // Redirection vers la page de connexion
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
                Déconnexion
            </button>
            <div style={{ display: "flex", gap: "20px" }}>
                <UsersPage />
                <EntreprisesPage />
            </div>
        </div>
    );
}

export default DashboardPage;
