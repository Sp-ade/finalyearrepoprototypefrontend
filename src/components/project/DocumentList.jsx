import React from 'react';
import { Box, Typography, Button } from '@mui/material';
// uploaded Document part of project view
const DocumentList = ({ documents }) => {
    if (!documents || documents.length === 0) {
        return <Typography color="text.secondary">No documents available.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {documents.map((doc, index) => (
                <Box
                    key={doc.artifact_id || doc.id || index}
                    sx={{
                        bgcolor: '#e3f2fd',
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        borderLeft: '4px solid',
                        borderColor: 'info.main'
                    }}
                >
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Document {index + 1}
                    </Typography>
                    <Box sx={{
                        mt: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2
                    }}>
                        <Typography variant="body1" sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
                            📎 {doc.file_name || doc.fileName || 'Unnamed Document'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Recently uploaded'}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            href={doc.file_path || doc.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            View Document
                        </Button>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default DocumentList;
