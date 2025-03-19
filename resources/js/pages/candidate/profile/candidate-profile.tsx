import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


import { Check, FileCheck, BriefcaseBusiness, CheckCircle2, Clock3, XCircle, CalendarDays, Clock, FileText } from 'lucide-react';
import { useRef, useState } from 'react';

// Breadcrumbs config
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard Candidate',
    href: '/candidate',
  },
];

// Dummy data untuk simulasi. Biasanya ini data dari controller Laravel Inertia.
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
    },
    {
      id: 2,
      name: 'Tes Psikotes',
      status: 'scheduled',
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
    },
  ],
};

export default function CandidatePsychotest() {
  const page = usePage();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleStartTest = () => {
    setShowConfirmDialog(true);
  };

  const confirmStartTest = () => {
    setShowConfirmDialog(false);
    // Navigate to the questions route as defined in web.php
    router.visit('/candidate/questions');
  };

  const preparationRef = useRef<HTMLDivElement>(null);
    const scrollToPreparation = () => {
      if (preparationRef.current) {
        preparationRef.current.scrollIntoView({
          behavior: 'smooth',
        });
      }
    };  

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
                    {currentCandidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{currentCandidate.name}</h2>
                  <p className="text-gray-600 mb-2 sm:mb-3">Kandidat {currentCandidate.position}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm">
                      <FileCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Lamaran: {currentCandidate.appliedDate}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 text-xs sm:text-sm">
                      <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Lolos Seleksi Administrasi
                    </Badge>
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
            {currentCandidate.stages.map((stage, idx) => (
              <div key={stage.id} className="relative">
                {/* Dot di timeline */}
                <div className={`absolute left-[-1.5rem] sm:left-[-2.5rem] top-6 p-1 rounded-full
                  ${stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                    stage.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`
                }>
                  {stage.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : stage.status === 'scheduled' ? (
                    <Clock3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>

                {/* Card stage */}
                <Card className={`border-l-4 
                  ${stage.status === 'completed' ? 'border-l-green-500' :
                    stage.status === 'scheduled' ? 'border-l-blue-500' :
                    'border-l-gray-300'
                  }`
                }>
                  <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                      <CardTitle className="text-base sm:text-lg">{stage.name}</CardTitle>
                      <Badge className={`self-start sm:self-auto
                        ${stage.status === 'completed' ? 'bg-green-500 text-white' : ''}
                        ${stage.status === 'scheduled' ? 'bg-blue-500 text-white' : ''}
                        ${stage.status === 'waiting' ? 'bg-gray-400 text-white' : ''}
                      `}>
                        {stage.status === 'completed' ? 'Selesai' :
                        stage.status === 'scheduled' ? 'Terjadwalkan' :
                        'Menunggu'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {stage.status === 'completed' ?
                        `Telah selesai pada ${stage.date}` :
                        stage.status === 'scheduled' ?
                        `Dijadwalkan pada ${stage.date}, ${stage.time}` :
                        'Menunggu penyelesaian tahap sebelumnya'}
                    </CardDescription>
                  </CardHeader>

                  {/* Content khusus untuk stage scheduled */}
                  {stage.status === 'scheduled' && (
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                      {/* Detail informasi tes */}
                      <div className="space-y-3 bg-blue-50 p-3 sm:p-4 rounded-md">
                        <h4 className="font-semibold text-blue-800 text-sm sm:text-base">Detail Tes Psikotes:</h4>
                        <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                          <div className="flex items-start gap-2">
                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700 mt-0.5" />
                            <div>
                              <p className="font-medium">Tanggal & Waktu</p>
                              <p className="text-gray-600">{stage.date}, {stage.time}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700 mt-0.5" />
                            <div>
                              <p className="font-medium">Durasi</p>
                              <p className="text-gray-600">{stage.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700 mt-0.5" />
                            <div>
                              <p className="font-medium">Jenis Tes</p>
                              <p className="text-gray-600">{stage.testType}</p>
                            </div>
                          </div>
                          {stage.location && (
                            <div className="flex items-start gap-2 sm:col-span-2">
                              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                <p className="font-medium">Lokasi</p>
                                <p className="text-gray-600">{stage.location}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Notes dan pesan */}
                        {stage.notes && (
                          <div className="mt-3">
                            <p className="font-medium text-blue-800 text-xs sm:text-sm">Catatan:</p>
                            <p className="text-xs sm:text-sm text-gray-600">{stage.notes}</p>
                          </div>
                        )}

                          <div className="bg-white p-2 sm:p-3 rounded-md mt-3 border border-blue-100">
                            <p className="text-xs sm:text-sm font-medium text-blue-800">Tips untuk Tes Psikotes:</p>
                            <ul className="text-xs sm:text-sm text-gray-600 mt-1 space-y-1 pl-4 sm:pl-5 list-disc">
                              <li>Istirahatlah yang cukup malam sebelum tes</li>
                              <li>Jangan lupa sarapan untuk menjaga energi Anda</li>
                              <li>Jawab dengan jujur dan sesuai dengan kepribadian Anda</li>
                              <li>Kelola waktu dengan baik</li>
                              <li>Tetap tenang dan percaya diri</li>
                            </ul>
                            <div className="flex justify-end mt-3 sm:mt-4">
                              <Button
                                onClick={scrollToPreparation}
                                variant="outline"
                                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-blue-700 border-blue-500 hover:bg-blue-50 py-1 h-auto sm:h-9"
                              >
                                Lanjut ke Persiapan Tes
                                <ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                              </Button>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 sm:p-3 rounded-md mt-2">
                            <p className="font-medium text-xs sm:text-sm">Pesan dari Tim Rekrutmen:</p>
                            <p className="text-xs sm:text-sm mt-1 overflow-hidden text-ellipsis">"Kami senang Anda telah mencapai tahap ini dalam proses rekrutmen. Percayalah pada kemampuan Anda dan tunjukkan potensi terbaik Anda. Semoga sukses!"</p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Persiapan Tes */}
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
              <Button className="w-full" onClick={handleStartTest}> 
                Mulai Mengerjakan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </UserLayout>
    </div>
  );
}