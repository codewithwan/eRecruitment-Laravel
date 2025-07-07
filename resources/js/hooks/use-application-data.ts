import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { 
    UseApplicationDataParams, 
    CustomPageProps
} from '@/types/application';

export function useApplicationData(stage: string, params: UseApplicationDataParams) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CustomPageProps | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.company) queryParams.append('company', params.company);
                if (params.search) queryParams.append('search', params.search);
                if (params.status) queryParams.append('status', params.status);
                if (params.page) queryParams.append('page', params.page.toString());

                const routeMap: Record<string, string> = {
                    'administration': '/dashboard/company/administration',
                    'assessment': '/dashboard/company/assessment',
                    'interview': '/dashboard/company/interview'
                };

                const route = routeMap[stage];
                if (!route) {
                    throw new Error(`Invalid stage: ${stage}`);
                }

                await router.get(`${route}?${queryParams.toString()}`, {}, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (response) => {
                        const page = response as unknown as { props: CustomPageProps };
                        if (page?.props) {
                            setData(page.props);
                        }
                        setLoading(false);
                    },
                    onError: () => {
                        setError('An error occurred while fetching application data');
                        setLoading(false);
                    }
                });

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchData();
    }, [stage, params.period, params.company, params.search, params.status, params.page]);

    return { loading, error, data };
} 