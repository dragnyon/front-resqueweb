import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Card, CardContent, Grid, Divider, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import { AuthContext } from "../../context/AuthContext";
import { getEntreprise, updateEntreprise } from "../../services/EntrepriseService";
import EntrepriseForm from "./EntrepriseForm";
import CustomButton from "../../components/common/CustomButton";

// Utilisation du fond et des couleurs du thème
const PageWrapper = styled(Container)(({ theme }) => ({
    background: theme.palette.background.default,
    minHeight: "100vh",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    textAlign: "center",
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 800,
    margin: "auto",
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[4],
}));

// Composant pour afficher une information avec icône
const InfoItem = ({ icon: Icon, label, value }) => (
    <Grid item xs={12} sm={6}>
        <Box display="flex" alignItems="center">
            {Icon && <Icon color="primary" sx={{ mr: 1 }} />}
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="h6">{value || "N/A"}</Typography>
            </Box>
        </Box>
    </Grid>
);

const MyCompagnyPage = () => {
    const { userInfo } = useContext(AuthContext);
    const [entreprise, setEntreprise] = useState(null);
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const entrepriseId = userInfo.entrepriseId;
                if (!entrepriseId) {
                    console.error("L'identifiant de l'entreprise est introuvable dans userInfo:", userInfo);
                    return;
                }
                const myEntreprise = await getEntreprise(entrepriseId);
                setEntreprise(myEntreprise);
            } catch (error) {
                console.error("Erreur lors du chargement de l'entreprise", error);
            }
        };
        if (userInfo && userInfo.entrepriseId) {
            fetchEntreprise();
        }
    }, [userInfo]);

    const handleFormSubmit = async (updatedData) => {
        try {
            const updatedEntreprise = await updateEntreprise(entreprise.id, updatedData);
            setEntreprise(updatedEntreprise);
            setOpenForm(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'entreprise", error);
        }
    };

    if (!entreprise) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                Chargement des informations de votre entreprise...
            </Typography>
        );
    }

    return (
        <PageWrapper maxWidth="lg">
            <HeaderSection>
                <BusinessIcon sx={{ fontSize: 60, color: "primary.main" }} />
                <Typography variant="h3" component="h1" gutterBottom>
                    Mon Entreprise
                </Typography>
                <Typography variant="subtitle1">
                    Gérez les informations de votre entreprise en quelques clics.
                </Typography>
            </HeaderSection>
            <StyledCard>
                <CardContent>
                    <Grid container spacing={3}>
                        <InfoItem icon={AccountCircleIcon} label="Nom" value={entreprise.name} />
                        <InfoItem icon={EmailIcon} label="Email" value={entreprise.mail} />
                        <InfoItem icon={LocationOnIcon} label="Adresse" value={entreprise.adresse} />
                        <InfoItem
                            icon={CardMembershipIcon}
                            label="Abonnement"
                            value={entreprise.abonnement ? "Vous êtes abonné" : "Vous n'êtes pas abonné"}
                        />
                    </Grid>
                    <Box mt={3}>
                        <Divider />
                    </Box>
                    <CustomButton variant="contained" onClick={() => setOpenForm(true)}>
                        <EditIcon sx={{ mr: 1 }} /> Modifier
                    </CustomButton>
                </CardContent>
            </StyledCard>
            <EntrepriseForm
                open={openForm}
                handleClose={() => setOpenForm(false)}
                onSubmit={handleFormSubmit}
                initialData={entreprise}
                disableAbonnement={true}
            />
        </PageWrapper>
    );
};

export default MyCompagnyPage;
