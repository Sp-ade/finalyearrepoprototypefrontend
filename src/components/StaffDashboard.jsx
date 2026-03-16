import React from 'react'
import { Box, Button, Stack, Container } from '@mui/material'
import { useNavigate } from 'react-router'
import { useDashboardUser } from '../hooks/useDashboardUser'
import { useStaffDashboard } from '../hooks/useStaffDashboard'
import AccountInformation from './AccountInformation'
import HeroSection from './common/HeroSection'
import StatisticsGrid from './common/StatisticsGrid'
import ProjectsSection from './common/ProjectsSection'
import heroimage from '../assets/Nile-Matriculation.jpg'

const StaffDashboard = () => {
  const navigate = useNavigate()
  const { firstName, lastName, userId } = useDashboardUser()
  const { stats, recentProjects, loading } = useStaffDashboard(userId)

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'   // 🚨 Prevent horizontal scrolling
      }}
    >

      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroimage}
        firstName={firstName}
        lastName={lastName}
      />

      {/* Account Information */}
      <Box sx={{ mb: { xs: 3, md: 4 }, width: '100%' }}>
        <AccountInformation />
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: { xs: 4, md: 5 }, width: '100%' }}>
        <StatisticsGrid stats={stats} />
      </Box>

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
            size="large"
            sx={{
              bgcolor: '#5fef6bff',
              color: 'white',
              flex: 1,
              '&:hover': { backgroundColor: '#77fa82ff' }
            }}
            onClick={() => navigate('/staffbrowse')}
          >
            Explore Projects
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{ flex: 1, bgcolor: '#2b4593', '&:hover': { backgroundColor: '#243a7aff', color: 'white' } }}
            onClick={() => navigate('/projectcreate')}
          >
            Upload Projects
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ flex: 1, '&:hover': { backgroundColor: '#2b4593', color: 'white' } }}
            onClick={() => navigate('/studentsubmissionlist')}
          >
            View Student submissions
          </Button>
        </Stack>
      </Container>

      {/* Recent Uploads */}
      <Box sx={{ width: '100%' }}>
        <ProjectsSection
          title="Recent Uploads"
          projects={recentProjects}
          loading={loading}
          emptyMessage="No projects uploaded yet. Click 'Upload Projects' to get started!"
          maxItems={3}
          onBrowseClick={() => navigate('/staffbrowse')}
          buttonText="Manage Project"
        />
      </Box>


    </Box >
  )
}

export default StaffDashboard