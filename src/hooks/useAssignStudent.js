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

    const setAsLeader = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/supervisors/students/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update student role');
            }

            // Update local state without fetching all again
            setStudents(prev => prev.map(student =>
                student.id === userId
                    ? { ...student, role: 'leader' }
                    : student
            ));

            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    return { students, loading, error, setAsLeader, refetch: fetchStudents };
};
