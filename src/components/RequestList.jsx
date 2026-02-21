import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, Stack, CircularProgress, Alert } from '@mui/material'
import { useRequestsList } from '../hooks/useRequestsList'
import RequestCard from './common/RequestCard'
import RequestDetailDialog from './common/RequestDetailDialog'

const RequestList = () => {
    const { requests, loading, error, updateRequest } = useRequestsList('supervisor')
    const [selected, setSelected] = useState(null)
    const [open, setOpen] = useState(false)
    const [responseText, setResponseText] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

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
        const success = await updateRequest(selected.request_id, status, responseText)
        setActionLoading(false)
        if (success) {
            handleClose()
        } else {
            alert('Failed to update request status')
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        )
    }
//staff requests
    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, backgroundColor: 'background.default' }}>
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
                            <RequestCard
                                key={req.request_id}
                                request={req}
                                onClick={() => handleOpen(req)}
                                showStudent={true}
                            />
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            <RequestDetailDialog
                open={open}
                onClose={handleClose}
                request={selected}
                mode="review"
                responseText={responseText}
                onResponseChange={setResponseText}
                onApprove={() => handleDecision('Approved')}
                onReject={() => handleDecision('Rejected')}
                loading={actionLoading}
            />
        </Box>
    )
}

export default RequestList