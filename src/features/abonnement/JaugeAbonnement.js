import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography, useTheme } from '@mui/material';

const AnimatedCircularProgress = ({ value, size = 140, thickness = 6 }) => {
    const [progress, setProgress] = useState(0);
    const theme = useTheme();

    // Animation simple : le pourcentage évolue progressivement
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(value);
        }, 500);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={progress}
                size={size}
                thickness={thickness}
                sx={{
                    color: theme.palette.primary.light,
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                        transition: 'stroke-dashoffset 1.0s ease-in-out'
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6" component="div" color="text.primary">
                    {Math.round(progress)}%
                </Typography>
            </Box>
        </Box>
    );
};

const JaugeAbonnementCircular = ({ dateDebut, dateFin }) => {
    const dDebut = new Date(dateDebut);
    const dFin = new Date(dateFin);
    const now = new Date();

    // Calcul du nombre total de jours de l'abonnement
    const totalDays = Math.ceil((dFin - dDebut) / (1000 * 60 * 60 * 24));
    // Calcul des jours restants (au moins 0)
    const daysRemaining = Math.max(0, Math.ceil((dFin - now) / (1000 * 60 * 60 * 24)));
    // Calcul du pourcentage (la jauge est pleine quand tous les jours sont restants)
    const progress = (daysRemaining / totalDays) * 100;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <AnimatedCircularProgress value={progress} />
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'medium' }}>
                Il vous reste {daysRemaining} jours d'abonnement
            </Typography>
        </Box>
    );
};

export default JaugeAbonnementCircular;
