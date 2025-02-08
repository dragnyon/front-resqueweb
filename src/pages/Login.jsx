import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import axios from "axios";
import styles from "../styles/Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext); // 🔹 Appel du contexte pour gérer la connexion
    useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");


        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
            login(response.data.token); // 🔹 Appel de login() pour stocker le token et rediriger
        } catch (err) {
            setError("Email ou mot de passe incorrect !");
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper className={styles.loginContainer} elevation={3}>
                <Typography variant="h4" className={styles.loginTitle} gutterBottom>Connexion</Typography>
                {error && <Alert severity="error" className={styles.errorMessage}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField type="email" fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextField fullWidth label="Mot de passe" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" variant="contained" className={styles.loginButton}>Se Connecter</Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
