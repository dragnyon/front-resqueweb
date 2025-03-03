import { createTheme } from "@mui/material/styles";

// 🎨 Thème clair
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#4b6cb7",
        },
        secondary: {
            main: "#182848",
        },
        background: {
            default: "#ffffff",
            paper: "#f5f5f5",
        },
        text: {
            primary: "#000000",
        },
    },
});

// 🌙 Thème sombre
export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#ffffff",
        },
    },
});
