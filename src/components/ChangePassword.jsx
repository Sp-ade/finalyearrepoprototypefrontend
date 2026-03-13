import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Paper, Chip, CircularProgress, Alert, Button, TextField, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import BadgeIcon from '@mui/icons-material/Badge'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LockIcon from '@mui/icons-material/Lock'
import API_URL from '../config'

const EditAccount = () => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            const email = localStorage.getItem('email')
            if (!email) {
                setError('No email found in session')
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`${API_URL}/api/me?email=${encodeURIComponent(email)}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch user data')
                }
                const data = await response.json()
                setUserData(data)
            } catch (err) {
                console.error('Error fetching user data:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswords(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (passwords.newPassword.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        setSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/api/update-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: userData.email,
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to update password')
            }

            setSuccess('Password updated successfully!')
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Change your password
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Grid container spacing={3}>
                    {/* Read-only Information Section */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                            Account Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon sx={{ color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Full Name</Typography>
                                        <Typography variant="body1">{userData.firstName} {userData.lastName}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon sx={{ color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Email</Typography>
                                        <Typography variant="body1">{userData.email}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BadgeIcon sx={{ color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Role</Typography>
                                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{userData.role}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Member Since</Typography>
                                        <Typography variant="body1">{formatDate(userData.createdAt)}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            {userData.role === 'student' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SchoolIcon sx={{ color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Matric No</Typography>
                                                <Typography variant="body1">{userData.matricNo}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SchoolIcon sx={{ color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Department</Typography>
                                                <Typography variant="body1">{userData.department}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </>
                            )}

                            {userData.role === 'supervisor' && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <WorkIcon sx={{ color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Staff ID</Typography>
                                            <Typography variant="body1">{userData.staffId}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Change Password Section */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                            Change Password
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={submitting}
                                        startIcon={submitting ? <CircularProgress size={20} /> : <LockIcon />}
                                    >
                                        Update Password
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(-1)}
                                        disabled={submitting}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default EditAccount
