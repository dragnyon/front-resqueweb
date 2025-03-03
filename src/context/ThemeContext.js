import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../theme";

// Création du contexte
export const ThemeContext = createContext();

const ThemeProviderWrapper = ({ children }) => {
    // Récupération de l'état du thème depuis le localStorage
    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? JSON.parse(storedTheme) : false; // false = lightMode par défaut
    };

    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

    // Sauvegarde du thème lorsqu'il change
    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Mémorisation du thème (évite les re-renders inutiles)
    const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Applique le bon fond et les couleurs */}
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProviderWrapper;
