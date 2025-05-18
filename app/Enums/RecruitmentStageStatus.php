<?php

namespace App\Enums;

enum RecruitmentStageStatus: string
{
    case SCHEDULED = 'Terjadwalkan';
    case COMPLETED = 'Selesai';
    case IN_PROGRESS = 'Dalam Proses';
    case FAILED = 'Gagal';

    public function label(): string
    {
        return match ($this) {
            self::SCHEDULED => 'Scheduled',
            self::COMPLETED => 'Completed',
            self::IN_PROGRESS => 'In Progress',
            self::FAILED => 'Failed',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
