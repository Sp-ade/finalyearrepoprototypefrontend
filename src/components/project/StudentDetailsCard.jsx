import React from 'react';
import { Typography, Divider, Box } from '@mui/material';

const StudentDetailsCard = ({ studentName, studentEmail, submissionDate }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>Student Details</Typography>
            <Typography><strong>Name:</strong> {studentName}</Typography>
            <Typography><strong>Email:</strong> {studentEmail}</Typography>
            <Typography><strong>Submitted:</strong> {new Date(submissionDate).toLocaleDateString()}</Typography>
            <Divider sx={{ my: 3 }} />
        </Box>
    );
};

export default StudentDetailsCard;
