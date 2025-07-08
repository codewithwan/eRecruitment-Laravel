import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { 
    Users, 
    Building2, 
    FileText, 
    ClipboardList, 
    MessageSquare,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    dashboardStats: {
        totalCandidates: number;
        companyStats: Array<{
            name: string;
            applications: number;
        }>;
        totalApplications: number;
        adminReview: number;
        assessmentStage: number;
        interviewStage: number;
        pendingActions: number;
    };
    recruitmentStageData: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    weeklyData: Array<{
        day: string;
        admin: number;
        assessment: number;
        interview: number;
    }>;
    recentActivities: Array<{
        id: number;
        type: string;
        message: string;
        time: string;
        status: string;
    }>;
    topPositions: Array<{
        title: string;
        applications: number;
        subsidiary: string;
    }>;
}

export default function Dashboard({ 
    dashboardStats,
    recruitmentStageData,
    weeklyData,
    recentActivities,
    topPositions
}: DashboardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading state for smoother transitions
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Check for any missing or invalid data
        const validateData = () => {
            if (!dashboardStats) {
                return 'Dashboard statistics are missing';
            }

            // Validate required properties in dashboardStats
            const requiredStats = [
                'totalCandidates',
                'companyStats',
                'totalApplications',
                'adminReview',
                'assessmentStage',
                'interviewStage',
                'pendingActions'
            ];

            const missingStats = requiredStats.filter(stat => !(stat in dashboardStats));
            if (missingStats.length > 0) {
                return `Missing required statistics: ${missingStats.join(', ')}`;
            }

            // Validate arrays have data
            if (!Array.isArray(recruitmentStageData) || recruitmentStageData.length === 0) {
                return 'Recruitment stage data is missing';
            }

            if (!Array.isArray(weeklyData) || weeklyData.length === 0) {
                return 'Weekly data is missing';
            }

            if (!Array.isArray(recentActivities)) {
                return 'Recent activities data is missing';
            }

            if (!Array.isArray(topPositions)) {
                return 'Top positions data is missing';
            }

            return null;
        };

        const validationError = validateData();
        if (validationError) {
            setError(validationError);
            console.error('Dashboard Data Validation Error:', {
                dashboardStats,
                recruitmentStageData,
                weeklyData,
                recentActivities,
                topPositions
            });
        } else {
            setError(null);
        }
    }, [dashboardStats, recruitmentStageData, weeklyData, recentActivities, topPositions]);

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard Admin - PT Mitra Karya Grup" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 rounded-xl p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-muted-foreground">Loading dashboard data...</p>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard Admin - PT Mitra Karya Grup" />
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin - PT Mitra Karya Grup" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Welcome Section */}
                <div className="bg-blue-600 rounded-lg p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">Dashboard Admin - PT Mitra Karya Grup</h1>
                    <p className="text-blue-100">Kelola sistem rekrutmen untuk semua perusahaan</p>
                </div>

                {/* Company Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Kandidat</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.totalCandidates.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total kandidat yang mendaftar
                            </p>
                        </CardContent>
                    </Card>

                    {dashboardStats.companyStats.map((company, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                                <div className="text-2xl font-bold text-blue-700">{company.applications}</div>
                            <p className="text-xs text-muted-foreground">Kandidat aktif</p>
                        </CardContent>
                    </Card>
                    ))}

                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Aplikasi</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.totalApplications.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total aplikasi masuk
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 3-Step Process Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Step 1: Administration</CardTitle>
                            <ClipboardList className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.adminReview}</div>
                            <p className="text-xs text-muted-foreground">Menunggu review admin</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Step 2: Assessment</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.assessmentStage}</div>
                            <p className="text-xs text-muted-foreground">Dalam tahap tes</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Step 3: Interview</CardTitle>
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.interviewStage}</div>
                            <p className="text-xs text-muted-foreground">Tahap wawancara</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Weekly Process Activity Chart */}
                    <Card className="lg:col-span-2 border-blue-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-blue-700 text-lg">Aktivitas 7 Hari Terakhir</CardTitle>
                            <CardDescription>Progres kandidat melalui 3 tahap rekrutmen</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart 
                                        data={weeklyData.slice(-7)} 
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis 
                                            dataKey="day" 
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickLine={{ stroke: '#64748b' }}
                                            axisLine={{ stroke: '#e2e8f0' }}
                                        />
                                        <YAxis 
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickLine={{ stroke: '#64748b' }}
                                            axisLine={{ stroke: '#e2e8f0' }}
                                            tickFormatter={(value) => Math.round(value).toString()}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value, name) => [value, name === 'admin' ? 'Administration' : name === 'assessment' ? 'Assessment' : 'Interview']}
                                            labelFormatter={(label) => `Tanggal: ${label}`}
                                        />
                                        <Legend 
                                            verticalAlign="top"
                                            height={36}
                                            formatter={(value) => value === 'admin' ? 'Administration' : value === 'assessment' ? 'Assessment' : 'Interview'}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="admin" 
                                            name="Administration" 
                                            stroke="#3B82F6" 
                                            strokeWidth={2}
                                            dot={{ fill: '#3B82F6', r: 3, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="assessment" 
                                            name="Assessment" 
                                            stroke="#10B981" 
                                            strokeWidth={2}
                                            dot={{ fill: '#10B981', r: 3, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="interview" 
                                            name="Interview" 
                                            stroke="#F59E0B" 
                                            strokeWidth={2}
                                            dot={{ fill: '#F59E0B', r: 3, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stage Distribution */}
                    <Card className="border-blue-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-blue-700 text-lg">Distribusi Tahap</CardTitle>
                            <CardDescription>Persentase kandidat per tahap</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px] flex items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={recruitmentStageData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            innerRadius={60}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {recruitmentStageData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color}
                                                    stroke="#fff"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Applications */}
                    <Card className="lg:col-span-2 border-blue-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-blue-700 text-lg">Aplikasi per Perusahaan</CardTitle>
                            <CardDescription>Jumlah aplikasi masuk tiap perusahaan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={dashboardStats.companyStats}
                                        layout="vertical"
                                        margin={{ top: 10, right: 10, left: 100, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" />
                                        <YAxis 
                                            dataKey="name" 
                                            type="category" 
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            width={100}
                                        />
                                        <Tooltip
                                            contentStyle={{ 
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => [`${value} aplikasi`, 'Jumlah']}
                                        />
                                        <Bar 
                                            dataKey="applications" 
                                            radius={[0, 4, 4, 0]}
                                        >
                                            {dashboardStats.companyStats.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`}
                                                    fill={`hsl(${220 + index * 20}, 84%, 60%)`}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Positions Chart */}
                    <Card className="border-blue-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-blue-700 text-lg">Top Posisi</CardTitle>
                            <CardDescription>5 posisi terpopuler</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={topPositions.slice(0, 5)}
                                        layout="vertical"
                                        margin={{ top: 10, right: 10, left: 100, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" />
                                        <YAxis
                                            dataKey="title"
                                            type="category"
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            width={100}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => [`${value} aplikasi`, 'Jumlah']}
                                        />
                                        <Bar
                                            dataKey="applications"
                                            fill="#3B82F6"
                                            radius={[0, 4, 4, 0]}
                                        >
                                            {topPositions.slice(0, 5).map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={`hsl(${200 + index * 15}, 84%, 60%)`}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Activities List */}
                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Aktivitas Terbaru</CardTitle>
                            <CardDescription>5 aktivitas terakhir dalam sistem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4">
                                            {activity.type === 'admin' && <ClipboardList className="h-4 w-4 text-blue-600" />}
                                        {activity.type === 'assessment' && <FileText className="h-4 w-4 text-blue-600" />}
                                        {activity.type === 'interview' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                        <div className={`text-xs ${
                                            activity.status === 'completed' ? 'text-green-600' :
                                            activity.status === 'scheduled' ? 'text-blue-600' :
                                            activity.status === 'new' ? 'text-yellow-600' :
                                            'text-gray-600'
                                        }`}>
                                            {activity.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}