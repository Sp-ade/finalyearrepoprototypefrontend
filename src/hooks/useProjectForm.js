import { useState } from 'react'
import API_URL from '../config'

export const useProjectForm = () => {
  const [projectData, setProjectData] = useState({
    projectTitle: '',
    academicYear: '',
    projectType: '',
    description: '',
    tags: '',
    grade: '',
    finalRemark: '',
  })

  const [files, setFiles] = useState([null, null])
  const [students, setStudents] = useState([{ name: '', id: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const updateField = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }))
  }

  const updateFile = (index, file) => {
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles[index] = file
      return newFiles
    })
  }

  const clearFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles[index] = null
      return newFiles
    })
  }

  const addStudent = () => {
    setStudents(prev => [...prev, { name: '', id: '' }])
  }

  const removeStudent = (index) => {
    if (students.length > 1) {
      setStudents(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateStudent = (index, field, value) => {
    setStudents(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const uploadFiles = async () => {
    const attachments = []

    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        const formData = new FormData()
        formData.append('document', files[i])

        try {
          const uploadRes = await fetch(`${API_URL}/api/upload/project-artifact`, {
            method: 'POST',
            body: formData
          })

          if (!uploadRes.ok) throw new Error(`Failed to upload file ${i + 1}`)

          const uploadData = await uploadRes.json()
          if (uploadData.success) {
            attachments.push({
              url: uploadData.data.url,
              publicId: uploadData.data.publicId,
              originalName: uploadData.data.originalName,
              size: uploadData.data.size
            })
          }
        } catch (err) {
          throw new Error(err.message)
        }
      }
    }

    return attachments
  }

  const submitProject = async () => {
    setError(null)
    setLoading(true)
    setUploadProgress(0)

    try {
      const studentNames = students.map(s => s.name).filter(Boolean)
      const attachments = await uploadFiles()
      const tagArray = projectData.tags.split(',').map(t => t.trim()).filter(Boolean)

      const payload = {
        name: projectData.projectTitle || 'Project',
        title: projectData.projectTitle || 'Untitled',
        description: projectData.description || 'No description provided',
        supervisor: localStorage.getItem('userName') || 'TBD',
        StudentCount: studentNames.length,
        Studentnames: studentNames,
        Tags: tagArray,
        category: projectData.projectType || 'General',
        year: projectData.academicYear || new Date().getFullYear().toString(),
        grade: projectData.grade || 'Pending',
        finalRemark: projectData.finalRemark || 'Evaluation pending',
        supervisorId: localStorage.getItem('userId'),
        ...(attachments.length > 0 && { attachments })
      }

      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to save project')

      await res.json()
      setLoading(false)
      return true
    } catch (err) {
      setLoading(false)
      setError(err.message)
      return false
    }
  }

  return {
    projectData,
    updateField,
    files,
    updateFile,
    clearFile,
    students,
    addStudent,
    removeStudent,
    updateStudent,
    loading,
    error,
    uploadProgress,
    submitProject,
    setError
  }
}
