import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Paper, Chip, CircularProgress, Alert, Button } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import BadgeIcon from '@mui/icons-material/Badge'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import API_URL from '../config'

const AccountInformation = () => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    if (loading) {
        return (
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 2 }}>Loading account information...</Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        )
    }

    if (!userData) {
        return null
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
        <Paper elevation={1} sx={{ p: '20px 0px 20px 0px', bgcolor: 'white', borderRadius: 0, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Account Information
                </Typography>
                <Chip
                    label={userData.isActive ? 'Active' : 'Inactive'}
                    color={userData.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 2 }}
                />
            </Box>

            <Grid container spacing={2}>
                {/* Full Name */}
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Full Name</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {userData.firstName} {userData.lastName}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Email</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {userData.email}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Role */}
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BadgeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Role</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                {userData.role}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Account Created */}
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Member Since</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {formatDate(userData.createdAt)}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Student-specific fields */}
                {userData.role === 'student' && userData.matricNo && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Matric Number</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {userData.matricNo}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Department</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {userData.department}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </>
                )}

                {/* Supervisor-specific fields */}
                {userData.role === 'supervisor' && userData.staffId && (
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WorkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Staff ID</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {userData.staffId}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button>Edit Account info</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default AccountInformation
