import React from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    DialogContentText, TextField, DialogActions, Button
} from '@mui/material';
//Dialog box when student requests access to a project
const AccessRequestDialog = ({
    open, onClose, onSubmit,
    reason, setReason, projectTitle, loading, mode = 'view'
}) => {
    const isEdit = mode === 'edit';

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit ? 'Request Project Edit Access' : 'Request Full Access'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {isEdit 
                        ? `Please explain what changes you need to make to `
                        : `Please explain why you are requesting access to `}
                    <strong>{projectTitle}</strong>.
                    This will be sent to the supervisor for approval.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="reason"
                    label="Reason for Request"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., I am interested in contributing to this research..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={onSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AccessRequestDialog;
