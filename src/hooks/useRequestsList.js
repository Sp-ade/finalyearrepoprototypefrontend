import { useState, useEffect } from 'react'
import API_URL from '../config'

export const useRequestsList = (type) => {
  // type can be 'student' or 'supervisor'
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setError('You must be logged in to view requests')
        setLoading(false)
        return
      }

      try {
        const endpoint = type === 'student'
          ? `${API_URL}/api/requests/student/${userId}`
          : `${API_URL}/api/requests/supervisor/${userId}`

        const response = await fetch(endpoint)
        if (!response.ok) throw new Error('Failed to fetch requests')

        const data = await response.json()
        setRequests(data.success ? data.requests : [])
        setError(null)
      } catch (err) {
        console.error('Error fetching requests:', err)
        setError('Could not load requests. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [type])

  const deleteRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setRequests(requests.filter(r => r.request_id !== requestId))
        return true
      }
      return false
    } catch (err) {
      console.error('Error deleting request:', err)
      return false
    }
  }

  const updateRequest = async (requestId, status, response) => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, response })
      })

      if (!res.ok) throw new Error('Failed to update request')

      const updatedReq = await res.json()
      if (updatedReq.success) {
        setRequests(prev => prev.map(r =>
          r.request_id === requestId
            ? { ...r, status, supervisor_response: response, reviewed_at: new Date().toISOString() }
            : r
        ))
        return true
      }
      return false
    } catch (err) {
      console.error('Error updating request:', err)
      return false
    }
  }

  return { requests, loading, error, deleteRequest, updateRequest }
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'success'
    case 'Rejected': return 'error'
    default: return 'warning'
  }
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
