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
import CustomButton from "../../components/common/CustomButton";

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
                            //required si on ajoute un utilisateur mais pas si on l'edit (car le mot de passe n'est pas modifié)
                            required={!initialData}

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
                        <CustomButton type="submit">
                            {initialData ? "Modifier" : "Ajouter"}
                        </CustomButton>
                    </Stack>
                </StyledModalPaper>
            </Fade>
        </Modal>
    );
};

export default UserForm;
