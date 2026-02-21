import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Chip, TextField, Box, Alert, Divider } from '@mui/material'
import { getStatusColor, formatDate } from '../../hooks/useRequestsList'

const RequestDetailDialog = ({ 
  open, 
  onClose, 
  request, 
  mode = 'view',
  responseText = '',
  onResponseChange,
  onApprove,
  onReject,
  onDelete,
  loading = false
}) => {
  const isStudent = mode === 'view'
  const isPending = request?.status === 'Pending'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isStudent ? 'Request Details' : 'Review Request'}
      </DialogTitle>
      <DialogContent dividers>
        {request && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Project</Typography>
                <Typography variant="h6">{request.project_title}</Typography>
              </Grid>

              {mode === 'review' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Student</Typography>
                  <Typography>{request.student_name} ({request.student_email})</Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={request.status}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  {isStudent ? 'Date Sent' : 'Date Received'}
                </Typography>
                <Typography>{formatDate(request.requested_at)}</Typography>
              </Grid>

              {!isStudent && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Supervisor</Typography>
                  <Typography>{request.supervisor_name}</Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  {isStudent ? 'My Reason' : 'Reason for Request'}
                </Typography>
                <Typography sx={{ bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                  {request.request_reason || 'No reason provided'}
                </Typography>
              </Grid>

              {mode === 'review' && isPending && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Your Response
                    </Typography>
                    <TextField
                      placeholder="Add a comment or reason for your decision..."
                      fullWidth
                      multiline
                      minRows={3}
                      value={responseText}
                      onChange={(e) => onResponseChange(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                </>
              )}

              {!isPending && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Supervisor Response</Typography>
                  <Typography sx={{ bgcolor: request.supervisor_response ? 'info.light' : 'grey.100', p: 1, borderRadius: 1 }}>
                    {request.supervisor_response || 'No response yet'}
                  </Typography>
                </Grid>
              )}

              {!isPending && mode === 'review' && (
                <Grid item xs={12}>
                  <Alert severity={request.status === 'Approved' ? 'success' : 'error'}>
                    This request was {request.status.toLowerCase()} on {formatDate(request.reviewed_at)}.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>

        {mode === 'view' && request?.status === 'Pending' && (
          <Button
            onClick={onDelete}
            color="error"
            disabled={loading}
          >
            Cancel Request
          </Button>
        )}

        {mode === 'review' && request?.status === 'Pending' && (
          <>
            <Button
              onClick={onReject}
              variant="outlined"
              color="error"
              disabled={loading}
            >
              Reject
            </Button>
            <Button
              onClick={onApprove}
              variant="contained"
              color="success"
              disabled={loading}
            >
              Approve Request
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default RequestDetailDialog
