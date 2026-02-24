import React, { useState } from 'react'
import { Box, Container, Paper, Typography, TextField, Button, Alert } from '@mui/material'
import API_URL from './config'

const VerifyTest = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [testLoading, setTestLoading] = useState(false)
    const [testMessage, setTestMessage] = useState('')

    const handleVerify = async () => {
        setError('')
        setMessage('')
        if (!email) {
            setError('Please enter an email address')
            return
        }
        setLoading(true)
        try {
            // endpoint is mounted at /api (no /auth prefix in backend)
            const res = await fetch(`${API_URL}/api/force-verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            // attempt to parse JSON only when appropriate
            let data
            const contentType = res.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
                data = await res.json()
            } else {
                const text = await res.text()
                throw new Error(`Unexpected server response: ${text.slice(0,200)}`)
            }

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Failed to verify')
            }
            setMessage(`User ${email} marked verified`)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSendTestEmail = async () => {
        setError('')
        setTestMessage('')
        if (!email) {
            setError('Please enter an email address')
            return
        }
        setTestLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/send-test-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const contentType = res.headers.get('content-type') || ''
            let data
            if (contentType.includes('application/json')) data = await res.json()
            else data = { message: await res.text() }

            if (!res.ok) throw new Error(data.error || data.message || 'Failed to send test email')
            setTestMessage(`Test email sent to ${email}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setTestLoading(false)
        }
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ borderRadius: '20px', p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                        Verify Existing Email
                    </Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleVerify}
                        disabled={loading}
                        sx={{ mb: 1 }}
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleSendTestEmail}
                        disabled={testLoading}
                    >
                        {testLoading ? 'Sending...' : 'Send Test Email'}
                    </Button>
                    {testMessage && <Alert severity="success" sx={{ mt: 2 }}>{testMessage}</Alert>}
                </Paper>
            </Container>
        </Box>
    )
}

export default VerifyTest
