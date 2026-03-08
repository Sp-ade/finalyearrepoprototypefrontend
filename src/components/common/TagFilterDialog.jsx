import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Chip, Typography, Button } from '@mui/material';

const TagFilterDialog = ({ open, onClose, allTags, selectedTags, onTagClick }) => {
    const [tagSearchQuery, setTagSearchQuery] = useState('');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Filter by Tags</DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    placeholder="Search tags..."
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                    size="small"
                />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {allTags.filter(t => t.toLowerCase().includes(tagSearchQuery.toLowerCase())).map(tag => (
                        <Chip
                            key={tag}
                            label={tag}
                            onClick={() => onTagClick(tag)}
                            sx={{
                                cursor: 'pointer',
                                opacity: selectedTags.includes(tag) ? 0.5 : 1,
                                '&:hover': {
                                    bgcolor: 'primary.light',
                                }
                            }}
                            disabled={selectedTags.includes(tag)}
                            color={selectedTags.includes(tag) ? "primary" : "default"}
                        />
                    ))}
                    {allTags.filter(t => t.toLowerCase().includes(tagSearchQuery.toLowerCase())).length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            No tags found matching "{tagSearchQuery}".
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TagFilterDialog;
