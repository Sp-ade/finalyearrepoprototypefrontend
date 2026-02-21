import React from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Typography,
  Box
} from '@mui/material'

const SubmissionsTable = ({ 
  submissions, 
  getStatusColor, 
  onReview,
  emptyMessage = 'No submissions found for this filter.'
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Student Name</strong>
            </TableCell>
            <TableCell>
              <strong>Project Title</strong>
            </TableCell>
            <TableCell>
              <strong>Submitted At</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
            <TableCell>
              <strong>Action</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.length > 0 ? (
            submissions.map((sub) => (
              <TableRow key={sub.submission_id} hover>
                <TableCell>
                  {sub.student_first_name} {sub.student_last_name}
                  <Typography variant="caption" display="block" color="text.secondary">
                    {sub.student_email}
                  </Typography>
                </TableCell>
                <TableCell>{sub.project_title}</TableCell>
                <TableCell>
                  {new Date(sub.requested_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={sub.status}
                    color={getStatusColor(sub.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onReview(sub.submission_id)}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SubmissionsTable
