// src/pages/EntreprisePage.js
import React, { useEffect, useState } from "react";
import {
    getEntreprises,
    createEntreprise,
    deleteEntreprise,
    updateEntreprise,
} from "./EntrepriseService";
import EntrepriseList from "./EntrepriseList";
import EntrepriseForm from "./EntrepriseForm";
import { Container, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const HeaderBox = styled("div")(({ theme }) => ({
    background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    textAlign: "center",
    color: "#fff",
    marginBottom: theme.spacing(4),
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

const ModernPaper = styled("div")(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: theme.spacing(4),
}));

const ModernButton = styled("button")(({ theme }) => ({
    border: "none",
    outline: "none",
    padding: theme.spacing(1.5),
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
                console.log("Entreprises chargées :", data);
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
                setEntreprises((prev) =>
                    prev.map((entreprise) =>
                        entreprise.id === updatedEntreprise.id ? updatedEntreprise : entreprise
                    )
                );
                setEditingEntreprise(null);
            } else {
                const newEntreprise = await createEntreprise(entrepriseData);
                setEntreprises((prev) => [...prev, newEntreprise]);
            }
        } catch (error) {
            console.error("Erreur lors de la création ou modification de l'entreprise :", error);
        }
        setOpenEntrepriseForm(false);
    };

    const handleDeleteEntreprise = async (id) => {
        try {
            await deleteEntreprise(id);
            setEntreprises((prev) => prev.filter((entreprise) => entreprise.id !== id));
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
        <Container sx={{ py: 4 }}>
            <HeaderBox>
                <Typography variant="h4" gutterBottom>
                    Gestion des Entreprises
                </Typography>
                <Typography variant="body1">
                    Gérez vos entreprises de manière simple et efficace.
                </Typography>
            </HeaderBox>

            <ModernPaper>
                <TextField
                    label="Rechercher une entreprise par email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={search}
                    onChange={handleSearch}
                />
                <ModernButton onClick={() => handleOpenEntrepriseForm()} style={{ marginTop: "16px" }}>
                    Ajouter une entreprise
                </ModernButton>
            </ModernPaper>

            <EntrepriseList
                entreprises={filteredEntreprises}
                onDelete={handleDeleteEntreprise}
                onEdit={handleOpenEntrepriseForm}
            />

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
