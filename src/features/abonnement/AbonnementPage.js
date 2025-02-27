// src/pages/AbonnementPage.js
import React, { useEffect, useState } from "react";
import { createAbonnement, deleteAbonnement, getAbonnements, updateAbonnement } from "./AbonnementService";
import AbonnementList from "./AbonnementList";
import AbonnementForm from "./AbonnementForm";
import { Container, Typography, TextField, Grid } from "@mui/material";
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
                console.error("Erreur lors du chargement des abonnements :", error);
            }
        };
        fetchAbonnements();
    }, []);

    const handleAddAbonnement = async (abonnementData) => {
        try {
            if (editingAbonnement) {
                const updatedAbonnement = await updateAbonnement(editingAbonnement.id, abonnementData);
                setAbonnements((prev) =>
                    prev.map((abonnement) =>
                        abonnement.id === updatedAbonnement.id ? updatedAbonnement : abonnement
                    )
                );
                setEditingAbonnement(null);
            } else {
                const newAbonnement = await createAbonnement(abonnementData);
                setAbonnements((prev) => [...prev, newAbonnement]);
            }
        } catch (error) {
            console.error("Erreur lors de la création ou modification de l'abonnement :", error);
        }
        setOpenAbonnementForm(false);
    };

    const handleDeleteAbonnement = async (id) => {
        try {
            await deleteAbonnement(id);
            setAbonnements((prev) => prev.filter((abonnement) => abonnement.id !== id));
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
        <Container sx={{ py: 4 }}>
            <HeaderBox>
                <Typography variant="h4" gutterBottom>
                    Gestion des Abonnements
                </Typography>
                <Typography variant="body1">
                    Gérez vos abonnements de manière simple et efficace.
                </Typography>
            </HeaderBox>

            <ModernPaper>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Rechercher un abonnement par périodicité"
                            variant="outlined"
                            fullWidth
                            value={search}
                            onChange={handleSearch}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "right" } }}>
                        <ModernButton onClick={() => handleOpenAbonnementForm()}>
                            Ajouter un abonnement
                        </ModernButton>
                    </Grid>
                </Grid>
            </ModernPaper>

            <ModernPaper>
                <AbonnementList
                    abonnements={filteredAbonnements}
                    onDelete={handleDeleteAbonnement}
                    onEdit={handleOpenAbonnementForm}
                />
            </ModernPaper>

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
