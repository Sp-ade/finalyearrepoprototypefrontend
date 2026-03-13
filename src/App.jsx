import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import MainLayout from './Layouts/MainLayout'
import Start from './pages/Start'
import StaffBrowse from './components/StaffBrowse'
import StaffDashboard from './components/StaffDashboard'
import StudentBrowse from './components/StudentBrowse'
import StudentDashboard from './components/StudentDashboard'
import ProjectCreate from './components/ProjectCreate'
import RequestList from './components/RequestList'
import StudentRequestList from './components/StudentRequestList'
import Signup from './components/Authentication/Signup'
import VerifyTest from './verifytest'
import ProjectView from './components/ProjectView'
import StaffProjectView from './components/StaffProjectView'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'
import UserManagement from './components/UserManagement'
import TagManagement from './components/TagManagement'
import AdminLogin from './components/Authentication/AdminLogin'
import StudentProjectCreate from './components/StudentProjectCreate'
import StudentSubmissionList from './components/StudentSubmissionList'
import StaffProjectValidation from './components/StaffProjectValidation'
import ProjectEdit from './components/ProjectEdit'
import ChangePassword from './components/ChangePassword'
import StudentProjectEdit from './components/StudentProjectEdit'
import NotFoundPage from './pages/NotFoundPage'
import AssignStudentPage from './pages/AssignStudentPage'
import AdminBrowse from './pages/AdminBrowse'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route path='/' element={<Start />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='adminlogin' element={<AdminLogin />} />
      <Route path='signup' element={<Signup />} />
      <Route path='verifytest' element={<VerifyTest />} />
      <Route path='*' element={<NotFoundPage />} />
      <Route path='staffdashboard' element={<StaffDashboard />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='staffbrowse' element={<StaffBrowse />} />
        <Route path='staff/project/:id' element={<StaffProjectView />} />
        <Route path='staff/project/edit/:id' element={<ProjectEdit />} />

        <Route path='studentbrowse' element={<StudentBrowse />} />
        <Route path='project/:id' element={<ProjectView />} />
        <Route path='studentdashboard' element={<StudentDashboard />} />
        <Route path='ProjectCreate' element={<ProjectCreate />} />
        <Route path='requests' element={<RequestList />} />
        <Route path='studentrequests' element={<StudentRequestList />} />
        <Route path='studentsubmit' element={<StudentProjectCreate />} />
        <Route path='studentprojectedit' element={<StudentProjectEdit />} />
        <Route path='staffprojectvalidation/:id' element={<StaffProjectValidation />} />
        <Route path='studentsubmissionlist' element={<StudentSubmissionList />} />
        <Route path='change-password' element={<ChangePassword />} />
        <Route path='assignstudent' element={<AssignStudentPage />} />


        {/* Admin Routes */}
        <Route path='admindashboard' element={<AdminDashboard />} />
        <Route path='admin/users' element={<UserManagement />} />
        <Route path='admin/tags' element={<TagManagement />} />
        <Route path='admin/browse' element={<AdminBrowse />} />
      </Route>
    </Route>
  )
)
const App = () => {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  )
}

export default App