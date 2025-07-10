<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        // Create 15 random messages (20% chance of being read)
        ContactMessage::factory()->count(15)->create();

        // Create 5 read messages
        ContactMessage::factory()
            ->count(5)
            ->read()
            ->create();

        // Create some predefined messages
        $messages = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'message' => 'I would like to inquire about job opportunities in the IT department.',
                'is_read' => true,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'message' => 'When will the next recruitment period start? I am interested in applying.',
                'is_read' => false,
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'message' => 'Is there any internship program available for fresh graduates?',
                'is_read' => false,
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create($message);
        }
    }
} 