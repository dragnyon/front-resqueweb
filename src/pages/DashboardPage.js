// src/pages/DashboardPage.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import UsersPage from "./users/UsersPage";
import EntreprisesPage from "./entreprise/EntreprisePage";
import AbonnementsPage from "./abonnement/AbonnementPage";
import MyAbonnement from "./abonnement/myAbonnement";
import { Container, Typography } from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardTabs from "./DashboardTabs";
import MyCompagnyPage from "./entreprise/MyCompagnyPage";

const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3,
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


                        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} /> }>
                            <Route
                                path="clients"
                                element={
                                    <motion.div
                                        initial="initial"
                                        animate="in"
                                        exit="out"
                                        variants={pageVariants}
                                        transition={pageTransition}
                                    >
                                        <DashboardTabs />
                                    </motion.div>
                                }
                            />
                        </Route>


                        <Route  element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
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
                        </Route>


                        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
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
                        </Route>


                        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
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
                        </Route>


                        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN","ADMIN"]} />}>
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
                        </Route>

                        <Route element={ <ProtectedRoute allowedRoles={["ADMIN"]} /> }>
                            <Route
                                path="mycompagny"
                                element={
                                    <motion.div
                                        initial="initial"
                                        animate="in"
                                        exit="out"
                                        variants={pageVariants}
                                        transition={pageTransition}
                                    >
                                        <MyCompagnyPage />
                                    </motion.div>
                                }
                            />

                        </Route>



                    </Routes>


                </AnimatePresence>
            </Container>
        </>
    );
};

export default DashboardPage;
