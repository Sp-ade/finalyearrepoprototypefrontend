import React from 'react';
import { Typography, Divider, Box } from '@mui/material';
//This is the part in the studentprojectvalidation(where supervisor validates) that shows ownership
const StudentDetailsCard = ({ studentName, studentEmail, submissionDate, studentsInvolved }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>Student Details</Typography>
            <Typography><strong>Submitted By:</strong> {studentName}</Typography>
            <Typography><strong>Email:</strong> {studentEmail}</Typography>
            <Typography><strong>Submitted:</strong> {new Date(submissionDate).toLocaleDateString()}</Typography>
            {studentsInvolved && studentsInvolved.length > 0 && (
                <Typography sx={{ mt: 1 }}>
                    <strong>All Students:</strong> {studentsInvolved.join(', ')}
                </Typography>
            )}
            <Divider sx={{ my: 3 }} />
        </Box>
    );
};

export default StudentDetailsCard;
