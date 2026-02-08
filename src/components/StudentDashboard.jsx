import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Card, CardContent, Button, Stack } from '@mui/material'
import AccountInformation from './AccountInformation'
import heroimage from '../assets/Nile-University-Matriculation-Ceremony.jpg'


const StudentDashboard = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Retrieve user's email from localStorage and fetch user data from backend
    const fetchUserData = async () => {
      const email = localStorage.getItem('email')
      if (!email) return

      try {
        const response = await fetch(`http://localhost:3000/api/me?email=${encodeURIComponent(email)}`)
        if (response.ok) {
          const userData = await response.json()
          setFirstName(userData.firstName || '')
          setLastName(userData.lastName || '')
          setUserId(userData.id)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    // Fetch pending requests count when userId is available
    const fetchPendingRequests = async () => {
      if (!userId) return

      try {
        const response = await fetch(`http://localhost:3000/api/requests/student/${userId}`)
        if (response.ok) {
          const data = await response.json()
          // Filter requests with 'pending' status (case-insensitive)
          const pendingCount = data.requests.filter(req => req.status?.toLowerCase() === 'pending').length
          setPendingRequestsCount(pendingCount)
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error)
      }
    }

    fetchPendingRequests()
  }, [userId])

  const stats = [
    { label: 'Projects status', value: "Your project has been submitted" },
    { label: 'Pending requests made', value: pendingRequestsCount },
    { label: 'null for now', value: "null" },
  ]


  return (
    <Box sx={{ p: 0, }}>
      <Box
        sx={{
          width: '100vw',
          height: '35vh',
          backgroundImage: `url(${heroimage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'common.white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
        }}
      >
        <Typography variant="h4" component="h1">
          Hello {firstName} {lastName}
        </Typography>
      </Box>


      <Box sx={{ mt: 2 }}>
        <AccountInformation />
      </Box>

      <Grid container spacing={2} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card variant="outlined" sx={{ minHeight: 100, display: 'flex', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {s.label}:
                </Typography>
                <Typography variant="h5">{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={8} sx={{ mt: 3 }} justifyContent="center">
        <Button variant="contained" color="primary" onClick={() => navigate('/studentbrowse')}>
          Explore Projects
        </Button>
        <Button variant="outlined" color="secondary">Learn More</Button>
      </Stack>

      <Box sx={{ mt: 4, width: '100%' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Recently viewed projects
        </Typography>
        <Grid container spacing={2} sx={{ width: '100%' }} justifyContent="center" alignItems="center" gap={15}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={4} key={i} >
              <Box
                sx={{
                  bgcolor: 'primary.dark',
                  color: 'common.white',
                  p: 2,
                  borderRadius: 1,
                  width: '200px',
                  minHeight: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography>box{i}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default StudentDashboard