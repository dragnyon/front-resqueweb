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

const UserForm = ({ onSubmit, initialData, open, handleClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [entreprise, setEntreprise] = useState("");

    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email);
            setPassword(initialData.password);
            setEntreprise(initialData.entreprise || "");
        } else {
            setEmail("");
            setPassword("");
            setEntreprise("");
        }
    }, [initialData, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password, entreprise: entreprise.trim() === "" ? null : entreprise });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component={Paper} elevation={3}>
                <Typography variant="h5" className={styles.formTitle} gutterBottom>
                    {initialData ? "Modifier" : "Ajouter"} un utilisateur
                </Typography>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextField fullWidth label="Mot de passe" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <TextField fullWidth label="UUID de l'entreprise (optionnel)" margin="normal" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary" fullWidth className={styles.submitButton}>
                        {initialData ? "Modifier" : "Ajouter"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default UserForm;
