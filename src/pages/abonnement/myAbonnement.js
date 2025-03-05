import React, { useEffect, useState, useContext } from "react";
import { Container, Typography, Card, CardContent, Grid, Box, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { getAbonnement, getAbonnements, updateAbonnement, createAbonnement } from "../../services/AbonnementService";
import { getUsersByCompany } from "../../services/UserService";
import JaugeAbonnement from "./JaugeAbonnement";
import JaugeUtilisateurs from "./JaugeUtilisateurs";
import AbonnementForm from "./AbonnementForm";

const MyAbonnement = () => {
    const [abonnement, setAbonnement] = useState(null);
    const [usersCount, setUsersCount] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const { userInfo } = useContext(AuthContext);
    const userType = userInfo?.typeUtilisateur;
    const abonnementID = userInfo?.abonnementId;

    // Récupération de l'abonnement
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (userType === "ADMIN") {
                    data = await getAbonnement(abonnementID);
                } else {
                    const abonnements = await getAbonnements();
                    // On prend le premier abonnement s'il existe
                    data = abonnements && abonnements.length > 0 ? abonnements[0] : null;
                }
                setAbonnement(data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'abonnement :", error);
            }
        };
        fetchData();
    }, [abonnementID, userType]);

    // Récupération du nombre d'utilisateurs de l'entreprise
    useEffect(() => {
        const fetchUsersCount = async () => {
            try {
                const users = await getUsersByCompany();
                setUsersCount(users.length);
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs :", error);
            }
        };
        fetchUsersCount();
    }, []);

    // Fonction de soumission du formulaire
    const handleFormSubmit = async (data) => {
        if (abonnement) {
            // Mode modification
            try {
                const updatedAbonnement = await updateAbonnement(abonnement.id, data);
                setAbonnement(updatedAbonnement);
                setOpenForm(false);
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'abonnement :", error);
            }
        } else {
            // Mode création
            try {
                const newAbonnement = await createAbonnement(data);
                setAbonnement(newAbonnement);
                setOpenForm(false);
            } catch (error) {
                console.error("Erreur lors de la création de l'abonnement :", error);
            }
        }
    };

    // Si abonnement existe, alors l'entreprise est abonnée
    const hasAbonnement = abonnement !== null;

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Mon Abonnement
            </Typography>

            {hasAbonnement ? (
                <Card sx={{ maxWidth: 900, mx: "auto", mb: 4, boxShadow: 4 }}>
                    <CardContent>
                        <Grid container spacing={4} justifyContent="center">
                            {/* Jauge du temps restant */}
                            <Grid item xs={12} sm={6} md={4}>
                                <JaugeAbonnement dateDebut={abonnement.dateDebut} dateFin={abonnement.dateFin} />
                            </Grid>
                            {/* Jauge du nombre d'utilisateurs utilisés */}
                            <Grid item xs={12} sm={6} md={4}>
                                <JaugeUtilisateurs nbUtilisateurs={abonnement.nbUtilisateur} utilisateursActuels={usersCount} />
                            </Grid>
                            {/* Détails de l'abonnement */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{ mt: { xs: 2, md: 0 } }}>
                                    <Typography variant="subtitle1">
                                        <strong>Date de début :</strong> {new Date(abonnement.dateDebut).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>Date de fin :</strong> {new Date(abonnement.dateFin).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>Prix :</strong> {abonnement.prix} €
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: "center", mt: 4 }}>
                            <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
                                Modifier mon abonnement
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                // Offre d'abonnement pour les entreprises non abonnées
                <Card sx={{ maxWidth: 900, mx: "auto", mb: 4, boxShadow: 4 }}>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>
                            Vous n'avez pas encore d'abonnement
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            Abonnez-vous dès maintenant pour bénéficier d'un accès illimité à l'application mobile.
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            Prix : 0,5€ par utilisateur par jour
                        </Typography>
                        <Box sx={{ textAlign: "center", mt: 4 }}>
                            <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
                                S'abonner
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Box sx={{ textAlign: "center" }}>
                {hasAbonnement && (
                    <Typography variant="body2" color="textSecondary">
                        Abonnement valide jusqu'au {new Date(abonnement.dateFin).toLocaleDateString()}
                    </Typography>
                )}
            </Box>

            {/* Formulaire d'abonnement (en création ou modification selon le cas) */}
            <AbonnementForm
                open={openForm}
                handleClose={() => setOpenForm(false)}
                onSubmit={handleFormSubmit}
                initialData={abonnement}
            />
        </Container>
    );
};

export default MyAbonnement;
