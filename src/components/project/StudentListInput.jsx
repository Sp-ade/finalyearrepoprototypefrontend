import React from 'react'
import { Stack, TextField, Button, Box } from '@mui/material'

const StudentListInput = ({ 
  students, 
  onAdd, 
  onRemove, 
  onChange 
}) => {
  return (
    <Box>
      {students.map((student, index) => (
        <Stack 
          key={index} 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          sx={{ mb: 1 }}
        >
          <TextField
            label="Student name"
            variant="outlined"
            fullWidth
            value={student.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            placeholder="Enter student name"
          />

          <TextField
            label="ID"
            variant="outlined"
            sx={{ width: 160 }}
            value={student.id}
            onChange={(e) => onChange(index, 'id', e.target.value)}
            placeholder="Student ID"
          />

          <Button 
            variant="outlined"
            onClick={onAdd}
            title="Add another student"
          >
            +
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => onRemove(index)}
            disabled={students.length === 1}
            title="Remove student"
          >
            -
          </Button>
        </Stack>
      ))}
    </Box>
  )
}

export default StudentListInput
