// src/pages/UserList.js
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

const DataGridContainer = styled(Box)(({ theme }) => ({
    height: 500,
    width: "90%",
    margin: "auto",
    marginTop: theme.spacing(4),
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: theme.spacing(2),
    overflow: "hidden",
}));

const localeText = {
    noRowsLabel: "Aucune ligne",
    errorOverlayDefaultLabel: "Une erreur est survenue.",
    toolbarDensity: "Densité",
    toolbarDensityLabel: "Densité",
    toolbarDensityCompact: "Compacte",
    toolbarDensityStandard: "Standard",
    toolbarDensityComfortable: "Confortable",
    toolbarColumns: "Colonnes",
    toolbarColumnsLabel: "Sélectionner les colonnes",
    toolbarFilters: "Filtres",
    toolbarFiltersLabel: "Afficher les filtres",
    toolbarFiltersTooltipHide: "Masquer les filtres",
    toolbarFiltersTooltipShow: "Afficher les filtres",
    toolbarFiltersTooltipActive: (count) =>
        count > 1 ? `${count} filtres actifs` : `${count} filtre actif`,
    toolbarExport: "Exporter",
    toolbarExportLabel: "Exporter",
    toolbarExportCSV: "Télécharger en CSV",
    columnsPanelTextFieldLabel: "Rechercher une colonne",
    columnsPanelTextFieldPlaceholder: "Titre de colonne",
    columnsPanelDragIconLabel: "Réordonner la colonne",
    columnsPanelShowAllButton: "Afficher tout",
    columnsPanelHideAllButton: "Masquer tout",
    filterPanelAddFilter: "Ajouter un filtre",
    filterPanelDeleteIconLabel: "Supprimer",
    filterPanelOperators: "Opérateurs",
    filterPanelOperatorAnd: "Et",
    filterPanelOperatorOr: "Ou",
    filterPanelColumns: "Colonnes",
    filterPanelInputLabel: "Valeur",
    filterPanelInputPlaceholder: "Saisissez une valeur",
    columnMenuLabel: "Menu",
    columnMenuShowColumns: "Afficher les colonnes",
    columnMenuFilter: "Filtrer",
    columnMenuHideColumn: "Masquer",
    columnMenuUnsort: "Annuler le tri",
    columnMenuSortAsc: "Tri croissant",
    columnMenuSortDesc: "Tri décroissant",
    columnHeaderFiltersTooltipActive: (count) =>
        count > 1 ? `${count} filtres actifs` : `${count} filtre actif`,
    columnHeaderFiltersLabel: "Afficher les filtres",
    columnHeaderSortIconLabel: "Trier",
    footerRowSelected: (count) =>
        count > 1
            ? `${count.toLocaleString()} lignes sélectionnées`
            : `${count.toLocaleString()} ligne sélectionnée`,
    footerTotalRows: "Total des lignes :",
    footerPaginationRowsPerPage: "Lignes par page :",
};

const UserList = ({ users, onDelete, onEdit }) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleOpenConfirm = (user) => {
        setUserToDelete(user);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setUserToDelete(null);
        setOpenConfirm(false);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDelete(userToDelete.id);
            handleCloseConfirm();
        }
    };

    // Filtrer pour ne garder que les utilisateurs ayant un id
    const rows = (users || []).filter((user) => user && user.id);

    const columns = [
        { field: "email", headerName: "Email", flex: 1 },
        { field: "id", headerName: "UUID", flex: 1 },
        { field: "nom", headerName: "Nom", flex: 1 },
        { field: "prenom", headerName: "Prénom", flex: 1 },
        {
            field: "entreprise",
            headerName: "Entreprise",
            flex: 1,
            renderCell: (params) => {
                if (!params || !params.row) return "Aucune";
                const enterprise = params.row.entreprise;
                return enterprise && typeof enterprise === "string" && enterprise.trim().length > 0
                    ? enterprise
                    : "Aucune";
            },
        },
        { field: "typeUtilisateur", headerName: "Type", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                if (!params || !params.row) return null;
                return (
                    <>
                        <IconButton color="primary" onClick={() => onEdit(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenConfirm(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <DataGridContainer>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    localeText={localeText}
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-cell:hover": {
                            color: "primary.main",
                        },
                    }}
                />
            </DataGridContainer>

            <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmation de suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                        <strong>
                            {userToDelete?.nom} {userToDelete?.prenom}
                        </strong>
                        ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserList;
