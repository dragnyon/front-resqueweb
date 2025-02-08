import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import styles from "../../styles/List.module.css";

const EntrepriseList = ({ entreprises, onDelete, onEdit }) => {
    return (
        <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow className={styles.tableHeader}>
                        <TableCell>Email</TableCell>
                        <TableCell>UUID</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Abonnement</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entreprises.map((entreprise) => (
                        <TableRow key={entreprise.id} className={styles.tableRow}>
                            <TableCell>{entreprise.mail}</TableCell>
                            <TableCell>{entreprise.id}</TableCell>
                            <TableCell>{entreprise.adresse || "N/A"}</TableCell>
                            <TableCell>{entreprise.abonnement || "N/A"}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="secondary" onClick={() => onEdit(entreprise)} className={styles.editButton}>
                                    Modifier
                                </Button>
                                <Button variant="contained" color="error" onClick={() => onDelete(entreprise.id)} className={styles.deleteButton}>
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

export default EntrepriseList;
