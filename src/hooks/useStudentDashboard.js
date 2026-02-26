import { useState, useEffect } from 'react'
import API_URL from '../config'

export const useStudentDashboard = (userId) => {
  const [requests, setRequests] = useState([])
  const [approvedProjects, setApprovedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [myProject, setMyProject] = useState(null)

  // Fetch requests and approved projects
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        // Fetch student requests
        const reqResponse = await fetch(`${API_URL}/api/requests/student/${userId}`)
        let studentRequests = []
        if (reqResponse.ok) {
          const data = await reqResponse.json()
          studentRequests = data.requests || []
          setRequests(studentRequests)
        }

        // Fetch approved projects
        const approvedReqs = studentRequests.filter(r => r.status?.toLowerCase() === 'approved')

        if (approvedReqs.length > 0) {
          const projectPromises = approvedReqs.map(async (req) => {
            try {
              const progResponse = await fetch(`${API_URL}/api/projects/${req.project_id}`)
              if (progResponse.ok) {
                const projData = await progResponse.json()
                return projData.project || projData
              }
              return null
            } catch (err) {
              console.error(`Error fetching project ${req.project_id}:`, err)
              return null
            }
          })

          const projects = await Promise.all(projectPromises)
          setApprovedProjects(projects.filter(p => p !== null))
        } else {
          setApprovedProjects([])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    handleCheckSubmission()
  }, [userId])

  const handleCheckSubmission = async () => {
    if (!userId) return
    setStatusLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/submissions/student/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissionStatus(data)

        // If approved, fetch the actual project data
        if (data.submission && data.submission.status === 'Approved' && data.submission.project_id) {
          const projRes = await fetch(`${API_URL}/api/projects/${data.submission.project_id}`)
          if (projRes.ok) {
            const projData = await projRes.json()
            setMyProject(projData.project || projData)
          }
        }
      } else {
        setSubmissionStatus({ submitted: false })
      }
    } catch (error) {
      console.error('Error checking submission status:', error)
      setSubmissionStatus({ error: 'Failed to fetch status' })
    } finally {
      setStatusLoading(false)
    }
  }

  const checkSubmissionStatus = async () => {
    await handleCheckSubmission()
  }

  const approvedCount = requests.filter(r => r.status?.toLowerCase() === 'approved').length
  const pendingCount = requests.filter(r => r.status?.toLowerCase() === 'pending').length

  const stats = [
    { label: 'Approved Projects', value: approvedCount, color: 'success.main' },
    { label: 'Pending Requests', value: pendingCount, color: 'warning.main' },
    { label: 'Total Requests', value: requests.length },
  ]

  return {
    requests,
    approvedProjects,
    loading,
    submissionStatus,
    statusLoading,
    stats,
    checkSubmissionStatus,
    setSubmissionStatus,
    myProject
  }
}
