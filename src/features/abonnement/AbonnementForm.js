// src/pages/AbandonmentForm.js
import React, { useState, useEffect } from "react";
import {
    TextField,
    Typography,
    Modal,
    Select,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledModalPaper = styled("div")(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

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
    boxShadow: "0 3px 5px 2px rgba(25,118,210,0.3)",
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

    useEffect(() => {
        if (initialData) {
            setDateDebut(initialData.dateDebut ? initialData.dateDebut.substring(0, 10) : "");
            setDateFin(initialData.dateFin ? initialData.dateFin.substring(0, 10) : "");
            setPeriodicite(initialData.periodicite);
            setNbUtilisateurs(initialData.nbUtilisateur.toString());
            setRenouvellementAuto(initialData.renouvellementAuto.toString());
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
        <Modal open={open} onClose={handleClose} closeAfterTransition>
            <StyledModalPaper>
                <Typography variant="h5" align="center" gutterBottom>
                    {initialData ? "Modifier" : "Ajouter"} un abonnement
                </Typography>
                <form onSubmit={handleSubmit}>
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
                    <TextField
                        fullWidth
                        label="Jours restant (calculé)"
                        margin="normal"
                        value={computedNbJours}
                        disabled
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Prix (calculé)"
                        margin="normal"
                        value={computedPrix}
                        disabled
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="État (calculé)"
                        margin="normal"
                        value={computedEstActif}
                        InputProps={{ readOnly: true }}
                    />
                    <ModernButton type="submit">
                        {initialData ? "Modifier" : "Ajouter"}
                    </ModernButton>
                </form>
            </StyledModalPaper>
        </Modal>
    );
};

export default AbonnementForm;
