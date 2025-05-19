import { useState, useEffect } from 'react';
import axios from 'axios';

interface Education {
    id?: number;
    education_level: string;
    faculty: string;
    major: string;
    institution_name: string;
    gpa: string;
    year_in: string;
    year_out: string;
}

export function useEducation() {
    const [education, setEducation] = useState<Education | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEducation = async () => {
        try {
            const response = await axios.get('/candidate/education/data');
            setEducation(response.data);
        } catch (error) {
            console.error('Error fetching education:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateEducation = async (data: Education) => {
        try {
            const response = await axios.post('/candidate/education', data);
            setEducation(response.data);
            return { success: true, message: 'Education updated successfully' };
        } catch (error) {
            console.error('Error updating education:', error);
            return { success: false, message: 'Failed to update education' };
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    return { education, loading, updateEducation, fetchEducation };
}