<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    protected $fillable = [
        'title',
        'description',
        'requirements',
        'created_by',
        'created_at',
    ];

    //Relasi : Job dibuat oleh Admin/Kepala Divisi
    public function creator()
    {
        return $this->belongsTo(user::class, 'created_by');
    }

    //Relasi : Sebuah Job bisa memiliki banyak aplikasi
    public function applications()
    {
        return $this->hasMany(Application::class, 'joblisting_id');
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class, 'joblisting_id');
    }
}
