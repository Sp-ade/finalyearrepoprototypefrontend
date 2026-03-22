import React from 'react'
import { Container, Box } from '@mui/material'
import SplashImage from '../assets/Nile-University-of-Nigeria.jpg'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SplashScreen = () => {
  const navigate = useNavigate()
  useEffect(() => {


    // Retrieve user's role to navigate to specified dashboard.
    const fetchUserData = async () => {
      const timer = setTimeout(() => {

        const role = localStorage.getItem('role')
        if (!role) {
          navigate('/login')
        } else if (role === 'student') {
          navigate('/studentdashboard')
        } else if (role === 'supervisor') {
          navigate('/staffdashboard')
        } else if (role === 'admin') {
          navigate('/admindashboard')
        }

      }, 800);
    }

    fetchUserData()
  }, [])
  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundImage: `url(${SplashImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '400px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
          }}
        ></Box>
      </Container>
    </Box>
  )
}

export default SplashScreen