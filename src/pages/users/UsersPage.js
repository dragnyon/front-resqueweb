import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, deleteUser, updateUser, getUsersByCompany } from "../../services/UserService";
import UserList from "./UserList";
import UserForm from "./UserForm";
import { Container, Typography, TextField, Paper, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../context/AuthContext";
import CustomButton from "../../components/common/CustomButton";

// Zone d'en-tête avec dégradé
const HeaderBox = styled(Box)(({ theme }) => ({
    background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    textAlign: "center",
    color: "#fff",
    marginBottom: theme.spacing(4),
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

// Paper modernisé pour encadrer les sections
const ModernPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: theme.spacing(4),
}));

const UsersPage = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");
    const [openUserForm, setOpenUserForm] = useState(false);

    const { userInfo } = useContext(AuthContext);
    const userType = userInfo?.typeUtilisateur;

    const queryClient = useQueryClient();

    // 🔹 Récupération des utilisateurs via React Query
    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["users", userType], // 🔹 Ajoute userType pour différencier les requêtes ADMIN/SUPER_ADMIN
        queryFn: () => (userType === "ADMIN" ? getUsersByCompany() : getUsers()),
    });

    // 🔹 Mutation pour ajouter ou modifier un utilisateur
    const userMutation = useMutation({
        mutationFn: (userData) =>
            editingUser ? updateUser(editingUser.id, userData) : createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries(["users", userType]); // 🔹 Rafraîchir la liste après ajout/modif
            setOpenUserForm(false);
            setEditingUser(null);
        },
    });

    // 🔹 Mutation pour supprimer un utilisateur
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => queryClient.invalidateQueries(["users", userType]), // 🔹 Rafraîchir la liste après suppression
    });

    const handleAddUser = (userData) => userMutation.mutate(userData);
    const handleDeleteUser = (id) => deleteMutation.mutate(id);

    const handleOpenUserForm = (user = null) => {
        setEditingUser(user);
        setOpenUserForm(true);
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* En-tête de page */}
            <HeaderBox>
                <Typography variant="h4" gutterBottom>
                    Gestion des Utilisateurs
                </Typography>
            </HeaderBox>

            {/* Barre de recherche et bouton d'ajout */}
            <ModernPaper>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Rechercher par email"
                            variant="outlined"
                            fullWidth
                            value={search}
                            onChange={handleSearch}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "right" } }}>
                        <CustomButton onClick={() => handleOpenUserForm()}>
                            Ajouter un utilisateur
                        </CustomButton>
                    </Grid>
                </Grid>
            </ModernPaper>

            {/* 🔹 Gestion des erreurs et du chargement */}
            {isLoading ? <Typography>Chargement des utilisateurs...</Typography> : null}
            {isError ? <Typography color="error">Erreur lors du chargement</Typography> : null}

            {/* Liste des utilisateurs */}
            <ModernPaper>
                <UserList users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleOpenUserForm} />
            </ModernPaper>

            {/* Formulaire d'ajout/modification */}
            <UserForm
                onSubmit={handleAddUser}
                initialData={editingUser}
                open={openUserForm}
                handleClose={() => setOpenUserForm(false)}
            />
        </Container>
    );
};

export default UsersPage;
