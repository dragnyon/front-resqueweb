// src/pages/UsersPage.js
import React, { useContext, useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, updateUser, getUsersByCompany } from "./UserService";
import UserList from "./UserList";
import UserForm from "./UserForm";
import { Container, Typography, TextField, Paper, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../context/AuthContext";

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

// Bouton personnalisé avec effet "shine" sur hover
const ModernButton = styled("button")(({ theme }) => ({
    border: "none",
    outline: "none",
    padding: theme.spacing(1.5),
    width: "100%",
    cursor: "pointer",
    borderRadius: theme.spacing(1),
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    background: "linear-gradient(45deg, #4b6cb7 30%, #182848 90%)",
    boxShadow: "0 3px 5px 2px rgba(25, 118, 210, 0.3)",
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
                <Typography variant="body1">
                    Gérez vos utilisateurs de manière simple et efficace.
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
                        <ModernButton onClick={() => handleOpenUserForm()}>
                            Ajouter un utilisateur
                        </ModernButton>
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
