import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from '../assets/Nile-University-of-Nigeria.jpg'

const Navbar = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const dashboardRoute = role === 'admin' ? '/admindashboard' : role === 'supervisor' ? '/staffdashboard' : '/studentdashboard'
  const browseRoute = role === 'supervisor' ? '/staffbrowse' : '/studentbrowse'
  const requestsRoute = role === 'supervisor' ? '/requests' : '/studentrequests'

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    setMobileOpen(false)
    navigate('/login')
  }

  const navLinks = [
    { title: 'Contacts', path: '#' },
    { title: 'Dashboard', path: dashboardRoute },
    ...(role !== 'admin' ? [
      { title: 'Projects', path: browseRoute },
      { title: 'Requests', path: requestsRoute }
    ] : []),
    ...(role === 'supervisor' ? [
      { title: 'Assign Leader', path: '/assignstudent' }
    ] : []),
    ...(role === 'admin' ? [
      { title: 'Users', path: '/admin/users' },
      { title: 'Tags', path: '/admin/tags' }
    ] : []),
    { title: 'FAQS', path: '#' }
  ]

  const drawer = (
    <Box sx={{ width: '100%', pt: 2, pb: 2 }} onClick={handleDrawerToggle} role="presentation">
      <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          component="img"
          src={Logo}
          alt="logo"
          sx={{ width: 60, height: 60, borderRadius: 1 }}
        />
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Box>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              sx={{
                py: 1.5,
                '&:active': {
                  bgcolor: '#4caf50 !important',
                  color: 'white'
                },
                '&.Mui-selected': {
                  bgcolor: '#4caf50 !important',
                  color: 'white'
                }
              }}
            >
              <ListItemText
                primary={link.title}
                primaryTypographyProps={{ fontWeight: 500, sx: { px: 2 } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          {token ? (
            <ListItemButton
              onClick={handleLogout}
              sx={{
                py: 1.5,
                '&:active': {
                  bgcolor: '#4caf50 !important',
                  color: 'white'
                }
              }}
            >
              <ListItemText primary="Log out" sx={{ color: 'error.main', px: 2 }} />
            </ListItemButton>
          ) : (
            <ListItemButton
              component={Link}
              to="/login"
              sx={{
                py: 1.5,
                '&:active': {
                  bgcolor: '#4caf50 !important',
                  color: 'white'
                }
              }}
            >
              <ListItemText primary="Log in" sx={{ px: 2 }} />
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </Box>
  )

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Box
            component="img"
            src={Logo}
            alt="logo"
            sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, bgcolor: '#f0f0f0', borderRadius: 1 }}
          />
        </Box>

        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, color: 'black' }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            {navLinks.map((link) => (
              <Button key={link.title} component={Link} to={link.path} color="black" variant="text">
                {link.title}
              </Button>
            ))}
            {token ? (
              <Button onClick={handleLogout} color="black" variant="text">Log out</Button>
            ) : (
              <Button component={Link} to="/login" color="black" variant="text">log in</Button>
            )}
          </Box>
        )}
      </Toolbar>

      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            borderRadius: '0 0 20px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  )
}

export default Navbar
