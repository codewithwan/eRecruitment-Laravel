<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    // Recruitment stages
    case ADMINISTRATIVE_SELECTION = 'administrative_selection';
    case PSYCHOLOGICAL_TEST = 'psychological_test';
    case INTERVIEW = 'interview';
    
    // Final statuses
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::ADMINISTRATIVE_SELECTION => 'Administrative Selection',
            self::PSYCHOLOGICAL_TEST => 'Psychological Test',
            self::INTERVIEW => 'Interview',
            self::PENDING => 'Pending',
            self::ACCEPTED => 'Accepted',
            self::REJECTED => 'Rejected',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get only the recruitment stages
     */
    public static function stages(): array
    {
        return [
            self::ADMINISTRATIVE_SELECTION->value,
            self::PSYCHOLOGICAL_TEST->value,
            self::INTERVIEW->value,
        ];
    }

    /**
     * Get only the final statuses
     */
    public static function statuses(): array
    {
        return [
            self::PENDING->value,
            self::ACCEPTED->value,
            self::REJECTED->value,
        ];
    }

    /**
     * Check if this is a recruitment stage
     */
    public function isStage(): bool
    {
        return in_array($this->value, self::stages());
    }

    /**
     * Check if this is a final status
     */
    public function isStatus(): bool
    {
        return in_array($this->value, self::statuses());
    }

    /**
     * Get the order for stages
     */
    public function getOrder(): ?int
    {
        return match ($this) {
            self::ADMINISTRATIVE_SELECTION => 1,
            self::PSYCHOLOGICAL_TEST => 2,
            self::INTERVIEW => 3,
            default => null,
        };
    }
} 