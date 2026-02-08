import React, { useState } from 'react'
import { Box, Paper, TextField, Button, Stack, Typography } from '@mui/material'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

const ProjectCreate = () => {
  const [rows, setRows] = useState([{ name: '', id: '' }])
  const navigate = useNavigate()

  const handleChange = (index, field, value) => {
    const next = [...rows]
    next[index] = { ...next[index], [field]: value }
    setRows(next)
  }

  const handleAdd = () => {
    setRows(prev => [...prev, { name: '', id: '' }])
  }

  const handleRemove = (index) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter((_, i) => i !== index))
    }
  }

  const [projectTitle, setProjectTitle] = useState('')
  const [projectName, setProjectName] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [projectType, setProjectType] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [grade, setGrade] = useState('')
  const [finalRemark, setFinalRemark] = useState('')
  const [files, setFiles] = useState([null, null])
  const [supervisor, setSupervisor] = useState(localStorage.getItem('userName') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles[index] = selectedFile
      return newFiles
    })
  }

  const handleClearFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles[index] = null
      return newFiles
    })
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    setUploadProgress(0)

    try {
      const studentNames = rows.map(r => r.name).filter(Boolean)
      const attachments = []

      // Upload files to Cloudinary if present
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          const formData = new FormData()
          formData.append('document', files[i])

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
        }
      }

      // Parse tags
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)

      // Create project object
      const projectData = {
        name: projectTitle || 'Project',
        title: projectTitle || 'Untitled',
        description: description || 'No description provided',
        supervisor: supervisor || 'TBD',
        StudentCount: studentNames.length,
        Studentnames: studentNames,
        Tags: tagArray,
        category: projectType || 'General',
        year: academicYear || new Date().getFullYear().toString(),
        grade: grade || 'Pending',
        finalRemark: finalRemark || 'Evaluation pending',
        supervisorId: localStorage.getItem('userId'),
        ...(attachments.length > 0 && { attachments: attachments })
      }

      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      })

      if (!res.ok) throw new Error('Failed to save project')

      const data = await res.json()
      setLoading(false)
      navigate('/staffbrowse')
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 3, width: 800, maxWidth: '95%' }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project Creation
        </Typography>

        {rows.map((r, i) => (
          <Stack key={i} direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <TextField
              label="Student name"
              variant="outlined"
              fullWidth
              value={r.name}
              onChange={e => handleChange(i, 'name', e.target.value)}
            />

            <TextField
              label="ID"
              variant="outlined"
              sx={{ width: 160 }}
              value={r.id}
              onChange={e => handleChange(i, 'id', e.target.value)}
            />

            <Button variant="outlined" onClick={handleAdd}>
              +
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemove(i)}
              disabled={rows.length === 1}
            >
              -
            </Button>
          </Stack>
        ))}

        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Project Title"
            value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            fullWidth
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Academic Year"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              sx={{ width: 200 }}
            />

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="project-type-label">Project Type</InputLabel>
              <Select
                labelId="project-type-label"
                value={projectType}
                label="Project Type"
                onChange={e => setProjectType(e.target.value)}
              >
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Research">Research</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Grade"
              value={grade}
              onChange={e => setGrade(e.target.value)}
              sx={{ width: 160 }}
            />
          </Stack>

          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />

          <TextField
            label="Final Remark"
            value={finalRemark}
            onChange={e => setFinalRemark(e.target.value)}
            multiline
            rows={2}
            fullWidth
            placeholder="Evaluation remarks and feedback"
          />

          <TextField
            label="Tags"
            placeholder="tag1, tag2, tag3"
            value={tags}
            onChange={e => setTags(e.target.value)}
            fullWidth
            helperText="Separate tags with commas"
          />

          <Typography variant="body1" sx={{ mt: 1, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
            <strong>Supervisor:</strong> {supervisor}
          </Typography>

          {/* File Upload Section 1 - Drag & Drop */}
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: files[0] ? 'success.main' : 'primary.main',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: files[0] ? 'success.light' : 'grey.50',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.light',
                  borderColor: 'primary.dark',
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const droppedFile = e.dataTransfer.files[0]
                if (droppedFile) {
                  setFiles(prev => {
                    const newFiles = [...prev]
                    newFiles[0] = droppedFile
                    return newFiles
                  })
                }
              }}
              onClick={() => document.getElementById('fileUpload1')?.click()}
            >
              <input
                type="file"
                id="fileUpload1"
                hidden
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 0)}
              />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {files[0] ? '✓ Document 1 Selected' : 'Document 1: Drag & drop here'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {files[0] ? `${files[0].name} (${(files[0].size / 1024).toFixed(2)} KB)` : 'or click to browse'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Accepted format: PDF
              </Typography>
            </Box>
            {files[0] && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearFile(0)
                }}
              >
                Clear Document 1
              </Button>
            )}
          </Box>

          {/* File Upload Section 2 - Drag & Drop */}
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: files[1] ? 'success.main' : 'primary.main',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: files[1] ? 'success.light' : 'grey.50',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.light',
                  borderColor: 'primary.dark',
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const droppedFile = e.dataTransfer.files[0]
                if (droppedFile) {
                  setFiles(prev => {
                    const newFiles = [...prev]
                    newFiles[1] = droppedFile
                    return newFiles
                  })
                }
              }}
              onClick={() => document.getElementById('fileUpload2')?.click()}
            >
              <input
                type="file"
                id="fileUpload2"
                hidden
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 1)}
              />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {files[1] ? '✓ Document 2 Selected' : 'Document 2: Drag & drop here'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {files[1] ? `${files[1].name} (${(files[1].size / 1024).toFixed(2)} KB)` : 'or click to browse'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Accepted format: PDF
              </Typography>
            </Box>
            {files[1] && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearFile(1)
                }}
              >
                Clear Document 2
              </Button>
            )}
          </Box>
        </Stack>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

      </Paper>
    </Box>
  )
}

export default ProjectCreate
