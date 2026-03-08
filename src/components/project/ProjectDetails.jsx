import React from 'react';
import { Grid, Box, Typography, Chip } from '@mui/material';
//Details placed on projectView
const ProjectDetails = ({ project }) => {
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Year */}
            <Grid item xs={12} sm={6}>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Academic Year
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{project.year}</Typography>
                </Box>
            </Grid>

            {/* Supervisor */}
            <Grid item xs={12} sm={6}>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Supervisor
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{project.supervisor || project.supervisor_name}</Typography>
                </Box>
            </Grid>

            {/* Students Involved */}
            <Grid item xs={12}>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
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
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Description
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8 }}>
                        {project.description}
                    </Typography>
                </Box>
            </Grid>

            {/* Grade */}
            <Grid item xs={12} sm={6}>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Grade
                    </Typography>
                    <Typography variant="h4" sx={{
                        color: 'success.main',
                        fontWeight: 700,
                        fontSize: { xs: '1.75rem', sm: '2.125rem' }
                    }}>
                        {project.grade}
                    </Typography>
                </Box>
            </Grid>

            {/* Tags */}
            <Grid item xs={12} sm={6}>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Tags
                    </Typography>
                    {project.Tags && project.Tags.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            {project.Tags.map((tag, index) => (
                                <Chip key={index} label={tag} color="primary" variant="outlined" size="small" />
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 1 }}>No tags</Typography>
                    )}
                </Box>
            </Grid>

            {/* Final Remark */}
            {project.supervisor_remark && (
                <Grid item xs={12}>
                    <Box sx={{
                        bgcolor: '#f9f9f9',
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        borderLeft: '4px solid',
                        borderColor: 'primary.main'
                    }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Supervisor Remark
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            "{project.supervisor_remark}"
                        </Typography>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default ProjectDetails;
