import React, { useEffect, useState } from "react";
import { Button, Container, Typography, TextField } from "@mui/material";
import {createAbonnement, deleteAbonnement, getAbonnements, updateAbonnement} from "./AbonnementService";
import AbonnementList from "./AbonnementList";
import AbonnementForm from "./AbonnmentForm";

const AbonnementsPage = () => {
    const [abonnements, setAbonnements] = useState([]);
    const [editingAbonnement, setEditingAbonnement] = useState(null);
    const [search, setSearch] = useState("");
    const [openAbonnementForm, setOpenAbonnementForm] = useState(false);

    useEffect(() => {
        const fetchAbonnements = async () => {
            try {
                const data = await getAbonnements();
                setAbonnements(data);
            } catch (error) {
                console.error("Erreur lors du chargement des Abonnements :", error);
            }
        };

        fetchAbonnements();
    }, []);

    const handleAddAbonnement = async (abonnementData) => {
        try {
            if (editingAbonnement) {
                const updatedAbonnement = await updateAbonnement(editingAbonnement.id, abonnementData);
                setAbonnements((prevAbonnements) =>
                    prevAbonnements.map((abonnement) => (abonnement.id === updatedAbonnement.id ? updatedAbonnement : abonnement))
                );
                setEditingAbonnement(null);
            } else {
                const newAbonnement = await createAbonnement(abonnementData);
                setAbonnements((prevAbonnements) => [...prevAbonnements, newAbonnement]);
            }
        } catch (error) {
            console.error("Erreur lors de la création ou modification de l'abonnement :", error);
        }
        setOpenAbonnementForm(false);
    };

    const handleDeleteAbonnement = async (id) => {
        try {
            await deleteAbonnement(id);
            setAbonnements((prevAbonnements) => prevAbonnements.filter((abonnement) => abonnement.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'abonnement :", error);
        }
    };

    const handleOpenAbonnementForm = (abonnement = null) => {
        setEditingAbonnement(abonnement);
        setOpenAbonnementForm(true);
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredAbonnements = abonnements.filter((abonnement) =>
        abonnement.periodicite.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Gestion des Abonnements</Typography>

            <TextField
                label="Rechercher un abonnment par periodicite"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={handleSearch}
            />

            <Button variant="contained" color="primary" onClick={() => handleOpenAbonnementForm()}>
                Ajouter un abonnment
            </Button>

            <AbonnementList abonnements={filteredAbonnements} onDelete={handleDeleteAbonnement} onEdit={handleOpenAbonnementForm} />

            <AbonnementForm
                onSubmit={handleAddAbonnement}
                initialData={editingAbonnement}
                open={openAbonnementForm}
                handleClose={() => setOpenAbonnementForm(false)}
            />
        </Container>
    );
};

export default AbonnementsPage;
