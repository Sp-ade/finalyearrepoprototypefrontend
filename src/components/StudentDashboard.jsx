import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack } from '@mui/material'
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
      <Stack direction="row" spacing={2} sx={{ mt: 4, mb: 4 }} justifyContent="center" flexWrap="wrap">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/studentbrowse')}
        >
          Explore Projects
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/studentrequests')}
        >
          My Requests
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleCheckStatus}
        >
          Check Submission Status
        </Button>
      </Stack>

      {/* Approved Projects Section */}
      <ProjectsSection
        title="Your Approved Projects"
        projects={approvedProjects}
        loading={loading}
        emptyMessage="You don't have any approved projects yet."
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