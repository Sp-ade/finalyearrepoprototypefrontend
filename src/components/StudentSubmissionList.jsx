import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Container,
    CircularProgress,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const StudentSubmissionList = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    //remember to make a component to check role
    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            // In a real app, you'd properly handle auth tokens here
            const response = await fetch(`${API_URL}/api/submissions`);
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'error';
            case 'Changes Requested': return 'warning';
            default: return 'info'; // Pending
        }
    };

    const filteredSubmissions = filter === 'All'
        ? submissions
        : submissions.filter(s => s.status === filter);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom color="primary">
                    Student Submissions
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Review and validate project proposals from students.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {['All', 'Pending', 'Approved', 'Changes Requested'].map((status) => (
                        <Chip
                            key={status}
                            label={status}
                            onClick={() => setFilter(status)}
                            color={filter === status ? 'primary' : 'default'}
                            variant={filter === status ? 'filled' : 'outlined'}
                            clickable
                        />
                    ))}
                </Stack>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Student Name</strong></TableCell>
                                <TableCell><strong>Project Title</strong></TableCell>
                                <TableCell><strong>Submitted At</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map((sub) => (
                                    <TableRow key={sub.submission_id} hover>
                                        <TableCell>
                                            {sub.student_first_name} {sub.student_last_name}
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {sub.student_email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{sub.project_title}</TableCell>
                                        <TableCell>
                                            {new Date(sub.requested_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={sub.status}
                                                color={getStatusColor(sub.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => navigate(`/staffprojectvalidation/${sub.submission_id}`)}
                                            >
                                                Review
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No submissions found for this filter.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default StudentSubmissionList;
