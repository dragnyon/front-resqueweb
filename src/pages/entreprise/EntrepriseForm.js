import React, { useState, useEffect } from "react";
import { TextField, Grid, Autocomplete } from "@mui/material";
import CustomModal from "../../components/common/CustomModal";
import CustomButton from "../../components/common/CustomButton";
import { getAbonnements } from "../../services/AbonnementService";

const EntrepriseForm = ({ onSubmit, initialData, open, handleClose }) => {
    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [selectedAbonnement, setSelectedAbonnement] = useState(null);
    const [adresse, setAdresse] = useState("");
    const [abonnements, setAbonnements] = useState([]);

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

    useEffect(() => {
        if (initialData) {
            setMail(initialData.mail);
            setName(initialData.name);
            setAdresse(initialData.adresse || "");
            setSelectedAbonnement(
                abonnements.find((ab) => ab.id.toString() === initialData.abonnement?.toString()) || null
            );
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
        <CustomModal open={open} handleClose={handleClose} title={initialData ? "Modifier une entreprise" : "Ajouter une entreprise"}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Email" type="email" value={mail} onChange={(e) => setMail(e.target.value)} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={abonnements}
                            getOptionLabel={(option) => `${option.periodicite} - ${option.dateDebut.substring(0, 10)}`}
                            value={selectedAbonnement}
                            onChange={(event, newValue) => setSelectedAbonnement(newValue)}
                            renderInput={(params) => <TextField {...params} label="Sélectionner un abonnement" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomButton type="submit" fullWidth>{initialData ? "Modifier" : "Ajouter"}</CustomButton>
                    </Grid>
                </Grid>
            </form>
        </CustomModal>
    );
};

export default EntrepriseForm;
