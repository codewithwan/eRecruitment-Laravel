import axios from 'axios';
import { useEffect, useState } from 'react';

interface PeriodInfo {
  period: {
    id: number;
    name: string;
    start_date: string | null;
    end_date: string | null;
  };
  company: {
    id: number;
    name: string;
  };
}

export function usePeriodCompanyInfo(periodId: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodInfo, setPeriodInfo] = useState<PeriodInfo | null>(null);

  useEffect(() => {
    // Reset states when periodId changes
    setLoading(true);
    setError(null);
    
    // Don't fetch if no periodId is provided
    if (!periodId) {
      setLoading(false);
      return;
    }

    const fetchPeriodInfo = async () => {
      try {
        // Use the direct API route
        const response = await axios.get(`/api/periods/${periodId}/with-company`);
        if (response.data.success) {
          setPeriodInfo(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch period information');
        }
      } catch (err) {
        setError('An error occurred while fetching period information');
        console.error('Error fetching period information:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodInfo();
  }, [periodId]);

  return { loading, error, periodInfo };
}
