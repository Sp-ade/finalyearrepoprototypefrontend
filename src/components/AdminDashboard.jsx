import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    People as PeopleIcon,
    Folder as FolderIcon,
    Assignment as AssignmentIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admin/analytics/dashboard', {
                headers: {
                    'x-user-role': 'admin' // In production, this would come from JWT
                }
            });
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <Card sx={{ height: '100%', bgcolor: `${color}.50` }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: `${color}.main` }}>
                            {value}
                        </Typography>
                    </Box>
                    <Icon sx={{ fontSize: 60, color: `${color}.main`, opacity: 0.3 }} />
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    System overview and management
                </Typography>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Users"
                            value={analytics?.users?.total_users || 0}
                            icon={PeopleIcon}
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Projects"
                            value={analytics?.projects?.total_projects || 0}
                            icon={FolderIcon}
                            color="success"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Requests"
                            value={analytics?.requests?.total_requests || 0}
                            icon={AssignmentIcon}
                            color="warning"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Active Users"
                            value={analytics?.users?.active_users || 0}
                            icon={PeopleIcon}
                            color="info"
                        />
                    </Grid>
                </Grid>

                {/* Detailed Statistics */}
                <Grid container spacing={3}>
                    {/* User Breakdown */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                User Breakdown
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Students</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {analytics?.users?.total_students || 0}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Supervisors</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {analytics?.users?.total_supervisors || 0}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Admins</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {analytics?.users?.total_admins || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Project Breakdown */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Project Status
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Active</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                                        {analytics?.projects?.active_projects || 0}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Completed</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {analytics?.projects?.completed_projects || 0}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Departments</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {analytics?.projects?.total_departments || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Request Breakdown */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Request Status
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Pending</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                        {analytics?.requests?.pending_requests || 0}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Approved</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                                        {analytics?.requests?.approved_requests || 0}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Rejected</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                                        {analytics?.requests?.rejected_requests || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Recent Activity */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Recent Activity
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {analytics?.recent_activity?.length > 0 ? (
                                    analytics.recent_activity.map((activity, index) => (
                                        <Box key={index} sx={{ py: 1, borderBottom: index < analytics.recent_activity.length - 1 ? '1px solid #eee' : 'none' }}>
                                            <Typography variant="body2">
                                                <strong>{activity.action.replace('_', ' ').toUpperCase()}</strong>: {activity.details}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(activity.created_at).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No recent activity</Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
