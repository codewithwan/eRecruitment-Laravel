import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
    Users, 
    Building2, 
    FileText, 
    Calendar, 
    ClipboardList, 
    MessageSquare,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowRight
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Dummy data for PT Mitra Karya Grup dashboard
const dashboardStats = {
    totalCandidates: 847,
    mitraKaryaAnalitika: 523,
    autentikKaryaAnalitika: 324,
    totalApplications: 1247,
    adminReview: 456,
    assessmentStage: 289,
    interviewStage: 123,
    pendingActions: 67
};

const recruitmentStageData = [
    { name: 'Administration', value: 456, color: '#3B82F6' },
    { name: 'Assessment', value: 289, color: '#1D4ED8' },
    { name: 'Interview', value: 123, color: '#1E3A8A' }
];

const recentActivities = [
    { id: 1, type: 'admin', message: 'New application submitted for Data Analyst - Mitra Karya Analitika', time: '5 minutes ago', status: 'new' },
    { id: 2, type: 'assessment', message: 'Assessment completed by Andi Pratama - Autentik Karya Analitika', time: '12 minutes ago', status: 'completed' },
    { id: 3, type: 'interview', message: 'Interview scheduled with Sari Dewi for Business Analyst position', time: '30 minutes ago', status: 'scheduled' },
    { id: 4, type: 'admin', message: 'Application approved for assessment - Marketing Specialist', time: '1 hour ago', status: 'approved' },
    { id: 5, type: 'interview', message: 'Interview completed - Final decision pending', time: '2 hours ago', status: 'completed' }
];

const weeklyData = [
    { day: 'Senin', admin: 45, assessment: 28, interview: 12 },
    { day: 'Selasa', admin: 52, assessment: 34, interview: 15 },
    { day: 'Rabu', admin: 38, assessment: 29, interview: 18 },
    { day: 'Kamis', admin: 61, assessment: 41, interview: 22 },
    { day: 'Jumat', admin: 49, assessment: 32, interview: 16 },
    { day: 'Sabtu', admin: 23, assessment: 15, interview: 8 },
    { day: 'Minggu', admin: 31, assessment: 18, interview: 9 }
];

const topPositions = [
    { title: 'Data Analyst', applications: 156, subsidiary: 'Mitra Karya Analitika' },
    { title: 'Business Intelligence Specialist', applications: 98, subsidiary: 'Autentik Karya Analitika' },
    { title: 'Marketing Analyst', applications: 87, subsidiary: 'Mitra Karya Analitika' },
    { title: 'Financial Analyst', applications: 76, subsidiary: 'Autentik Karya Analitika' },
    { title: 'HR Analytics Specialist', applications: 65, subsidiary: 'Mitra Karya Analitika' }
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin - PT Mitra Karya Grup" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                
                {/* Welcome Section */}
                <div className="bg-blue-600 rounded-lg p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">Dashboard Admin - PT Mitra Karya Grup</h1>
                    <p className="text-blue-100">Kelola sistem rekrutmen untuk Mitra Karya Analitika dan Autentik Karya Analitika</p>
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
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                +15% dari bulan lalu
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mitra Karya Analitika</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.mitraKaryaAnalitika}</div>
                            <p className="text-xs text-muted-foreground">Kandidat aktif</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Autentik Karya Analitika</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.autentikKaryaAnalitika}</div>
                            <p className="text-xs text-muted-foreground">Kandidat aktif</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Aplikasi</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{dashboardStats.totalApplications.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                +22% minggu ini
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
                    <Card className="md:col-span-2 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Aktivitas Mingguan Proses Rekrutmen</CardTitle>
                            <CardDescription>Progres kandidat melalui 3 tahap rekrutmen</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="admin" fill="#3B82F6" name="Administration" />
                                        <Bar dataKey="assessment" fill="#1D4ED8" name="Assessment" />
                                        <Bar dataKey="interview" fill="#1E3A8A" name="Interview" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recruitment Stage Distribution */}
                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Distribusi Tahap Rekrutmen</CardTitle>
                            <CardDescription>Kandidat per tahap proses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={recruitmentStageData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {recruitmentStageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Recent Activities */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Quick Actions */}
                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Aksi Cepat</CardTitle>
                            <CardDescription>Fungsi admin yang sering digunakan</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Link href="/admin/company" className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Kelola Perusahaan</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-600" />
                            </Link>
                            
                            <Link href="/admin/periods" className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Periode Rekrutmen</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-600" />
                            </Link>
                            
                            <Link href="/admin/candidates" className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Manajemen Kandidat</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-600" />
                            </Link>
                            
                            <Link href="/admin/questions" className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Bank Soal Assessment</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-600" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Aktivitas Terbaru</CardTitle>
                            <CardDescription>Update terbaru sistem rekrutmen</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className={`p-1 rounded-full ${
                                            activity.status === 'new' ? 'bg-blue-100' :
                                            activity.status === 'scheduled' ? 'bg-green-100' :
                                            activity.status === 'completed' ? 'bg-purple-100' :
                                            activity.status === 'approved' ? 'bg-emerald-100' :
                                            'bg-gray-100'
                                        }`}>
                                            {activity.type === 'admin' && <ClipboardList className="h-4 w-4 text-blue-600" />}
                                            {activity.type === 'assessment' && <FileText className="h-4 w-4 text-purple-600" />}
                                            {activity.type === 'interview' && <MessageSquare className="h-4 w-4 text-green-600" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Performing Positions */}
                <Card className="border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-700">Posisi dengan Aplikasi Terbanyak</CardTitle>
                        <CardDescription>Posisi yang paling diminati kandidat bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPositions.map((position, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{position.title}</h4>
                                            <p className="text-sm text-blue-600">{position.subsidiary}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-700">{position.applications}</div>
                                        <p className="text-xs text-gray-500">aplikasi</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Status & Tasks */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Status Sistem
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Database</span>
                                    <span className="text-sm text-green-600">Online</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Email Service</span>
                                    <span className="text-sm text-green-600">Aktif</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">File Storage</span>
                                    <span className="text-sm text-green-600">Normal</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Tugas Mendatang
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-sm">
                                    <span className="font-medium">Review Interview</span>
                                    <span className="text-gray-500 block">Deadline: 2 jam lagi</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Laporan Bulanan</span>
                                    <span className="text-gray-500 block">Deadline: Besok</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Backup Sistem</span>
                                    <span className="text-gray-500 block">Terjadwal: Malam ini</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                Tindakan Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Review Admin</span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">23</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Assessment Selesai</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">31</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Jadwal Interview</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">13</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
