// src/pages/AbonnementList.js
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
    width: "95%",
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

const AbonnementList = ({ abonnements, onDelete, onEdit }) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [abonnementToDelete, setAbonnementToDelete] = useState(null);

    const handleOpenConfirm = (abonnement) => {
        setAbonnementToDelete(abonnement);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setAbonnementToDelete(null);
        setOpenConfirm(false);
    };

    const handleConfirmDelete = () => {
        if (abonnementToDelete) {
            onDelete(abonnementToDelete.id);
            handleCloseConfirm();
        }
    };

    // On ne garde que les abonnements avec un id défini
    const rows = (abonnements || []).filter(
        (abonnement) => abonnement && abonnement.id
    );

    const columns = [
        {
            field: "dateDebut",
            headerName: "Date de début",
            flex: 1,
            valueFormatter: (params) =>
                params.value ? params.value.substring(0, 10) : "N/A",
        },
        {
            field: "dateFin",
            headerName: "Date de fin",
            flex: 1,
            valueFormatter: (params) =>
                params.value ? params.value.substring(0, 10) : "N/A",
        },
        { field: "id", headerName: "UUID", flex: 1 },
        { field: "periodicite", headerName: "Périodicité", flex: 1 },
        {
            field: "nbUtilisateur",
            headerName: "Nombre d'utilisateurs",
            flex: 1,
        },
        {
            field: "renouvellementAuto",
            headerName: "Renouvellement",
            flex: 1,
            valueFormatter: (params) =>
                typeof params.value === "boolean" ? (params.value ? "Oui" : "Non") : "N/A",
        },
        {
            field: "nbJourRestant",
            headerName: "Jours restant",
            flex: 1,
            valueFormatter: (params) =>
                params.value !== undefined && params.value !== null ? params.value : "N/A",
        },
        {
            field: "prix",
            headerName: "Prix",
            flex: 1,
            valueFormatter: (params) =>
                params.value !== undefined && params.value !== null ? params.value : "N/A",
        },
        {
            field: "estActif",
            headerName: "État",
            flex: 1,
            valueFormatter: (params) =>
                typeof params.value === "boolean" ? (params.value ? "Actif" : "Inactif") : "N/A",
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                if (!params?.row) return null;
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
                        Êtes-vous sûr de vouloir supprimer l'abonnement{" "}
                        <strong>{abonnementToDelete?.id}</strong> ?
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

export default AbonnementList;
