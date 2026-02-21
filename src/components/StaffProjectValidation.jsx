import React, { useState } from 'react'
import { Box, Paper, Typography, CircularProgress, Stack, Grid, Button, Snackbar, Alert } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectValidation } from '../hooks/useProjectValidation'
import PageHeader from './common/PageHeader'
import StatusChip from './common/StatusChip'
import RequestChangesDialog from './common/RequestChangesDialog'
import ProjectReviewDetails from './project/ProjectReviewDetails'
import ReviewActionCard from './project/ReviewActionCard'
import StudentDetailsCard from './project/StudentDetailsCard'

const StaffProjectValidation = () => {
  const { id: submissionId } = useParams()
  const navigate = useNavigate()
  const [changesDialogOpen, setChangesDialogOpen] = useState(false)

  const {
    submission,
    project,
    loading,
    actionLoading,
    grade,
    setGrade,
    supervisorResponse,
    setSupervisorResponse,
    changesResponse,
    setChangesResponse,
    notification,
    setNotification,
    handleApprove,
    handleRequestChanges,
    isApproved
  } = useProjectValidation(submissionId)

  const handleApproveClick = async () => {
    const success = await handleApprove()
    if (success) {
      setTimeout(() => navigate(-1), 1500)
    }
  }

  const handleRequestChangesClick = async () => {
    const success = await handleRequestChanges()
    if (success) {
      setChangesDialogOpen(false)
      setTimeout(() => navigate(-1), 1500)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!submission || !project) {
    return (
      <Typography sx={{ mt: 5, textAlign: 'center' }}>
        Submission not found.
      </Typography>
    )
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '90vh' }}>
      <Paper sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <PageHeader title="Project Validation" showBack={true} />
          <StatusChip status={submission.status} sx={{ mt: 1 }} />
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ProjectReviewDetails project={project} />
          </Grid>

          <Grid item xs={12} md={4}>
            <StudentDetailsCard
              studentName={`${submission.student_first_name} ${submission.student_last_name}`}
              studentEmail={submission.student_email}
              submissionDate={submission.requested_at}
            />

            <ReviewActionCard
              grade={grade}
              setGrade={setGrade}
              remark={supervisorResponse}
              setRemark={setSupervisorResponse}
              onApprove={handleApproveClick}
              onRequestChanges={() => setChangesDialogOpen(true)}
              loading={actionLoading}
              disabled={isApproved}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Request Changes Dialog */}
      <RequestChangesDialog
        open={changesDialogOpen}
        onClose={() => setChangesDialogOpen(false)}
        value={changesResponse}
        onChange={setChangesResponse}
        onSubmit={handleRequestChangesClick}
        loading={actionLoading}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default StaffProjectValidation
