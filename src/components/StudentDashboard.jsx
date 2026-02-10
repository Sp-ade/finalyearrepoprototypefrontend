import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Chip, CircularProgress, Alert } from '@mui/material'
import AccountInformation from './AccountInformation'
import ProjectCard from './ProjectCard'
import heroimage from '../assets/Nile-Matriculation.jpg'
import API_URL from '../config'


const StudentDashboard = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userId, setUserId] = useState(null)

  // Dashboard State
  const [requests, setRequests] = useState([])
  const [approvedProjects, setApprovedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Retrieve user's email from localStorage and fetch user data from backend
    const fetchUserData = async () => {
      const email = localStorage.getItem('email')
      if (!email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/me?email=${encodeURIComponent(email)}`)
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
    // Fetch requests when userId is available
    const fetchDashboardData = async () => {
      if (!userId) return

      try {
        // 1. Fetch Requests
        const reqResponse = await fetch(`${API_URL}/api/requests/student/${userId}`)
        let studentRequests = []
        if (reqResponse.ok) {
          const data = await reqResponse.json()
          studentRequests = data.requests || []
          setRequests(studentRequests)
        }

        // 2. Filter for Approved Requests and Fetch Project Details
        const approvedReqs = studentRequests.filter(r => r.status?.toLowerCase() === 'approved')

        if (approvedReqs.length > 0) {
          const projectPromises = approvedReqs.map(async (req) => {
            try {
              const progResponse = await fetch(`${API_URL}/api/projects/${req.project_id}`)
              if (progResponse.ok) {
                const projData = await progResponse.json()
                return projData.project || projData
              }
              return null
            } catch (err) {
              console.error(`Error fetching project ${req.project_id}:`, err)
              return null
            }
          })

          const projects = await Promise.all(projectPromises)
          setApprovedProjects(projects.filter(p => p !== null))
        } else {
          setApprovedProjects([])
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userId])

  const approvedCount = requests.filter(r => r.status?.toLowerCase() === 'approved').length
  const pendingCount = requests.filter(r => r.status?.toLowerCase() === 'pending').length

  const stats = [
    { label: 'Approved Projects', value: approvedCount, color: 'success.main' },
    { label: 'Pending Requests', value: pendingCount, color: 'warning.main' },
    { label: 'Total Requests', value: requests.length },
  ]


  return (
    <Box sx={{ p: 0, pb: 10 }}>
      {/* Hero Section */}
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
        <Typography variant="h4" component="h1" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
          Hello {firstName} {lastName}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <AccountInformation />
      </Box>

      {/* Statistics Grid */}
      <Grid container spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {s.label}
                </Typography>
                <Typography variant="h5" sx={{ color: s.color || 'text.primary', fontWeight: 'bold' }}>
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Stack direction="row" spacing={3} sx={{ mt: 4 }} justifyContent="center">
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/studentbrowse')}>
          Explore Projects
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/studentrequests')}>
          My Requests
        </Button>
      </Stack>

      {/* Recently Approved Projects Section */}
      <Box sx={{ mt: 6, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          Your Approved Projects
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : approvedProjects.length > 0 ? (
          <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
            {approvedProjects.slice(0, 3).map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id || Math.random()}>
                <ProjectCard project={project} buttonText="View Project" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" variant="outlined" sx={{ maxWidth: 600, mx: 'auto' }}>
            You don't have any approved projects yet.
          </Alert>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button onClick={() => navigate('/studentbrowse')}>
            Browse All Projects
          </Button>
        </Box>
      </Box>

    </Box>
  )
}

export default StudentDashboard