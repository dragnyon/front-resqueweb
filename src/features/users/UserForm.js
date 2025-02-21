import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Modal, Box, Paper, Autocomplete, MenuItem, Select } from "@mui/material";
import styles from "../../styles/Form.module.css";
import { getEntreprises } from "../entreprise/EntrepriseService";

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
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [password, setPassword] = useState("");
    const [typeUtilisateur, setTypeUtilisateur] = useState("USER");
    const [entreprises, setEntreprises] = useState([]);  // Liste des entreprises
    const [selectedEntreprise, setSelectedEntreprise] = useState(null); // Entreprise sélectionnée
    const [autocompleteOpen, setAutocompleteOpen] = useState(false); // Gère l'ouverture de l'Autocomplete

    useEffect(() => {
        // Charger la liste des entreprises depuis l'API
        const fetchEntreprises = async () => {
            try {
                const entreprisesData = await getEntreprises();
                setEntreprises(entreprisesData);
            } catch (error) {
                console.error("Erreur lors de la récupération des entreprises :", error);
            }
        };

        fetchEntreprises();
    }, []);

    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email);
            setPassword(initialData.password);
            setTypeUtilisateur(initialData.typeUtilisateur);
            setNom(initialData.nom);
            setPrenom(initialData.prenom);

            // Sélectionner automatiquement l'entreprise si elle existe
            if (entreprises.length > 0) {
                const entrepriseExistante = entreprises.find(e => e.id === initialData.entreprise);
                setSelectedEntreprise(entrepriseExistante || null);
            }
        } else {
            setEmail("");
            setNom("");
            setPrenom("");
            setPassword("");
            setTypeUtilisateur("USER");
            setSelectedEntreprise(null);
        }
    }, [initialData, open, entreprises]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            email,
            nom,
            prenom,
            password,
            entreprise: selectedEntreprise ? selectedEntreprise.id : null,
            typeUtilisateur,
        });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component={Paper} elevation={3}>
                <Typography variant="h5" className={styles.formTitle} gutterBottom>
                    {initialData ? "Modifier" : "Ajouter"} un utilisateur
                </Typography>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Nom"
                        type="text"
                        margin="normal"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Prénom"
                        type="text"
                        margin="normal"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* Autocomplete pour sélectionner une entreprise */}
                    <Autocomplete
                        options={entreprises}
                        getOptionLabel={(option) => option.mail || ""}
                        value={selectedEntreprise}
                        open={autocompleteOpen} // 🔹 Ouvre automatiquement la liste
                        onOpen={() => setAutocompleteOpen(true)} // 🔹 Ouvre la liste au focus
                        onClose={() => setAutocompleteOpen(false)}
                        onChange={(event, newValue) => setSelectedEntreprise(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Sélectionner une entreprise (Email)" margin="normal" fullWidth />
                        )}
                    />

                    {/* Sélection du type d'utilisateur */}
                    <Select
                        fullWidth
                        margin="normal"
                        value={typeUtilisateur}
                        onChange={(e) => setTypeUtilisateur(e.target.value)}
                    >
                        <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="USER">USER</MenuItem>
                    </Select>

                    {/* Bouton de soumission */}

                    <Button type="submit" variant="contained" color="primary" fullWidth className={styles.submitButton}>
                        {initialData ? "Modifier" : "Ajouter"}
                    </Button>


                </form>
            </Box>
        </Modal>
    );
};

export default UserForm;
