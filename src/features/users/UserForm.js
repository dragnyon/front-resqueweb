import React, { useState, useEffect } from 'react';

const UserForm = ({ onSubmit, initialData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [entreprise, setEntreprise] = useState('');

    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email);
            setPassword(initialData.password);
            setEntreprise(initialData.entreprise || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            email,
            password,
            entreprise: entreprise.trim() === '' ? null : entreprise,
        });

        // Réinitialise les champs
        setEmail('');
        setPassword('');
        setEntreprise('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{initialData ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="UUID de l'entreprise (optionnel)"
                value={entreprise}
                onChange={(e) => setEntreprise(e.target.value)}
            />
            <button type="submit">{initialData ? 'Modifier' : 'Ajouter'}</button>
        </form>
    );
};

export default UserForm;
