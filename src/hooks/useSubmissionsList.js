import { useState, useEffect } from 'react'
import API_URL from '../config'

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Changes Requested']

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'success'
    case 'Rejected':
      return 'error'
    case 'Changes Requested':
      return 'warning'
    default:
      return 'info' // Pending
  }
}

export const useSubmissionsList = (supervisorId = null) => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchSubmissions()
  }, [supervisorId])

  const fetchSubmissions = async () => {
    try {
      const url = supervisorId 
        ? `${API_URL}/api/submissions?supervisorId=${supervisorId}`
        : `${API_URL}/api/submissions`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubmissions =
    filter === 'All'
      ? submissions
      : submissions.filter(s => s.status === filter)

  return {
    submissions: filteredSubmissions,
    allSubmissions: submissions,
    loading,
    filter,
    setFilter,
    statusOptions: STATUS_OPTIONS,
    getStatusColor,
    refreshSubmissions: fetchSubmissions
  }
}
