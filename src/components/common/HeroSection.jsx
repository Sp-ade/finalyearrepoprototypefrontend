import React from 'react'
import { Box, Typography } from '@mui/material'

const HeroSection = ({ backgroundImage, firstName, lastName }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '35vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
      >
        Hello {firstName} {lastName}
      </Typography>
    </Box>
  )
}

export default HeroSection
