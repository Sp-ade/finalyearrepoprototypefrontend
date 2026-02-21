import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, CircularProgress, Alert, Typography, Stack } from '@mui/material'
import StatusChip from './StatusChip'

const SubmissionStatusDialog = ({ 
  open, 
  onClose, 
  loading, 
  status, 
  onEditSubmit 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Project Submission Status</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : status?.error ? (
          <Alert severity="error">{status.error}</Alert>
        ) : !status?.submitted ? (
          <Box textAlign="center" py={2}>
            <Typography gutterBottom>You have not submitted a project yet.</Typography>
            <Button variant="contained" onClick={() => window.location.href = '/studentsubmit'}>
              Propose Project
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              {status.submission.project_title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography>Status:</Typography>
              <StatusChip status={status.submission.status} />
            </Stack>

            {status.submission.status === 'Approved' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <strong>Project Uploaded!</strong> Your project has been approved and is now active.
              </Alert>
            )}

            {status.submission.status === 'Changes Requested' && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <strong>Supervisor Feedback:</strong><br />
                  {status.submission.supervisor_response || 'No feedback provided.'}
                </Alert>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => onEditSubmit(status.submission)}
                >
                  Edit & Resubmit
                </Button>
              </Box>
            )}

            {status.submission.status === 'Pending' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Your submission is currently under review by your supervisor.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubmissionStatusDialog
