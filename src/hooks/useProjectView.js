import { useState, useEffect } from 'react'
import API_URL from '../config'

export const useProjectView = (projectId) => {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const studentId = localStorage.getItem('userId')
        const url = studentId
          ? `${API_URL}/api/projects/${projectId}?studentId=${studentId}`
          : `${API_URL}/api/projects/${projectId}`

        const res = await fetch(url)
        if (!res.ok) throw new Error('Project not found')
        const data = await res.json()

        // For students, check if their matric number is in the project's StudentIDs
        const role = localStorage.getItem('role')
        const email = localStorage.getItem('email')

        if (role === 'student' && email && data.StudentIDs && data.StudentIDs.length > 0) {
          try {
            const meRes = await fetch(`${API_URL}/api/me?email=${encodeURIComponent(email)}`)
            if (meRes.ok) {
              const meData = await meRes.json()
              const matricNo = meData.matricNo
              if (matricNo && data.StudentIDs.includes(matricNo)) {
                data.hasAccess = true
                data.userProjectRole = meData.role // 'leader' or 'member' from Students table
                data.isProjectLeader = meData.role === 'leader'
              }
            }
          } catch (err) {
            // Non-fatal: if we can't check, access stays as-is
            console.error('Could not verify project membership:', err)
          }
        }

        setProject(data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  return { project, loading, error }
}
