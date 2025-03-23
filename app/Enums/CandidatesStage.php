<?php 

namespace App\Enums;


enum CandidatesStage: string {
    case ADMINISTRATIVE_SELECTION = "administrative_selection";
    case PSYCHOTEST = "psychological_test";
    case INTERVIEW = "interview";
    case ACCEPTED = "accepted";
    case REJECTED = "rejected";

    public function label(): string
    {
        return match ($this) {
            self::ADMINISTRATIVE_SELECTION => 'administrative_selection',
            self::PSYCHOTEST => 'psychological_test',
            self::INTERVIEW => 'interview',
            self::ACCEPTED => 'accepted',
            self::REJECTED => 'rejected',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}