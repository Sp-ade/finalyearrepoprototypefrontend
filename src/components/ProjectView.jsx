import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {

    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Chip,
    Container,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField
} from '@mui/material'
import ProjectDelete from './ProjectDelete'
import API_URL from '../config'
//  API_URL from '../config';

const ProjectView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

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

    // Request Dialog State
    const [openRequestDialog, setOpenRequestDialog] = useState(false);
    const [requestReason, setRequestReason] = useState('');
    const [submittingRequest, setSubmittingRequest] = useState(false);

    const handleOpenRequestDialog = () => {
        setOpenRequestDialog(true);
    };

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

        // Prevent supervisors from making requests
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
                headers: {
                    'Content-Type': 'application/json',
                },
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

    // Handle project not found
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
                    <Button
                        variant="contained"
                        onClick={() => navigate('/studentbrowse')}
                    >
                        ← Back to Browse
                    </Button>
                </Paper>
            </Container>
        )
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Back Button */}
                <Button
                    onClick={() => navigate('/studentbrowse')}
                    sx={{ mb: 3 }}
                >
                    ← Back to Browse
                </Button>

                {/* Main Content */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                mb: 2
                            }}
                        >
                            {project.title}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {project.name}
                        </Typography>

                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Project Information Grid */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {/* Year */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Academic Year
                                </Typography>
                                <Typography variant="h6">
                                    {project.year}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Supervisor */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Supervisor
                                </Typography>
                                <Typography variant="h6">
                                    {project.supervisor}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Students Involved */}
                        <Grid item xs={12}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Student(s) Involved ({project.StudentCount})
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {project.Studentnames?.join(', ') || 'No students assigned'}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Description
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8 }}>
                                    {project.description}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Grade */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Grade
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: 'success.main',
                                        fontWeight: 700
                                    }}
                                >
                                    {project.grade}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Tags (Replacing Category) */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Tags
                                </Typography>
                                {project.Tags && project.Tags.length > 0 ? (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                        {project.Tags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body1" sx={{ mt: 1 }}>No tags</Typography>
                                )}
                            </Box>
                        </Grid>

                        {/* Final Remark */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    bgcolor: '#f9f9f9',
                                    p: 3,
                                    borderRadius: 2,
                                    borderLeft: '4px solid',
                                    borderColor: 'primary.main'
                                }}
                            >
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Final Remark
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    "{project.finalRemark}"
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Artifacts Section - Only visible if hasAccess or supervisor */}
                    {(project.hasAccess || localStorage.getItem('role') !== 'student') && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Project Documents
                            </Typography>
                            {(() => {
                                // Support both 'attachments' (new) and 'artifacts' (legacy)
                                const documents = project.attachments || project.artifacts || []

                                return documents.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {documents.map((doc, index) => (
                                            <Box
                                                key={doc.artifact_id || doc.id || index}
                                                sx={{
                                                    bgcolor: '#e3f2fd',
                                                    p: 3,
                                                    borderRadius: 2,
                                                    borderLeft: '4px solid',
                                                    borderColor: 'info.main'
                                                }}
                                            >
                                                <Typography
                                                    variant="overline"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    Document {index + 1}
                                                </Typography>
                                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                    <Typography variant="body1">
                                                        📎 {doc.file_name || doc.fileName || 'Unnamed Document'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Recently uploaded'}
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        href={doc.file_path?.startsWith('http') ? doc.file_path : doc.filePath?.startsWith('http') ? doc.filePath : `http://localhost:3000/${doc.file_path || doc.filePath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ ml: 'auto' }}
                                                    >
                                                        View Document
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary">No documents available.</Typography>
                                )
                            })()}
                        </Box>
                    )}

                    <Divider sx={{ mb: 4 }} />

                    {/* Action Buttons */}
                    {/* Action Buttons */}
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
                                    px: 6,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    boxShadow: 3,
                                }}
                            >
                                Request Full View
                            </Button>
                        )}
                    </Box>

                    {/* Info Note */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Request full access to view complete project documentation, files, and additional resources.
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            {/* Request Dialog */}
            <Dialog open={openRequestDialog} onClose={handleCloseRequestDialog} fullWidth maxWidth="sm">
                <DialogTitle>Request Full Access</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Please explain why you are requesting access to <strong>{project.title}</strong>.
                        This will be sent to the supervisor for approval.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reason"
                        label="Reason for Request"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={requestReason}
                        onChange={(e) => setRequestReason(e.target.value)}
                        placeholder="e.g., I am interested in contributing to this research..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRequestDialog} disabled={submittingRequest}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitRequest} variant="contained" disabled={submittingRequest}>
                        {submittingRequest ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ProjectView
