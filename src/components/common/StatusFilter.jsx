import React from 'react'
import { Stack, Chip } from '@mui/material'

const StatusFilter = ({ 
  options, 
  selected, 
  onChange 
}) => {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
      {options.map((status) => (
        <Chip
          key={status}
          label={status}
          onClick={() => onChange(status)}
          color={selected === status ? 'primary' : 'default'}
          variant={selected === status ? 'filled' : 'outlined'}
          clickable
        />
      ))}
    </Stack>
  )
}

export default StatusFilter
