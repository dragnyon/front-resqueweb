// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Button,
    Typography,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UserForm from "./users/UserForm";
import EntrepriseForm from "./entreprise/EntrepriseForm";
import { createEntreprise } from "../services/EntrepriseService";
import { createUser } from "../services/UserService";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
    background: "linear-gradient(90deg, #4b6cb7, #182848)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
}));

const ModernButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1rem",
    fontWeight: 500,
    background: "linear-gradient(45deg, #4b6cb7, #182848)",
    color: "#fff",
    boxShadow: "0 3px 5px rgba(25,118,210,0.3)",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
    },
}));

const Register = () => {
    const [userType, setUserType] = useState(""); // "USER" ou "ENTREPRISE"
    const [enterpriseData, setEnterpriseData] = useState(null); // Stocke les données du formulaire Entreprise
    const [userData, setUserData] = useState(null); // Stocke les données du formulaire Utilisateur
    const [isRegistered, setIsRegistered] = useState(false);
    const [openEnterpriseModal, setOpenEnterpriseModal] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);
    const navigate = useNavigate();

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
        setEnterpriseData(null);
        setUserData(null);
        setIsRegistered(false);
        setOpenEnterpriseModal(false);
        setOpenUserModal(false);
    };

    // Sauvegarder les données du formulaire Entreprise sans envoyer la requête
    const handleEnterpriseSubmit = (data) => {
        setEnterpriseData(data);
        setOpenEnterpriseModal(false);
    };

    // Sauvegarder les données du formulaire Utilisateur sans envoyer la requête
    const handleUserSubmit = (data) => {
        setUserData(data);
        setOpenUserModal(false);
    };

    // Fonction de soumission finale de l'inscription
    const handleFinalSubmit = async () => {
        try {
            if (userType === "ENTREPRISE") {
                // Créer l'entreprise d'abord et récupérer son ID
                const newEnterprise = await createEntreprise(enterpriseData);
                const finalUserData = { ...userData, entreprise: newEnterprise.id };
                await createUser(finalUserData);
            } else if (userType === "USER") {
                await createUser(userData);
            }
            setIsRegistered(true);
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <StyledPaper>
                <GradientTitle variant="h4" gutterBottom>
                    Inscription
                </GradientTitle>
                {isRegistered ? (
                    <>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Inscription réussie !
                        </Alert>
                        <ModernButton onClick={() => navigate("/login")} fullWidth variant="contained">
                            Se Connecter
                        </ModernButton>
                    </>
                ) : (
                    <>
                        <RadioGroup value={userType} onChange={handleUserTypeChange} row>
                            <FormControlLabel value="USER" control={<Radio />} label="Utilisateur Simple" />
                            <FormControlLabel value="ENTREPRISE" control={<Radio />} label="Entreprise" />
                        </RadioGroup>

                        {userType === "ENTREPRISE" && (
                            <>
                                <ModernButton onClick={() => setOpenEnterpriseModal(true)} fullWidth variant="contained">
                                    Remplir le formulaire entreprise
                                </ModernButton>
                                {enterpriseData && (
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        Entreprise saisie : {enterpriseData.name}
                                    </Typography>
                                )}
                            </>
                        )}

                        {(userType === "USER" || userType === "ENTREPRISE") && (
                            <ModernButton onClick={() => setOpenUserModal(true)} fullWidth variant="contained" sx={{ mt: 2 }}>
                                Remplir le formulaire utilisateur
                            </ModernButton>
                        )}

                        {((userType === "USER" && userData) ||
                            (userType === "ENTREPRISE" && enterpriseData && userData)) && (
                            <ModernButton onClick={handleFinalSubmit} fullWidth variant="contained" sx={{ mt: 2 }}>
                                Valider l'inscription
                            </ModernButton>
                        )}
                    </>
                )}
            </StyledPaper>

            <EntrepriseForm
                open={openEnterpriseModal}
                onSubmit={handleEnterpriseSubmit}
                handleClose={() => setOpenEnterpriseModal(false)}
            />
            <UserForm
                open={openUserModal}
                onSubmit={handleUserSubmit}
                handleClose={() => setOpenUserModal(false)}
                initialData={{ entreprise: enterpriseData ? enterpriseData.id : "" }}
            />
        </Container>
    );
};

export default Register;
