import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid
} from '@mui/material'

const RequestList = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  // Response text for the current selected request
  const [responseText, setResponseText] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const supervisorId = localStorage.getItem('userId')
    if (!supervisorId) {
      setError('You must be logged in as a supervisor to view requests')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/requests/supervisor/${supervisorId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch requests')
      }
      const data = await response.json()
      if (data.success) {
        setRequests(data.requests)
      } else {
        setRequests([])
      }
    } catch (err) {
      console.error('Error fetching requests:', err)
      setError('Could not load requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (req) => {
    setSelected(req)
    setResponseText(req.supervisor_response || '')
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelected(null)
    setResponseText('')
  }

  const handleDecision = async (status) => {
    if (!selected) return

    setActionLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/api/requests/${selected.request_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status,
          response: responseText
        })
      })

      if (!res.ok) {
        throw new Error('Failed to update request')
      }

      // Update local state
      const updatedReq = await res.json()
      if (updatedReq.success) {
        setRequests(prev => prev.map(r =>
          r.request_id === selected.request_id
            ? { ...r, status: status, supervisor_response: responseText, reviewed_at: new Date().toISOString() }
            : r
        ))
        handleClose()
      }
    } catch (err) {
      console.error('Error updating request:', err)
      alert('Failed to update request status')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success'
      case 'Rejected': return 'error'
      default: return 'warning' // Pending
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Card sx={{ width: 'min(900px, 95%)', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Student Requests
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage student access requests for your projects.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {!loading && !error && requests.length === 0 && (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              No pending requests found.
            </Typography>
          )}

          <Stack spacing={2}>
            {requests.map((req) => (
              <Card
                key={req.request_id}
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  cursor: 'pointer',
                  borderLeft: `4px solid`,
                  borderLeftColor: req.status === 'Pending' ? 'warning.main' : (req.status === 'Approved' ? 'success.main' : 'error.main'),
                  '&:hover': { bgcolor: 'grey.50' }
                }}
                onClick={() => handleOpen(req)}
              >
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {req.project_title}
                    </Typography>
                    <Typography variant="body2">
                      Student: <strong>{req.student_name}</strong> ({req.student_email})
                    </Typography>
                    <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 0.5 }}>
                      Received: {formatDate(req.requested_at)}
                    </Typography>
                  </Box>

                  <Chip
                    label={req.status}
                    color={getStatusColor(req.status)}
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Review Request</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* Request Info */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Project</Typography>
                  <Typography variant="h6">{selected.project_title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Student</Typography>
                  <Typography>{selected.student_name} ({selected.student_email})</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Reason for Request</Typography>
                  <Typography sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, fontStyle: 'italic' }}>
                    "{selected.request_reason || 'No reason provided'}"
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              {/* Review Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Your Response
                </Typography>
                <TextField
                  placeholder="Add a comment or reason for your decision..."
                  fullWidth
                  multiline
                  minRows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  disabled={selected.status !== 'Pending' || actionLoading}
                />
              </Box>

              {selected.status !== 'Pending' && (
                <Alert severity={selected.status === 'Approved' ? 'success' : 'error'}>
                  This request was {selected.status.toLowerCase()} on {formatDate(selected.reviewed_at)}.
                </Alert>
              )}

            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={actionLoading}>Close</Button>

          {selected && selected.status === 'Pending' && (
            <>
              <Button
                onClick={() => handleDecision('Rejected')}
                variant="outlined"
                color="error"
                disabled={actionLoading}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleDecision('Approved')}
                variant="contained"
                color="success"
                disabled={actionLoading}
              >
                Approve Request
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RequestList