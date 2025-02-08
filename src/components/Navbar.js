import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    return (
        <AppBar position="static" className={styles.navbar}>
            <Container>
                <Toolbar>
                    <Typography variant="h6" className={styles.title}>
                        BackOffice
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/dashboard")}>Accueil</Button>
                    <Button color="inherit" onClick={() => navigate("/dashboard/users")}>Utilisateurs</Button>
                    <Button color="inherit" onClick={() => navigate("/dashboard/entreprises")}>Entreprises</Button>
                    <Button color="inherit" className={styles.logoutButton} onClick={logout}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
