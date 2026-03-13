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
      { title: 'Projects', path: '/admin/browse' },
      { title: 'Users', path: '/admin/users' },
      { title: 'Tags', path: '/admin/tags' }
    ] : []),
    { title: 'FAQS', path: '#' }
  ]

  const drawerContent = (
    <Box sx={{ width: '100%', py: 2 }} onClick={handleDrawerToggle} role="presentation">
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton component={Link} to={link.path}>
              <ListItemText primary={link.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          {token ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Log out" sx={{ color: 'error.main' }} />
            </ListItemButton>
          ) : (
            <ListItemButton component={Link} to="/login">
              <ListItemText primary="Log in" />
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Box
              component="img"
              src={Logo}
              alt="logo"
              sx={{ width: 60, height: 60, borderRadius: 1 }}
            />
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'black' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.title}
                  component={Link}
                  to={link.path}
                  color="inherit"
                  sx={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {link.title}
                </Button>
              ))}
              {token ? (
                <Button onClick={handleLogout} color="error" variant="text" sx={{ textTransform: 'capitalize' }}>
                  Log out
                </Button>
              ) : (
                <Button component={Link} to="/login" color="black" variant="text" sx={{ textTransform: 'capitalize' }}>
                  Log in
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

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
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default Navbar
