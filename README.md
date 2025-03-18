# e-Recruitment

Sistem Rekrutmen berbasis website yang dikembangkan menggunakan **Laravel 12** dan **MySQL** untuk mempermudah proses rekrutmen perusahaan.

## ✨ Fitur Utama

### 🎯 Untuk Kandidat 
- Melihat daftar lowongan kerja
- Mengisi data diri secara online
- Mengikuti tes atau wawancara daring
- Melihat hasil seleksi dan status rekrutmen

### 🏢 Untuk HR/Perusahaan

- Membuat, mengedit, dan menghapus lowongan
- Melihat dan menyaring berkas pendaftaran kandidat
- Mengirim informasi seleksi lanjutan
- Melihat hasil psikotes kandidat

## 🛠️ Teknologi yang Digunakan

- **Framework:** Laravel 12
- **Database:** MySQL
- **Frontend:** React + Tailwind CSS
- **Tools:** GitHub, Figma (UI/UX Design), Visual Studio Code

## 📌 Instalasi

1. Clone repository:
    ```bash
    git clone https://github.com/codewithwan/eRecruitment-Laravel.git
    cd eRecruitment-Laravel
    ```
2. Install dependencies:
    ```bash
    composer install
    npm install
    ```
3. Buat file **.env** dan atur konfigurasi database:
    ```bash
    cp .env.example .env
    ```
4. Generate key Laravel:
    ```bash
    php artisan key:generate
    ```
5. Migrasi database:
    ```bash
    php artisan migrate --seed
    ```
6. Jalankan server lokal:
    ```bash
    php artisan serve
    ```
7. Buka di browser: `http://127.0.0.1:8000`

## 🚀 Struktur Proyek

```
📂 eRecruitment-Laravel
├── 📂 app       # Backend Laravel
├── 📂 database  # File migrasi dan seeder
├── 📂 public    # Aset publik
├── 📂 resources # Blade templates & frontend assets
├── 📂 routes    # API & web routes
├── 📂 storage   # File upload & logs
└── 📂 tests     # Unit & feature testing
```

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b feat/xyz`)
3. Commit perubahan (`git commit -m 'feat(xyz): Menambahkan fitur xyz'`)
4. Push ke branch (`git push origin feat/xyz`)
5. Buat Pull Request

## 📜 Lisensi

Proyek ini dilindungi oleh lisensi **MIT**.

---

Made with ❤️ by **Tim e-Recruitment** 🚀
