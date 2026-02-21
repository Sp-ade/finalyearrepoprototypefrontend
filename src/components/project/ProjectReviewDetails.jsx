import React from 'react';
import { Typography, Stack, Chip, Button } from '@mui/material';
import { Download } from '@mui/icons-material';

const ProjectReviewDetails = ({ project }) => {
    return (
        <>
            <Typography variant="h5" gutterBottom>{project.title}</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Chip label={project.category} variant="outlined" />
                <Chip label={project.year} variant="outlined" />
            </Stack>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>Description</Typography>
            <Typography paragraph sx={{ whiteSpace: 'pre-wrap' }}>{project.description}</Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>Attachments</Typography>
            <Stack spacing={1}>
                {project.attachments && project.attachments.length > 0 ? (
                    project.attachments.map((file, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            startIcon={<Download />}
                            href={file.file_path || file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ justifyContent: 'flex-start' }}
                        >
                            {file.file_name || file.original_name || `Document ${index + 1}`}
                        </Button>
                    ))
                ) : (
                    <Typography color="text.secondary">No attachments found.</Typography>
                )}
            </Stack>
        </>
    );
};

export default ProjectReviewDetails;
