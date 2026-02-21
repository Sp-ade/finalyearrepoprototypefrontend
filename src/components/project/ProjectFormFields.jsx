import React from 'react';
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProjectFormFields = ({
    title, setTitle,
    category, setCategory,
    academicYear, setAcademicYear,
    selectedSupervisor, setSelectedSupervisor,
    supervisors,
    description, setDescription,
    tags, setTags
}) => {
    return (
        <Stack spacing={3} sx={{ mt: 3 }}>
            <TextField
                label="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <MenuItem value="Design">Design</MenuItem>
                        <MenuItem value="Development">Development</MenuItem>
                        <MenuItem value="Research">Research</MenuItem>
                        <MenuItem value="Case Study">Case Study</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Academic Year"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    fullWidth
                    required
                />
            </Stack>

            <FormControl fullWidth required>
                <InputLabel>Select Supervisor</InputLabel>
                <Select
                    value={selectedSupervisor}
                    label="Select Supervisor"
                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                >
                    {supervisors.map((sup) => (
                        <MenuItem key={sup.id} value={sup.id}>
                            {sup.first_name} {sup.last_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={6}
                fullWidth
                required
                placeholder="Describe your project"
            />

            <TextField
                label="Tags"
                placeholder="tag1, tag2, tag3"
                value={tags}
                onChange={e => setTags(e.target.value)}
                fullWidth
                helperText="Separate tags with commas"
            />
        </Stack>
    );
};

export default ProjectFormFields;
