import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography, useTheme } from '@mui/material';

const AnimatedCircularProgress = ({ value, size = 140, thickness = 6 }) => {
    const [progress, setProgress] = useState(0);
    const theme = useTheme();

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

const JaugeUtilisateurs = ({ nbUtilisateurs, utilisateursActuels }) => {
    const progress = (utilisateursActuels / nbUtilisateurs) * 100;
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <AnimatedCircularProgress value={progress} />
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'medium' }}>
                {utilisateursActuels} sur {nbUtilisateurs} utilisateurs utilisés
            </Typography>
        </Box>
    );
};

export default JaugeUtilisateurs;
