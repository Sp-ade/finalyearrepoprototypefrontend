import React from 'react';
import { Paper, Typography, Divider, TextField, Stack, Button } from '@mui/material';
import { CheckCircle, AssignmentReturn } from '@mui/icons-material';

const ReviewActionCard = ({
    grade, setGrade,
    remark, setRemark,
    onApprove, onRequestChanges,
    loading, disabled
}) => {
    return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#fafafa', border: '1px solid #ddd' }}>
            <Typography variant="h6" gutterBottom>Supervisor Action</Typography>

            <TextField
                label="Grade (e.g. A, B, C, D, E, F)"
                fullWidth
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                sx={{ mb: 2 }}
                disabled={disabled}
            />

            <TextField
                label="Supervisor Remark"
                multiline
                rows={3}
                fullWidth
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter remarks for the project record"
                sx={{ mb: 2 }}
                disabled={disabled}
            />

            <Stack spacing={2}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={onApprove}
                    disabled={loading || disabled}
                >
                    Approve & Upload
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<AssignmentReturn />}
                    onClick={onRequestChanges}
                    disabled={loading || disabled}
                >
                    Request Changes
                </Button>
            </Stack>
        </Paper>
    );
};

export default ReviewActionCard;
