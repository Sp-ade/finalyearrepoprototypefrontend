import { useState, useEffect } from 'react'
import API_URL from '../config'

// logic for project creation and editing
export const useProjectForm = (editMode = false, projectId = null) => {
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
  const [existingAttachments, setExistingAttachments] = useState([null, null])
  const [students, setStudents] = useState([{ name: '', id: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (editMode && projectId) {
      const fetchProject = async () => {
        setLoading(true)
        try {
          const res = await fetch(`${API_URL}/api/projects/${projectId}`)
          if (!res.ok) throw new Error('Failed to fetch project details')
          const data = await res.json()
          const proj = data.project || data

          setProjectData({
            projectTitle: proj.title || '',
            academicYear: proj.year || '',
            projectType: proj.category || '',
            description: proj.description || '',
            tags: (proj.Tags || []).join(', '),
            grade: proj.grade || '',
            finalRemark: proj.supervisor_remark || proj.finalRemark || '',
          })

          if (proj.Studentnames && proj.Studentnames.length > 0) {
            setStudents(proj.Studentnames.map((name, i) => ({
              name,
              id: proj.StudentIDs?.[i] || ''
            })))
          }

          if (proj.artifacts || proj.attachments) {
            const arts = proj.artifacts || proj.attachments
            const newExisting = [null, null]
            if (arts[0]) newExisting[0] = arts[0]
            if (arts[1]) newExisting[1] = arts[1]
            setExistingAttachments(newExisting)
          }

          setLoading(false)
        } catch (err) {
          setError(err.message)
          setLoading(false)
        }
      }
      fetchProject()
    }
  }, [editMode, projectId])

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
    setExistingAttachments(prev => {
      const next = [...prev]
      next[index] = null
      return next
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
              size: uploadData.data.size,
              fileName: uploadData.data.originalName
            })
          }
        } catch (err) {
          throw new Error(err.message)
        }
      } else if (existingAttachments[i]) {
        const ext = existingAttachments[i]
        attachments.push({
          url: ext.file_path || ext.url,
          fileName: ext.file_name || ext.originalName || ext.fileName,
          originalName: ext.file_name || ext.originalName || ext.fileName,
          publicId: ext.public_id || ext.publicId,
          size: ext.file_size || ext.size
        })
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
      const studentIds = students.map(s => s.id).filter(Boolean)
      const attachments = await uploadFiles()
      const tagArray = projectData.tags.split(',').map(t => t.trim()).filter(Boolean)

      const payload = {
        name: projectData.projectTitle || 'Project',
        title: projectData.projectTitle || 'Untitled',
        description: projectData.description || 'No description provided',
        supervisor: localStorage.getItem('userName') || 'TBD',
        StudentCount: studentNames.length,
        Studentnames: studentNames,
        StudentIDs: studentIds,
        Tags: tagArray,
        category: projectData.projectType || 'General',
        year: projectData.academicYear || new Date().getFullYear().toString(),
        grade: projectData.grade || 'Pending',
        finalRemark: projectData.finalRemark || 'Evaluation pending',
        supervisorId: localStorage.getItem('userId'),
        attachments: attachments
      }

      const url = editMode ? `${API_URL}/api/projects/${projectId}` : `${API_URL}/api/projects`
      const method = editMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to save project')
      }

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
    existingAttachments,
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
