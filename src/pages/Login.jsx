import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import styles from "../styles/Login.module.css"; // Import du fichier CSS

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
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
