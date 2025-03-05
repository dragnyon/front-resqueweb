import React, { useEffect, useState, useContext } from "react";
import { Container, Typography, Card, CardContent, Grid, Box, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import {
    getAbonnement,
    getAbonnements,
    updateAbonnement,
    createAbonnement
} from "../../services/AbonnementService";
import { getUsersByCompany } from "../../services/UserService";
import JaugeAbonnement from "./JaugeAbonnement";
import JaugeUtilisateurs from "./JaugeUtilisateurs";
import AbonnementForm from "./AbonnementForm";
import { jsPDF } from "jspdf";

// Import du logo depuis /componant/common/image.png
import logo from "../../components/common/image.png";

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

    // Soumission du formulaire d'abonnement (création ou modification)
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

    const hasAbonnement = abonnement !== null;

    // Conversion des dates pour l'affichage
    const dateDebutStr = abonnement ? new Date(abonnement.dateDebut).toLocaleDateString() : "";
    const dateFinStr = abonnement ? new Date(abonnement.dateFin).toLocaleDateString() : "";

    /**
     * Génère et télécharge une facture PDF avec un format réaliste :
     * - Logo RescueWay (avec le logo importé)
     * - Informations de l'émetteur (RescueWay)
     * - Numéro de facture, infos client, détails de l'abonnement
     * - Les ID (abonnement et entreprise) ne sont affichés que dans la facture.
     */
    const generateInvoicePDF = () => {
        if (!abonnement) return;

        const doc = new jsPDF("p", "mm", "a4"); // Format A4

        // -- En-tête avec logo --
        if (logo) {
            // Affiche le logo en haut à gauche (x=10, y=10, width=25mm, height=25mm)
            doc.addImage(logo, "PNG", 10, 10, 25, 25);
        }
        doc.setFontSize(14);
        doc.text("RescueWay", 105, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text("123 Rue du Sauvetage, 75000 Paris", 105, 20, { align: "center" });
        doc.text("Téléphone : +33 1 23 45 67 89 | SIRET : 123 456 789 00012", 105, 25, { align: "center" });

        // -- Titre de la facture --
        doc.setFontSize(14);
        doc.text("FACTURE", 105, 40, { align: "center" });
        doc.line(20, 45, 190, 45);

        // -- Date & Numéro de facture --
        doc.setFontSize(10);
        const dateFacture = new Date().toLocaleDateString();
        doc.text(`Date de la facture : ${dateFacture}`, 20, 52);
        doc.text(`Numéro de facture : RW-${abonnement.id}`, 20, 58);

        // -- Infos client --
        doc.setFontSize(11);
        doc.text("Informations du client :", 20, 70);
        doc.setFontSize(10);
        doc.text(`Entreprise ID : ${userInfo.entrepriseId || "N/A"}`, 20, 76);

        // -- Détails de l'abonnement --
        doc.setFontSize(11);
        doc.text("Détails de l'abonnement :", 20, 90);
        doc.setFontSize(10);
        doc.text(`Date de début : ${dateDebutStr}`, 20, 96);
        doc.text(`Date de fin : ${dateFinStr}`, 20, 102);
        doc.text(`Nombre d'utilisateurs autorisés : ${abonnement.nbUtilisateur}`, 20, 108);
        doc.text(`Utilisateurs actuels : ${usersCount}`, 20, 114);
        const prix = abonnement.prix ? `${abonnement.prix} €` : "0 €";
        doc.text(`Prix total : ${prix}`, 20, 120);
        doc.text("Accès illimité à l'application mobile : OUI", 20, 126);

        // -- Pied de page --
        doc.line(20, 140, 190, 140);
        doc.setFontSize(10);
        doc.text("Merci pour votre confiance !", 105, 150, { align: "center" });

        // Téléchargement du PDF
        doc.save("facture_abonnement.pdf");
    };

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
                            {/* Jauge du nombre d'utilisateurs */}
                            <Grid item xs={12} sm={6} md={4}>
                                <JaugeUtilisateurs nbUtilisateurs={abonnement.nbUtilisateur} utilisateursActuels={usersCount} />
                            </Grid>
                            {/* Détails de l'abonnement (sans afficher les IDs) */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{ mt: { xs: 2, md: 0 } }}>
                                    <Typography variant="subtitle1">
                                        <strong>Date de début :</strong> {dateDebutStr}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>Date de fin :</strong> {dateFinStr}
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
                            <Button variant="contained" color="secondary" sx={{ ml: 2 }} onClick={generateInvoicePDF}>
                                Télécharger la facture
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                // Offre d'abonnement si l'entreprise n'est pas abonnée
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

            {hasAbonnement && (
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="textSecondary">
                        Abonnement valide jusqu'au {dateFinStr}
                    </Typography>
                </Box>
            )}

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
