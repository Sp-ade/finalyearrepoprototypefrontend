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
    const [requestMode, setRequestMode] = React.useState('view')
    const { openDialog, reason, submitting, submitRequest, setOpenDialog, setReason, closeDialog } = useAccessRequest()

    const handleSubmitRequest = async () => {
        const success = await submitRequest(project.id || project.project_id, requestMode)
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

    // Only show "Request Edit" if they are the uploader
    const isStudent = localStorage.getItem('role') === 'student'

    const handleOpenRequest = (mode) => {
        setRequestMode(mode)
        setOpenDialog(true)
    }
    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, sm: 4 } }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <Button
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    ← Go Back
                </Button>

                <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                mb: 1,
                                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            {project.title}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
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
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={() => navigate(`/staff/project/edit/${project.id || project.project_id}`)}
                                    sx={{ minWidth: 120 }}
                                >
                                    Edit
                                </Button>
                                <ProjectDelete
                                    projectId={project.id || project.project_id}
                                    projectTitle={project.title}
                                    onDeleteSuccess={() => navigate('/staffbrowse')}
                                />
                            </Box>
                        )}

                        {isStudent && (
                            <>
                                {!project.hasAccess ? (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleOpenRequest('view')}
                                        sx={{
                                            width: { xs: '100%', sm: 'auto' },
                                            px: { xs: 3, sm: 6 },
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
                                ) : (
                                    project.isSubmitter && (
                                        project.editRequestApproved ? (
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={() => navigate('/studentprojectedit', { 
                                                    state: { 
                                                        editMode: true, 
                                                        projectId: project.id || project.project_id,
                                                        submissionId: project.submissionId
                                                    } 
                                                })}
                                                color="success"
                                                sx={{
                                                    width: { xs: '100%', sm: 'auto' },
                                                    px: { xs: 3, sm: 6 },
                                                    py: 1.5,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Edit Project
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                size="large"
                                                onClick={() => handleOpenRequest('edit')}
                                                color="warning"
                                                sx={{
                                                    width: { xs: '100%', sm: 'auto' },
                                                    px: { xs: 3, sm: 6 },
                                                    py: 1.5,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Request Edit Access
                                            </Button>
                                        )
                                    )
                                )}
                            </>
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
                mode={requestMode}
            />
        </Box>
    )
}

export default ProjectView
