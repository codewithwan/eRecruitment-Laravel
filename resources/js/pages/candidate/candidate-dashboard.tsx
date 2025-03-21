import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Check, FileCheck, BriefcaseBusiness, XCircle } from 'lucide-react';
// import { useRef, useState } from 'react';
import RecruitmentStageCard from '@/components/recruitment-stage-card';
import { useState } from 'react';

interface CandidateInfoProps {
    users?: User[];
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

// Breadcrumbs config
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Candidate',
        href: '/candidate',
    },
];

const currentCandidate = {
    avatar: 'https://via.placeholder.com/150',
    name: 'Albert Einstein',
    position: 'Software Engineer',
    appliedDate: '10 Maret 2025',
    stages: [
        {
            id: 1,
            name: 'Seleksi Administrasi',
            status: 'completed',
            date: '12 Maret 2025',
            location: 'Online',
            notes: 'Pastikan semua dokumen telah diunggah.',
        },
        {
            id: 2,
            name: 'Tes Psikotes',
            status: 'waiting',
            date: '20 Maret 2025',
            time: '09:00 WIB',
            duration: '90 menit',
            testType: 'Tes Kepribadian & Logika',
            location: 'Online via Zoom',
            notes: 'Harap login 30 menit sebelum tes dimulai. Pastikan koneksi internet stabil dan perangkat siap.',
        },
        {
            id: 3,
            name: 'Wawancara',
            status: 'waiting',
            date: '25 Maret 2025',
            time: '14:00 WIB',
            duration: '60 menit',
            testType: 'Wawancara Langsung',
            location: 'Kantor Pusat',
            notes: 'Berpakaian rapi dan formal. Bawa dokumen pendukung.',
        },
    ],
};

export default function CandidateDashboard(props: CandidateInfoProps) {
    const users = Array.isArray(props.users) ? props.users : props.users ? [props.users] : [];
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // const handleStartTest = () => {
    //     setShowConfirmDialog(true);
    // };

    const confirmStartTest = () => {
        setShowConfirmDialog(false);
        router.visit('/candidate/questions');
    };

    // const preparationRef = useRef<HTMLDivElement>(null);     
    // const scrollToPreparation = () => {
    //     if (preparationRef.current) {
    //         preparationRef.current.scrollIntoView({
    //             behavior: 'smooth',
    //         });
    //     }
    // };

    // Check if the user has passed the administrative selection stage
    const hasPassedAdmin = currentCandidate.stages.find(stage => stage.id === 1)?.status === 'completed';

    return (
        <div className="space-y-8">
            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="max-w-md mx-auto w-full">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Mulai Tes</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin memulai tes psikotes sekarang? Harap diperhatikan:
                            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                                <li>Anda tidak dapat meninggalkan tab ini selama tes berlangsung.</li>
                                <li>Pastikan koneksi internet Anda stabil.</li>
                                <li>Siapkan perangkat dengan kamera dan mikrofon yang berfungsi.</li>
                                <li>Tempatkan diri di ruangan yang tenang dan bebas gangguan.</li>
                            </ul>
                            <p className="mt-4 font-medium text-gray-800">Semangat! Tunjukkan potensi terbaik Anda. Kami percaya Anda bisa melakukannya!</p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="w-full sm:w-auto">Batal</Button>
                        <Button onClick={confirmStartTest} className="w-full sm:w-auto">Mulai Tes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UserLayout breadcrumbs={breadcrumbs}>
                <Head title="Tes Psikotes" />
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-2 sm:p-4">
                    <div className="space-y-6 sm:space-y-8">
                        {/* Candidate Profile */}
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-md">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 sm:border-4 border-white shadow-sm">
                                        <AvatarImage src={currentCandidate.avatar} alt={currentCandidate.name} />
                                        <AvatarFallback className="text-lg sm:text-xl">
                                            {users[0].name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-xl sm:text-2xl font-bold mb-1">{users[0].name}</h2>
                                        <p className="text-gray-600 mb-2 sm:mb-3">Kandidat {currentCandidate.position}</p>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm">
                                                <FileCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Lamaran: {currentCandidate.appliedDate}
                                            </Badge>
                                            {hasPassedAdmin ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 text-xs sm:text-sm">
                                                    <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Lolos Seleksi Administrasi
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200 text-xs sm:text-sm">
                                                    <XCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Belum Lolos Seleksi Administrasi
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recruitment Stages */}
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
                                <BriefcaseBusiness className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                Tahapan Rekrutmen
                            </h3>

                            <div className="relative border-l-2 border-gray-200 pl-4 sm:pl-8 space-y-4 sm:space-y-8 ml-2 sm:ml-4">
                                {currentCandidate.stages.map((stage) => (
                                    <RecruitmentStageCard key={stage.id} stage={stage} />
                                ))}
                            </div>
                        </div>

                        {/* Persiapan Tes Psikotes */}
                        {/* {hasPassedAdmin && (
                            <Card ref={preparationRef}>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center">
                                        <Check className="mr-2 h-5 w-5 text-primary" />
                                        Persiapan Tes Psikotes
                                    </CardTitle>
                                    <CardDescription>
                                        Beberapa hal yang perlu dipersiapkan sebelum tes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">
                                            Tes psikotes akan menilai kemampuan kognitif dan kepribadian Anda untuk memastikan kecocokan dengan posisi dan budaya perusahaan. Kami menyarankan agar Anda:
                                        </p>

                                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
                                                <h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">Sebelum Hari Tes</h4>
                                                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                                    <li className="flex items-start gap-2">
                                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5" />
                                                        <span>Riset tentang perusahaan dan jabatan yang dilamar</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5" />
                                                        <span>Berlatih dengan contoh soal psikotes umum</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5" />
                                                        <span>Siapkan dokumen yang diperlukan (KTP, CV, dll)</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
                                                <h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">Hari Tes</h4>
                                                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                                    <li className="flex items-start gap-2">
                                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5" />
                                                        <span>Login 30 menit sebelum jadwal</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5" />
                                                        <span>Pastikan koneksi internet stabil</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5" />
                                                        <span>Siapkan perangkat dengan kamera dan mikrofon yang berfungsi</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5" />
                                                        <span>Tempatkan diri di ruangan yang tenang dan bebas gangguan</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="p-3 sm:p-4 bg-green-50 rounded-md">
                                            <p className="text-xs sm:text-sm text-gray-600 italic">
                                                "Ingatlah bahwa tes ini adalah kesempatan untuk menunjukkan potensi terbaik Anda. Kami mencari kandidat yang tidak hanya memiliki keterampilan teknis yang tepat, tetapi juga kecocokan dengan nilai-nilai dan budaya perusahaan. Jadilah diri Anda sendiri dan jawab dengan jujur. Kami sangat menantikan untuk melihat bakat Anda!"
                                            </p>
                                            <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">- Tim Rekrutmen</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="px-4 sm:px-6 py-4 sm:py-6">
                                    <Button 
                                        className="w-full" 
                                        onClick={handleStartTest} 
                                    >
                                        Mulai Mengerjakan
                                    </Button>
                                </CardFooter>
                            </Card>
                        )} */}
                    </div>
                </div>
            </UserLayout>
        </div>
    );
}