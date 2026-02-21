import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Button } from '@mui/material'

const RequestChangesDialog = ({ 
  open, 
  onClose, 
  value, 
  onChange, 
  onSubmit, 
  loading 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request Changes</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe the changes the student needs to make before resubmitting. This feedback will be visible to the student.
        </Typography>
        <TextField
          label="Required Changes"
          multiline
          rows={5}
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Please revise the methodology section and update the references..."
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Send Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RequestChangesDialog
