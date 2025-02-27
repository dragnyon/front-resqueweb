// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    Container,
    TextField,
    Typography,
    Alert,
    Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
    background: "linear-gradient(90deg, #4b6cb7, #182848)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
}));

// Bouton personnalisé avec effet "shine" sur hover
const ModernButton = styled("button")(({ theme }) => ({
    border: "none",
    outline: "none",
    padding: theme.spacing(1.5),
    width: "100%",
    cursor: "pointer",
    borderRadius: theme.spacing(1),
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    background: "linear-gradient(45deg, #4b6cb7 30%, #182848 90%)",
    boxShadow: "0 3px 5px 2px rgba(25, 118, 210, 0.3)",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
    },
    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-75%",
        width: "50%",
        height: "100%",
        background: "rgba(255,255,255,0.2)",
        transform: "skewX(-25deg)",
        transition: "left 0.5s ease-in-out",
    },
    "&:hover::after": {
        left: "125%",
    },
}));

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
            await login(email, password);
        } catch (err) {
            setError(err.message || "Email ou mot de passe incorrect !");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <StyledPaper>
                <GradientTitle variant="h4" gutterBottom>
                    Connexion
                </GradientTitle>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
                    <ModernButton type="submit" fullWidth variant="contained">
                        Se Connecter
                    </ModernButton>
                </form>
            </StyledPaper>
            <ModernButton
                onClick={() => navigate("/register")}
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
            >
                S'inscrire
            </ModernButton>
        </Container>
    );
};

export default Login;
