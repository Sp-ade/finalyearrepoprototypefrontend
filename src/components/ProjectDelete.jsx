import React, { useState } from 'react';
import {
import API_URL from '../config'
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config'

const ProjectDelete = ({ projectId, projectTitle, onDeleteSuccess }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete project');
            }

            const data = await res.json();

            if (data.success) {
                setOpen(false);
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                } else {
                    navigate('/studentbrowse'); // Fallback navigation
                }
            } else {
                throw new Error(data.message || 'Deletion failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert(`Error deleting project: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tooltip title="Delete Project">
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleClickOpen}
                    sx={{
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                            bgcolor: 'error.light',
                            borderColor: 'error.dark',
                            color: 'error.dark'
                        }
                    }}
                >
                    Delete Project
                </Button>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Project?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete <strong>{projectTitle}</strong>?
                        <br /><br />
                        This action cannot be undone. All associated files and data will be permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} disabled={loading} color="error" autoFocus>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProjectDelete;
