import React, { useState, useEffect } from "react";
import { TextField, Select, MenuItem, Grid, Autocomplete } from "@mui/material";
import CustomModal from "../../components/common/CustomModal";
import CustomButton from "../../components/common/CustomButton";
import { getEntreprises } from "../../services/EntrepriseService";

const UserForm = ({
                      onSubmit,
                      initialData,
                      defaultEntreprise, // Peut être un id ou un objet entreprise
                      open,
                      handleClose,
                      disableEntreprise = false,
                      disableTypeUtilisateur = false,
                  }) => {
    const [formValues, setFormValues] = useState({
        email: "",
        nom: "",
        prenom: "",
        password: "",
        typeUtilisateur: "USER",
        entreprise: null,
    });

    const [entreprises, setEntreprises] = useState([]);

    // Récupération de la liste des entreprises
    useEffect(() => {
        const fetchEntreprises = async () => {
            try {
                const entreprisesData = await getEntreprises();
                setEntreprises(entreprisesData);
            } catch (error) {
                console.error("Erreur lors de la récupération des entreprises :", error);
            }
        };
        fetchEntreprises();
    }, []);

    // Lors de l'ouverture de la modal, initialiser le formulaire selon le mode édition ou ajout.
    useEffect(() => {
        if (open) {
            if (initialData) {
                // Mode édition : préremplissage avec les données existantes
                setFormValues({
                    email: initialData.email || "",
                    nom: initialData.nom || "",
                    prenom: initialData.prenom || "",
                    password: "",
                    typeUtilisateur: initialData.typeUtilisateur,
                    entreprise: initialData.entreprise
                        ? entreprises.find(
                        (e) =>
                            e.id.toString() === initialData.entreprise.toString()
                    ) || null
                        : null,
                });
            } else {
                // Mode ajout : forcer typeUtilisateur à "USER" et préremplir le champ entreprise
                let defaultEnt = null;
                if (defaultEntreprise && entreprises.length > 0) {
                    // Si defaultEntreprise est un objet (ayant la propriété id), l'utiliser directement
                    if (typeof defaultEntreprise === "object" && defaultEntreprise.id) {
                        defaultEnt = defaultEntreprise;
                    } else {
                        // Sinon, rechercher l'entreprise dont l'id correspond
                        defaultEnt = entreprises.find(
                            (e) => e.id.toString() === defaultEntreprise.toString()
                        );
                    }
                }
                setFormValues({
                    email: "",
                    nom: "",
                    prenom: "",
                    password: "",
                    typeUtilisateur: "USER",
                    entreprise: defaultEnt,
                });
            }
        }
    }, [open, initialData, entreprises, defaultEntreprise]);

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedData = {
            id: initialData?.id,
            email: formValues.email,
            nom: formValues.nom,
            prenom: formValues.prenom,
            password: formValues.password || undefined,
            // On soumet l'id de l'entreprise sélectionnée
            entreprise: formValues.entreprise ? formValues.entreprise.id : null,
            typeUtilisateur: disableTypeUtilisateur
                ? initialData
                    ? initialData.typeUtilisateur
                    : "USER"
                : formValues.typeUtilisateur,
        };
        onSubmit(submittedData);
        handleClose();
    };

    return (
        <CustomModal
            open={open}
            handleClose={handleClose}
            title={initialData ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
        >
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Nom"
                            name="nom"
                            value={formValues.nom}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Prénom"
                            name="prenom"
                            value={formValues.prenom}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    {!initialData && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mot de passe"
                                type="password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Autocomplete
                            disabled={disableEntreprise}
                            options={entreprises}
                            getOptionLabel={(option) => option.name || ""}
                            value={formValues.entreprise}
                            onChange={(event, newValue) =>
                                setFormValues({ ...formValues, entreprise: newValue })
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Sélectionner une entreprise" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {disableTypeUtilisateur ? (
                            <TextField
                                fullWidth
                                label="Type d'utilisateur"
                                name="typeUtilisateur"
                                value={formValues.typeUtilisateur}
                                disabled
                            />
                        ) : (
                            <Select
                                fullWidth
                                name="typeUtilisateur"
                                value={formValues.typeUtilisateur}
                                onChange={handleChange}
                            >
                                <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                                <MenuItem value="USER">USER</MenuItem>
                            </Select>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <CustomButton type="submit" fullWidth>
                            {initialData ? "Modifier" : "Ajouter"}
                        </CustomButton>
                    </Grid>
                </Grid>
            </form>
        </CustomModal>
    );
};

export default UserForm;
