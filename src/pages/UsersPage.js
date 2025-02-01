import React, { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, updateUser } from "../features/users/UserService";
import UserList from "../features/users/UserList";
import UserForm from "../features/users/UserForm";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers(); // 🔹 Récupère tous les utilisateurs (avec JWT)
                setUsers(data);
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs :", error);
            }
        };

        fetchUsers();
    }, []);

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
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>Gestion des Utilisateurs</h1>

            <input
                type="text"
                placeholder="Rechercher par email..."
                value={search}
                onChange={handleSearch}
                style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
            />

            <UserForm onSubmit={handleAddUser} initialData={editingUser} />
            <UserList users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleEditUser} />
        </div>
    );
};

export default UsersPage;
