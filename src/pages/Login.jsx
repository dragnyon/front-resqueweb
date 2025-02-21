// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import styles from "../styles/Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Appel à la fonction login du contexte
            await login(email, password);
            // La redirection vers "/dashboard" est gérée dans AuthContext.login()
        } catch (err) {
            // Affiche l'erreur retournée par la fonction login
            setError(err.message || "Email ou mot de passe incorrect !");
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper className={styles.loginContainer} elevation={3}>
                <Typography variant="h4" className={styles.loginTitle} gutterBottom>
                    Connexion
                </Typography>
                {error && <Alert severity="error" className={styles.errorMessage}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        fullWidth
                        label="Email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" className={styles.loginButton}>
                        Se Connecter
                    </Button>
                </form>
            </Paper>
            <Button
                onClick={() => navigate("/register")}
                variant="contained"
                color="primary"
                className={styles.registerRedirect}
            >
                S'inscrire
            </Button>
        </Container>
    );
};

export default Login;
