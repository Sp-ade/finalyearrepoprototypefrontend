import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Typography, Button, Fab, Chip, Stack } from '@mui/material'
import PageHeader from './common/PageHeader'
import TagFilterDialog from './common/TagFilterDialog'
import Card from './project/ProjectCard'
import heroImage from '../assets/scott-unsplash.jpg'
import API_URL from '../config'




const StaffBrowse = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [studentFilter, setStudentFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [supervisorFilter, setSupervisorFilter] = useState('All')
  const [selectedTags, setSelectedTags] = useState([])
  const [projects, setProjects] = useState([])
  const projectsRef = useRef(null)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
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
  const students = useMemo(() => ['All', ...Array.from(new Set(projects.flatMap(p => p.Studentnames || []).filter(Boolean)))], [projects])

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
      const matchesQuery =
        p.name?.toLowerCase().includes(query.trim().toLowerCase()) ||
        p.title?.toLowerCase().includes(query.trim().toLowerCase()) ||
        p.category?.toLowerCase().includes(query.trim().toLowerCase()) ||
        (p.Studentnames && Array.isArray(p.Studentnames) && p.Studentnames.some(name => name.toLowerCase().includes(query.trim().toLowerCase())))
      const matchesCategory = filter === 'All' || p.category === filter
      const matchesYear = yearFilter === 'All' || p.year === yearFilter
      const matchesSupervisor = supervisorFilter === 'All' || p.supervisor === supervisorFilter
      const matchesStudent = studentFilter === '' || studentFilter === 'All' || (p.Studentnames && Array.isArray(p.Studentnames) && p.Studentnames.includes(studentFilter))

      // Tag matching: project must have ALL selected tags (AND logic)
      let matchesTags = true
      if (selectedTags.length > 0) {
        const projectTags = p.Tags || p.tags || []
        const projectTagNames = Array.isArray(projectTags)
          ? projectTags.map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean)
          : []
        matchesTags = selectedTags.every(selectedTag => projectTagNames.includes(selectedTag))
      }

      return matchesQuery && matchesCategory && matchesYear && matchesSupervisor && matchesStudent && matchesTags
    })
  }, [query, filter, yearFilter, supervisorFilter, selectedTags, projects])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Box>

      <Box sx={{
        minHeight: { xs: 300, sm: 400 }, width: '100vw', position: 'relative', left: '50%',
        right: '50%', marginLeft: '-50vw', marginRight: '-50vw', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        px: 2, py: 4
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '2rem', sm: '3rem' } }}>Supervisor browse page</Typography>
          <Typography variant="h3" sx={{ color: 'white', fontSize: { xs: '1rem', sm: '1.2rem' } }}>Welcome to the project browse page</Typography>
        </Box>
        {/* search bar at the start of the page */}
        <Box sx={{ mb: 3, width: { xs: '90%', md: '80%', lg: '800px' }, display: 'flex', flexDirection: 'row' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Search projects"
              value={query}
              placeholder='Search by Name or Project Title'
              onChange={e => setQuery(e.target.value)}
              sx={{
                bgcolor: 'white',
                borderRadius: "40px 0px 0px 40px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '40px 0px 0px 40px',
                  '& fieldset': {
                    borderRadius: '40px 0px 0px 40px',
                  },
                },
              }}
            />
          </form>
          <Button
            variant="contained"
            onClick={handleSearchSubmit}
            sx={{
              px: 4,
              borderRadius: '0px 40px 40px 0px',
              bgcolor: '#49f663ff',
              boxShadow: 'none',
              color: '#ffffff',
              '&:hover': { bgcolor: '#3ed656', boxShadow: 'none' }
            }}
          >
            Search
          </Button>
        </Box>

      </Box>
      <Box sx={{ p: { xs: 2, md: 4 } }}>



        {/* title and filters */}
        <Box sx={{ mb: 3 }}>
          <PageHeader title="All Projects" showBack={false} />

          {/* Filter dropdowns */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 160 } }} size="small">
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                value={filter}
                label="Department"
                onChange={e => setFilter(e.target.value)}
              >
                {categories.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: '100%', sm: 160 } }} size="small">
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

            <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }} size="small">
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

          {/* Tag selection button */}
          {allTags.length > 0 && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setIsTagDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Filter by Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
              </Button>
            </Box>
          )}

          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <Box sx={{ mb: 2 }}>
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

        {/* Tag Filter Dialog */}
        <TagFilterDialog
          open={isTagDialogOpen}
          onClose={() => setIsTagDialogOpen(false)}
          allTags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
        />

        {/* project cards grid (forced two columns) */}
        <Box ref={projectsRef} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, maxWidth: 1100, mx: 'auto' }}>
          {filtered.map(p => (
            <Box key={p.id} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Card project={p} buttonText="Manage Project" />
            </Box>
          ))}
        </Box>
      </Box>
      {/* floating action button: create project */}
      <Box sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1400, }}>
        <Fab color="primary" aria-label="add" sx={{ height: 75, width: 75 }} onClick={() => navigate('/ProjectCreate')}>
          <Typography sx={{ fontSize: 50 }}>+</Typography>
        </Fab>
      </Box>
    </Box>
  )
}

export default StaffBrowse