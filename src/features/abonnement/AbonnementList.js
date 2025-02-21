import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import styles from "../../styles/List.module.css";

const AbonnementList = ({ abonnements, onDelete, onEdit }) => {
    return (
        <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow className={styles.tableHeader}>
                        <TableCell>Date de début</TableCell>
                        <TableCell>Date de fin</TableCell>
                        <TableCell>UUID</TableCell>
                        <TableCell>Périodicité</TableCell>
                        <TableCell>Nombre d'utilisateurs</TableCell>
                        <TableCell>Renouvellement</TableCell>
                        <TableCell>Jours restant</TableCell>
                        <TableCell>Prix</TableCell>
                        <TableCell>État</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {abonnements.map((abonnement) => (
                        <TableRow key={abonnement.id} className={styles.tableRow}>
                            <TableCell>{abonnement.dateDebut}</TableCell>
                            <TableCell>{abonnement.dateFin}</TableCell>
                            <TableCell>{abonnement.id}</TableCell>
                            <TableCell>{abonnement.periodicite}</TableCell>
                            <TableCell>{abonnement.nbUtilisateur}</TableCell>
                            <TableCell>{abonnement.renouvellementAuto.toString()}</TableCell>
                            <TableCell>{abonnement.nbJourRestant}</TableCell>
                            <TableCell>{abonnement.prix}</TableCell>
                            <TableCell>{abonnement.estActif.toString()}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="secondary" onClick={() => onEdit(abonnement)} className={styles.editButton}>
                                    Modifier
                                </Button>
                                <Button variant="contained" color="error" onClick={() => onDelete(abonnement.id)} className={styles.deleteButton}>
                                    Supprimer
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AbonnementList;