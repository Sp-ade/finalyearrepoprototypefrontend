import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import Start from './components/Start'
import StaffBrowse from './components/StaffBrowse'
import StaffDashboard from './components/StaffDashboard'
import StudentBrowse from './components/StudentBrowse'
import StudentDashboard from './components/StudentDashboard'
import ProjectCreate from './components/ProjectCreate'
import RequestList from './components/RequestList'
import StudentRequestList from './components/StudentRequestList'
import Signup from './components/Signup'
import ProjectView from './components/ProjectView'
import StaffProjectView from './components/StaffProjectView'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'
import UserManagement from './components/UserManagement'
import TagManagement from './components/TagManagement'
import AdminLogin from './components/AdminLogin'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route path='/' element={<Start />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='adminlogin' element={<AdminLogin />} />
      <Route path='signup' element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='staffbrowse' element={<StaffBrowse />} />
        <Route path='staff/project/:id' element={<StaffProjectView />} />
        <Route path='staffdashboard' element={<StaffDashboard />} />
        <Route path='studentbrowse' element={<StudentBrowse />} />
        <Route path='project/:id' element={<ProjectView />} />
        <Route path='studentdashboard' element={<StudentDashboard />} />
        <Route path='ProjectCreate' element={<ProjectCreate />} />
        <Route path='requests' element={<RequestList />} />
        <Route path='studentrequests' element={<StudentRequestList />} />

        {/* Admin Routes */}
        <Route path='admindashboard' element={<AdminDashboard />} />
        <Route path='admin/users' element={<UserManagement />} />
        <Route path='admin/tags' element={<TagManagement />} />
      </Route>
    </Route>
  )
)
const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App