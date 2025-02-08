import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import UsersPage from "../features/users/UsersPage";
import EntreprisesPage from "../features/entreprise/EntreprisePage";
import { Container, Typography } from "@mui/material";

const DashboardPage = () => {
    return (
        <>
            <Navbar />
            <Container>
                <Routes>
                    <Route path="/" element={<Typography variant="h4" align="center" marginTop={5}>Bienvenue sur le BackOffice</Typography>} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/entreprises" element={<EntreprisesPage />} />
                </Routes>
            </Container>
        </>
    );
};

export default DashboardPage;
