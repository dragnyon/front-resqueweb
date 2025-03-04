// src/pages/users/MyUsersPage.js
import React, { useState, useContext } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserList from "./UserList";
import UserForm from "./UserForm";
import { getUsersByCompany, createUser, updateUser, deleteUser } from "../../services/UserService";
import { AuthContext } from "../../context/AuthContext";

const MyUsersPage = () => {
    const { userInfo } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [editingUser, setEditingUser] = useState(null);
    const [openUserForm, setOpenUserForm] = useState(false);

    // On considère qu'on est en mode "ajout" si aucun utilisateur n'est passé en modification
    const isAdding = editingUser === null;

    // Récupération des utilisateurs de l'entreprise via getUsersByCompany
    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["myUsers"],
        queryFn: getUsersByCompany,
    });

    // Mutation pour ajouter ou modifier un utilisateur
    const userMutation = useMutation({
        mutationFn: (userData) =>
            editingUser ? updateUser(editingUser.id, userData) : createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries(["myUsers"]);
            setOpenUserForm(false);
            setEditingUser(null);
        },
    });

    // Mutation pour supprimer un utilisateur
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => queryClient.invalidateQueries(["myUsers"]),
    });

    const handleAddUser = (userData) => userMutation.mutate(userData);
    const handleDeleteUser = (id) => deleteMutation.mutate(id);

    // Pour l'ajout, on n'envoie pas d'utilisateur, ce qui déclenche l'utilisation des props "defaultEntreprise" et "disableXXX"
    const handleOpenUserForm = (user = null) => {
        setEditingUser(user);
        setOpenUserForm(true);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    mb: 4,
                    background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
                    padding: 2,
                    borderRadius: 1,
                    color: "#fff",
                    textAlign: "center",
                }}
            >
                <Typography variant="h4">Utilisateurs de mon entreprise</Typography>
            </Box>

            {isLoading && <Typography>Chargement des utilisateurs...</Typography>}
            {isError && <Typography color="error">Erreur lors du chargement</Typography>}

            <Paper sx={{ p: 3, mb: 4 }}>
                <UserList
                    users={users}
                    onDelete={handleDeleteUser}
                    onEdit={handleOpenUserForm}
                    onAdd={handleOpenUserForm}
                />
            </Paper>

            <UserForm
                onSubmit={handleAddUser}
                initialData={editingUser}
                open={openUserForm}
                handleClose={() => setOpenUserForm(false)}
                // Pour l'ajout : pré-sélectionner et bloquer l'entreprise (celle de l'utilisateur connecté)
                // et forcer le type sur "USER"
                defaultEntreprise={isAdding ? userInfo?.entreprise : undefined}
                disableEntreprise={isAdding}
                disableTypeUtilisateur={isAdding}
            />
        </Container>
    );
};

export default MyUsersPage;
