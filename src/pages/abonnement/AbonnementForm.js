import React, { useState, useEffect } from "react";
import { TextField, Select, MenuItem, Grid } from "@mui/material";
import CustomModal from "../../components/common/CustomModal";
import CustomButton from "../../components/common/CustomButton";

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
        <CustomModal open={open} handleClose={handleClose} title={initialData ? "Modifier un abonnement" : "Ajouter un abonnement"}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Date de début */}
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Date de début"
                            type="date"
                            value={dateDebut}
                            onChange={(e) => setDateDebut(e.target.value)}
                            required
                        />
                    </Grid>
                    {/* Date de fin */}
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Date de fin"
                            type="date"
                            value={dateFin}
                            onChange={(e) => setDateFin(e.target.value)}
                            required
                        />
                    </Grid>

                    {/* Périodicité */}
                    <Grid item xs={12}>
                        <Select
                            fullWidth
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
                    </Grid>

                    {/* Nombre d'utilisateurs */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nombre d'utilisateurs"
                            type="number"
                            value={nbUtilisateurs}
                            onChange={(e) => setNbUtilisateurs(e.target.value)}
                            required
                        />
                    </Grid>

                    {/* Renouvellement automatique */}
                    <Grid item xs={12}>
                        <Select
                            fullWidth
                            value={renouvellementAuto}
                            onChange={(e) => setRenouvellementAuto(e.target.value)}
                            required
                        >
                            <MenuItem value="true">Oui</MenuItem>
                            <MenuItem value="false">Non</MenuItem>
                        </Select>
                    </Grid>

                    {/* Champs calculés (non modifiables) */}
                    <Grid item xs={6}>
                        <TextField fullWidth label="Jours restants (calculé)" value={computedNbJours} disabled />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Prix (calculé)" value={computedPrix} disabled />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="État (calculé)" value={computedEstActif} disabled />
                    </Grid>

                    {/* Bouton de soumission */}
                    <Grid item xs={12}>
                        <CustomButton type="submit" fullWidth>
                            {initialData ? "Modifier" : "Ajouter"}
                        </CustomButton>
                    </Grid>
                </Grid>
            </form>
        </CustomModal>
    );
};

export default AbonnementForm;
