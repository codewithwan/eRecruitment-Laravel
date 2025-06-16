import axios from 'axios';
import { useEffect, useState } from 'react';

interface Education {
    id?: number;
    education_level: string;
    faculty: string;
    major_id: string;
    major?: string;
    institution_name: string;
    gpa: string;
    year_in: string;
    year_out: string;
}

export const useEducation = () => {
    const [education, setEducation] = useState<Education | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEducation = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Fetching education data...');

            const response = await axios.get('/api/candidate/education', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });

            console.log('✅ Education data received:', response.data);
            setEducation(response.data);

        } catch (error: any) {
            console.error('❌ Error fetching education:', error);
            if (error.response?.status === 404 || error.response?.data === null) {
                // No education data found - this is OK
                setEducation(null);
                setError(null);
            } else {
                setError('Gagal memuat data pendidikan');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateEducation = async (data: any, onSuccess?: () => void) => {
        try {
            setLoading(true);

            // Get the CSRF token from the cookie instead of meta tag
            // Laravel stores it in the XSRF-TOKEN cookie
            const getCsrfToken = () => {
                const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : null;
            };

            const csrfToken = getCsrfToken();
            console.log('🔐 Using CSRF Token:', csrfToken);

            const response = await fetch('/api/candidate/education', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': csrfToken || '',
                },
                credentials: 'include', // Important: include cookies in request
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Server returned error:', response.status, errorData);
                throw new Error(errorData.message || 'Failed to update education');
            }

            const result = await response.json();
            console.log('✅ Education data updated:', result);
            setEducation(result.data || result);

            if (onSuccess) {
                onSuccess();
            }

            return result;
        } catch (error) {
            console.error('❌ Error updating education:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const refreshEducation = async () => {
        console.log('🔄 Force refreshing education...');
        await fetchEducation();
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    return {
        education,
        loading,
        updateEducation,
        refreshEducation
    };
};
