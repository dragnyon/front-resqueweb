import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token); // 🔹 Stocke le token JWT
                navigate("/dashboard"); // 🔹 Redirige après connexion
            } else {
                setError("Échec de l'authentification.");
            }
        } catch (err) {
            setError("Email ou mot de passe incorrect !");
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Se Connecter</button>
            </form>
        </div>
    );
};

export default Login;
