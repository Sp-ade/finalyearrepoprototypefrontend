import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, Typography, Snackbar, Alert, CircularProgress, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import API_URL from '../config';
import ParticipantTable from './project/ParticipantTable';
import ProjectFormFields from './project/ProjectFormFields';
import FileUploadSlot from './project/FileUploadSlot';
import PageHeader from './common/PageHeader';

const StudentProjectCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { editMode = false, projectId: editProjectId, submissionId: editSubmissionId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form States
    const [rows, setRows] = useState([{ name: '', id: '' }]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [tags, setTags] = useState('');

    // File State - Array for 2 files
    const [files, setFiles] = useState([null, null]);
    const [existingAttachments, setExistingAttachments] = useState([null, null]);

    const [supervisors, setSupervisors] = useState([]);

    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const response = await fetch(`${API_URL}/api/submissions/supervisors`);
                if (response.ok) {
                    const data = await response.json();
                    setSupervisors(data);
                }
            } catch (err) {
                console.error('Failed to fetch supervisors:', err);
            }
        };

        fetchSupervisors();
        if (!editMode) {
            const name = localStorage.getItem('userName') || '';
            if (name) setRows([{ name, id: '' }]);
        }
    }, [editMode]);

    // In edit mode, fetch existing project data and pre-fill the form
    useEffect(() => {
        if (editMode && editProjectId) {
            const loadProject = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/projects/${editProjectId}`);
                    const data = await res.json();
                    const proj = data.project || data;
                    setTitle(proj.title || '');
                    setDescription(proj.description || '');
                    setCategory(proj.category || '');
                    setAcademicYear(proj.year || new Date().getFullYear().toString());
                    setSelectedSupervisor(proj.supervisor_id || '');
                    if (proj.Tags && proj.Tags.length > 0) setTags(proj.Tags.join(', '));
                    if (proj.Studentnames && proj.Studentnames.length > 0) {
                        setRows(proj.Studentnames.map(n => ({ name: n, id: '' })));
                    }

                    // Populate existing attachments
                    if (proj.artifacts && proj.artifacts.length > 0) {
                        const newExisting = [null, null];
                        // Assuming the first two PDF artifacts are the ones we want
                        const pdfArtifacts = proj.artifacts.filter(a => a.file_type === 'application/pdf');
                        if (pdfArtifacts[0]) newExisting[0] = pdfArtifacts[0];
                        if (pdfArtifacts[1]) newExisting[1] = pdfArtifacts[1];
                        setExistingAttachments(newExisting);
                    }
                } catch (err) {
                    console.error('Failed to load project for editing:', err);
                }
            };
            loadProject();
        }
    }, [editMode, editProjectId]);

    const handleChange = (index, field, value) => {
        const next = [...rows];
        next[index] = { ...next[index], [field]: value };
        setRows(next);
    };

    const handleAdd = () => {
        setRows(prev => [...prev, { name: '', id: '' }]);
    };

    const handleRemove = (index) => {
        if (rows.length > 1) {
            setRows(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleFileChange = (e, index) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => {
                const newFiles = [...prev];
                newFiles[index] = e.target.files[0];
                return newFiles;
            });
        }
    };

    const handleClearFile = (index) => {
        setFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = null;
            return newFiles;
        });
    };

    const handleSubmit = async () => {
        if (!title || !description || !category || !selectedSupervisor) {
            setError('Please fill in all required fields.');
            return;
        }

        const hasProposal = files[0] || (existingAttachments[0]);
        const hasReport = files[1] || (existingAttachments[1]);

        if (!hasProposal && !hasReport) {
            setError('Please upload at least one proposal document.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const studentNames = rows.map(r => r.name).filter(Boolean);
            const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
            const attachments = [];

            for (let i = 0; i < files.length; i++) {
                if (files[i]) {
                    const formData = new FormData();
                    formData.append('document', files[i]);

                    const uploadRes = await fetch(`${API_URL}/api/upload/project-artifact`, {
                        method: 'POST',
                        body: formData
                    });

                    if (!uploadRes.ok) throw new Error(`File ${i + 1} upload failed`);
                    const uploadData = await uploadRes.json();

                    attachments.push({
                        url: uploadData.data.url,
                        publicId: uploadData.data.publicId,
                        fileName: uploadData.data.originalName,
                        originalName: uploadData.data.originalName,
                        size: uploadData.data.size,
                        fileType: 'application/pdf'
                    });
                } else if (existingAttachments[i]) {
                    const ext = existingAttachments[i];
                    attachments.push({
                        url: ext.file_path,
                        fileName: ext.file_name,
                        originalName: ext.file_name,
                        fileType: ext.file_type || 'application/pdf'
                    });
                }
            }

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
            };

            if (editMode && editProjectId) {
                const updateRes = await fetch(`${API_URL}/api/projects/${editProjectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
                if (!updateRes.ok) throw new Error('Failed to update project');

                const resubRes = await fetch(`${API_URL}/api/submissions/${editSubmissionId}/resubmit`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resubRes.ok) throw new Error('Failed to resubmit for validation');
            } else {
                const projectRes = await fetch(`${API_URL}/api/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
                if (!projectRes.ok) throw new Error('Failed to create project record');
                const projectResult = await projectRes.json();
                const newProjectId = projectResult.project.id || projectResult.project.project_id;

                const submissionRes = await fetch(`${API_URL}/api/submissions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        student_id: currentUserId,
                        project_id: newProjectId
                    })
                });
                if (!submissionRes.ok) throw new Error('Failed to submit project for validation');
            }

            setShowSuccess(true);
            setTimeout(() => navigate('/studentdashboard'), 2000);

        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during submission');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: '#f5f5f5' }}>
            <Paper sx={{ p: 4, width: 800, maxWidth: '100%' }} elevation={3}>
                <PageHeader
                    title="Submit Your Project"
                    subtitle="Submit your project for supervisor validation. Please upload both required documents. Proposal slides and final year report"
                />

                <ParticipantTable
                    rows={rows}
                    onChange={handleChange}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                />

                <ProjectFormFields
                    title={title} setTitle={setTitle}
                    category={category} setCategory={setCategory}
                    academicYear={academicYear} setAcademicYear={setAcademicYear}
                    selectedSupervisor={selectedSupervisor} setSelectedSupervisor={setSelectedSupervisor}
                    supervisors={supervisors}
                    description={description} setDescription={setDescription}
                    tags={tags} setTags={setTags}
                />

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Project Documents</Typography>
                <Stack spacing={2}>
                    {[0, 1].map((index) => (
                        <FileUploadSlot
                            key={index}
                            index={index}
                            file={files[index]}
                            existingFile={existingAttachments[index]}
                            onFileChange={handleFileChange}
                            onClear={handleClearFile}
                        />
                    ))}
                </Stack>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ py: 1.5, mt: 4, fullWidth: true }}
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Proposal'}
                </Button>
            </Paper>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    Project submitted successfully! Redirecting...
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StudentProjectCreate;
