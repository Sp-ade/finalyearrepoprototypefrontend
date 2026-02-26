import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Chip } from '@mui/material'

const Card = ({ project = { name: 'Project', title: 'Untitled', description: 'No description', supervisor: 'Unknown', StudentCount: 0, Studentnames: [], tags: [] }, buttonText = 'Manage Project' }) => {
  const navigate = useNavigate()

  const name = project.name || 'Project'
  const title = project.title || project.category || 'Untitled'
  const description = project.description || 'No description'
  const supervisor = project.supervisor || 'Unknown'
  const studentCount = project.StudentCount || 0
  const studentNames = project.Studentnames ? project.Studentnames.join(', ') : 'No students'
  const year = project.year || new Date().getFullYear().toString()

  // Handle tags - backend returns 'Tags' (capital T), but also check 'tags' for compatibility
  let tags = []
  const rawTags = project.Tags || project.tags
  if (rawTags) {
    if (Array.isArray(rawTags)) {
      tags = rawTags.map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean)
    } else if (typeof rawTags === 'string') {
      try {
        const parsed = JSON.parse(rawTags)
        tags = Array.isArray(parsed) ? parsed.map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean) : []
      } catch {
        tags = []
      }
    }
  }

  console.log('Project:', project.title, 'Tags:', tags, 'Raw Tags:', rawTags)

  const handleClick = () => {
    if (buttonText === 'View Project' && project.id) {
      navigate(`/project/${project.id}`)
    } else if (buttonText === 'Manage Project' && project.id) {
      navigate(`/staff/project/${project.id}`)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', height: 360 }}>
      <Box sx={{ height: 180, bgcolor: '#f5f5f5', position: 'relative' }}>
        <Box sx={{ width: '100%', height: '100%', bgcolor: '#ddd' }} />
        {/* Year Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bgcolor: '#49f663ff',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: '0px 0px 80px 0px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
          }}
        >
          {year}
        </Box>
        {/* Tags at bottom of image */}
        {tags.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.75rem',
                  height: '20px',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
      <Box sx={{ p: 2, height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>{title}</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}><strong>Description:</strong>{description}</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}><strong>Supervisor:</strong> {supervisor}</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}><strong>Student(s):</strong> {studentNames}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" size="small" onClick={handleClick}>{buttonText}</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Card