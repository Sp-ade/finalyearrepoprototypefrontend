import { useState, useEffect } from 'react'
import API_URL from '../config'

export const useStudentProjectForm = (editMode = false, editProjectId = null, editSubmissionId = null) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString())
  const [selectedSupervisor, setSelectedSupervisor] = useState('')
  const [tags, setTags] = useState('')
  const [files, setFiles] = useState([null, null])
  const [existingAttachments, setExistingAttachments] = useState([null, null])
  const [rows, setRows] = useState([{ name: '', id: '' }])
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentUserId = localStorage.getItem('userId')

  // Fetch supervisors and initialize form
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/submissions/supervisors`)
        if (response.ok) {
          const data = await response.json()
          setSupervisors(data)
        }
      } catch (err) {
        console.error('Failed to fetch supervisors:', err)
      }
    }

    fetchSupervisors()

    if (!editMode) {
      const name = localStorage.getItem('userName') || ''
      if (name) setRows([{ name, id: '' }])
    }
  }, [editMode])

  // Load project data in edit mode
  useEffect(() => {
    if (editMode && editProjectId) {
      const loadProject = async () => {
        try {
          const res = await fetch(`${API_URL}/api/projects/${editProjectId}`)
          const data = await res.json()
          const proj = data.project || data
          
          setTitle(proj.title || '')
          setDescription(proj.description || '')
          setCategory(proj.category || '')
          setAcademicYear(proj.year || new Date().getFullYear().toString())
          setSelectedSupervisor(proj.supervisor_id || '')
          if (proj.Tags && proj.Tags.length > 0) setTags(proj.Tags.join(', '))
          if (proj.Studentnames && proj.Studentnames.length > 0) {
            setRows(proj.Studentnames.map(n => ({ name: n, id: '' })))
          }

          if (proj.artifacts && proj.artifacts.length > 0) {
            const newExisting = [null, null]
            const pdfArtifacts = proj.artifacts.filter(a => a.file_type === 'application/pdf')
            if (pdfArtifacts[0]) newExisting[0] = pdfArtifacts[0]
            if (pdfArtifacts[1]) newExisting[1] = pdfArtifacts[1]
            setExistingAttachments(newExisting)
          }
        } catch (err) {
          console.error('Failed to load project for editing:', err)
          setError('Failed to load project data')
        }
      }
      loadProject()
    }
  }, [editMode, editProjectId])

  const handleStudentChange = (index, field, value) => {
    const next = [...rows]
    next[index] = { ...next[index], [field]: value }
    setRows(next)
  }

  const handleAddStudent = () => {
    setRows(prev => [...prev, { name: '', id: '' }])
  }

  const handleRemoveStudent = (index) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleFileChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => {
        const newFiles = [...prev]
        newFiles[index] = e.target.files[0]
        return newFiles
      })
    }
  }

  const handleClearFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles[index] = null
      return newFiles
    })
  }

  const validateForm = () => {
    if (!title || !description || !category || !selectedSupervisor) {
      setError('Please fill in all required fields.')
      return false
    }

    const hasProposal = files[0] || existingAttachments[0]
    const hasReport = files[1] || existingAttachments[1]

    if (!hasProposal && !hasReport) {
      setError('Please upload at least one proposal document.')
      return false
    }

    return true
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

          if (!uploadRes.ok) throw new Error(`File ${i + 1} upload failed`)
          const uploadData = await uploadRes.json()

          attachments.push({
            url: uploadData.data.url,
            publicId: uploadData.data.publicId,
            fileName: uploadData.data.originalName,
            originalName: uploadData.data.originalName,
            size: uploadData.data.size,
            fileType: 'application/pdf'
          })
        } catch (err) {
          throw new Error(err.message)
        }
      } else if (existingAttachments[i]) {
        const ext = existingAttachments[i]
        attachments.push({
          url: ext.file_path,
          fileName: ext.file_name,
          originalName: ext.file_name,
          fileType: ext.file_type || 'application/pdf'
        })
      }
    }

    return attachments
  }

  const submitProject = async () => {
    if (!validateForm()) return false

    setLoading(true)
    setError(null)

    try {
      const studentNames = rows.map(r => r.name).filter(Boolean)
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      const attachments = await uploadFiles()

      const projectData = {
        title,
        name: title,
        description,
        category,
        year: academicYear,
        supervisorId: selectedSupervisor,
        StudentCount: studentNames.length,
        Studentnames: studentNames,
        Tags: tagArray,
        attachments: attachments,
        status: 'Pending',
        grade: 'Pending'
      }

      if (editMode && editProjectId) {
        const updateRes = await fetch(`${API_URL}/api/projects/${editProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        if (!updateRes.ok) throw new Error('Failed to update project')

        const resubRes = await fetch(`${API_URL}/api/submissions/${editSubmissionId}/resubmit`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!resubRes.ok) throw new Error('Failed to resubmit for validation')
      } else {
        const projectRes = await fetch(`${API_URL}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        if (!projectRes.ok) throw new Error('Failed to create project record')
        
        const projectResult = await projectRes.json()
        const newProjectId = projectResult.project.id || projectResult.project.project_id

        const submissionRes = await fetch(`${API_URL}/api/submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: currentUserId,
            project_id: newProjectId
          })
        })
        if (!submissionRes.ok) throw new Error('Failed to submit project for validation')
      }

      setLoading(false)
      return true
    } catch (err) {
      console.error(err)
      setError(err.message || 'An error occurred during submission')
      setLoading(false)
      return false
    }
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    academicYear,
    setAcademicYear,
    selectedSupervisor,
    setSelectedSupervisor,
    tags,
    setTags,
    files,
    existingAttachments,
    rows,
    supervisors,
    loading,
    error,
    setError,
    handleStudentChange,
    handleAddStudent,
    handleRemoveStudent,
    handleFileChange,
    handleClearFile,
    submitProject
  }
}
