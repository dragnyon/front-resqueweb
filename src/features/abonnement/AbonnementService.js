import api from '../../services/api';


export const getAbonnements = async () => {
    const response = await api.get('/abonnement/all');
    return response.data;
};

export const getAbonnement = async (uuid) => {
    const response = await api.get(`/abonnement/get/${uuid}`);
    return response.data;
};


export const createAbonnement = async (abonnementData) => {
    const response = await api.post('/abonnement/create', abonnementData);
    return response.data;
};


export const updateAbonnement = async (id, updatedData) => {
    const response = await api.put(`/abonnement/update/${id}`, updatedData);
    return response.data; // Retourne l'abonnement mis à jour
};


export const deleteAbonnement = async (uuid) => {
    const response = await api.delete(`/abonnement/delete/${uuid}`);
    return response.data;
};