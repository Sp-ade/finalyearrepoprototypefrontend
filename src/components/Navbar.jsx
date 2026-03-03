import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import Logo from '../assets/Nile-University-of-Nigeria.jpg'

const Navbar = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [anchorEl, setAnchorEl] = useState(null)

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const dashboardRoute =
    role === 'admin'
      ? '/admindashboard'
      : role === 'supervisor'
      ? '/staffdashboard'
      : '/studentdashboard'

  const browseRoute =
    role === 'supervisor' ? '/staffbrowse' : '/studentbrowse'

  const requestsRoute =
    role === 'supervisor' ? '/requests' : '/studentrequests'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>

        {/* Logo */}
        <Box
          component="img"
          src={Logo}
          alt="logo"
          sx={{
            width: { xs: 60, md: 88 },
            height: { xs: 60, md: 88 }
          }}
        />

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <Button component={Link} to="/contacts">Contacts</Button>
            <Button component={Link} to={dashboardRoute}>Dashboard</Button>

            {role !== 'admin' && (
              <>
                <Button component={Link} to={browseRoute}>Projects</Button>
                <Button component={Link} to={requestsRoute}>Requests</Button>
              </>
            )}

            {role === 'admin' && (
              <>
                <Button component={Link} to="/admin/users">Users</Button>
                <Button component={Link} to="/admin/tags">Tags</Button>
              </>
            )}

            <Button component={Link} to="/faqs">FAQS</Button>

            {token ? (
              <Button onClick={handleLogout}>Log out</Button>
            ) : (
              <Button component={Link} to="/login">Log in</Button>
            )}
          </Box>
        )}

        {/* Mobile Dropdown */}
        {isMobile && (
          <>
            <IconButton
              sx={{ ml: 'auto' }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/contacts" onClick={handleMenuClose}>
                Contacts
              </MenuItem>

              <MenuItem component={Link} to={dashboardRoute} onClick={handleMenuClose}>
                Dashboard
              </MenuItem>

              {role !== 'admin' && (
                <>
                  <MenuItem component={Link} to={browseRoute} onClick={handleMenuClose}>
                    Projects
                  </MenuItem>
                  <MenuItem component={Link} to={requestsRoute} onClick={handleMenuClose}>
                    Requests
                  </MenuItem>
                </>
              )}

              {role === 'admin' && (
                <>
                  <MenuItem component={Link} to="/admin/users" onClick={handleMenuClose}>
                    Users
                  </MenuItem>
                  <MenuItem component={Link} to="/admin/tags" onClick={handleMenuClose}>
                    Tags
                  </MenuItem>
                </>
              )}

              <MenuItem component={Link} to="/faqs" onClick={handleMenuClose}>
                FAQS
              </MenuItem>

              {token ? (
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                  Log out
                </MenuItem>
              ) : (
                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                  Log in
                </MenuItem>
              )}
            </Menu>
          </>
        )}

      </Toolbar>
    </AppBar>
  )
}

export default Navbar