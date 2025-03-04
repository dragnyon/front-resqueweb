import React, { useState } from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
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
import GroupIcon from "@mui/icons-material/Group";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { getUsersByCompanyId, deleteUser, updateUser, createUser } from "../../services/UserService";
import UserForm from "../users/UserForm";
import UserList from "../users/UserList"; // Confirmation centralisée dans UserList
import { getAbonnement, updateAbonnement } from "../../services/AbonnementService";
import AbonnementForm from "../abonnement/AbonnementForm";

const DataGridContainer = styled(Box)(({ theme }) => ({
    height: 500,
    width: "100%",
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

const EntrepriseList = ({ entreprises, onDelete, onEdit, onAdd }) => {
    // États pour la suppression d'entreprise
    const [openConfirm, setOpenConfirm] = useState(false);
    const [entrepriseToDelete, setEntrepriseToDelete] = useState(null);

    // États pour la modale affichant la liste des utilisateurs de l'entreprise sélectionnée
    const [openUsersModal, setOpenUsersModal] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [enterpriseUsers, setEnterpriseUsers] = useState([]);

    // États pour l'édition d'utilisateur (ajout ou modification)
    const [editingUser, setEditingUser] = useState(null);
    const [openUserForm, setOpenUserForm] = useState(false);

    // États pour le formulaire d'abonnement
    const [openAbonnementForm, setOpenAbonnementForm] = useState(false);
    const [editingAbonnement, setEditingAbonnement] = useState(null);

    // État pour afficher le message quand l'entreprise n'a pas d'abonnement
    const [openNoAbonnementDialog, setOpenNoAbonnementDialog] = useState(false);

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

    // Chargement de la liste des utilisateurs pour l'entreprise sélectionnée
    const handleManageUsers = async (entreprise) => {
        setSelectedEnterprise(entreprise);
        try {
            const users = await getUsersByCompanyId(entreprise.id);
            setEnterpriseUsers(users);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs de l'entreprise :", error);
        }
        setOpenUsersModal(true);
    };

    // Fonction pour consulter/modifier l'abonnement via AbonnementForm
    const handleViewAbonnement = async (entreprise) => {
        if (entreprise.abonnement) {
            try {
                const abo = await getAbonnement(entreprise.abonnement);
                setEditingAbonnement(abo);
                setOpenAbonnementForm(true);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'abonnement :", error);
            }
        } else {
            setOpenNoAbonnementDialog(true);
        }
    };

    // Gestion de l'édition d'utilisateur
    const handleEditUser = (user) => {
        setEditingUser(user);
        setOpenUserForm(true);
    };

    // Pour l'ajout d'utilisateur, on laisse editingUser à null
    const handleAddUserForEnterprise = () => {
        setEditingUser(null);
        setOpenUserForm(true);
    };

    // Fonction simple pour supprimer un utilisateur (sans modal ici, confirmation gérée dans UserList)
    const deleteUserForEnterprise = (userId) => {
        return deleteUser(userId)
            .then(() => {
                setEnterpriseUsers((prevUsers) =>
                    prevUsers.filter((u) => u.id !== userId)
                );
            })
            .catch((error) =>
                console.error("Erreur lors de la suppression de l'utilisateur :", error)
            );
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
                        <IconButton color="info" onClick={() => handleViewAbonnement(params.row)}>
                            <InfoIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => onEdit(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleManageUsers(params.row)}>
                            <GroupIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenConfirm(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    // Toolbar intégrée pour la DataGrid des entreprises
    const CustomToolbar = () => (
        <GridToolbarContainer
            sx={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                padding: "8px",
                borderBottom: "1px solid #ccc",
            }}
        >
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="primary" onClick={onAdd} startIcon={<AddIcon />}>
                Ajouter une entreprise
            </Button>
        </GridToolbarContainer>
    );

    return (
        <>
            {/* DataGrid des entreprises avec Toolbar intégrée */}
            <DataGridContainer>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    localeText={localeText}
                    slots={{ toolbar: CustomToolbar }}
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-cell:hover": { color: "primary.main" },
                    }}
                />
            </DataGridContainer>

            {/* Modal de confirmation de suppression d'entreprise */}
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
                        Êtes-vous sûr de vouloir supprimer l'entreprise <strong>{entrepriseToDelete?.name}</strong> ?
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

            {/* Modal pour la gestion des utilisateurs via le composant UserList */}
            <Dialog
                open={openUsersModal}
                onClose={() => setOpenUsersModal(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Utilisateurs de {selectedEnterprise?.name}</DialogTitle>
                <DialogContent>
                    <UserList
                        users={enterpriseUsers}
                        onDelete={deleteUserForEnterprise}  // La confirmation est gérée dans UserList
                        onEdit={handleEditUser}
                        onAdd={handleAddUserForEnterprise}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUsersModal(false)} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal d'édition ou d'ajout d'utilisateur via UserForm */}
            <UserForm
                onSubmit={(userData) => {
                    if (editingUser) {
                        // Mode modification
                        updateUser(editingUser.id, userData)
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
                    } else {
                        // Mode ajout
                        createUser(userData)
                            .then((newUser) => {
                                setEnterpriseUsers((prevUsers) => [...prevUsers, newUser]);
                            })
                            .catch((error) =>
                                console.error("Erreur lors de l'ajout de l'utilisateur", error)
                            );
                    }
                    setOpenUserForm(false);
                    setEditingUser(null);
                }}
                initialData={editingUser}
                defaultEntreprise={selectedEnterprise} // Prérégle l'entreprise pour l'ajout
                open={openUserForm}
                handleClose={() => {
                    setOpenUserForm(false);
                    setEditingUser(null);
                }}
            />

            {/* Modal pour consulter/modifier l'abonnement via AbonnementForm */}
            {openAbonnementForm && (
                <AbonnementForm
                    onSubmit={(updatedAbo) => {
                        updateAbonnement(updatedAbo.id, updatedAbo)
                            .then((updatedData) => {
                                setEditingAbonnement(updatedData);
                            })
                            .catch((error) =>
                                console.error("Erreur lors de la mise à jour de l'abonnement :", error)
                            );
                        setOpenAbonnementForm(false);
                        setEditingAbonnement(null);
                    }}
                    initialData={editingAbonnement}
                    open={openAbonnementForm}
                    handleClose={() => {
                        setOpenAbonnementForm(false);
                        setEditingAbonnement(null);
                    }}
                />
            )}

            {/* Modal pour afficher un message si l'entreprise n'a pas d'abonnement */}
            <Dialog
                open={openNoAbonnementDialog}
                onClose={() => setOpenNoAbonnementDialog(false)}
            >
                <DialogTitle>Aucun abonnement</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Cette entreprise n'a pas d'abonnement.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNoAbonnementDialog(false)} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EntrepriseList;
