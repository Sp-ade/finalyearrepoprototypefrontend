import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, Stack, CircularProgress, Alert } from '@mui/material'
import { useRequestsList } from '../hooks/useRequestsList'
import RequestCard from './common/RequestCard'
import RequestDetailDialog from './common/RequestDetailDialog'

const StudentRequestList = () => {
    const { requests, loading, error, deleteRequest } = useRequestsList('student')
    const [selected, setSelected] = useState(null)
    const [open, setOpen] = useState(false)

    const handleOpen = (req) => {
        setSelected(req)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelected(null)
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            const success = await deleteRequest(selected.request_id)
            if (success) {
                handleClose()
            } else {
                alert('Failed to cancel request')
            }
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, backgroundColor: 'background.default' }}>
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
                            <RequestCard
                                key={req.request_id}
                                request={req}
                                onClick={() => handleOpen(req)}
                                showStudent={false}
                            />
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            <RequestDetailDialog
                open={open}
                onClose={handleClose}
                request={selected}
                mode="view"
                onDelete={handleDelete}
            />
        </Box>
    )
}

export default StudentRequestList
