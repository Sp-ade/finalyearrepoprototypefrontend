import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Switch,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [roleFilter, search]);

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (roleFilter) params.append('role', roleFilter);
            if (search) params.append('search', search);

            const response = await fetch(`http://localhost:3000/api/admin/users?${params}`, {
                headers: {
                    'x-user-role': 'admin'
                }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admin/users/stats', {
                headers: {
                    'x-user-role': 'admin'
                }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': 'admin'
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, is_active: !currentStatus } : user
                ));
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'student': return 'primary';
            case 'supervisor': return 'success';
            case 'admin': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Back Button */}
                <Button onClick={() => navigate('/admindashboard')} sx={{ mb: 3 }}>
                    ← Back to Dashboard
                </Button>

                {/* Header */}
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    User Management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage all users in the system
                </Typography>

                {/* Statistics */}
                {stats && (
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <Chip label={`Total: ${stats.total_users}`} color="default" />
                        <Chip label={`Students: ${stats.total_students}`} color="primary" />
                        <Chip label={`Supervisors: ${stats.total_supervisors}`} color="success" />
                        <Chip label={`Active: ${stats.active_users}`} color="info" />
                    </Stack>
                )}

                {/* Filters */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Search by name or email"
                            variant="outlined"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={roleFilter}
                                label="Filter by Role"
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <MenuItem value="">All Roles</MenuItem>
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="supervisor">Supervisor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Paper>

                {/* Users Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Joined</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            {user.first_name} {user.last_name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                color={getRoleColor(user.role)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{user.department || 'N/A'}</TableCell>
                                        <TableCell>
                                            {user.role === 'admin' && user.admin_level
                                                ? user.admin_level
                                                : user.identifier || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.is_active ? 'Active' : 'Inactive'}
                                                color={user.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={user.is_active}
                                                onChange={() => handleStatusToggle(user.id, user.is_active)}
                                                color="success"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography color="text.secondary">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default UserManagement;
