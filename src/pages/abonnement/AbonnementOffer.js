import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import AbonnementForm from "./AbonnementForm";
import { createAbonnement } from "../../services/AbonnementService";

const AbonnementOffer = ({ nbUtilisateurs, onAbonnementCreated }) => {
    const [openForm, setOpenForm] = useState(false);

    const handleSubscribeSubmit = async (data) => {
        try {
            // Crée l'abonnement en utilisant le service
            const newAbonnement = await createAbonnement(data);
            // Vous pouvez ensuite notifier le parent pour rafraîchir l'affichage par exemple
            if (onAbonnementCreated) {
                onAbonnementCreated(newAbonnement);
            }
            setOpenForm(false);
        } catch (error) {
            console.error("Erreur lors de la création de l'abonnement :", error);
        }
    };

    return (
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

            {/* Le formulaire d'abonnement s'ouvre en mode création */}
            <AbonnementForm
                open={openForm}
                handleClose={() => setOpenForm(false)}
                onSubmit={handleSubscribeSubmit}
                initialData={null}
            />
        </Card>
    );
};

export default AbonnementOffer;
