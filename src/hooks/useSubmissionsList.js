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

export const useSubmissionsList = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/submissions`)
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
