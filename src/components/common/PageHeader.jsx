import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, showBack = true, onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            {showBack && (
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 2, textTransform: 'none' }}
                >
                    Back
                </Button>
            )}
            <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body1" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default PageHeader;
