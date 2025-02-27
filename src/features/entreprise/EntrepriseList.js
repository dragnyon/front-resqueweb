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
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import { styled } from "@mui/material/styles";
import { getUsersByCompanyId, updateUser, deleteUser } from "../users/UserService"; // Vérifiez le chemin
import UserForm from "../users/UserForm"; // Vérifiez le chemin

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

const EntrepriseList = ({ entreprises, onDelete, onEdit }) => {
    // États pour la suppression d'entreprise
    const [openConfirm, setOpenConfirm] = useState(false);
    const [entrepriseToDelete, setEntrepriseToDelete] = useState(null);

    // États pour la modale affichant la liste des utilisateurs de l'entreprise sélectionnée
    const [openUsersModal, setOpenUsersModal] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [enterpriseUsers, setEnterpriseUsers] = useState([]);

    // États pour l'édition et la suppression d'utilisateur dans la modale
    const [editingUser, setEditingUser] = useState(null);
    const [openUserForm, setOpenUserForm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [openUserDeleteConfirm, setOpenUserDeleteConfirm] = useState(false);

    // Gestion de la suppression d'entreprise
    const handleOpenConfirm = (entreprise) => {
        setEntrepriseToDelete(entreprise);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setEntrepriseToDelete(null);
        setOpenConfirm(false);
    };

    const handleConfirmDelete = () => {
        if (entrepriseToDelete) {
            onDelete(entrepriseToDelete.id);
            handleCloseConfirm();
        }
    };

    // Chargement de la liste des utilisateurs pour l'entreprise sélectionnée via le nouvel endpoint
    const handleManageUsers = async (entreprise) => {
        setSelectedEnterprise(entreprise);
        try {
            const users = await getUsersByCompanyId(entreprise.id);
            setEnterpriseUsers(users);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des utilisateurs de l'entreprise :",
                error
            );
        }
        setOpenUsersModal(true);
    };

    // Gestion de l'édition d'utilisateur
    const handleEditUser = (user) => {
        setEditingUser(user);
        setOpenUserForm(true);
    };

    // Gestion de la suppression d'utilisateur
    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setOpenUserDeleteConfirm(true);
    };

    const handleConfirmUserDelete = async () => {
        try {
            await deleteUser(userToDelete.id);
            setEnterpriseUsers((prev) =>
                prev.filter((u) => u.id !== userToDelete.id)
            );
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
        setOpenUserDeleteConfirm(false);
        setUserToDelete(null);
    };

    // Colonnes pour le DataGrid des entreprises
    const rows = (entreprises || []).filter(
        (entreprise) => entreprise && entreprise.id
    );

    const columns = [
        { field: "mail", headerName: "Email", flex: 1 },
        { field: "name", headerName: "Nom", flex: 1 },
        { field: "id", headerName: "UUID", flex: 1 },
        {
            field: "adresse",
            headerName: "Adresse",
            flex: 1,
            renderCell: (params) => {
                const addr = params.value;
                return addr && addr.trim().length > 0 ? addr : "N/A";
            },
        },
        {
            field: "abonnement",
            headerName: "Abonnement",
            flex: 1,
            renderCell: (params) => {
                const abo = params.value;
                return abo && abo.trim().length > 0 ? abo : "N/A";
            },
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
                        <IconButton
                            color="secondary"
                            onClick={() => handleManageUsers(params.row)}
                        >
                            <GroupIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleOpenConfirm(params.row)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    // Colonnes pour le DataGrid des utilisateurs dans la modale, incluant les actions
    const userColumns = [
        { field: "email", headerName: "Email", flex: 1 },
        { field: "nom", headerName: "Nom", flex: 1 },
        { field: "prenom", headerName: "Prénom", flex: 1 },
        { field: "typeUtilisateur", headerName: "Type", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditUser(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <>
            {/* DataGrid des entreprises */}
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

            {/* Dialogue de confirmation de suppression d'entreprise */}
            <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">
                    Confirmation de suppression
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Êtes-vous sûr de vouloir supprimer l'entreprise{" "}
                        <strong>{entrepriseToDelete?.name}</strong> ?
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

            {/* Modale affichant la liste des utilisateurs de l'entreprise */}
            <Dialog
                open={openUsersModal}
                onClose={() => setOpenUsersModal(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Utilisateurs de {selectedEnterprise?.name}
                </DialogTitle>
                <DialogContent>
                    {enterpriseUsers.length > 0 ? (
                        <DataGrid
                            rows={enterpriseUsers}
                            columns={userColumns}
                            autoHeight
                            pageSize={5}
                            rowsPerPageOptions={[5, 10]}
                        />
                    ) : (
                        <Typography>
                            Aucun utilisateur trouvé pour cette entreprise.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUsersModal(false)} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogue de confirmation de suppression d'utilisateur */}
            <Dialog
                open={openUserDeleteConfirm}
                onClose={() => setOpenUserDeleteConfirm(false)}
                aria-labelledby="confirm-user-delete-title"
                aria-describedby="confirm-user-delete-description"
            >
                <DialogTitle id="confirm-user-delete-title">
                    Confirmation de suppression
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-user-delete-description">
                        Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                        <strong>
                            {userToDelete?.nom} {userToDelete?.prenom}
                        </strong>{" "}
                        ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUserDeleteConfirm(false)} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmUserDelete} color="error" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Formulaire d'édition d'utilisateur */}
            <UserForm
                onSubmit={(updatedData) => {
                    updateUser(editingUser.id, updatedData)
                        .then((updatedUser) => {
                            setEnterpriseUsers((prevUsers) =>
                                prevUsers.map((user) =>
                                    user.id === updatedUser.id ? updatedUser : user
                                )
                            );
                        })
                        .catch((error) =>
                            console.error("Erreur lors de la modification de l'utilisateur", error)
                        );
                    setOpenUserForm(false);
                    setEditingUser(null);
                }}
                initialData={editingUser}
                open={openUserForm}
                handleClose={() => {
                    setOpenUserForm(false);
                    setEditingUser(null);
                }}
            />
        </>
    );
};

export default EntrepriseList;
