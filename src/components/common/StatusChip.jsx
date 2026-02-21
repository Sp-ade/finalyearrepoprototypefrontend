import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status, sx = {} }) => {
    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'approved' || s === 'active') return 'success';
        if (s === 'pending') return 'info';
        if (s === 'changes requested' || s === 'rejected') return 'warning';
        return 'default';
    };

    return (
        <Chip
            label={status}
            color={getStatusColor(status)}
            sx={{ fontWeight: 'medium', ...sx }}
        />
    );
};

export default StatusChip;
