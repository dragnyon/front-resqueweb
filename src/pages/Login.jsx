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
import CustomButton from "../components/common/CustomButton";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    textAlign: "center",
    backgroundColor: theme.palette.background.paper, // ✅ Respecte le mode sombre
    color: theme.palette.text.primary, // ✅ Texte ajusté selon le mode sombre/clair
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));


const GradientTitle = styled(Typography)(({ theme }) => ({
    background: theme.palette.mode === "dark"
        ? "linear-gradient(90deg, #90caf9, #f48fb1)" // 🌙 Mode sombre : Bleu et Rose
        : "linear-gradient(90deg, #4b6cb7, #182848)", // ☀️ Mode clair : Bleu foncé
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
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
                        sx={{
                            input: { color: "text.primary" }, // ✅ Texte qui respecte le mode sombre/clair
                            label: { color: "text.secondary" }, // ✅ Label ajusté pour le mode sombre
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "text.secondary" }, // ✅ Bordure adaptée au thème
                                "&:hover fieldset": { borderColor: "primary.main" },
                                "&.Mui-focused fieldset": { borderColor: "primary.main" },
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{
                            input: { color: "text.primary" }, // ✅ Texte qui respecte le mode sombre/clair
                            label: { color: "text.secondary" }, // ✅ Label ajusté pour le mode sombre
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "text.secondary" }, // ✅ Bordure adaptée au thème
                                "&:hover fieldset": { borderColor: "primary.main" },
                                "&.Mui-focused fieldset": { borderColor: "primary.main" },
                            },
                        }}
                    />
                    <CustomButton type="submit" fullWidth variant="contained">
                        Se Connecter
                    </CustomButton>
                </form>
            </StyledPaper>
            <CustomButton
                onClick={() => navigate("/register")}
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
            >
                S'inscrire
            </CustomButton>
        </Container>
    );
};

export default Login;
