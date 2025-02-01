import React from 'react';

const UserList = ({ users, onDelete, onEdit }) => {
    return (
        <div>
            <h2>Liste des utilisateurs</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <strong>Email :</strong> {user.email} |
                        <strong> UUID :</strong> {user.id} |
                        <strong> Entreprise :</strong> {user.entreprise || 'Aucune'}
                        <button onClick={() => onDelete(user.id)}>Supprimer</button>
                        <button onClick={() => onEdit(user)}>Modifier</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
