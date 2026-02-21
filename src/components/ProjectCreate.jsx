import React, { useState } from 'react'
import { Box, Paper, Button, Stack, Typography, Snackbar, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { useProjectForm } from '../hooks/useProjectForm'
import StudentListInput from './project/StudentListInput'
import ProjectFormFields from './project/ProjectFormFields'
import FileUploadField from './project/FileUploadField'

const ProjectCreate = () => {
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  
  const {
    projectData,
    updateField,
    files,
    updateFile,
    clearFile,
    students,
    addStudent,
    removeStudent,
    updateStudent,
    loading,
    error,
    submitProject,
    setError
  } = useProjectForm()

  const supervisor = localStorage.getItem('userName') || ''

  const handleSubmit = async () => {
    const success = await submitProject()
    if (success) {
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/staffbrowse')
      }, 1500)
    }
  }

  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 3, width: 800, maxWidth: '95%' }} elevation={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Return
        </Button>
        
        <Typography variant="h6" sx={{ mb: 3 }}>
          Project Creation
        </Typography>

        {/* Student List */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Students
          </Typography>
          <StudentListInput
            students={students}
            onAdd={addStudent}
            onRemove={removeStudent}
            onChange={updateStudent}
          />
        </Box>

        {/* Project Form Fields */}
        <ProjectFormFields
          projectData={projectData}
          onFieldChange={updateField}
          supervisor={supervisor}
        />

        {/* File Uploads */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Project Documents
        </Typography>
        <Stack spacing={2}>
          <FileUploadField
            index={0}
            file={files[0]}
            onFileChange={(file) => updateFile(0, file)}
            onClear={() => clearFile(0)}
          />
          <FileUploadField
            index={1}
            file={files[1]}
            onFileChange={(file) => updateFile(1, file)}
            onClear={() => clearFile(1)}
          />
        </Stack>

        {/* Submit Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </Box>

        {/* Error Display */}
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Paper>

      {/* Success Notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2500}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{
            width: '100%',
            backgroundColor: '#58e45fff',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          Project created successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ProjectCreate
