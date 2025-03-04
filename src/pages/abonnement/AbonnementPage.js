import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAbonnement, deleteAbonnement, getAbonnements, updateAbonnement } from "../../services/AbonnementService";
import AbonnementList from "./AbonnementList";
import AbonnementForm from "./AbonnementForm";
import { Container, Typography, Paper } from "@mui/material";
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

const ModernPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: theme.spacing(4),
}));

const AbonnementsPage = () => {
    const [editingAbonnement, setEditingAbonnement] = useState(null);
    const [openAbonnementForm, setOpenAbonnementForm] = useState(false);

    const queryClient = useQueryClient();

    // Récupération des abonnements via React Query
    const { data: abonnements = [], isLoading, isError } = useQuery({
        queryKey: ["abonnements"],
        queryFn: getAbonnements,
    });

    // Mutation pour ajouter ou modifier un abonnement
    const abonnementMutation = useMutation({
        mutationFn: (abonnementData) =>
            editingAbonnement
                ? updateAbonnement(editingAbonnement.id, abonnementData)
                : createAbonnement(abonnementData),
        onSuccess: () => {
            queryClient.invalidateQueries(["abonnements"]); // Rafraîchir la liste après ajout/modif
            setOpenAbonnementForm(false);
            setEditingAbonnement(null);
        },
    });

    // Mutation pour supprimer un abonnement
    const deleteMutation = useMutation({
        mutationFn: deleteAbonnement,
        onSuccess: () => queryClient.invalidateQueries(["abonnements"]), // Rafraîchir la liste après suppression
    });

    const handleAddAbonnement = (abonnementData) => abonnementMutation.mutate(abonnementData);
    const handleDeleteAbonnement = (id) => deleteMutation.mutate(id);
    const handleOpenAbonnementForm = (abonnement = null) => {
        setEditingAbonnement(abonnement);
        setOpenAbonnementForm(true);
    };

    return (
        <Container sx={{ py: 4 }}>
            <HeaderBox>
                <Typography variant="h4" gutterBottom>
                    Gestion des Abonnements
                </Typography>
            </HeaderBox>

            <ModernPaper>

                {isLoading && <Typography>Chargement des abonnements...</Typography>}
                {isError && <Typography color="error">Erreur lors du chargement</Typography>}

                <AbonnementList
                    abonnements={abonnements}
                    onDelete={handleDeleteAbonnement}
                    onEdit={handleOpenAbonnementForm}
                    onAdd={() => {
                        console.log("onAdd callback appelé");
                        handleOpenAbonnementForm();
                    }}
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
