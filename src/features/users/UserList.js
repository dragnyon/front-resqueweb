import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import styles from "../../styles/List.module.css";

const UserList = ({ users, onDelete, onEdit }) => {
    return (
        <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow className={styles.tableHeader}>
                        <TableCell>Email</TableCell>
                        <TableCell>UUID</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell>Prénom</TableCell>
                        <TableCell>Entreprise</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className={styles.tableRow}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.nom}</TableCell>
                            <TableCell>{user.prenom}</TableCell>
                            <TableCell>{user.typeUtilisateur}</TableCell>
                            <TableCell>{user.entreprise || "Aucune"}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="secondary" onClick={() => onEdit(user)} className={styles.editButton}>
                                    Modifier
                                </Button>
                                <Button variant="contained" color="error" onClick={() => onDelete(user.id)} className={styles.deleteButton}>
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

export default UserList;
