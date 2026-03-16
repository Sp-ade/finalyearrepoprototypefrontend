import { useState, useEffect } from 'react';
import API_URL from '../config';

export const useAssignStudent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/supervisors/students`);
            if (!response.ok) throw new Error('Failed to fetch students');

            const data = await response.json();
            setStudents(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Could not load students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const setAsLeader = async (userId, supervisorId) => {
        try {
            const response = await fetch(`${API_URL}/api/supervisors/students/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ supervisorId })
            });

            if (!response.ok) {
                throw new Error('Failed to update student role');
            }

            // Update local state without fetching all again
            setStudents(prev => prev.map(student =>
                student.id === userId
                    ? { ...student, role: 'leader', leader_assigned_by: supervisorId }
                    : student
            ));

            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    const unassignLeader = async (userId, supervisorId) => {
        try {
            const response = await fetch(`${API_URL}/api/supervisors/students/${userId}/unassign-role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ supervisorId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to unassign leader');
            }

            // Update local state
            setStudents(prev => prev.map(student =>
                student.id === userId
                    ? { ...student, role: 'member', leader_assigned_by: null }
                    : student
            ));

            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    return { students, loading, error, setAsLeader, unassignLeader, refetch: fetchStudents };
};
