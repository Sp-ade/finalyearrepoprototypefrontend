import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Button, Chip, Stack, Container } from '@mui/material'
import PageHeader from '../components/common/PageHeader'
import TagFilterDialog from '../components/common/TagFilterDialog'
import Card from '../components/project/ProjectCard'
import API_URL from '../config'

const AdminBrowse = () => {
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('All')
    const [yearFilter, setYearFilter] = useState('All')
    const [supervisorFilter, setSupervisorFilter] = useState('All')
    const [selectedTags, setSelectedTags] = useState([])
    const [projects, setProjects] = useState([])
    const projectsRef = useRef(null)
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`)
            const data = await response.json()
            if (data.projects) {
                setProjects(data.projects)
            }
        } catch (err) {
            console.error('Error fetching projects:', err)
        } finally {
            setLoading(false)
        }
    }

    const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))], [projects])
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
            const matchesQuery =
                p.name?.toLowerCase().includes(query.trim().toLowerCase()) ||
                p.title?.toLowerCase().includes(query.trim().toLowerCase()) ||
                p.category?.toLowerCase().includes(query.trim().toLowerCase()) ||
                (p.Studentnames && Array.isArray(p.Studentnames) && p.Studentnames.some(name => name.toLowerCase().includes(query.trim().toLowerCase())))
            const matchesCategory = filter === 'All' || p.category === filter
            const matchesYear = yearFilter === 'All' || p.year === yearFilter
            const matchesSupervisor = supervisorFilter === 'All' || p.supervisor === supervisorFilter

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
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <PageHeader title="Admin Project Browse" showBack={true} backPath="/admindashboard" />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Browse and manage all projects within the system.
                    </Typography>

                    {/* Search and Filters */}
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Search projects by title, department, or student name"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            sx={{ bgcolor: 'white', borderRadius: 1 }}
                        />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Department</InputLabel>
                                <Select
                                    value={filter}
                                    label="Department"
                                    onChange={e => setFilter(e.target.value)}
                                >
                                    {categories.map(c => (
                                        <MenuItem key={c} value={c}>{c}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={yearFilter}
                                    label="Year"
                                    onChange={e => setYearFilter(e.target.value)}
                                >
                                    {years.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Supervisor</InputLabel>
                                <Select
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

                        <Box>
                            <Button
                                variant="outlined"
                                onClick={() => setIsTagDialogOpen(true)}
                                sx={{ textTransform: 'none' }}
                            >
                                Filter by Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                            </Button>
                        </Box>

                        {selectedTags.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {selectedTags.map(tag => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleTagRemove(tag)}
                                        color="primary"
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Box>

                <TagFilterDialog
                    open={isTagDialogOpen}
                    onClose={() => setIsTagDialogOpen(false)}
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onTagClick={handleTagClick}
                />

                {/* Projects Grid */}
                <Box ref={projectsRef}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
                    </Typography>
                    
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                        gap: 3 
                    }}>
                        {filtered.map(p => (
                            <Card key={p.id} project={p} buttonText="View Project" />
                        ))}
                    </Box>

                    {!loading && filtered.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 10 }}>
                            <Typography color="text.secondary">No projects found matching your criteria.</Typography>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    )
}

export default AdminBrowse
