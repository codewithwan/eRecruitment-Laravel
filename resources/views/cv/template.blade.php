<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - {{ $user->name ?? 'CV' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 10px 20px; /* Reduced top padding */
        }

        .header {
            text-align: center;
            margin-bottom: 20px; /* Reduced margin */
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px; /* Reduced padding */
        }

        .header h1 {
            font-size: 24px;
            color: #2563eb;
            margin-bottom: 3px; /* Reduced margin */
        }

        .header .contact-info {
            font-size: 11px;
            color: #666;
            line-height: 1.3; /* Added line height */
        }

        .section {
            margin-bottom: 15px; /* Reduced margin */
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 3px; /* Reduced padding */
            margin-bottom: 10px; /* Reduced margin */
        }

        .item {
            margin-bottom: 10px; /* Reduced margin */
        }

        .item-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 2px; /* Added margin */
        }

        .item-subtitle {
            font-style: italic;
            color: #666;
            font-size: 11px;
            margin-bottom: 2px; /* Added margin */
        }

        .item-description {
            margin-top: 3px; /* Reduced margin */
            text-align: justify;
            font-size: 11px; /* Added font size */
        }

        .two-column {
            display: table;
            width: 100%;
            margin-top: -5px; /* Added negative margin to pull content up */
        }

        .left-column {
            display: table-cell;
            width: 65%;
            vertical-align: top;
            padding-right: 20px;
        }

        .right-column {
            display: table-cell;
            width: 35%;
            vertical-align: top;
        }

        .skills-list {
            list-style: none;
            margin-top: 5px; /* Added margin */
        }

        .skills-list li {
            background: #f3f4f6;
            padding: 2px 6px; /* Reduced padding */
            margin: 2px 0; /* Reduced margin */
            border-radius: 3px;
            font-size: 11px;
        }

        .about-me {
            background: #f9fafb;
            padding: 10px; /* Reduced padding */
            border-radius: 5px;
            margin-bottom: 15px; /* Reduced margin */
            text-align: justify;
            font-size: 11px; /* Added font size */
        }

        /* Added new style for profile image container */
        .profile-image-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px; /* Reduced margin */
        }

        .profile-image-container img {
            width: 70px; /* Reduced size */
            height: 70px; /* Reduced size */
            border-radius: 50%;
            object-fit: cover;
            margin-right: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="profile-image-container">
                @if($profile && $profile->profile_image && Storage::disk('public')->exists($profile->profile_image))
                    <img src="{{ Storage::disk('public')->path($profile->profile_image) }}" />
                @endif
                <div>
                    <h1>{{ $user->name ?? 'Nama Lengkap' }}</h1>
                    <div class="contact-info">
                        {{ $user->email ?? '' }}
                        @if($profile && $profile->phone_number)
                            | {{ $profile->phone_number }}
                        @endif
                        @if($profile && $profile->address)
                            <br>{{ $profile->address }}
                            @if($profile->city), {{ $profile->city }}@endif
                            @if($profile->province), {{ $profile->province }}@endif
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <div class="two-column">
            <!-- Left Column -->
            <div class="left-column">
                <!-- About Me -->
                @if($profile && $profile->about_me)
                <div class="section">
                    <div class="section-title">TENTANG SAYA</div>
                    <div class="about-me">
                        {{ $profile->about_me }}
                    </div>
                </div>
                @endif

                <!-- Work Experience -->
                @if(isset($workExperiences) && $workExperiences->count() > 0)
                <div class="section">
                    <div class="section-title">PENGALAMAN KERJA</div>
                    @foreach($workExperiences as $work)
                    <div class="item">
                        <div class="item-title">{{ $work->job_title ?? 'Job Title' }}</div>
                        <div class="item-subtitle">
                            {{ $work->company_name ?? 'Company Name' }} |
                            {{ $work->employment_status ?? 'Full Time' }} |
                            @php
                                $startMonth = '';
                                if ($work->start_month) {
                                    try {
                                        $startMonth = DateTime::createFromFormat('!m', $work->start_month)->format('M');
                                    } catch (Exception $e) {
                                        $startMonth = $work->start_month;
                                    }
                                }
                            @endphp
                            {{ $startMonth }} {{ $work->start_year ?? '' }} -
                            @if($work->is_current_job)
                                Sekarang
                            @else
                                @php
                                    $endMonth = '';
                                    if ($work->end_month) {
                                        try {
                                            $endMonth = DateTime::createFromFormat('!m', $work->end_month)->format('M');
                                        } catch (Exception $e) {
                                            $endMonth = $work->end_month;
                                        }
                                    }
                                @endphp
                                {{ $endMonth }} {{ $work->end_year ?? '' }}
                            @endif
                        </div>
                        @if($work->job_description)
                        <div class="item-description">{{ $work->job_description }}</div>
                        @endif
                    </div>
                    @endforeach
                </div>
                @endif

                <!-- Pendidikan -->
                @if(isset($educations) && $educations->count() > 0)
                <div class="section">
                    <div class="section-title">PENDIDIKAN</div>
                    @foreach($educations->sortByDesc('year_in') as $education)
                    <div class="item">
                        <div class="item-title">{{ $education->education_level }}</div>
                        <div class="item-subtitle">
                            {{ $education->institution_name }} | {{ $education->year_in ?? '' }} - 
                            {{ $education->year_out ?? 'Sekarang' }}
                        </div>
                        <div class="item-description">
                            Fakultas {{ $education->faculty }} - {{ $education->major ?? '' }}<br>
                            IPK: {{ $education->gpa }}
                        </div>
                    </div>
                    @endforeach
                </div>
                @endif

                <!-- Organizations -->
                @if(isset($organizations) && $organizations->count() > 0)
                <div class="section">
                    <div class="section-title">ORGANISASI</div>
                    @foreach($organizations as $org)
                    <div class="item">
                        <div class="item-title">{{ $org->position ?? 'Posisi' }}</div>
                        <div class="item-subtitle">
                            {{ $org->organization_name ?? 'Nama Organisasi' }} |
                            {{ $org->start_month ?? '' }} {{ $org->start_year ?? '' }} -
                            @if($org->is_active)
                                Sekarang
                            @else
                                {{ $org->end_month ?? '' }} {{ $org->end_year ?? '' }}
                            @endif
                        </div>
                        @if($org->description)
                        <div class="item-description">{{ $org->description }}</div>
                        @endif
                    </div>
                    @endforeach
                </div>
                @endif

                <!-- Achievements -->
                @if(isset($achievements) && $achievements->count() > 0)
                <div class="section">
                    <div class="section-title">PRESTASI</div>
                    @foreach($achievements as $achievement)
                    <div class="item">
                        <div class="item-title">{{ $achievement->title ?? 'Judul Prestasi' }}</div>
                        <div class="item-subtitle">
                            {{ $achievement->level ?? 'Tingkat' }} | {{ $achievement->month ?? '' }} {{ $achievement->year ?? '' }}
                        </div>
                        @if($achievement->description)
                        <div class="item-description">{{ $achievement->description }}</div>
                        @endif
                    </div>
                    @endforeach
                </div>
                @endif
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- Personal Info -->
                @if($profile)
                <div class="section">
                    <div class="section-title">INFORMASI PRIBADI</div>
                    <div style="font-size: 11px;">
                        @if($profile->date_of_birth)
                            <strong>Tanggal Lahir:</strong><br>
                            @if($profile->place_of_birth){{ $profile->place_of_birth }}, @endif
                            {{ date('d M Y', strtotime($profile->date_of_birth)) }}<br><br>
                        @endif
                        @if($profile->gender)
                            <strong>Jenis Kelamin:</strong><br>
                            {{ $profile->gender == 'male' ? 'Laki-laki' : ($profile->gender == 'female' ? 'Perempuan' : ucfirst($profile->gender)) }}<br><br>
                        @endif
                        @if($profile->no_ektp)
                            <strong>No. E-KTP:</strong><br>
                            {{ $profile->no_ektp }}<br><br>
                        @endif
                        @if($profile->npwp)
                            <strong>NPWP:</strong><br>
                            {{ $profile->npwp }}<br><br>
                        @endif
                    </div>
                </div>
                @endif

                <!-- Skills -->
                @if(isset($skills) && $skills->count() > 0)
                <div class="section">
                    <div class="section-title">KEAHLIAN</div>
                    <ul class="skills-list">
                        @foreach($skills as $skill)
                        <li>{{ $skill->skill_name ?? 'Skill' }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                <!-- Courses -->
                @if(isset($courses) && $courses->count() > 0)
                <div class="section">
                    <div class="section-title">KURSUS</div>
                    <ul class="skills-list">
                        @foreach($courses as $course)
                        <li>{{ $course->course_name ?? $course->name ?? 'Kursus' }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                <!-- Certifications -->
                @if(isset($certifications) && $certifications->count() > 0)
                <div class="section">
                    <div class="section-title">SERTIFIKASI</div>
                    <ul class="skills-list">
                        @foreach($certifications as $cert)
                        <li>{{ $cert->certification_name ?? $cert->name ?? 'Sertifikasi' }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                <!-- Languages -->
                @if(isset($languages) && $languages->count() > 0)
                <div class="section">
                    <div class="section-title">BAHASA</div>
                    <ul class="skills-list">
                        @foreach($languages as $language)
                        <li>{{ $language->language_name }} @if($language->proficiency_level)({{ $language->proficiency_level }})@endif</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                <!-- English Certifications -->
                @if(isset($englishCertifications) && $englishCertifications->count() > 0)
                <div class="section">
                    <div class="section-title">SERTIFIKASI BAHASA INGGRIS</div>
                    <ul class="skills-list">
                        @foreach($englishCertifications as $cert)
                        <li>{{ $cert->name }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                <!-- Social Media -->
                @if(isset($socialMedia) && $socialMedia->count() > 0)
                <div class="section">
                    <div class="section-title">MEDIA SOSIAL</div>
                    <div style="font-size: 10px;">
                        @foreach($socialMedia as $social)
                        <strong>{{ $social->platform_name ?? 'Platform' }}:</strong><br>
                        {{ $social->url ?? $social->profile_url ?? '#' }}<br><br>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>
        </div>
    </div>
</body>
</html>
