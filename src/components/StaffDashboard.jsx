import React from 'react'
import { Box, Grid, Button, Stack, Typography } from '@mui/material'
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
    <Box sx={{ p: 0, margin: 0, width: '100%' }}>
      {/* Hero Section */}
      <HeroSection 
        backgroundImage={heroimage} 
        firstName={firstName} 
        lastName={lastName} 
      />

      {/* Account Information */}
      <Box sx={{ margin: 0, padding: 0 }}>
        <AccountInformation />
      </Box>

      {/* Statistics */}
      <StatisticsGrid stats={stats} />

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 4, mb: 4 }} justifyContent="center" flexWrap="wrap">
        <Button 
          variant="contained" 
          size="large" 
          sx={{ bgcolor: '#5fef6bff', color: 'white', '&:hover': { backgroundColor: '#77fa82ff' } }} 
          onClick={() => navigate('/staffbrowse')}
        >
          Explore Projects
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={() => navigate('/projectcreate')}
        >
          Upload Projects
        </Button>
        <Button variant="outlined" size="large">
          Learn More
        </Button>
      </Stack>

      {/* Recent Uploads Section */}
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
  )
}

export default StaffDashboard