import React, { useState } from 'react'
import { Box, Paper, Button, Typography, Snackbar, Alert, CircularProgress, Stack } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStudentProjectForm } from '../hooks/useStudentProjectForm'
import ParticipantTable from './project/ParticipantTable'
import ProjectFormFields from './project/ProjectFormFields'
import FileUploadSlot from './project/FileUploadSlot'
import PageHeader from './common/PageHeader'

const StudentProjectEdit = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { editMode = true, projectId: editProjectId, submissionId: editSubmissionId } = location.state || {}
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    academicYear,
    setAcademicYear,
    selectedSupervisor,
    setSelectedSupervisor,
    tags,
    setTags,
    files,
    existingAttachments,
    rows,
    supervisors,
    loading,
    error,
    setError,
    handleStudentChange,
    handleAddStudent,
    handleRemoveStudent,
    handleFileChange,
    handleClearFile,
    submitProject
  } = useStudentProjectForm(editMode, editProjectId, editSubmissionId)

  const handleSubmit = async () => {
    const success = await submitProject()
    if (success) {
      setShowSuccess(true)
      setTimeout(() => navigate('/studentdashboard'), 2000)
    }
  }

  if (!editProjectId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">No project specified for editing.</Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: '#f5f5f5' }}>
      <Paper sx={{ p: 4, width: 800, maxWidth: '100%' }} elevation={3}>
        <PageHeader
          title="Edit Your Project"
          subtitle="Update your project information and documents. Changes will be resubmitted for supervisor validation."
        />

        <ParticipantTable
          students={rows}
          onChange={handleStudentChange}
          onAdd={handleAddStudent}
          onRemove={handleRemoveStudent}
        />

        <ProjectFormFields
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          academicYear={academicYear}
          setAcademicYear={setAcademicYear}
          selectedSupervisor={selectedSupervisor}
          setSelectedSupervisor={setSelectedSupervisor}
          supervisors={supervisors}
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
        />

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Project Documents
        </Typography>
        <Stack spacing={2}>
          {[0, 1].map((index) => (
            <FileUploadSlot
              key={index}
              index={index}
              file={files[index]}
              existingFile={existingAttachments[index]}
              onFileChange={handleFileChange}
              onClear={handleClearFile}
            />
          ))}
        </Stack>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ py: 1.5, mt: 4 }}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Project'}
        </Button>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Project updated successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default StudentProjectEdit
