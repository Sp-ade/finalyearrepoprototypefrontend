import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Box, Paper, Typography, TextField, Button } from '@mui/material'
import API_URL from '../config'

const AdminLogin = ({ onSwitch }) => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e?.preventDefault()
        setError('')
        if (!userName || !password) {
            setError('Email and password are required')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userName, password })
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body.message || 'Login failed')
            }
            const data = await res.json()
            if (data.token) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('email', userName)
                localStorage.setItem('userId', data.user.id)
                localStorage.setItem('userName', `${data.user.firstName} ${data.user.lastName}`)
                // Store user role for role-based navigation
                if (data.user && data.user.role) {
                    localStorage.setItem('role', data.user.role)
                }
            }
            // Redirect to admin dashboard
            navigate('/admindashboard')
        } catch (err) {
            setError(err.message || 'Login error')
        } finally {
            setLoading(false)
        }
    }

    return (<>
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '70vh', display: 'flex', alignItems: 'center', py: 6 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ display: 'flex', borderRadius: "20px 0px 0px 20px", flexDirection: { xs: 'column', md: 'row' }, minHeight: 420 }}>
                    {/* Left: form */}
                    <Box sx={{ width: '43%' }} component="form" onSubmit={handleSubmit}>
                        <Box sx={{ mb: 2, background: 'linear-gradient(90deg, #ff6b35 0%, #ff8c42 60%)', color: '#fff', p: 2, borderRadius: "20px 1px 1px 1px", height: '40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography sx={{ color: '#ffffff', fontSize: '1.7rem' }}>Admin Login</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', Width: "80%" }}>
                            <Typography>Email</Typography>
                            <TextField label="Email" type="email" size='small' InputLabelProps={{ sx: { fontSize: 'small' } }} fullWidth sx={{ mb: 2, fontSize: 'small' }} value={userName} onChange={(e) => setUserName(e.target.value)} />
                            <Typography>Password</Typography>
                            <TextField label="Password" type="password" size='small' InputLabelProps={{ sx: { fontSize: 'small' } }} fullWidth sx={{ mb: 3 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ background: 'linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%)' }} disabled={loading}>{loading ? 'Signing in…' : 'Log In'}</Button>
                            {error && <Typography sx={{ color: 'red', mt: 1 }}>{error}</Typography>}
                            <br />
                            <Typography sx={{ fontSize: "0.8rem", }}>NOTE: Admin access only</Typography>
                            <br />
                            <Typography sx={{ fontSize: "0.8rem", opacity: "60%" }}>Not an admin? <span onClick={onSwitch} style={{ textDecoration: 'underline', color: 'inherit', cursor: 'pointer' }}>Go back</span></Typography>
                        </Box>
                    </Box>

                    {/* Right: image/design */}
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#ff6b35',
                        color: '#fff',
                        p: 3
                    }}>
                        <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
                            🔐 System Administrator
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    </>
    )
}

export default AdminLogin
