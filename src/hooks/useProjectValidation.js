import { useState, useEffect } from 'react'
import API_URL from '../config'

export const useProjectValidation = (submissionId) => {
  const [submission, setSubmission] = useState(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [grade, setGrade] = useState('')
  const [supervisorResponse, setSupervisorResponse] = useState('')
  const [changesResponse, setChangesResponse] = useState('')
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })

  // Fetch submission and project data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await fetch(`${API_URL}/api/submissions`)
        const subData = await subRes.json()
        const foundSub = subData.find(s => s.submission_id.toString() === submissionId)

        if (foundSub) {
          setSubmission(foundSub)
          const projRes = await fetch(`${API_URL}/api/projects/${foundSub.project_id}`)
          const projData = await projRes.json()
          setProject(projData)
          if (projData.grade && projData.grade !== 'Pending') {
            setGrade(projData.grade)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setNotification({ open: true, message: 'Failed to load submission data', severity: 'error' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [submissionId])

  const validateApproval = () => {
    if (!grade) {
      setNotification({ open: true, message: 'Please provide a grade before approving.', severity: 'warning' })
      return false
    }
    return true
  }

  const validateChanges = () => {
    if (!changesResponse.trim()) {
      setNotification({ open: true, message: 'Please describe the required changes.', severity: 'error' })
      return false
    }
    return true
  }

  const submitReview = async (status, responseText) => {
    if (status === 'Approved' && !validateApproval()) {
      return false
    }

    if (status === 'Changes Requested' && !validateChanges()) {
      return false
    }

    setActionLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/submissions/${submissionId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          supervisor_response: responseText || supervisorResponse,
          grade
        })
      })

      if (response.ok) {
        setNotification({ 
          open: true, 
          message: `Submission ${status} successfully`, 
          severity: 'success' 
        })
        setActionLoading(false)
        return true
      } else {
        throw new Error('Failed to update submission')
      }
    } catch (error) {
      setNotification({ open: true, message: error.message, severity: 'error' })
      setActionLoading(false)
      return false
    }
  }

  const handleApprove = async () => {
    return await submitReview('Approved', supervisorResponse)
  }

  const handleRequestChanges = async () => {
    return await submitReview('Changes Requested', changesResponse)
  }

  return {
    submission,
    project,
    loading,
    actionLoading,
    grade,
    setGrade,
    supervisorResponse,
    setSupervisorResponse,
    changesResponse,
    setChangesResponse,
    notification,
    setNotification,
    handleApprove,
    handleRequestChanges,
    isApproved: submission?.status === 'Approved'
  }
}
