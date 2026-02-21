import React from 'react'
import { Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material'
import { getStatusColor, formatDate } from '../../hooks/useRequestsList'

const RequestCard = ({ request, onClick, showStudent = false }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 1,
        cursor: 'pointer',
        borderLeft: showStudent ? 'none' : `4px solid`,
        borderLeftColor: request.status === 'Pending' ? 'warning.main' : (request.status === 'Approved' ? 'success.main' : 'error.main'),
        '&:hover': { bgcolor: 'grey.50' }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {request.project_title || 'Untitled Project'}
          </Typography>
          {showStudent ? (
            <Typography variant="body2">
              Student: <strong>{request.student_name}</strong> ({request.student_email})
            </Typography>
          ) : (
            <Typography color="text.secondary" variant="body2">
              Supervisor: {request.supervisor_name || 'Unknown'}
            </Typography>
          )}
          <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 0.5 }}>
            {showStudent ? 'Sent' : 'Received'}: {formatDate(request.requested_at)}
          </Typography>
        </Box>

        <Chip
          label={request.status}
          color={getStatusColor(request.status)}
          variant="outlined"
          size="small"
        />
      </CardContent>
    </Card>
  )
}

export default RequestCard
