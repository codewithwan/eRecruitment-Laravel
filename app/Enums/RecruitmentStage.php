<?php

namespace App\Enums;

enum RecruitmentStage: string
{
    case ADMINISTRATIVE_SELECTION = 'Administrative Selection';
    case PSYCHOTEST = 'Psychological Test';
    case INTERVIEW = 'Interview';

    public function label(): string
    {
        return match ($this) {
            self::ADMINISTRATIVE_SELECTION => 'Administrative Selection',
            self::PSYCHOTEST => 'Psychological Test',
            self::INTERVIEW => 'Interview',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
