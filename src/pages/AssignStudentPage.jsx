import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import { useAssignStudent } from '../hooks/useAssignStudent';

const AssignStudentPage = () => {
    const { students, loading, error, setAsLeader } = useAssignStudent();
    const [searchTerm, setSearchTerm] = useState('');
    const [actingStudent, setActingStudent] = useState(null);

    const filteredStudents = students.filter(student => {
        const term = searchTerm.toLowerCase();
        return (
            (student.first_name && student.first_name.toLowerCase().includes(term)) ||
            (student.last_name && student.last_name.toLowerCase().includes(term)) ||
            (student.student_matric_no && student.student_matric_no.toLowerCase().includes(term))
        );
    });

    const handleSetLeader = async (userId) => {
        setActingStudent(userId);
        await setAsLeader(userId);
        setActingStudent(null);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <PageHeader title="Assign Leader Role" showBack={false} />

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    Manage student roles. Only "leader" students can submit final project artifacts.
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search by name or matric number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 300 } }}
                />
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
            )}

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Matric No</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Current Role</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    Loading students...
                                </TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    No students found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id} hover>
                                    <TableCell>{student.first_name} {student.last_name}</TableCell>
                                    <TableCell>{student.student_matric_no}</TableCell>
                                    <TableCell>{student.department}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={student.role === 'leader' ? 'Leader' : 'Member'}
                                            color={student.role === 'leader' ? 'primary' : 'default'}
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant={student.role === 'leader' ? "outlined" : "contained"}
                                            size="small"
                                            disabled={student.role === 'leader' || actingStudent === student.id}
                                            onClick={() => handleSetLeader(student.id)}
                                        >
                                            {actingStudent === student.id ? 'Updating...' : student.role === 'leader' ? 'Already Leader' : 'Set as Leader'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AssignStudentPage;
