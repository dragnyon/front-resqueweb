// src/pages/EntrepriseForm.js
import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Modal,
    Box,
    Paper,
    Autocomplete
} from "@mui/material";
import styles from "../../styles/Form.module.css";
import { getAbonnements } from "../abonnement/AbonnementService"; // Assurez-vous que ce chemin est correct

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

const EntrepriseForm = ({ onSubmit, initialData, open, handleClose }) => {
    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [selectedAbonnement, setSelectedAbonnement] = useState(null);
    const [adresse, setAdresse] = useState("");
    const [abonnements, setAbonnements] = useState([]);

    // Charger la liste des abonnements depuis l'API
    useEffect(() => {
        const fetchAbonnements = async () => {
            try {
                const data = await getAbonnements();
                setAbonnements(data);
            } catch (error) {
                console.error("Erreur lors du chargement des abonnements :", error);
            }
        };
        fetchAbonnements();
    }, []);

    // Initialisation du formulaire en mode modification ou création
    useEffect(() => {
        if (initialData) {
            setMail(initialData.mail);
            setName(initialData.name);
            setAdresse(initialData.adresse || "");
            // Si un abonnement est défini dans initialData, le pré-sélectionner dans l'autocomplete
            if (initialData.abonnement && abonnements.length > 0) {
                const abSelected = abonnements.find(
                    (ab) => ab.id.toString() === initialData.abonnement.toString()
                );
                setSelectedAbonnement(abSelected || null);
            } else {
                setSelectedAbonnement(null);
            }
        } else {
            setMail("");
            setName("");
            setAdresse("");
            setSelectedAbonnement(null);
        }
    }, [initialData, open, abonnements]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            mail,
            name,
            abonnement: selectedAbonnement ? selectedAbonnement.id : null,
            adresse: adresse.trim() === "" ? null : adresse,
        });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component={Paper} elevation={3}>
                <Typography variant="h5" className={styles.formTitle} gutterBottom>
                    {initialData ? "Modifier" : "Ajouter"} une entreprise
                </Typography>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Nom"
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {/* Autocomplete pour sélectionner un abonnement existant */}
                    <Autocomplete
                        options={abonnements}
                        getOptionLabel={(option) =>
                            // Affichage d'une info représentative, ici periodicité et dateDebut
                            `${option.periodicite} - ${option.dateDebut.substring(0, 10)}`
                        }
                        value={selectedAbonnement}
                        onChange={(event, newValue) => setSelectedAbonnement(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Sélectionner un abonnement (optionnel)"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />

                    <TextField
                        fullWidth
                        label="Adresse (optionnel)"
                        margin="normal"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={styles.submitButton}
                    >
                        {initialData ? "Modifier" : "Ajouter"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EntrepriseForm;
