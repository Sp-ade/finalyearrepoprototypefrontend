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
    CircularProgress
} from '@mui/material'
import ProjectDelete from './ProjectDelete'
// import ProjectsData from '../Projects.json'

const StaffProjectView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:3000/api/projects/${id}`)
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
                        onClick={() => navigate('/staffbrowse')}
                    >
                        ← Back to Browse
                    </Button>
                </Paper>
            </Container>
        )
    }

    const handleRequestEdit = () => {
        // TODO: Implement request edit functionality
        // This could open a modal, navigate to an edit form, or make an API call
        alert(`Edit request submitted for: ${project.title}`)
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Back Button */}
                <Button
                    onClick={() => navigate('/staffbrowse')}
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

                        {/* Attachments - Show all uploaded files */}
                        {(() => {
                            const documents = project.attachments || project.artifacts || []
                            return documents.length > 0 && (
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            color="text.secondary"
                                            sx={{ fontWeight: 600, mb: 2, display: 'block' }}
                                        >
                                            Project Documents
                                        </Typography>
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
                                                            📎 {doc.file_name || doc.fileName || doc.originalName || 'Document'}
                                                        </Typography>
                                                        {doc.uploaded_at && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(doc.uploaded_at).toLocaleDateString()}
                                                            </Typography>
                                                        )}
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            href={doc.file_path || doc.filePath || doc.url}
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
                                    </Box>
                                </Grid>
                            )
                        })()}
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* Request Edit Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
                        <ProjectDelete
                            projectId={project.id || project.project_id}
                            projectTitle={project.title}
                            onDeleteSuccess={() => navigate('/staffbrowse')}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRequestEdit}
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
                            Request Edit
                        </Button>
                    </Box>

                    {/* Info Note */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Request permission to edit project details, documentation, and settings.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default StaffProjectView
