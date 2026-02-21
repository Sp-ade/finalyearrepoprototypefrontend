import React from 'react'
import { Grid, Card, CardContent, Typography } from '@mui/material'

const StatisticsGrid = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={4} key={stat.label}>
          <Card variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <CardContent sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {stat.label}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ color: stat.color || 'text.primary', fontWeight: 'bold' }}
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
