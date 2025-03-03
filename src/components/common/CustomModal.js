// src/components/common/CustomModal.js
import React from "react";
import { Modal, Paper, Typography, IconButton, Fade, Backdrop } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const StyledModalPaper = styled(Paper)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

const ModalHeader = styled("div")({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
});

const CustomModal = ({ open, handleClose, title, children }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={open}>
                <StyledModalPaper>
                    <ModalHeader>
                        <Typography variant="h5">{title}</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ModalHeader>
                    {children}
                </StyledModalPaper>
            </Fade>
        </Modal>
    );
};

export default CustomModal;
