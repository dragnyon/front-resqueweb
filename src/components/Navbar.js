// src/components/Navbar.js
import React, { useContext, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { styled } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0, 2),
}));

// Bouton de navigation avec effet "ripple" moderne
const NavButton = styled(Button)(({ theme }) => ({
    color: "#fff",
    margin: theme.spacing(0, 1),
    textTransform: "none",
    fontWeight: 500,
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s",
    // Assure que le texte reste au-dessus du pseudo-élément
    "& > *": {
        position: "relative",
        zIndex: 1,
    },
    // Pseudo-élément pour l'animation ripple
    "&::before": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 0,
        height: 0,
        background: "rgba(255,255,255,0.3)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 0,
        transition: "width 0.4s ease, height 0.4s ease",
    },
    "&:hover": {
        transform: "scale(1.05)",
    },
    "&:hover::before": {
        width: "200%",
        height: "500%",
    },
}));

const Navbar = () => {
    const navigate = useNavigate();
    const { logout, userInfo } = useContext(AuthContext);
    const userType = userInfo?.typeUtilisateur;
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Définition des liens en fonction du rôle
    const navItems = [{ label: "Accueil", path: "/dashboard" }];
    if (userType === "ADMIN") {
        navItems.push(
            { label: "Mes Collaborateurs", path: "/dashboard/myusers" },
            { label: "Mon Entreprise", path: "/dashboard/mycompagny" },
            { label: "Mon Profil", path: "/dashboard/myprofil" },
            { label: "Mon Abonnement", path: "/dashboard/myabonnement" }
        );
    }
    if (userType === "SUPER_ADMIN") {
        navItems.push(
            { label: "Utilisateurs", path: "/dashboard/users" },
            { label: "Abonnements", path: "/dashboard/abonnements" },
            { label: "Entreprises", path: "/dashboard/entreprises" }
        );
    }

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
            <Typography variant="h6" sx={{ my: 2, textAlign: "center", fontWeight: "bold" }}>
                ResqueWay
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem
                        button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        sx={{ justifyContent: "center" }}
                    >
                        <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
                    </ListItem>
                ))}
                <ListItem button onClick={logout} sx={{ justifyContent: "center" }}>
                    <ListItemText primary="Déconnexion" sx={{ textAlign: "center" }} />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <StyledAppBar position="static">
                <StyledToolbar>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => navigate("/dashboard")}
                    >
                        ResqueWay
                    </Typography>
                    {/* Version desktop */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
                        {navItems.map((item) => (
                            <NavButton key={item.label} onClick={() => navigate(item.path)}>
                                {item.label}
                            </NavButton>
                        ))}
                        <NavButton onClick={logout}>Déconnexion</NavButton>
                    </Box>
                    {/* Version mobile */}
                    <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                        <IconButton color="inherit" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </StyledToolbar>
            </StyledAppBar>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navbar;
