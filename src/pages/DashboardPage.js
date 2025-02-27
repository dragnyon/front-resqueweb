// src/pages/DashboardPage.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import UsersPage from "../features/users/UsersPage";
import EntreprisesPage from "../features/entreprise/EntreprisePage";
import AbonnementsPage from "../features/abonnement/AbonnementPage";
import MyAbonnement from "../features/abonnement/myAbonnement";
import { Container, Typography } from "@mui/material";

const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.2,
};

const DashboardPage = () => {
    const location = useLocation();

    return (
        <>
            <Navbar />
            <Container>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route
                            index
                            element={
                                <motion.div
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition}
                                >
                                    <Typography variant="h4" align="center" marginTop={5}>
                                        Bienvenue sur votre espace administrateur
                                    </Typography>
                                </motion.div>
                            }
                        />
                        <Route
                            path="users"
                            element={
                                <motion.div
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition}
                                >
                                    <UsersPage />
                                </motion.div>
                            }
                        />
                        <Route
                            path="entreprises"
                            element={
                                <motion.div
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition}
                                >
                                    <EntreprisesPage />
                                </motion.div>
                            }
                        />
                        <Route
                            path="abonnements"
                            element={
                                <motion.div
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition}
                                >
                                    <AbonnementsPage />
                                </motion.div>
                            }
                        />
                        <Route
                            path="myabonnement"
                            element={
                                <motion.div
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition}
                                >
                                    <MyAbonnement />
                                </motion.div>
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </Container>
        </>
    );
};

export default DashboardPage;
