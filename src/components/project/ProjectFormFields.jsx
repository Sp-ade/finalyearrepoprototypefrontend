import React from 'react'
import { Box, TextField, Stack, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material'

const PROJECT_TYPES = ['Design', 'Development', 'Research']

const ProjectFormFields = ({ 
  projectData, 
  onFieldChange,
  supervisor 
}) => {
  const handleChange = (field) => (event) => {
    onFieldChange(field, event.target.value)
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Project Title"
        value={projectData.projectTitle}
        onChange={handleChange('projectTitle')}
        fullWidth
        placeholder="Enter project title"
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Academic Year"
          value={projectData.academicYear}
          onChange={handleChange('academicYear')}
          sx={{ width: { sm: 200 } }}
          placeholder={new Date().getFullYear().toString()}
        />

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="project-type-label">Project Type</InputLabel>
          <Select
            labelId="project-type-label"
            value={projectData.projectType}
            label="Project Type"
            onChange={handleChange('projectType')}
          >
            {PROJECT_TYPES.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Grade"
          value={projectData.grade}
          onChange={handleChange('grade')}
          sx={{ width: 160 }}
          placeholder="A, B, C, etc."
        />
      </Stack>

      <TextField
        label="Description"
        value={projectData.description}
        onChange={handleChange('description')}
        multiline
        rows={4}
        fullWidth
        placeholder="Enter project description"
      />

      <TextField
        label="Final Remark"
        value={projectData.finalRemark}
        onChange={handleChange('finalRemark')}
        multiline
        rows={2}
        fullWidth
        placeholder="Evaluation remarks and feedback"
      />

      <TextField
        label="Tags"
        placeholder="tag1, tag2, tag3"
        value={projectData.tags}
        onChange={handleChange('tags')}
        fullWidth
        helperText="Separate tags with commas"
      />

      <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="body1">
          <strong>Supervisor:</strong> {supervisor}
        </Typography>
      </Box>
    </Stack>
  )
}

export default ProjectFormFields
