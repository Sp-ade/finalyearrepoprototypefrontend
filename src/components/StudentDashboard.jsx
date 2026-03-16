import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, Container } from '@mui/material'
import { useDashboardUser } from '../hooks/useDashboardUser'
import { useStudentDashboard } from '../hooks/useStudentDashboard'
import AccountInformation from './AccountInformation'
import HeroSection from './common/HeroSection'
import StatisticsGrid from './common/StatisticsGrid'
import ProjectsSection from './common/ProjectsSection'
import SubmissionStatusDialog from './common/SubmissionStatusDialog'
import heroimage from '../assets/Nile-Matriculation.jpg'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  const { firstName, lastName, userId } = useDashboardUser()
  const {
    approvedProjects,
    loading,
    submissionStatus,
    statusLoading,
    stats,
    checkSubmissionStatus,
    myProject
  } = useStudentDashboard(userId)

  const handleCheckStatus = async () => {
    setShowStatusDialog(true)
    await checkSubmissionStatus()
  }

  const handleEditSubmit = (submission) => {
    navigate('/studentsubmit', {
      state: {
        editMode: true,
        projectId: submission.project_id,
        submissionId: submission.submission_id
      }
    })
  }

  return (
    <Box sx={{ p: 0, pb: 10, width: '100%' }}>
      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroimage}
        firstName={firstName}
        lastName={lastName}
      />

      {/* Account Information */}
      <Box sx={{ mt: 2 }}>
        <AccountInformation />
      </Box>

      {/* Statistics Grid */}
      <StatisticsGrid stats={stats} />

      {/* Action Buttons */}
      <Container maxWidth="md">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 4, mb: 4 }}
          justifyContent="center"
          alignItems="stretch"
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ bgcolor: '#2b4593', flex: 1 }}
            onClick={() => navigate('/studentbrowse')}
          >
            Explore Projects
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              flex: 1,
              borderColor: '#2b4593', color: '#2b4593',
              '&:hover': {
                bgcolor: '#2b4593',
                borderColor: '#2b4593',
                color: 'white',
              }
            }}
            onClick={() => navigate('/studentrequests')}
          >
            My Requests
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ bgcolor: '#49f663ff', flex: 1 }}
            onClick={handleCheckStatus}
          >
            Check Submission Status
          </Button>
        </Stack>
      </Container>

      {/* Approved Projects Section */}
      <ProjectsSection
        title="Approved Projects"
        projects={approvedProjects}
        loading={loading}
        emptyMessage="You don't have full access to any projects yet."
        maxItems={3}
        onBrowseClick={() => navigate('/studentbrowse')}
        buttonText="View Project"
      />

      {/* My Project Section */}
      {myProject && (
        <ProjectsSection
          title="My Submitted Project"
          projects={[myProject]}
          loading={statusLoading}
          emptyMessage=""
          onBrowseClick={() => { }}
          buttonText="View Project"
        />
      )}

      {/* Submission Status Dialog */}
      <SubmissionStatusDialog
        open={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        loading={statusLoading}
        status={submissionStatus}
        onEditSubmit={handleEditSubmit}
      />
    </Box>
  )
}

export default StudentDashboard