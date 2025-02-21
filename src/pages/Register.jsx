import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Typography, Paper, RadioGroup, FormControlLabel, Radio, Alert } from "@mui/material";
import UserForm from "../features/users/UserForm";
import EntrepriseForm from "../features/entreprise/EntrepriseForm";
import { createEntreprise } from "../features/entreprise/EntrepriseService";
import { createUser } from "../features/users/UserService";
import styles from "../styles/Register.module.css";

const Register = () => {
    const [userType, setUserType] = useState(""); // "USER" ou "ENTREPRISE"
    const [entrepriseData, setEntrepriseData] = useState(null); // Stocke les données de l'entreprise
    const [isRegistered, setIsRegistered] = useState(false); // Pour afficher le message de confirmation
    const navigate = useNavigate();

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
        setEntrepriseData(null); // Réinitialise les données d'entreprise en cas de changement
        setIsRegistered(false); // Réinitialise la confirmation en cas de modification
    };

    // Fonction pour gérer la création d'une entreprise
    const handleEntrepriseSubmit = async (data) => {
        try {
            const newEntreprise = await createEntreprise(data);
            setEntrepriseData(newEntreprise); // Stocke l'entreprise créée pour l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la création de l'entreprise :", error);
        }
    };

    // Fonction pour gérer la création d'un utilisateur
    const handleUserSubmit = async (data) => {
        try {
            if (userType === "ENTREPRISE" && entrepriseData) {
                data.entreprise = entrepriseData.id; // Associe l'utilisateur à l'entreprise créée
            }
            await createUser(data);
            setIsRegistered(true); // Active le message de confirmation
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper className={styles.registerContainer} elevation={3}>
                <Typography variant="h4" className={styles.registerTitle} gutterBottom>Inscription</Typography>

                {/* Message de confirmation après inscription */}
                {isRegistered ? (
                    <>
                        <Alert severity="success">L'entreprise et l'utilisateur ont été créés avec succès !</Alert>
                        <Button
                            onClick={() => navigate("/login")}
                            variant="contained"
                            color="primary"
                            className={styles.loginRedirect}
                        >
                            Se Connecter
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Sélecteur du type d'inscription */}
                        <RadioGroup value={userType} onChange={handleUserTypeChange} row>
                            <FormControlLabel value="USER" control={<Radio />} label="Utilisateur Simple" />
                            <FormControlLabel value="ENTREPRISE" control={<Radio />} label="Entreprise" />
                        </RadioGroup>

                        {/* Si l'utilisateur choisit "Entreprise", on affiche d'abord le formulaire entreprise */}
                        {userType === "ENTREPRISE" && !entrepriseData && (
                            <EntrepriseForm onSubmit={handleEntrepriseSubmit} open={true} handleClose={() => {}} />
                        )}

                        {/* Affichage du formulaire utilisateur uniquement quand :
                            - L'utilisateur a choisi "Utilisateur Simple"
                            - L'utilisateur a choisi "Entreprise" ET a déjà créé une entreprise */}
                        {(userType === "USER" || (userType === "ENTREPRISE" && entrepriseData)) && (
                            <UserForm
                                onSubmit={handleUserSubmit}
                                open={true}
                                handleClose={() => {}}
                                initialData={{ entreprise: entrepriseData ? entrepriseData.id : "" }} // Précoche l'entreprise si créée
                            />
                        )}
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Register;
