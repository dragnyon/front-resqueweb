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
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext"; // ✅ Utilisation du bon ThemeContext
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

const NavButton = styled(Button)(({ theme }) => ({
    color: "#fff",
    margin: theme.spacing(0, 1),
    textTransform: "none",
    fontWeight: 500,
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s",
    "& > *": { position: "relative", zIndex: 1 },
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
    const { isDarkMode, toggleTheme } = useContext(ThemeContext); // ✅ Utilisation du bon ThemeContext
    const [drawerOpen, setDrawerOpen] = useState(false);

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
            { label: "Gestion des données", path: "/dashboard/data" },
            { label: "Gestion des clients", path: "/dashboard/clients" }
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
                    <ListItem button key={item.label} onClick={() => navigate(item.path)} sx={{ justifyContent: "center" }}>
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
                    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
                        {navItems.map((item) => (
                            <NavButton key={item.label} onClick={() => navigate(item.path)}>
                                {item.label}
                            </NavButton>
                        ))}
                        <NavButton onClick={logout}>Déconnexion</NavButton>
                        <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 2 }}>
                            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Box>
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
