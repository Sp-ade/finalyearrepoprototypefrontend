import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Container,
  CircularProgress
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSubmissionsList } from '../hooks/useSubmissionsList'
import StatusFilter from './common/StatusFilter'
import SubmissionsTable from './common/SubmissionsTable'

const StudentSubmissionList = () => {
  const navigate = useNavigate()
  const {
    submissions,
    loading,
    filter,
    setFilter,
    statusOptions,
    getStatusColor
  } = useSubmissionsList()

  const handleReview = (submissionId) => {
    navigate(`/staffprojectvalidation/${submissionId}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Student Submissions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Review and validate project proposals from students.
        </Typography>

        <StatusFilter
          options={statusOptions}
          selected={filter}
          onChange={setFilter}
        />

        <SubmissionsTable
          submissions={submissions}
          getStatusColor={getStatusColor}
          onReview={handleReview}
        />
      </Paper>
    </Container>
  )
}

export default StudentSubmissionList
