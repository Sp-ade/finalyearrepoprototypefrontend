import React, { useState, useEffect } from 'react'
import {
import API_URL from '../config'
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
    Grid,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material'

const StudentRequestList = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selected, setSelected] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fetchRequests = async () => {
            const studentId = localStorage.getItem('userId')
            if (!studentId) {
                setError('You must be logged in to view requests')
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`http://localhost:3000/api/requests/student/${studentId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch requests')
                }
                const data = await response.json()
                if (data.success) {
                    setRequests(data.requests)
                } else {
                    // If no success flag but maybe just array? 
                    // Based on controller it returns { success: true, requests: [...] }
                    setRequests([])
                }
            } catch (err) {
                console.error('Error fetching requests:', err)
                setError('Could not load your requests. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    const handleOpen = (req) => {
        setSelected(req)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelected(null)
    }

    const handleDeleteRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) return

        try {
            const response = await fetch(`http://localhost:3000/api/requests/${requestId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setRequests(requests.filter(r => r.request_id !== requestId))
                handleClose()
            } else {
                alert('Failed to cancel request')
            }
        } catch (err) {
            console.error('Error deleting request:', err)
            alert('Error deleting request')
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
                        My Requests
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {!loading && !error && requests.length === 0 && (
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                            You haven't made any project requests yet.
                        </Typography>
                    )}

                    <Stack spacing={2}>
                        {requests.map((req) => (
                            <Card
                                key={req.request_id}
                                variant="outlined"
                                sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
                                onClick={() => handleOpen(req)}
                            >
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {req.project_title || 'Untitled Project'}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            Supervisor: {req.supervisor_name || 'Unknown'}
                                        </Typography>

                                        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                                            Status: <Typography component="span" fontWeight="bold" color={getStatusColor(req.status)}>{req.status}</Typography>
                                        </Typography>

                                        <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 0.5 }}>
                                            Sent: {formatDate(req.requested_at)}
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
                <DialogTitle>Request Details</DialogTitle>
                <DialogContent dividers>
                    {selected && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Project</Typography>
                                    <Typography variant="h6">{selected.project_title}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={selected.status}
                                        color={getStatusColor(selected.status)}
                                        size="small"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Date Sent</Typography>
                                    <Typography>{formatDate(selected.requested_at)}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Supervisor</Typography>
                                    <Typography>{selected.supervisor_name}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">My Reason</Typography>
                                    <Typography sx={{ bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                                        {selected.request_reason || 'No reason provided'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Supervisor Response</Typography>
                                    <Typography sx={{ bgcolor: selected.supervisor_response ? 'info.light' : 'grey.100', p: 1, borderRadius: 1 }}>
                                        {selected.supervisor_response || 'No response yet'}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    {selected && selected.status === 'Pending' && (
                        <Button
                            onClick={() => handleDeleteRequest(selected.request_id)}
                            color="error"
                        >
                            Cancel Request
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default StudentRequestList
