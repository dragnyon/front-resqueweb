import React, {useContext, useEffect, useState} from "react";
import {getUsers, createUser, deleteUser, updateUser, getUsersByCompany} from "./UserService";
import UserList from "./UserList";
import UserForm from "./UserForm";
import { Button, Container, Typography, TextField } from "@mui/material";
import {AuthContext} from "../../context/AuthContext";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");
    const [openUserForm, setOpenUserForm] = useState(false);
    const { userType } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let data;
                // Par exemple, pour un admin, on récupère uniquement ceux de sa compagnie
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
        <Container>
            <Typography variant="h4" gutterBottom>Gestion des Utilisateurs</Typography>

            <TextField
                label="Rechercher un utilisateur par email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={handleSearch}
            />

            <Button variant="contained" color="primary" onClick={() => handleOpenUserForm()}>
                Ajouter un utilisateur
            </Button>

            <UserList users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleOpenUserForm} />

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
