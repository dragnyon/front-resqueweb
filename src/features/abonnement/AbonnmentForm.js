import React, { useState, useEffect } from "react";
import {TextField, Button, Typography, Modal, Box, Paper, Select, MenuItem} from "@mui/material";
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
    const [renouvellementAuto, setRenouvellementAuto] = useState("");
    const [nbJoursRestant, setNbJoursRestant] = useState("");
    const [prix, setPrix] = useState("");
    const [estActif, setEstActif] = useState("");


    useEffect(() => {
        if (initialData) {

            setDateDebut(initialData.dateDebut ? initialData.dateDebut.substring(0, 10) : "");
            setDateFin(initialData.dateFin ? initialData.dateFin.substring(0, 10) : "");
            setPeriodicite(initialData.periodicite);
            setNbUtilisateurs(initialData.nbUtilisateur);
            setRenouvellementAuto(initialData.renouvellementAuto);
            setNbJoursRestant(initialData.nbJourRestant);
            setPrix(initialData.prix);
            setEstActif(initialData.estActif);

        } else {
            setDateDebut("");
            setDateFin("");
            setPeriodicite("");
            setNbUtilisateurs("");
            setRenouvellementAuto("");
            setNbJoursRestant("");
            setPrix("");
            setEstActif("");
        }
    }, [initialData, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({         dateDebut: new Date(dateDebut).toISOString(),
            dateFin: new Date(dateFin).toISOString(),
            periodicite,
            nbUtilisateur: Number(nbUtilisateurs),
            renouvellementAuto: renouvellementAuto,
            nbJourRestant: Number(nbJoursRestant),
            prix: Number(prix),
            estActif: estActif   });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component={Paper} elevation={3}>
                <Typography variant="h5" className={styles.formTitle} gutterBottom>
                    {initialData ? "Modifier" : "Ajouter"} une entreprise
                </Typography>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <TextField fullWidth label="Date de début" type="date" margin="normal" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
                    <TextField fullWidth label="Date de fin" type="date" margin="normal" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
                    <Select  fullWidth label="Périodicité" margin="normal" value={periodicite} onChange={(e) => setPeriodicite(e.target.value)} required >
                        <MenuItem value="Mensuel">Mensuel</MenuItem>
                        <MenuItem value="Annuel">Annuel</MenuItem>
                    </Select>
                    <TextField fullWidth type='number' label="Nombre d'utilisateurs" margin="normal" value={nbUtilisateurs} onChange={(e) => setNbUtilisateurs(e.target.value)} required />
                    <Select fullWidth label="Renouvellement" margin="normal" value={renouvellementAuto} onChange={(e) => setRenouvellementAuto(e.target.value)} required >
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                    </Select>
                    <TextField fullWidth label="Jours restant" margin="normal" value={nbJoursRestant} onChange={(e) => setNbJoursRestant(e.target.value)} required />
                    <TextField fullWidth type="number" label="Prix" margin="normal" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                    <Select fullWidth label="État" margin="normal" value={estActif} onChange={(e) => setEstActif(e.target.value)} required >
                        <MenuItem value="true">Actif</MenuItem>
                        <MenuItem value="false">Inactif</MenuItem>
                    </Select>
                    <Button type="submit" variant="contained" color="primary" fullWidth className={styles.submitButton}>
                        {initialData ? "Modifier" : "Ajouter"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AbonnementForm;
