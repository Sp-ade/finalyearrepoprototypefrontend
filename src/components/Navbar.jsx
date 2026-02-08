import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Box, Button } from '@mui/material'
import Logo from '../assets/Nile-University-of-Nigeria.jpg'
const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation() // Forces re-render on route change

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') // Get user role from localStorage

  // Determine dashboard and browse routes based on role
  const dashboardRoute = role === 'admin' ? '/admindashboard' : role === 'supervisor' ? '/staffdashboard' : '/studentdashboard'
  const browseRoute = role === 'supervisor' ? '/staffbrowse' : '/studentbrowse'
  const requestsRoute = role === 'supervisor' ? '/requests' : '/studentrequests'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src={Logo}
          alt="logo"
          sx={{ width: 88, height: 88, bgcolor: '#f0f0f0', borderRadius: 1 }}
        />

        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          <Button color="black" variant="text">Contacts</Button>
          <Button component={Link} to={dashboardRoute} color="black" variant="text">Dashboard</Button>
          {role !== 'admin' && (
            <>
              <Button component={Link} to={browseRoute} color="black" variant="text">Projects</Button>
              <Button component={Link} to={requestsRoute} color="black" variant="text">Requests</Button>
            </>
          )}
          {role === 'admin' && (
            <>
              <Button component={Link} to="/admin/users" color="black" variant="text">Users</Button>
              <Button component={Link} to="/admin/tags" color="black" variant="text">Tags</Button>
            </>
          )}
          <Button color="black" variant="text">FAQS</Button>

          {token ? (
            <Button onClick={handleLogout} color="black" variant="text">Log out</Button>
          ) : (
            <Button component={Link} to="/login" color="black" variant="text">log in</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar