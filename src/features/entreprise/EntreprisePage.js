import React, { useEffect, useState } from "react";
import { getEntreprises, createEntreprise, deleteEntreprise, updateEntreprise } from "./EntrepriseService";
import EntrepriseList from "./EntrepriseList";
import EntrepriseForm from "./EntrepriseForm";
import { Button, Container, Typography, TextField } from "@mui/material";

const EntreprisesPage = () => {
    const [entreprises, setEntreprises] = useState([]);
    const [editingEntreprise, setEditingEntreprise] = useState(null);
    const [search, setSearch] = useState("");
    const [openEntrepriseForm, setOpenEntrepriseForm] = useState(false);

    useEffect(() => {
        const fetchEntreprises = async () => {
            try {
                const data = await getEntreprises();
                setEntreprises(data);
            } catch (error) {
                console.error("Erreur lors du chargement des entreprises :", error);
            }
        };

        fetchEntreprises();
    }, []);

    const handleAddEntreprise = async (entrepriseData) => {
        try {
            if (editingEntreprise) {
                const updatedEntreprise = await updateEntreprise(editingEntreprise.id, entrepriseData);
                setEntreprises((prevEntreprises) =>
                    prevEntreprises.map((entreprise) => (entreprise.id === updatedEntreprise.id ? updatedEntreprise : entreprise))
                );
                setEditingEntreprise(null);
            } else {
                const newEntreprise = await createEntreprise(entrepriseData);
                setEntreprises((prevEntreprises) => [...prevEntreprises, newEntreprise]);
            }
        } catch (error) {
            console.error("Erreur lors de la création ou modification de l'entreprise :", error);
        }
        setOpenEntrepriseForm(false);
    };

    const handleDeleteEntreprise = async (id) => {
        try {
            await deleteEntreprise(id);
            setEntreprises((prevEntreprises) => prevEntreprises.filter((entreprise) => entreprise.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'entreprise :", error);
        }
    };

    const handleOpenEntrepriseForm = (entreprise = null) => {
        setEditingEntreprise(entreprise);
        setOpenEntrepriseForm(true);
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredEntreprises = entreprises.filter((entreprise) =>
        entreprise.mail.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Gestion des Entreprises</Typography>

            <TextField
                label="Rechercher une entreprise par email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={handleSearch}
            />

            <Button variant="contained" color="primary" onClick={() => handleOpenEntrepriseForm()}>
                Ajouter une entreprise
            </Button>

            <EntrepriseList entreprises={filteredEntreprises} onDelete={handleDeleteEntreprise} onEdit={handleOpenEntrepriseForm} />

            <EntrepriseForm
                onSubmit={handleAddEntreprise}
                initialData={editingEntreprise}
                open={openEntrepriseForm}
                handleClose={() => setOpenEntrepriseForm(false)}
            />
        </Container>
    );
};

export default EntreprisesPage;
