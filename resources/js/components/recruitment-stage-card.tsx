import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock3, XCircle, CalendarDays, Clock, FileText } from 'lucide-react';

interface Stage {
    id: number;
    name: string;
    status: string;
    date?: string;
    time?: string;
    duration?: string;
    testType?: string;
    location?: string;
    notes?: string;
}

interface RecruitmentStageCardProps {
    stage: Stage;
}

export default function RecruitmentStageCard({ stage }: RecruitmentStageCardProps) {
    return (
        <div className="relative">
            {/* Dot in timeline */}
            <div className={`absolute left-[-1.5rem] sm:left-[-2.5rem] top-6 p-1 rounded-full
                ${stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                  stage.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
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
                }`}>
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
                        {stage.status === 'completed' && stage.date ?
                            `Telah selesai pada ${stage.date}` :
                            stage.status === 'scheduled' ?
                                `Dijadwalkan pada ${stage.date}, ${stage.time}` :
                                'Menunggu penyelesaian tahap sebelumnya'}
                    </CardDescription>
                </CardHeader>

                {/* Content for scheduled stage */}
                {stage.status === 'scheduled' && (
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-3 bg-blue-50 p-3 sm:p-4 rounded-md">
                            <h4 className="font-semibold text-blue-800 text-sm sm:text-base">Detail Tes:</h4>
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
                            {stage.notes && (
                                <div className="mt-3">
                                    <p className="font-medium text-blue-800 text-xs sm:text-sm">Catatan:</p>
                                    <p className="text-xs sm:text-sm text-gray-600">{stage.notes}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                )}

                {/* Content for waiting stage */}
                {stage.status === 'waiting' && (
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
                            <p className="text-sm text-gray-700">
                                Tahapan ini akan tersedia setelah Anda menyelesaikan tahap sebelumnya.
                            </p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
