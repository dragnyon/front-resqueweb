import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Modal, Box, Paper } from "@mui/material";
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

const EntrepriseForm = ({ onSubmit, initialData, open, handleClose }) => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [abonnement, setAbonnement] = useState("");
    const [adresse, setAdresse] = useState("");

    useEffect(() => {
        if (initialData) {
            setMail(initialData.mail);
            setPassword(initialData.password);
            setAbonnement(initialData.abonnement || "");
            setAdresse(initialData.adresse || "");
        } else {
            setMail("");
            setPassword("");
            setAbonnement("");
            setAdresse("");
        }
    }, [initialData, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ mail, password, abonnement: abonnement.trim() === "" ? null : abonnement, adresse: adresse.trim() === "" ? null : adresse });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component={Paper} elevation={3}>
                <Typography variant="h5" className={styles.formTitle} gutterBottom>
                    {initialData ? "Modifier" : "Ajouter"} une entreprise
                </Typography>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <TextField fullWidth label="Email" type="email" margin="normal" value={mail} onChange={(e) => setMail(e.target.value)} required />
                    <TextField fullWidth label="Mot de passe" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <TextField fullWidth label="UUID de l'abonnement (optionnel)" margin="normal" value={abonnement} onChange={(e) => setAbonnement(e.target.value)} />
                    <TextField fullWidth label="Adresse (optionnel)" margin="normal" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary" fullWidth className={styles.submitButton}>
                        {initialData ? "Modifier" : "Ajouter"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EntrepriseForm;
