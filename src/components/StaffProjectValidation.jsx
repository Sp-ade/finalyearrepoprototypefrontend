import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, CircularProgress, Stack, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../config';
import PageHeader from './common/PageHeader';
import StatusChip from './common/StatusChip';
import ProjectReviewDetails from './project/ProjectReviewDetails';
import ReviewActionCard from './project/ReviewActionCard';
import StudentDetailsCard from './project/StudentDetailsCard';

const StaffProjectValidation = () => {
    const { id: submissionId } = useParams();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState(null);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // For Approve flow
    const [supervisorResponse, setSupervisorResponse] = useState('');
    const [grade, setGrade] = useState('');

    // For Request Changes dialog
    const [changesDialogOpen, setChangesDialogOpen] = useState(false);
    const [changesResponse, setChangesResponse] = useState('');

    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subRes = await fetch(`${API_URL}/api/submissions`);
                const subData = await subRes.json();
                const foundSub = subData.find(s => s.submission_id.toString() === submissionId);

                if (foundSub) {
                    setSubmission(foundSub);
                    const projRes = await fetch(`${API_URL}/api/projects/${foundSub.project_id}`);
                    const projData = await projRes.json();
                    setProject(projData);
                    if (projData.grade && projData.grade !== 'Pending') {
                        setGrade(projData.grade);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [submissionId]);

    const handleReview = async (status, responseText) => {
        if (status === 'Approved' && !grade) {
            setNotification({ open: true, message: 'Please provide a grade before approving.', severity: 'warning' });
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/submissions/${submissionId}/review`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    supervisor_response: responseText || supervisorResponse,
                    grade
                })
            });

            if (response.ok) {
                setNotification({ open: true, message: `Submission ${status} successfully`, severity: 'success' });
                setTimeout(() => navigate(-1), 1500);
            } else {
                throw new Error('Failed to update submission');
            }
        } catch (error) {
            setNotification({ open: true, message: error.message, severity: 'error' });
        } finally {
            setActionLoading(false);
            setChangesDialogOpen(false);
        }
    };

    const handleSubmitChanges = () => {
        if (!changesResponse.trim()) {
            setNotification({ open: true, message: 'Please describe the required changes.', severity: 'error' });
            return;
        }
        handleReview('Changes Requested', changesResponse);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (!submission || !project) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Submission not found.</Typography>;

    const isApproved = submission.status === 'Approved';

    return (
        <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '90vh' }}>
            <Paper sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                    <PageHeader title="Project Validation" showBack={true} />
                    <StatusChip status={submission.status} sx={{ mt: 1 }} />
                </Stack>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <ProjectReviewDetails project={project} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StudentDetailsCard
                            studentName={`${submission.student_first_name} ${submission.student_last_name}`}
                            studentEmail={submission.student_email}
                            submissionDate={submission.requested_at}
                        />

                        <ReviewActionCard
                            grade={grade} setGrade={setGrade}
                            remark={supervisorResponse} setRemark={setSupervisorResponse}
                            onApprove={() => handleReview('Approved', supervisorResponse)}
                            onRequestChanges={() => setChangesDialogOpen(true)}
                            loading={actionLoading}
                            disabled={isApproved}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Dialog open={changesDialogOpen} onClose={() => setChangesDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Changes</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Describe the changes the student needs to make before resubmitting. This feedback will be visible to the student.
                    </Typography>
                    <TextField
                        label="Required Changes"
                        multiline
                        rows={5}
                        fullWidth
                        value={changesResponse}
                        onChange={(e) => setChangesResponse(e.target.value)}
                        placeholder="e.g. Please revise the methodology section and update the references..."
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChangesDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleSubmitChanges}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Submitting...' : 'Send Feedback'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default StaffProjectValidation;
