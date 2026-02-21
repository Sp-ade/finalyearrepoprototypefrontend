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
