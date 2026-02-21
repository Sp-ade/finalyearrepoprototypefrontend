import { useState } from 'react'
import API_URL from '../config'

export const useAccessRequest = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitRequest = async (projectId) => {
    const studentId = localStorage.getItem('userId')
    const userRole = localStorage.getItem('role')

    if (!studentId) {
      alert('You must be logged in to request access.')
      return false
    }

    if (userRole !== 'student') {
      alert('Only students can request project access.')
      return false
    }

    if (!reason.trim()) {
      alert('Please provide a reason for your request.')
      return false
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          projectId,
          reason
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Request submitted successfully!')
        setOpenDialog(false)
        setReason('')
        return true
      } else if (response.status === 409) {
        alert(data.message || 'You have already requested this project.')
        return false
      } else {
        throw new Error(data.message || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert(`Error: ${error.message}`)
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const closeDialog = () => {
    setOpenDialog(false)
    setReason('')
  }

  return {
    openDialog,
    setOpenDialog,
    reason,
    setReason,
    submitting,
    submitRequest,
    closeDialog
  }
}
