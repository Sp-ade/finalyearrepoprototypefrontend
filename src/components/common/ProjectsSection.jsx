import React from 'react'
import { Box, Typography, Grid, CircularProgress, Alert, Button } from '@mui/material'
import ProjectCard from '../project/ProjectCard'

//Project cards of both dashboards student and staff
const ProjectsSection = ({
  title,
  projects,
  loading,
  emptyMessage,
  maxItems = 3,
  onBrowseClick,
  buttonText = 'View Project'
}) => {
  return (
    <Box sx={{ mt: 6, width: '100%', px: { xs: 2, md: 0 } }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        {title}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : projects.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, maxWidth: 1100, mx: 'auto' }}>
          {projects.slice(0, maxItems).map((project) => (
            <Box key={project.id || project.project_id} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <ProjectCard project={project} buttonText={buttonText} />
            </Box>
          ))}
        </Box>
      ) : (
        <Alert severity="info" variant="outlined" sx={{ maxWidth: 600, mx: 'auto' }}>
          {emptyMessage}
        </Alert>
      )}

      {projects.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="outlined" sx={{
            borderColor: '#2b4593', color: '#2b4593',
            '&:hover': {
              bgcolor: '#2b4593',
              borderColor: '#2b4593',
              color: 'white',
            }
          }} onClick={onBrowseClick}>
            Browse All Projects
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ProjectsSection
