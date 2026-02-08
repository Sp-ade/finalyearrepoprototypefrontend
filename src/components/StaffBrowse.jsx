import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Typography, Button, Fab, Chip, Stack } from '@mui/material'
import Card from './ProjectCard'
import heroImage from '../assets/scott-unsplash.jpg'
import API_URL from '../config'




const StaffBrowse = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [supervisorFilter, setSupervisorFilter] = useState('All')
  const [selectedTags, setSelectedTags] = useState([])
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          setProjects(data.projects)
        }
      })
      .catch(err => console.error('Error fetching projects:', err))
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.category)))], [projects])

  const years = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.year).filter(Boolean)))], [projects])

  const supervisors = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.supervisor).filter(Boolean)))], [projects])

  const allTags = useMemo(() => {
    const tagSet = new Set()
    projects.forEach(p => {
      const projectTags = p.Tags || p.tags || []
      if (Array.isArray(projectTags)) {
        projectTags.forEach(tag => {
          const tagName = typeof tag === 'string' ? tag : tag.name
          if (tagName) tagSet.add(tagName)
        })
      }
    })
    return Array.from(tagSet)
  }, [projects])

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const handleTagRemove = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesQuery = p.name ? p.name.toLowerCase().includes(query.trim().toLowerCase()) : false
      const matchesCategory = filter === 'All' || p.category === filter
      const matchesYear = yearFilter === 'All' || p.year === yearFilter
      const matchesSupervisor = supervisorFilter === 'All' || p.supervisor === supervisorFilter

      // Tag matching: project must have ALL selected tags (AND logic)
      let matchesTags = true
      if (selectedTags.length > 0) {
        const projectTags = p.Tags || p.tags || []
        const projectTagNames = Array.isArray(projectTags)
          ? projectTags.map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean)
          : []
        matchesTags = selectedTags.every(selectedTag => projectTagNames.includes(selectedTag))
      }

      return matchesQuery && matchesCategory && matchesYear && matchesSupervisor && matchesTags
    })
  }, [query, filter, yearFilter, supervisorFilter, selectedTags, projects])

  return (
    <Box>

      <Box sx={{
        height: 400, width: '100vw', position: 'relative', left: '50%',
        right: '50%', marginLeft: '-50vw', marginRight: '-50vw', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
      }}><Box sx={{ alignSelf: 'flex-start', justifySelf: 'flex-start', height: '40%' }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>Supervisor browse page</Typography>
        </Box>
        {/* search bar at the start of the page */}
        <Box sx={{ mb: 3, width: '80%' }}>
          <TextField
            fullWidth
            label="Search projects"
            value={query}
            onChange={e => setQuery(e.target.value)}
            sx={{
              bgcolor: 'white',
              width: "100%",
              borderRadius: "40px",
              '& .MuiOutlinedInput-root': {
                borderRadius: '40px',
                '& fieldset': {
                  borderRadius: '40px',
                },
              },
            }}
          />
        </Box>

      </Box>
      <Box sx={{ p: { xs: 2, md: 4 } }}>



        {/* title and filters */}
        <Box sx={{ mb: 3 }}>
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>All projects</Typography>

          {/* Filter dropdowns */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={filter}
                label="Category"
                onChange={e => setFilter(e.target.value)}
              >
                {categories.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel id="year-label">Year</InputLabel>
              <Select
                labelId="year-label"
                value={yearFilter}
                label="Year"
                onChange={e => setYearFilter(e.target.value)}
              >
                {years.map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="supervisor-label">Supervisor</InputLabel>
              <Select
                labelId="supervisor-label"
                value={supervisorFilter}
                label="Supervisor"
                onChange={e => setSupervisorFilter(e.target.value)}
              >
                {supervisors.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Tag selection */}
          {allTags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Filter by Tags:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {allTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagClick(tag)}
                    sx={{
                      cursor: 'pointer',
                      opacity: selectedTags.includes(tag) ? 0.5 : 1,
                      '&:hover': {
                        bgcolor: 'primary.light',
                      }
                    }}
                    disabled={selectedTags.includes(tag)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Selected Tags:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagRemove(tag)}
                    color="primary"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* project cards grid (forced two columns) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, maxWidth: 1100, mx: 'auto' }}>
          {filtered.map(p => (
            <Box key={p.id} sx={{ width: '100%' }}>
              <Card project={p} buttonText="Manage Project" />
            </Box>
          ))}
        </Box>
      </Box>
      {/* floating action button: create project */}
      <Box sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1400 }}>
        <Fab color="primary" aria-label="add" onClick={() => navigate('/ProjectCreate')}>
          <Typography>+</Typography>
        </Fab>
      </Box>
    </Box>
  )
}

export default StaffBrowse