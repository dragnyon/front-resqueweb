// src/pages/UsersPage.js
import React, { useContext, useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, updateUser, getUsersByCompany } from "./UserService";
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
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");
    const [openUserForm, setOpenUserForm] = useState(false);

    const { userInfo } = useContext(AuthContext);
    const userType = userInfo?.typeUtilisateur;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let data;
                if (userType === "ADMIN") {
                    data = await getUsersByCompany();
                } else {
                    data = await getUsers();
                }
                setUsers(data);
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs :", error);
            }
        };
        fetchUsers();
    }, [userType]);

    const handleAddUser = async (userData) => {
        try {
            if (editingUser) {
                const updatedUser = await updateUser(editingUser.id, userData);
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
                );
                setEditingUser(null);
            } else {
                const newUser = await createUser(userData);
                setUsers((prevUsers) => [...prevUsers, newUser]);
            }
        } catch (error) {
            console.error("Erreur lors de la création ou modification de l'utilisateur :", error);
        }
        setOpenUserForm(false);
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };

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
