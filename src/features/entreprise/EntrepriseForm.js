import React, { useState, useEffect } from 'react';

const EntrepriseForm = ({ onSubmit, initialData }) => {
    const [mail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [abonnement, setAbonnement] = useState('');
    const [adresse, setAdresse] = useState('');



    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email);
            setPassword(initialData.password);
            setAbonnement(initialData.abonnement || '');
            setAdresse(initialData.adresse || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            mail,
            password,
            abonnement: abonnement.trim() === '' ? null : abonnement,
            adresse: adresse.trim() === '' ? null : adresse
        });

        // Réinitialise les champs
        setEmail('');
        setPassword('');
        setAbonnement('');
        setAdresse('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{initialData ? 'Modifier' : 'Ajouter'} une entreprise</h2>
            <input
                type="email"
                placeholder="Email"
                value={mail}
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
                placeholder="UUID de l'abonnement (optionnel)"
                value={abonnement}
                onChange={(e) => setAbonnement(e.target.value)}
            />

            <input
                type="text"
                placeholder="Adresse (optionnel)"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
            />

            <button type="submit">{initialData ? 'Modifier' : 'Ajouter'}</button>
        </form>
    );
};

export default EntrepriseForm;
