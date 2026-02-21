import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, Container, Divider, CircularProgress } from '@mui/material'
import { useProjectView } from '../hooks/useProjectView'
import { useAccessRequest } from '../hooks/useAccessRequest'
import ProjectDelete from './ProjectDelete'
import ProjectDetails from './project/ProjectDetails'
import DocumentList from './project/DocumentList'
import AccessRequestDialog from './project/AccessRequestDialog'

const ProjectView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { project, loading } = useProjectView(id)
    const { openDialog, reason, submitting, submitRequest, setOpenDialog, setReason, closeDialog } = useAccessRequest()

    const handleSubmitRequest = async () => {
        const success = await submitRequest(project.id || project.project_id)
        if (success) {
            closeDialog()
        }
    }

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

    const documents = project.attachments || project.artifacts || []
    const canViewArtifacts = project.hasAccess || localStorage.getItem('role') !== 'student'

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
                                onClick={() => setOpenDialog(true)}
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
                open={openDialog}
                onClose={closeDialog}
                onSubmit={handleSubmitRequest}
                reason={reason}
                setReason={setReason}
                projectTitle={project.title}
                loading={submitting}
            />
        </Box>
    )
}

export default ProjectView
