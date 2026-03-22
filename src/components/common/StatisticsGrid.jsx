import React from 'react'
import { Grid, Card, CardContent, Typography } from '@mui/material'
//statistic cards for student and staffdashboards 
const StatisticsGrid = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={4} key={stat.label}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              bgcolor: stat.bgColor || 'transparent',
              color: stat.bgColor ? 'white' : 'inherit',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent sx={{ width: '100%', textAlign: 'center' }}>
              <Typography
                variant="subtitle2"
                sx={{ color: stat.bgColor ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}
                gutterBottom
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: stat.bgColor ? 'white' : (stat.color || 'text.primary'),
                  fontWeight: 'bold'
                }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default StatisticsGrid
