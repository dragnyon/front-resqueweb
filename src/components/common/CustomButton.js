// src/components/common/CustomButton.js
import React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5, 3),
    borderRadius: theme.shape.borderRadius * 2,
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    background: "linear-gradient(45deg, #4b6cb7 30%, #182848 90%)",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
    textTransform: "none",
    transition: "all 0.3s ease-out",

    "&:hover": {
        background: "linear-gradient(45deg, #5a7edc 30%, #1b2c50 90%)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        transform: "translateY(-2px)",
    },

    "&:active": {
        background: "linear-gradient(45deg, #3d5fa3 30%, #121d34 90%)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        transform: "translateY(1px)",
    },
}));

const CustomButton = ({ children, onClick, ...props }) => {
    return (
        <StyledButton onClick={onClick} {...props}>
            {children}
        </StyledButton>
    );
};

export default CustomButton;
