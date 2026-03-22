import React from 'react'
import { Box, Typography } from '@mui/material'
//Hero section for both dashboards student and staff
const HeroSection = ({ backgroundImage, firstName, lastName }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '45vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: { xs: 'right', sm: 'top' },
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)', fontSize: { xs: '20px', sm: '30px', md: '40px' } }}
      >
        Hello {firstName} {lastName}
      </Typography>
    </Box>
  )
}

export default HeroSection
