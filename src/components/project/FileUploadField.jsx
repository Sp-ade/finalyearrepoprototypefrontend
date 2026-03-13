import React from 'react'
import { Box, Typography, Button } from '@mui/material'
//drag and drop file upload of project create, the input 
const FileUploadField = ({
  index,
  file,
  existingFile,
  onFileChange,
  onClear
}) => {
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      onFileChange(droppedFile)
    }
  }

  const handleClick = () => {
    document.getElementById(`fileUpload${index}`)?.click()
  }

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null
    if (selectedFile) {
      onFileChange(selectedFile)
    }
  }

  const hasFile = !!(file || existingFile)
  const displayName = file ? file.name : (existingFile?.file_name || existingFile?.originalName || 'Existing Document')
  const displaySize = file ? `${(file.size / 1024).toFixed(2)} KB` : (existingFile?.file_size ? `${(existingFile.file_size / 1024).toFixed(2)} KB` : '')

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: hasFile ? 'success.main' : 'primary.main',
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: hasFile ? (file ? 'success.light' : '#e8f5e9') : 'grey.50',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'primary.light',
            borderColor: 'primary.dark',
          }
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          id={`fileUpload${index}`}
          hidden
          accept=".pdf"
          onChange={handleInputChange}
        />
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {hasFile ? `✓ Document ${index + 1} ${file ? 'Selected' : 'Uploaded'}` : `Document ${index + 1}: Drag & drop here`}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {hasFile ? `${displayName} ${displaySize ? `(${displaySize})` : ''}` : 'or click to browse'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Accepted format: PDF
        </Typography>
      </Box>
      {hasFile && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          sx={{ mt: 1 }}
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
        >
          Clear Document {index + 1}
        </Button>
      )}
    </Box>
  )
}

export default FileUploadField
