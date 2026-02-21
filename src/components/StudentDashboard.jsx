import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Card, CardContent, Button, Stack, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import AccountInformation from './AccountInformation'
import ProjectCard from './project/ProjectCard'
import heroimage from '../assets/Nile-Matriculation.jpg'
import API_URL from '../config'
import StatusChip from './common/StatusChip'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userId, setUserId] = useState(null)

  // Dashboard State
  const [requests, setRequests] = useState([])
  const [approvedProjects, setApprovedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Submission Status State
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

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

  const checkSubmissionStatus = async () => {
    setStatusLoading(true)
    setShowStatusDialog(true)
    try {
      const response = await fetch(`${API_URL}/api/submissions/student/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissionStatus(data)
      } else {
        setSubmissionStatus({ submitted: false })
      }
    } catch (error) {
      console.error('Error checking submission status:', error)
      setSubmissionStatus({ error: 'Failed to fetch status' })
    } finally {
      setStatusLoading(false)
    }
  }

  const approvedCount = requests.filter(r => r.status?.toLowerCase() === 'approved').length
  const pendingCount = requests.filter(r => r.status?.toLowerCase() === 'pending').length

  const stats = [
    { label: 'Approved Projects', value: approvedCount, color: 'success.main' },
    { label: 'Pending Requests', value: pendingCount, color: 'warning.main' },
    { label: 'Total Requests', value: requests.length },
  ]


  return (
    <Box sx={{ p: 0, pb: 10, width: '100%' }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          height: '35vh',
          backgroundImage: `url(${heroimage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'common.white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

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
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={checkSubmissionStatus}
        >
          Check Submission Status
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

      {/* Submission Status Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Project Submission Status</DialogTitle>
        <DialogContent dividers>
          {statusLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : submissionStatus?.error ? (
            <Alert severity="error">{submissionStatus.error}</Alert>
          ) : !submissionStatus?.submitted ? (
            <Box textAlign="center" py={2}>
              <Typography gutterBottom>You have not submitted a project yet.</Typography>
              <Button variant="contained" onClick={() => navigate('/studentsubmit')}>
                Propose Project
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>{submissionStatus.submission.project_title}</Typography>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Typography>Status:</Typography>
                <StatusChip status={submissionStatus.submission.status} />
              </Stack>

              {submissionStatus.submission.status === 'Approved' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <strong>Project Uploaded!</strong> Your project has been approved and is now active.
                </Alert>
              )}

              {submissionStatus.submission.status === 'Changes Requested' && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <strong>Supervisor Feedback:</strong><br />
                    {submissionStatus.submission.supervisor_response || 'No feedback provided.'}
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate('/studentsubmit', {
                      state: {
                        editMode: true,
                        projectId: submissionStatus.submission.project_id,
                        submissionId: submissionStatus.submission.submission_id
                      }
                    })}
                  >
                    Edit & Resubmit
                  </Button>
                </Box>
              )}

              {submissionStatus.submission.status === 'Pending' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your submission is currently under review by your supervisor.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default StudentDashboard