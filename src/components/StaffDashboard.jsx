import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, Stack } from '@mui/material'
import AccountInformation from './AccountInformation'
import ProjectCard from './ProjectCard'
import heroimage from '../assets/Nile-University-Matriculation-Ceremony.jpg'
import { useNavigate } from 'react-router'
import API_URL from '../config'



const StaffDashboard = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const [requestHistoryCount, setRequestHistoryCount] = useState(0)
  const [projectsUploadedCount, setProjectsUploadedCount] = useState(0)
  const [recentProjects, setRecentProjects] = useState([])
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
    // Fetch supervisor requests when userId is available
    const fetchSupervisorRequests = async () => {
      if (!userId) return

      try {
        const response = await fetch(`http://localhost:3000/api/requests/supervisor/${userId}`)
        if (response.ok) {
          const data = await response.json()
          // Count pending requests (case-insensitive)
          const pendingCount = data.requests.filter(req => req.status?.toLowerCase() === 'pending').length
          // Count non-pending requests (approved, rejected, etc.)
          const historyCount = data.requests.filter(req => req.status?.toLowerCase() !== 'pending').length
          setPendingRequestsCount(pendingCount)
          setRequestHistoryCount(historyCount)
        }
      } catch (error) {
        console.error('Error fetching supervisor requests:', error)
      }
    }

    fetchSupervisorRequests()
  }, [userId])

  useEffect(() => {
    // Fetch projects uploaded by this supervisor
    const fetchProjectsCount = async () => {
      if (!userId) return

      try {
        const response = await fetch(`${API_URL}/api/projects`)
        if (response.ok) {
          const data = await response.json()
          // Filter projects by supervisor_id
          const supervisorProjects = data.projects.filter(project => project.supervisor_id === userId)
          setProjectsUploadedCount(supervisorProjects.length)
          // Get the last 3 projects (most recent)
          const recent = supervisorProjects.slice(0, 3)
          setRecentProjects(recent)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchProjectsCount()
  }, [userId])

  const stats = [
    { label: 'Projects uploaded', value: projectsUploadedCount },
    { label: 'Pending students request', value: pendingRequestsCount },
    { label: 'Request history', value: requestHistoryCount },
  ]
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 0 }}>
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

      <Box sx={{ mt: 0 }}>
        <AccountInformation />
      </Box>

      <Grid container spacing={2} sx={{ gap: 5, mt: 2, display: 'flex', justifyContent: 'center' }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={4} sx={{ width: '25%' }} key={s.label}>
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
        <Button variant="outlined" size='large' sx={{ bgcolor: '#5fef6bff', border: 'none', color: 'white', '&:hover': { backgroundColor: '#77fa82ff', cursor: 'pointer' } }} onClick={() => navigate('/staffbrowse')}>
          Explore Projects
        </Button>
        <Button variant="contained" color="primary" size='large' onClick={() => navigate('/projectcreate')}>
          Upload Projects
        </Button>
        <Button variant="outlined" size='large'>Learn More</Button>
      </Stack>

      {/* Recent Uploads Section */}
      <Box sx={{ mt: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Recent Uploads
        </Typography>
        {recentProjects.length > 0 ? (
          <Grid container spacing={2} sx={{ gap: 5, mt: 1, display: 'flex', justifyContent: 'center' }}>
            {recentProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} sx={{ width: '23%' }} key={project.id}>
                <ProjectCard project={project} buttonText="Manage Project" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No projects uploaded yet. Click "Upload Projects" to get started!
          </Typography>
        )}
      </Box>

    </Box>
  )
}

export default StaffDashboard