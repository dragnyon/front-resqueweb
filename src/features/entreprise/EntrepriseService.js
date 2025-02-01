import api from '../../services/api';

// Récupérer toutes les entreprises
export const getEntreprises = async () => {
    const response = await api.get('/entreprise/all');
    return response.data;
};

// Ajouter une entreprise
export const createEntreprise = async (entrepriseData) => {
    const response = await api.post('/entreprise/create', entrepriseData);
    return response.data;
};

// Mettre à jour une entreprise
export const updateEntreprise = async (id, updatedData) => {
    const response = await api.put(`/entreprise/update/${id}`, updatedData);
    return response.data; // Retourne l'entreprise mis à jour
};

// Supprimer une entreprise
export const deleteEntreprise = async (uuid) => {
    const response = await api.delete(`/entreprise/delete/${uuid}`);
    return response.data;
};