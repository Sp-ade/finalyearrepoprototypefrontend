import React from 'react'
import { Box, TextField, Stack, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material'

const PROJECT_TYPES = ['Design', 'Development', 'Research']

const ProjectFormFields = ({
  // For Staff (Object based)
  projectData,
  onFieldChange,

  // For Students (Prop based)
  title, setTitle,
  category, setCategory,
  academicYear, setAcademicYear,
  description, setDescription,
  tags, setTags,
  selectedSupervisor, setSelectedSupervisor,
  supervisors = [],

  // Shared
  supervisor
}) => {
  // Helpers to handle both data sources
  const getVal = (field) => {
    if (projectData) return projectData[field]
    if (field === 'projectTitle') return title
    if (field === 'projectType') return category
    if (field === 'academicYear') return academicYear
    if (field === 'description') return description
    if (field === 'tags') return tags
    return ''
  }

  const handleUpdate = (field, value) => {
    if (onFieldChange) {
      onFieldChange(field, value)
    } else {
      if (field === 'projectTitle') setTitle(value)
      if (field === 'projectType') setCategory(value)
      if (field === 'academicYear') setAcademicYear(value)
      if (field === 'description') setDescription(value)
      if (field === 'tags') setTags(value)
    }
  }

  const handleChange = (field) => (event) => {
    handleUpdate(field, event.target.value)
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Project Title"
        value={getVal('projectTitle')}
        onChange={handleChange('projectTitle')}
        fullWidth
        placeholder="Enter project title"
        required
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Academic Year"
          value={getVal('academicYear')}
          onChange={handleChange('academicYear')}
          sx={{ width: { sm: 200 } }}
          placeholder={new Date().getFullYear().toString()}
        />

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="project-type-label">Project Type</InputLabel>
          <Select
            labelId="project-type-label"
            value={getVal('projectType')}
            label="Project Type"
            onChange={handleChange('projectType')}
          >
            {PROJECT_TYPES.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Supervisor Selection (For Students) */}
        {!projectData && supervisors.length > 0 && (
          <FormControl sx={{ minWidth: 200 }} size="small" required>
            <InputLabel id="supervisor-label">Assign Supervisor</InputLabel>
            <Select
              labelId="supervisor-label"
              value={selectedSupervisor}
              label="Assign Supervisor"
              onChange={(e) => setSelectedSupervisor(e.target.value)}
            >
              {supervisors.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.first_name} {s.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {projectData && (
          <TextField
            label="Grade"
            value={projectData.grade}
            onChange={handleChange('grade')}
            sx={{ width: 160 }}
            placeholder="A, B, C, etc."
          />
        )}
      </Stack>

      <TextField
        label="Description"
        value={getVal('description')}
        onChange={handleChange('description')}
        multiline
        rows={4}
        fullWidth
        placeholder="Enter project description"
        required
      />

      {projectData && (
        <TextField
          label="Final Remark"
          value={projectData.finalRemark}
          onChange={handleChange('finalRemark')}
          multiline
          rows={2}
          fullWidth
          placeholder="Evaluation remarks and feedback"
        />
      )}

      <TextField
        label="Tags"
        placeholder="tag1, tag2, tag3"
        value={getVal('tags')}
        onChange={handleChange('tags')}
        fullWidth
        helperText="Separate tags with commas"
      />

      {supervisor && (
        <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body1">
            <strong>Supervisor:</strong> {supervisor}
          </Typography>
        </Box>
      )}
    </Stack>
  )
}

export default ProjectFormFields
