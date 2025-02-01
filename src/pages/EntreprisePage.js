import React, { useEffect, useState } from 'react';
import { getEntreprises, createEntreprise, deleteEntreprise, updateEntreprise } from '../features/entreprise/EntrepriseService';

import EntrepriseList from "../features/entreprise/EntrepriseList";
import EntrepriseForm from "../features/entreprise/EntrepriseForm";

const EntreprisesPage = () => {
    const [entreprises, setEntreprises] = useState([]); // Liste des entreprises
    const [editingEntreprise, setEditingEntreprise] = useState(null); // Entreprise en cours de modification
    const [search, setSearch] = useState(''); // Texte de recherche

    // Charger les entre^rises depuis l'API
    useEffect(() => {
        const fetchEntreprises = async () => {
            try {
                const data = await getEntreprises(); // Récupère toutes les entreprises
                setEntreprises(data);
            } catch (error) {
                console.error('Erreur lors du chargement des entreprises :', error);
            }
        };

        fetchEntreprises();
    }, []);

    // Ajouter ou modifier une entreprise
    const handleAddEntreprise = async (entrepriseData) => {
        try {
            if (editingEntreprise) {
                // Modification d'une entreprise
                const updatedEntreprise = await updateEntreprise(editingEntreprise.id, entrepriseData);
                setEntreprises((prevEntreprises) =>
                    prevEntreprises.map((entreprise) => (entreprise.id === updatedEntreprise.id ? updatedEntreprise : entreprise))
                );
                setEditingEntreprise(null); // Quitte le mode édition
            } else {
                // Création d'une nouvelle entreprises
                const newEntreprise = await createEntreprise(entrepriseData);
                setEntreprises((prevEntreprises) => [...prevEntreprises, newEntreprise]);
            }
        } catch (error) {
            console.error('Erreur lors de la création ou modification de l\'entreprise :', error);
        }
    };

    // Supprimer un utilisateur
    const handleDeleteEntreprise = async (id) => {
        try {
            await deleteEntreprise(id); // Supprime l'entreprise dans l'API
            setEntreprises((prevEntreprises) => prevEntreprises.filter((entreprise) => entreprise.id !== id)); // Met à jour la liste
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'entreprise :', error);
        }
    };

    // Activer le mode modification pour une entreprise
    const handleEditEntreprise = (entreprise) => {
        setEditingEntreprise(entreprise); // Charge l'entreprise à modifier dans le formulaire
    };

    // Gestion de la recherche
    const handleSearch = (e) => {
        setSearch(e.target.value); // Met à jour le texte de recherche
    };

    // Filtrer les entreprises en fonction de la recherche
    const filteredEntreprises = entreprises.filter((entreprise) =>
        entreprise.mail.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div>
            <h1>Gestion des Entreprises</h1>

            {/* Champ de recherche */}
            <input
                type="text"
                placeholder="Rechercher par email..."
                value={search}
                onChange={handleSearch}
                style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
            />

            {/* Formulaire d'ajout ou de modification */}
            <EntrepriseForm onSubmit={handleAddEntreprise} initialData={editingEntreprise} />

            {/* Liste des entreprises */}
            <EntrepriseList entreprises={filteredEntreprises} onDelete={handleDeleteEntreprise} onEdit={handleEditEntreprise} />
        </div>
    );
};

export default EntreprisesPage;
