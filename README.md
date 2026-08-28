# Bengkelin

Sistem manajemen bengkel berbasis Laravel, Inertia, dan React untuk mengelola booking request, work order, pembayaran DP, progres mekanik, serta dashboard admin dan customer.

<a href="/decision-log.md">Decision Log</a>

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
- Integrasi dengan Xendit untuk pembayaran DP.
- Validasi overlap jadwal mekanik agar booking baru tidak lolos jika masih berbenturan dengan slot aktif.

## Peran Pengguna

- `admin`: mengelola dashboard, master data, booking request, work order, dan progres mekanik.
- `customer`: mengajukan booking request, melihat work order, dan memantau kendaraan milik sendiri.

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

## Webhook

1. Webhook payment gateway dapat menggunakan ngrok
2. Buka terminal baru
3. Jalankan perintah berikut

```bash
ngrok http 8000
```

4. Gunakan url webhook dan konfigurasikan pada Xendit dashboard

```bash
https://{domain}/webhooks/xendit
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

## Lisensi

Proyek ini menggunakan lisensi MIT.
