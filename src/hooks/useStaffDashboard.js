import { useState, useEffect } from 'react'
import API_URL from '../config'

export const useStaffDashboard = (userId) => {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const [requestHistoryCount, setRequestHistoryCount] = useState(0)
  const [projectsUploadedCount, setProjectsUploadedCount] = useState(0)
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch supervisor requests
  useEffect(() => {
    const fetchSupervisorRequests = async () => {
      if (!userId) return

      try {
        const response = await fetch(`${API_URL}/api/requests/supervisor/${userId}`)
        if (response.ok) {
          const data = await response.json()
          const pendingCount = data.requests.filter(req => req.status?.toLowerCase() === 'pending').length
          const historyCount = data.requests.filter(req => req.status?.toLowerCase() !== 'pending').length
          setPendingRequestsCount(pendingCount)
          setRequestHistoryCount(historyCount)
        }
      } catch (error) {
        console.error('Error fetching supervisor requests:', error)
      }
    }

    fetchSupervisorRequests()
  }, [userId])

  // Fetch projects count and recent projects
  useEffect(() => {
    const fetchProjectsCount = async () => {
      if (!userId) return

      try {
        const response = await fetch(`${API_URL}/api/projects`)
        if (response.ok) {
          const data = await response.json()
          const supervisorProjects = data.projects.filter(project => project.supervisor_id === userId)
          setProjectsUploadedCount(supervisorProjects.length)
          setRecentProjects(supervisorProjects.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectsCount()
  }, [userId])

  const stats = [
    { label: 'Projects uploaded', value: projectsUploadedCount },
    { label: 'Pending students request', value: pendingRequestsCount },
    { label: 'Request history', value: requestHistoryCount },
  ]

  return {
    stats,
    recentProjects,
    loading,
    projectsUploadedCount,
    pendingRequestsCount,
    requestHistoryCount
  }
}
