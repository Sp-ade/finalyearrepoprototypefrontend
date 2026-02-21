import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, Container, Divider, CircularProgress } from '@mui/material'
import ProjectDelete from './ProjectDelete'
import API_URL from '../config'
import ProjectDetails from './project/ProjectDetails'
import DocumentList from './project/DocumentList'
import AccessRequestDialog from './project/AccessRequestDialog'

const ProjectView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    // Request Dialog State
    const [openRequestDialog, setOpenRequestDialog] = useState(false);
    const [requestReason, setRequestReason] = useState('');
    const [submittingRequest, setSubmittingRequest] = useState(false);

    useEffect(() => {
        const studentId = localStorage.getItem('userId');
        const url = studentId
            ? `${API_URL}/api/projects/${id}?studentId=${studentId}`
            : `${API_URL}/api/projects/${id}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Project not found')
                return res.json()
            })
            .then(data => {
                setProject(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    const handleOpenRequestDialog = () => setOpenRequestDialog(true);
    const handleCloseRequestDialog = () => {
        setOpenRequestDialog(false);
        setRequestReason('');
    };

    const handleSubmitRequest = async () => {
        const studentId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role');

        if (!studentId) {
            alert('You must be logged in to request access.');
            return;
        }

        if (userRole !== 'student') {
            alert('Only students can request project access.');
            return;
        }

        if (!requestReason.trim()) {
            alert('Please provide a reason for your request.');
            return;
        }

        setSubmittingRequest(true);
        try {
            const response = await fetch(`${API_URL}/api/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: studentId,
                    projectId: project.id || project.project_id,
                    reason: requestReason
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Request submitted successfully!');
                handleCloseRequestDialog();
            } else if (response.status === 409) {
                alert(data.message || 'You have already requested this project.');
                handleCloseRequestDialog();
            } else {
                throw new Error(data.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setSubmittingRequest(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: '50vh', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (!project) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Project Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        The project you're looking for doesn't exist or has been removed.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate(-1)}>
                        ← Go Back
                    </Button>
                </Paper>
            </Container>
        )
    }

    const documents = project.attachments || project.artifacts || [];
    const canViewArtifacts = project.hasAccess || localStorage.getItem('role') !== 'student';

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Button onClick={() => navigate(-1)} sx={{ mb: 3 }}>
                    ← Go Back
                </Button>

                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                            {project.title}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {project.name}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <ProjectDetails project={project} />

                    {canViewArtifacts && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom>Project Documents</Typography>
                            <DocumentList documents={documents} />
                        </Box>
                    )}

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
                        {localStorage.getItem('role') !== 'student' && (
                            <ProjectDelete
                                projectId={project.id || project.project_id}
                                projectTitle={project.title}
                                onDeleteSuccess={() => navigate('/studentbrowse')}
                            />
                        )}

                        {!project.hasAccess && localStorage.getItem('role') === 'student' && (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleOpenRequestDialog}
                                sx={{
                                    px: 6, py: 1.5, fontSize: '1.1rem', fontWeight: 600,
                                    borderRadius: 2, textTransform: 'none', boxShadow: 3,
                                }}
                            >
                                Request Full View
                            </Button>
                        )}
                    </Box>

                    {!canViewArtifacts && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Request full access to view complete project documentation, files, and additional resources.
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Container>

            <AccessRequestDialog
                open={openRequestDialog}
                onClose={handleCloseRequestDialog}
                onSubmit={handleSubmitRequest}
                reason={requestReason}
                setReason={setRequestReason}
                projectTitle={project.title}
                loading={submittingRequest}
            />
        </Box>
    )
}

export default ProjectView;
