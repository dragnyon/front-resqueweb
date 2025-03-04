import React, { useState, useEffect } from "react";
import { TextField, Select, MenuItem, Grid, Autocomplete } from "@mui/material";
import CustomModal from "../../components/common/CustomModal";
import CustomButton from "../../components/common/CustomButton";
import { getEntreprises } from "../../services/EntrepriseService";

const UserForm = ({
                      onSubmit,
                      initialData,
                      defaultEntreprise,
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
        entreprise: defaultEntreprise || null,
    });

    const [entreprises, setEntreprises] = useState([]);

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

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormValues({
                    email: initialData.email || "",
                    nom: initialData.nom || "",
                    prenom: initialData.prenom || "",
                    password: "",
                    // Utilisation directe de la valeur initiale sans fallback par "USER"
                    typeUtilisateur: initialData.typeUtilisateur,
                    entreprise: initialData.entreprise
                        ? entreprises.find(
                        (e) => e.id.toString() === initialData.entreprise.toString()
                    ) || null
                        : null,
                });
            } else {
                setFormValues({
                    email: "",
                    nom: "",
                    prenom: "",
                    password: "",
                    typeUtilisateur: "USER",
                    entreprise: defaultEntreprise || null,
                });
            }
        }
    }, [initialData, open, entreprises, defaultEntreprise]);

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Si disableTypeUtilisateur est true, forçons la valeur avec celle d'initialData
        const submittedData = {
            id: initialData?.id,
            email: formValues.email,
            nom: formValues.nom,
            prenom: formValues.prenom,
            password: formValues.password || undefined,
            entreprise: formValues.entreprise ? formValues.entreprise.id : null,
            typeUtilisateur: disableTypeUtilisateur ? initialData.typeUtilisateur : formValues.typeUtilisateur,
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
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            type="password"
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                            required={!initialData}
                        />
                    </Grid>
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
