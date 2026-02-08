import React, { useState, useEffect } from 'react';
import {
import API_URL from '../config'
    Box,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config'

const TagManagement = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState({ open: false, tag: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, tag: null });
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await fetch('${API_URL}/api/admin/tags', {
                headers: {
                    'x-user-role': 'admin'
                }
            });
            const data = await response.json();
            if (data.success) {
                setTags(data.tags);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tag) => {
        setEditDialog({ open: true, tag });
        setNewName(tag.name);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/tags/${editDialog.tag.tag_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': 'admin'
                },
                body: JSON.stringify({ name: newName })
            });

            const data = await response.json();
            if (data.success) {
                fetchTags();
                setEditDialog({ open: false, tag: null });
            }
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };

    const handleDelete = (tag) => {
        setDeleteDialog({ open: true, tag });
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/tags/${deleteDialog.tag.tag_id}`, {
                method: 'DELETE',
                headers: {
                    'x-user-role': 'admin'
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchTags();
                setDeleteDialog({ open: false, tag: null });
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Back Button */}
                <Button onClick={() => navigate('/admindashboard')} sx={{ mb: 3 }}>
                    ← Back to Dashboard
                </Button>

                {/* Header */}
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Tag Management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage all tags in the system
                </Typography>

                {/* Tags Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Tag Name</strong></TableCell>
                                <TableCell><strong>Usage Count</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <TableRow key={tag.tag_id}>
                                        <TableCell>
                                            <Chip label={tag.name} color="primary" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            {tag.usage_count} project{tag.usage_count !== 1 ? 's' : ''}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(tag)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(tag)}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        <Typography color="text.secondary">No tags found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Dialog */}
                <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, tag: null })}>
                    <DialogTitle>Edit Tag</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Tag Name"
                            fullWidth
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialog({ open: false, tag: null })}>Cancel</Button>
                        <Button onClick={handleSaveEdit} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, tag: null })}>
                    <DialogTitle>Delete Tag</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete the tag "<strong>{deleteDialog.tag?.name}</strong>"?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            This will remove the tag from all {deleteDialog.tag?.usage_count} project(s).
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog({ open: false, tag: null })}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default TagManagement;
