import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const FileUploadSlot = ({ index, file, existingFile, onFileChange, onClear }) => {
    const inputId = `project-file-${index}`;

    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                sx={{
                    border: '2px dashed',
                    borderColor: file ? 'success.main' : 'grey.400',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: file ? 'success.light' : 'grey.50',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                        bgcolor: 'primary.light',
                        borderColor: 'primary.dark',
                    }
                }}
                onClick={() => document.getElementById(inputId).click()}
            >
                <input
                    type="file"
                    id={inputId}
                    accept=".pdf"
                    hidden
                    onChange={(e) => onFileChange(e, index)}
                />
                <CloudUpload sx={{
                    fontSize: 40,
                    color: (file || existingFile) ? 'success.dark' : 'text.secondary',
                    mb: 1
                }} />
                <Typography variant="h6" color={(file || existingFile) ? 'success.dark' : 'text.primary'}>
                    {file ? `✓ Document ${index + 1} Replaced` :
                        existingFile ? `✓ Existing Document ${index + 1} kept` :
                            `Document ${index + 1}: Click to Upload (PDF)`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {file ? `${file.name} (${(file.size / 1024).toFixed(2)} KB)` :
                        existingFile ? `${existingFile.file_name || 'Existing File'}` :
                            'Accepted format: PDF'}
                </Typography>
            </Box>

            {file && (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear(index);
                    }}
                >
                    Clear Document {index + 1}
                </Button>
            )}
        </Box>
    );
};

export default FileUploadSlot;
