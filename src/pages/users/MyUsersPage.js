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

    // Mode ajout si editingUser est null
    const isAdding = editingUser === null;

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["myUsers"],
        queryFn: getUsersByCompany,
    });

    const userMutation = useMutation({
        mutationFn: (userData) =>
            editingUser ? updateUser(editingUser.id, userData) : createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries(["myUsers"]);
            setOpenUserForm(false);
            setEditingUser(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => queryClient.invalidateQueries(["myUsers"]),
    });

    // Cette fonction ouvre la modal.
    // Pour l'ajout, on passera explicitement null.
    const handleOpenUserForm = (user) => {
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
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onEdit={handleOpenUserForm}
                    // On force ici l'appel de handleOpenUserForm avec null pour passer en mode ajout
                    onAdd={() => handleOpenUserForm(null)}
                />
            </Paper>

            <UserForm
                onSubmit={(userData) => userMutation.mutate(userData)}
                initialData={editingUser}
                open={openUserForm}
                handleClose={() => setOpenUserForm(false)}
                // En mode ajout, on passe l'id de l'entreprise de l'utilisateur connecté
                defaultEntreprise={isAdding ? userInfo?.entrepriseId : undefined}
                disableEntreprise={true}
                disableTypeUtilisateur={true}
            />

        </Container>
    );
};

export default MyUsersPage;
