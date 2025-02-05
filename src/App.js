import './App.css';
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PrivateRoute from "./features/components/PrivateRoute";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";

function AppWrapper() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard"); // Si l'utilisateur a un token, on le redirige vers le Dashboard
        } else {
            navigate("/login"); // Sinon, on le redirige vers la page de connexion
        }
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard/*" element={<DashboardPage />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

export default App;
