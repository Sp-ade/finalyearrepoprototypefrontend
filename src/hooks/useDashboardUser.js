import { useState, useEffect } from 'react'
import API_URL from '../config'

export const useDashboardUser = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('email')
      if (!email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/me?email=${encodeURIComponent(email)}`)
        if (response.ok) {
          const userData = await response.json()
          setFirstName(userData.firstName || '')
          setLastName(userData.lastName || '')
          setUserId(userData.id)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return { firstName, lastName, userId, loading }
}
