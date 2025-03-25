<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case HR = 'hr';
    case HEAD_HR = 'head_hr';
    case HEAD_DEV = 'head_dev';
    case CANDIDATE = 'candidate';

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Administrator',
            self::HR => 'Human Resource',
            self::HEAD_HR => 'Head of HR',
            self::HEAD_DEV => 'Head of Development',
            self::CANDIDATE => 'Candidate',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
