// src/components/common/CustomButton.js
import React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    background: "linear-gradient(45deg, #4b6cb7 30%, #182848 90%)",
    boxShadow: "0 3px 5px 2px rgba(25,118,210,0.3)",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
    },
    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-75%",
        width: "50%",
        height: "100%",
        background: "rgba(255,255,255,0.2)",
        transform: "skewX(-25deg)",
        transition: "left 0.5s ease-in-out",
    },
    "&:hover::after": {
        left: "125%",
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
