<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        // Create 10 sample contacts
        Contact::factory()->count(10)->create();

        // Create some predefined contacts
        $contacts = [
            [
                'email' => 'info@example.com',
                'phone' => '+62 812-3456-7890',
                'address' => 'Jl. Contoh No. 123, Jakarta',
            ],
            [
                'email' => 'support@example.com',
                'phone' => '+62 812-3456-7891',
                'address' => 'Jl. Sample No. 456, Surabaya',
            ],
            [
                'email' => 'business@example.com',
                'phone' => '+62 812-3456-7892',
                'address' => 'Jl. Test No. 789, Bandung',
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
} 