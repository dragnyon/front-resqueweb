import api from "../../services/api";

// Récupérer tous les utilisateurs
export const getUsers = async () => {
    const response = await api.get("/utilisateurs/all"); // 🔹 Utilise `api.js` (avec JWT)
    return response.data;
};

// Ajouter un utilisateur
export const createUser = async (userData) => {
    const response = await api.post("/utilisateurs/create", userData);
    return response.data;
};

// Mettre à jour un utilisateur
export const updateUser = async (id, updatedData) => {
    const response = await api.put(`/utilisateurs/update/${id}`, updatedData);
    return response.data;
};

// Supprimer un utilisateur
export const deleteUser = async (uuid) => {
    const response = await api.delete(`/utilisateurs/${uuid}`);
    return response.data;
};
