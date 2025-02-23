// src/pages/AbonnementForm.js
import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Modal,
    Box,
    Paper,
    Select,
    MenuItem,
} from "@mui/material";
import styles from "../../styles/Form.module.css";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const AbonnementForm = ({ onSubmit, initialData, open, handleClose }) => {
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [periodicite, setPeriodicite] = useState("");
    const [nbUtilisateurs, setNbUtilisateurs] = useState("");
    const [renouvellementAuto, setRenouvellementAuto] = useState("false");

    // Champs calculés en lecture seule
    const [computedNbJours, setComputedNbJours] = useState("");
    const [computedPrix, setComputedPrix] = useState("");
    const [computedEstActif, setComputedEstActif] = useState("");

    // Lors de l'ouverture du formulaire (modification ou création), on pré-remplit les champs
    useEffect(() => {
        if (initialData) {
            setDateDebut(initialData.dateDebut ? initialData.dateDebut.substring(0, 10) : "");
            setDateFin(initialData.dateFin ? initialData.dateFin.substring(0, 10) : "");
            setPeriodicite(initialData.periodicite);
            setNbUtilisateurs(initialData.nbUtilisateur.toString());
            setRenouvellementAuto(initialData.renouvellementAuto.toString());
            // Prévisualiser les valeurs calculées à partir des données existantes
            setComputedNbJours(initialData.nbJourRestant.toString());
            setComputedPrix(initialData.prix.toString());
            setComputedEstActif(initialData.estActif ? "Actif" : "Inactif");
        } else {
            setDateDebut("");
            setDateFin("");
            setPeriodicite("");
            setNbUtilisateurs("");
            setRenouvellementAuto("false");
            setComputedNbJours("");
            setComputedPrix("");
            setComputedEstActif("");
        }
    }, [initialData, open]);

    // Calculer le nombre de jours restant dès que dateDebut et dateFin sont renseignées
    // Calculer le prix uniquement si nbUtilisateurs est renseigné en plus
    useEffect(() => {
        if (dateDebut && dateFin) {
            const dDebut = new Date(dateDebut);
            const dFin = new Date(dateFin);
            const diffTime = dFin.getTime() - dDebut.getTime();
            const diffDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
            setComputedNbJours(diffDays.toString());

            if (nbUtilisateurs) {
                const price = Number(nbUtilisateurs) * diffDays * 0.5;
                setComputedPrix(price.toString());
            } else {
                setComputedPrix("");
            }

            // L'abonnement est actif si aujourd'hui se situe entre dateDebut et dateFin (bornes incluses)
            const now = new Date();
            const actif = (now >= dDebut && now <= dFin) || diffDays > 0;
            setComputedEstActif(actif ? "Actif" : "Inactif");
        } else {
            setComputedNbJours("");
            setComputedPrix("");
            setComputedEstActif("");
        }
    }, [dateDebut, dateFin, nbUtilisateurs]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            dateDebut: new Date(dateDebut).toISOString(),
            dateFin: new Date(dateFin).toISOString(),
            periodicite,
            nbUtilisateur: Number(nbUtilisateurs),
            renouvellementAuto: renouvellementAuto === "true",
            nbJourRestant: Number(computedNbJours),
            prix: Number(computedPrix),
            estActif: computedEstActif === "Actif",
        });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component={Paper} elevation={3}>
                <Typography variant="h5" className={styles.formTitle} gutterBottom>
                    {initialData ? "Modifier" : "Ajouter"} un abonnement
                </Typography>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <TextField
                        fullWidth
                        label="Date de début"
                        type="date"
                        margin="normal"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Date de fin"
                        type="date"
                        margin="normal"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                        required
                    />
                    <Select
                        fullWidth
                        margin="normal"
                        value={periodicite}
                        onChange={(e) => setPeriodicite(e.target.value)}
                        displayEmpty
                        required
                    >
                        <MenuItem value="" disabled>
                            Sélectionner la périodicité
                        </MenuItem>
                        <MenuItem value="Mensuel">Mensuel</MenuItem>
                        <MenuItem value="Annuel">Annuel</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        label="Nombre d'utilisateurs"
                        type="number"
                        margin="normal"
                        value={nbUtilisateurs}
                        onChange={(e) => setNbUtilisateurs(e.target.value)}
                        required
                    />
                    <Select
                        fullWidth
                        margin="normal"
                        value={renouvellementAuto}
                        onChange={(e) => setRenouvellementAuto(e.target.value)}
                        required
                    >
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                    </Select>
                    {/* Prévisualisation des valeurs calculées */}
                    <TextField
                        fullWidth
                        label="Jours restant (calculé)"
                        margin="normal"
                        value={computedNbJours}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Prix (calculé)"
                        margin="normal"
                        value={computedPrix}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="État (calculé)"
                        margin="normal"
                        value={computedEstActif}
                        InputProps={{ readOnly: true }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth className={styles.submitButton}>
                        {initialData ? "Modifier" : "Ajouter"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AbonnementForm;
