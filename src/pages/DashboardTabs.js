import React, { useState } from "react";
import { Container, Tab, Tabs, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import EntreprisePage from "./entreprise/EntreprisePage";
import UsersPage from "./users/UsersPage";
import AbonnementsPage from "./abonnement/AbonnementPage";

const DashboardTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    // Définition des animations
    const variants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <Container sx={{ py: 4 }}>
            {/* Onglets de navigation */}
            <Tabs value={tabIndex} onChange={handleChange} centered>
                <Tab label="Toutes les entreprises" />
                <Tab label="Tous les utilisateurs" />
                <Tab label="Tous les abonnements" />
            </Tabs>

            {/* Contenu avec animation */}
            <Box sx={{ mt: 3 }}>
                <AnimatePresence mode="wait">
                    {tabIndex === 0 && (
                        <motion.div
                            key="entreprises"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={variants}
                            transition={{ duration: 0.3 }}
                        >
                            <EntreprisePage />
                        </motion.div>
                    )}
                    {tabIndex === 1 && (
                        <motion.div
                            key="utilisateurs"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={variants}
                            transition={{ duration: 0.3 }}
                        >
                            <UsersPage />
                        </motion.div>
                    )}
                    {tabIndex === 2 && (
                        <motion.div
                            key="abonnements"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={variants}
                            transition={{ duration: 0.3 }}
                        >
                            <AbonnementsPage />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </Container>
    );
};

export default DashboardTabs;
