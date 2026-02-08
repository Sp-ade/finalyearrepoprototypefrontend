import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Container, Box, Paper, Typography, TextField, Button, MenuItem, Alert } from '@mui/material'
import API_URL from '../config'

const Signup = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        studentId: '',
        department: '',
        role: searchParams.get('role') || 'student'
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.confirmPassword ||
            !formData.firstName || !formData.lastName || !formData.studentId) {
            setError('All fields are required')
            return false
        }

        if (formData.role === 'student' && !formData.department) {
            setError('Department is required for students')
            return false
        }

        if (!formData.email.endsWith('@nileuniversity.edu.ng')) {
            setError('Email must be from @nileuniversity.edu.ng domain')
            return false
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch('${API_URL}/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role,
                    studentId: formData.studentId,
                    department: formData.department
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed')
            }

            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Signup error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Box sx={{ background: 'linear-gradient(90deg, #1354c5ff 0%, #1262ecff 60%)', color: '#fff', p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Create Account</Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            Sign up for Nile University Project Management
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Account created successfully! Redirecting to login...
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            size="small"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            size="small"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Student/Staff ID"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            size="small"
                            required
                            helperText="Your unique student or staff ID number"
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            size="small"
                            required
                            helperText="Must be @nileuniversity.edu.ng email"
                        />

                        <TextField
                            fullWidth
                            select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            size="small"
                            required
                        >
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                        </TextField>

                        {formData.role === 'student' && (
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                size="small"
                                required
                                helperText="Your department (e.g., Computer Science, Engineering)"
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            size="small"
                            required
                            helperText="At least 6 characters"
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                            size="small"
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                background: 'linear-gradient(90deg, #2dcd45ff 0%, #31ef4eff 100%)',
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                            disabled={loading || success}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{ color: '#1354c5ff', textDecoration: 'underline' }}
                                >
                                    Log in here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default Signup
