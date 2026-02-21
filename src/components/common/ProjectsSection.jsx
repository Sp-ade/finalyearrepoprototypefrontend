import React from 'react'
import { Box, Typography, Grid, CircularProgress, Alert, Button } from '@mui/material'
import ProjectCard from '../project/ProjectCard'

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
    <Box sx={{ mt: 6, width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        {title}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : projects.length > 0 ? (
        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {projects.slice(0, maxItems).map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id || project.project_id}>
              <ProjectCard project={project} buttonText={buttonText} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" variant="outlined" sx={{ maxWidth: 600, mx: 'auto' }}>
          {emptyMessage}
        </Alert>
      )}

      {projects.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button onClick={onBrowseClick}>
            Browse All Projects
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ProjectsSection
