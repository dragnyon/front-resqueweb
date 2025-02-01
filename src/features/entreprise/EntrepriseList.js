import React from 'react';

const EntrepriseList = ({ entreprises, onDelete, onEdit }) => {
    return (
        <div>
            <h2>Liste des entreprise</h2>
            <ul>
                {entreprises.map((entreprise) => (
                    <li key={entreprise.id}>
                        <strong>Email :</strong> {entreprise.mail} |
                        <strong> UUID :</strong> {entreprise.id} |
                        <strong> Adresse :</strong> {entreprise.adresse} |
                        <strong> Abonnement :</strong> {entreprise.abonnement} |
                        <button onClick={() => onDelete(entreprise.id)}>Supprimer</button>
                        <button onClick={() => onEdit(entreprise)}>Modifier</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EntrepriseList;
