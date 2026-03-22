import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
  const location = useLocation();

  // Define the routes where the Navbar should NOT appear
  const hideNavbarOn = ['/login', '/adminlogin', '/signup', '/'];

  // Check if the current path matches any in the list
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {/* Only render Navbar if shouldHideNavbar is false */}
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </>
  )
}

export default MainLayout
