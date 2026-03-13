import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button,
  Checkbox, FormControlLabel, CircularProgress, Alert
} from '@mui/material';
import logo from '../../assets/Nile-University-of-Nigeria.jpg';
import API_URL from '../../config';

const StudentLogin = ({ onSetType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid student credentials');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', data.user.role);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: { xs: '#fff', sm: 'radial-gradient(circle at center, #ffffff 0%, #d4e1f5 100%)' },
      p: { xs: 0, sm: 2 }
    }}>
      <Paper elevation={0} sx={{
        p: { xs: 4, sm: 5 },
        width: '100%',
        maxWidth: 450,
        borderRadius: { xs: 0, sm: 6 },
        border: { xs: 'none', sm: '1px solid #eef2f6' },
        textAlign: 'center'
      }}>
        <Box component="img" src={logo} sx={{ width: 80, mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#000', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Nile Project Archive</Typography>
        <Typography variant="body2" sx={{ color: '#718096', mb: 3, fontSize: '0.9rem' }}>Secure Access to Projects</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700, color: '#000', fontSize: '0.9rem' }}>School Email</Typography>
          <TextField
            fullWidth
            placeholder="e.g. 2022xxxx@nileuniversity.edu.ng"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f7f9fc', '& fieldset': { borderColor: '#e2e8f0' } }
            }}
          />

          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700, color: '#000', fontSize: '0.9rem' }}>Password</Typography>
          <TextField
            fullWidth
            type="password"
            placeholder="••••••••"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f7f9fc', '& fieldset': { borderColor: '#e2e8f0' } }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControlLabel
              control={<Checkbox size="small" sx={{ color: '#cbd5e0' }} />}
              label={<Typography variant="body2" sx={{ color: '#1a202c', fontWeight: 500, fontSize: '0.85rem' }}>Remember me</Typography>}
            />
            <Link to="/reset-password" style={{ textDecoration: 'none', color: '#2b4593', fontWeight: 600, fontSize: '0.85rem' }}>Forgot Password</Link>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.2,
              borderRadius: 2,
              bgcolor: '#2b4593',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              mb: 2,
              '&:hover': { bgcolor: '#1e3066' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Log in'}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box sx={{ mt: 2 }}>
          <Typography onClick={() => onSetType('staff')} sx={{ color: '#2b4593', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
            Are you a staff? Click here
          </Typography>
          <Typography sx={{ color: '#718096', mt: 2, fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#2b4593', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentLogin;
