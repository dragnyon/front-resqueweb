import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Card, CardContent, Grid, Divider, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import CustomButton from "../../components/common/CustomButton";
import UserForm from "./UserForm";
import { AuthContext } from "../../context/AuthContext";
import { updateUser, getUser } from "../../services/UserService";

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

const MyProfilePage = () => {
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (userInfo && userInfo.userId) {
                    const user = await getUser(userInfo.userId);
                    setProfile(user);
                } else {
                    console.error("UUID utilisateur non défini dans userInfo", userInfo);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur", error);
            }
        };
        fetchUser();
    }, [userInfo]);

    const handleFormSubmit = async (updatedData) => {
        try {
            const updatedUser = await updateUser(profile.id, updatedData);
            setProfile(updatedUser);
            setUserInfo(updatedUser);
            setOpenForm(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil", error);
        }
    };

    if (!profile) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                Chargement de votre profil...
            </Typography>
        );
    }

    return (
        <PageWrapper maxWidth="lg">
            <HeaderSection>
                <PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />
                <Typography variant="h3" component="h1" gutterBottom>
                    Mon Profil
                </Typography>
                <Typography variant="subtitle1">
                    Visualisez et modifiez vos informations personnelles.
                </Typography>
            </HeaderSection>
            <StyledCard>
                <CardContent>
                    <Grid container spacing={3}>
                        <InfoItem icon={EmailIcon} label="Email" value={profile.email} />
                        <InfoItem icon={PersonIcon} label="Nom" value={profile.nom} />
                        <InfoItem icon={PersonIcon} label="Prénom" value={profile.prenom} />
                        <InfoItem icon={BadgeIcon} label="Type d'utilisateur" value={profile.typeUtilisateur} />
                    </Grid>
                    <Box mt={3}>
                        <Divider />
                    </Box>
                    <CustomButton variant="contained" onClick={() => setOpenForm(true)}>
                        <EditIcon sx={{ mr: 1 }} /> Modifier
                    </CustomButton>
                </CardContent>
            </StyledCard>
            <UserForm
                open={openForm}
                handleClose={() => setOpenForm(false)}
                onSubmit={handleFormSubmit}
                initialData={profile}
                disableEntreprise={true}
                disableTypeUtilisateur={true}
            />
        </PageWrapper>
    );
};

export default MyProfilePage;
