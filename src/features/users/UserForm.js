// src/pages/UserForm.js
import React, { useState, useEffect, useContext } from "react";
import {
    TextField,
    Modal,
    Fade,
    Autocomplete,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { getEntreprises } from "../entreprise/EntrepriseService";
import { AuthContext } from "../../context/AuthContext";
import { styled } from "@mui/material/styles";

// Composant Paper modernisé pour le modal
const StyledModalPaper = styled("div")(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

// Bouton personnalisé avec effet "shine" sur hover
const ModernButton = styled("button")(({ theme }) => ({
    border: "none",
    outline: "none",
    padding: theme.spacing(1.5),
    width: "100%",
    cursor: "pointer",
    borderRadius: theme.spacing(1),
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    background: "linear-gradient(45deg, #4b6cb7 30%, #182848 90%)",
    boxShadow: "0 3px 5px 2px rgba(25, 118, 210, 0.3)",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
    },
    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-75%",
        width: "50%",
        height: "100%",
        background: "rgba(255,255,255,0.2)",
        transform: "skewX(-25deg)",
        transition: "left 0.5s ease-in-out",
    },
    "&:hover::after": {
        left: "125%",
    },
}));

const UserForm = ({ onSubmit, initialData, open, handleClose }) => {
    const [email, setEmail] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [password, setPassword] = useState("");
    const [typeUtilisateur, setTypeUtilisateur] = useState("USER");
    const [entreprises, setEntreprises] = useState([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState(null);
    const [autocompleteOpen, setAutocompleteOpen] = useState(false);

    const { userInfo } = useContext(AuthContext);

    // Chargement de la liste des entreprises
    useEffect(() => {
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

    // Gestion des données initiales (pour modification)
    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email || "");
            setNom(initialData.nom || "");
            setPrenom(initialData.prenom || "");
            setPassword(initialData.password || "");
            setTypeUtilisateur(initialData.typeUtilisateur || "USER");

            if (initialData.entreprise && entreprises.length > 0) {
                const entrepriseExistante = entreprises.find(
                    (e) =>
                        e.id != null &&
                        e.id.toString() === initialData.entreprise.toString()
                );
                setSelectedEntreprise(entrepriseExistante || null);
            } else {
                setSelectedEntreprise(null);
            }
        } else {
            setEmail("");
            setNom("");
            setPrenom("");
            setPassword("");
            setTypeUtilisateur("USER");
            setSelectedEntreprise(null);
        }
    }, [initialData, entreprises]);

    // Pré-sélection de l'entreprise pour un ADMIN en mode création
    useEffect(() => {
        if (!initialData && userInfo?.typeUtilisateur === "ADMIN" && entreprises.length > 0) {
            const adminEntreprise = entreprises.find(
                (e) =>
                    e.id != null && e.id.toString() === userInfo.entrepriseId.toString()
            );
            setSelectedEntreprise(adminEntreprise || null);
            setTypeUtilisateur("USER");
        }
    }, [initialData, userInfo, entreprises]);

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
        <Modal open={open} onClose={handleClose} closeAfterTransition>
            <Fade in={open}>
                <StyledModalPaper>
                    <Typography variant="h5" gutterBottom align="center">
                        {initialData ? "Modifier" : "Ajouter"} un utilisateur
                    </Typography>
                    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Nom"
                            type="text"
                            variant="outlined"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Prénom"
                            type="text"
                            variant="outlined"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Autocomplete
                            options={entreprises}
                            getOptionLabel={(option) => option.name || ""}
                            value={selectedEntreprise}
                            open={autocompleteOpen}
                            onOpen={() => setAutocompleteOpen(true)}
                            onClose={() => setAutocompleteOpen(false)}
                            onChange={(event, newValue) => setSelectedEntreprise(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sélectionner une entreprise"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            disabled={userInfo?.typeUtilisateur === "ADMIN"}
                        />
                        <Select
                            fullWidth
                            variant="outlined"
                            value={typeUtilisateur}
                            onChange={(e) => setTypeUtilisateur(e.target.value)}
                            disabled={userInfo?.typeUtilisateur === "ADMIN"}
                        >
                            <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                            <MenuItem value="USER">USER</MenuItem>
                        </Select>
                        <ModernButton type="submit">
                            {initialData ? "Modifier" : "Ajouter"}
                        </ModernButton>
                    </Stack>
                </StyledModalPaper>
            </Fade>
        </Modal>
    );
};

export default UserForm;
