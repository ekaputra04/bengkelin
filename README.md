# Bengkelin

Sistem manajemen bengkel berbasis Laravel, Inertia, dan React untuk mengelola booking request, work order, pembayaran DP, progres mekanik, serta dashboard admin dan customer.

<img
  src="/public/images/hero.png"
  style="width: 100%; height: auto;"
/>

## Stack

- PHP 8.2
- Laravel 12
- Inertia.js 2
- React 18 + TypeScript
- Vite
- Tailwind CSS

## Fitur Utama

- Dashboard admin dengan ringkasan operasional, distribusi status, beban mekanik, dan antrean request.
- Dashboard customer dengan ringkasan booking pribadi, request aktif, kendaraan, dan histori servis.
- Booking request dengan alur `waiting`, `processing`, `converted`, `cancelled`, dan `expired`.
- Work order dengan status booking, penyelesaian dinamis `end_at`, dan integrasi pembayaran DP.
- Validasi overlap jadwal mekanik agar booking baru tidak lolos jika masih berbenturan dengan slot aktif.
- Seeder data demo untuk kendaraan, booking request, booking, dan payment pada rentang 25-30 Agustus.
- Timezone aplikasi mengikuti WITA (`Asia/Makassar`) agar selaras dengan Bali.

## Peran Pengguna

- `admin`: mengelola dashboard, master data, booking request, work order, dan progres mekanik.
- `customer`: mengajukan booking request, melihat work order, dan memantau kendaraan milik sendiri.
- `mechanic`: dipakai sebagai resource penugasan booking dan monitoring progres.

## Setup Lokal

1. Install dependency backend dan frontend.
2. Siapkan file environment.
3. Generate app key.
4. Jalankan migrasi dan seeder.
5. Jalankan server Laravel dan Vite.

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
composer run dev
```

Jika memakai Windows PowerShell dan `cp` tidak tersedia sebagai alias yang diinginkan, gunakan:

```powershell
Copy-Item .env.example .env
```

## Seeder Demo

Seeder utama dipanggil lewat `DatabaseSeeder` dan saat ini mencakup data:

- service type
- customer
- mechanic
- vehicle
- booking request
- booking
- payment

Untuk menyegarkan data demo:

```bash
php artisan migrate:fresh --seed
```

## Testing dan Build

```bash
php artisan test
npm run build
```

## Struktur Modul Penting

- `app/Http/Controllers/AdminDashboardController.php`
- `app/Http/Controllers/DashboardController.php`
- `app/Services/Booking/ProcessBookingRequest.php`
- `resources/js/Pages/Dashboard.tsx`
- `resources/js/Pages/UserDashboard.tsx`
- `resources/js/Components/Dashboard`
- `resources/js/Components/CustomerDashboard`

## Catatan Operasional

- Booking customer yang overlap dengan booking lain pada mekanik yang sama akan tetap tertahan.
- Request `processing` berarti slot sudah dipilih dan sistem sedang menunggu pembayaran dari payment gateway.
- Saat booking diselesaikan, `end_at` dapat disesuaikan dari dialog penyelesaian work order.

## Lisensi

Proyek ini menggunakan lisensi MIT.
