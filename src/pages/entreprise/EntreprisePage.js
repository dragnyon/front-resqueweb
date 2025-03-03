import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEntreprises,
    createEntreprise,
    deleteEntreprise,
    updateEntreprise,
} from "../../services/EntrepriseService";
import EntrepriseList from "./EntrepriseList";
import EntrepriseForm from "./EntrepriseForm";
import {Container, Typography, TextField, Paper} from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomButton from "../../components/common/CustomButton";

const HeaderBox = styled("div")(({ theme }) => ({
    background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    textAlign: "center",
    color: "#fff",
    marginBottom: theme.spacing(4),
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

const ModernPaper = styled(Paper)(({ theme })  => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: theme.spacing(4),
}));

const EntreprisesPage = () => {
    const [editingEntreprise, setEditingEntreprise] = useState(null);
    const [search, setSearch] = useState("");
    const [openEntrepriseForm, setOpenEntrepriseForm] = useState(false);

    const queryClient = useQueryClient();

    // 🔹 Récupération des entreprises via React Query
    const { data: entreprises = [], isLoading, isError } = useQuery({
        queryKey: ["entreprises"],
        queryFn: getEntreprises,
    });

    // 🔹 Mutation pour ajouter ou modifier une entreprise
    const entrepriseMutation = useMutation({
        mutationFn: (entrepriseData) =>
            editingEntreprise ? updateEntreprise(editingEntreprise.id, entrepriseData) : createEntreprise(entrepriseData),
        onSuccess: () => {
            queryClient.invalidateQueries(["entreprises"]); // 🔹 Rafraîchir la liste après ajout/modif
            setOpenEntrepriseForm(false);
            setEditingEntreprise(null);
        },
    });

    // 🔹 Mutation pour supprimer une entreprise
    const deleteMutation = useMutation({
        mutationFn: deleteEntreprise,
        onSuccess: () => queryClient.invalidateQueries(["entreprises"]), // 🔹 Rafraîchir la liste après suppression
    });

    const handleAddEntreprise = (entrepriseData) => entrepriseMutation.mutate(entrepriseData);
    const handleDeleteEntreprise = (id) => deleteMutation.mutate(id);

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
        <Container sx={{ py: 5 }}>
            <HeaderBox>
                <Typography variant="h4" gutterBottom>
                    Gestion des Entreprises
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
                <CustomButton onClick={() => handleOpenEntrepriseForm()} style={{ marginTop: "16px" }}>
                    Ajouter une entreprise
                </CustomButton>
            </ModernPaper>

            {/* 🔹 Gestion des erreurs et du chargement */}
            {isLoading && <Typography>Chargement des entreprises...</Typography>}
            {isError && <Typography color="error">Erreur lors du chargement</Typography>}
            <ModernPaper>
                <EntrepriseList
                    entreprises={filteredEntreprises}
                    onDelete={handleDeleteEntreprise}
                    onEdit={handleOpenEntrepriseForm}
                />
            </ModernPaper>
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
