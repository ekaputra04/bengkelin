# Decision Log

Dokumen ini merangkum alur utama sistem Bengkelin dari booking sampai konfirmasi atau gagal, serta keputusan teknis yang paling penting di area penjadwalan dan pembayaran DP.

## PDM Database

<img
  src="/public/images/pdm.png"
  style="width: 100%; height: auto;"
/>

## Alur Sistem: Booking sampai Konfirmasi/Gagal

1. Customer mengisi pengajuan servis melalui halaman `service-requests` dengan memilih kendaraan, jenis servis, dan waktu yang diinginkan.
2. Sistem membuat data `booking_requests` dengan status awal `waiting`.
3. Setelah request tersimpan, sistem langsung mencoba memprosesnya melalui service `ProcessBookingRequest`.
4. Sistem menghitung slot waktu berdasarkan `requested_start_at` dan durasi dari `service_type`.
5. Sistem mengunci request dan daftar mekanik aktif, lalu memeriksa satu per satu apakah ada mekanik yang tidak bentrok jadwal pada slot tersebut.
6. Jika tidak ada mekanik yang tersedia, request tetap berstatus `waiting` dan diberi `failure_reason` bahwa slot belum tersedia. Request masuk antrean.
7. Jika ada mekanik yang tersedia, sistem:
    - mengubah `booking_request` menjadi `processing`
    - menetapkan `mechanic_user_id`
    - membuat `booking` baru dengan status `pending_payment`
    - menetapkan batas waktu pembayaran DP selama 15 menit
8. Setelah booking dibuat, sistem membuat invoice DP ke Xendit. Jika masih ada invoice aktif yang pending, invoice lama dipakai ulang agar tidak terjadi duplikasi tagihan.
9. Customer diarahkan ke halaman pembayaran Xendit.
10. Jika invoice gagal dibuat, sistem tidak membiarkan slot menggantung. Booking diubah menjadi `expired`, lalu `booking_request` dikembalikan ke `waiting` dengan alasan gagal membuat pembayaran.
11. Saat Xendit mengirim webhook:

- sistem memverifikasi header `x-callback-token`
- sistem mencatat payload ke `webhook_logs`
- jika valid, sistem menyinkronkan status payment dan booking di dalam transaksi database

12. Jika webhook menyatakan `PAID`, maka:

- `payment` menjadi `paid`
- `booking` menjadi `confirmed`
- `booking_request` menjadi `converted`

13. Jika webhook menyatakan `EXPIRED`, maka:

- `payment` menjadi `expired`
- `booking` menjadi `expired`
- `booking_request` dikembalikan ke `waiting`

14. Dengan alur ini, hasil akhir utama ada dua:

- berhasil: slot ter-reserve, DP dibayar, booking terkonfirmasi
- gagal: slot tidak tersedia, invoice gagal dibuat, atau DP kedaluwarsa

## Keputusan Teknis Utama

### 1. Mencegah rebutan slot dengan transaksi database dan `lockForUpdate()`

**Masalah**

Dua customer bisa mengajukan booking pada jam yang sama, dan keduanya berpotensi memilih mekanik yang sama jika proses berjalan paralel.

**Opsi yang dipertimbangkan**

- Validasi biasa tanpa locking, hanya cek bentrok sebelum insert booking.
- Menyimpan slot di memori atau cache lalu memakai distributed lock.
- Menggunakan transaksi database dan `lockForUpdate()` pada request serta daftar mekanik aktif.

**Keputusan**

Dipilih opsi transaksi database dengan `lockForUpdate()`.

**Alasan**

- Konsisten dengan arsitektur saat ini yang berbasis Laravel + database relasional.
- Lebih sederhana dibanding menambah Redis/distributed lock hanya untuk satu masalah konkurensi inti.
- Mencegah dua proses memilih mekanik yang sama pada saat hampir bersamaan.
- Logika reservasi slot tetap berada di satu tempat, yaitu service `ProcessBookingRequest`, sehingga lebih mudah diuji dan dirawat.

**Konsekuensi**

- Proses assignment slot menjadi lebih aman, tetapi ada biaya locking saat traffic tinggi.
- Pendekatan ini cocok selama skala bengkel dan jumlah mekanik masih relatif moderat.

### 2. Verifikasi webhook Xendit memakai callback token dan pemrosesan idempoten

**Masalah**

Endpoint webhook bersifat publik karena dipanggil server-to-server. Risiko utamanya adalah callback palsu, callback ganda, atau callback datang ulang setelah status sudah final.

**Opsi yang dipertimbangkan**

- Mempercayai payload webhook tanpa verifikasi khusus.
- Verifikasi hanya berdasarkan `transaction_id` atau `external_id`.
- Verifikasi `x-callback-token`, simpan log webhook, lalu proses status secara idempoten di dalam transaksi.

**Keputusan**

Dipilih verifikasi `x-callback-token` ditambah pencatatan `webhook_logs` dan locking data saat callback diproses.

**Alasan**

- Token callback adalah mekanisme paling langsung yang sudah didukung integrasi ini.
- `transaction_id` atau `external_id` saja tidak cukup untuk memastikan request benar-benar berasal dari Xendit.
- Webhook payment pada praktiknya bisa dikirim ulang, sehingga idempoten wajib agar status tidak berubah dua kali.
- Audit log webhook penting untuk debugging insiden pembayaran dan pelacakan payload yang masuk.

**Konsekuensi**

- Sistem lebih aman terhadap callback tidak sah.
- Callback yang sama dapat diterima lebih dari sekali tanpa merusak status payment atau booking.
- Ada tambahan tabel log, tetapi itu sepadan untuk observability dan investigasi.

### 3. Slot dianggap ter-reserve sejak booking dibuat, lalu dilepas lagi jika invoice gagal atau DP kedaluwarsa

**Masalah**

Setelah slot ditemukan, sistem harus memutuskan kapan slot benar-benar dianggap milik customer. Jika terlalu cepat, slot bisa tertahan sia-sia. Jika terlalu lambat, customer yang sudah diarahkan ke pembayaran bisa kehilangan slot.

**Opsi yang dipertimbangkan**

- Slot baru dianggap terpakai setelah pembayaran berhasil.
- Slot langsung di-reserve saat booking dibuat, dengan batas waktu pembayaran.
- Tidak membuat booking dulu; cukup simpan request lalu buat booking setelah webhook `PAID`.

**Keputusan**

Dipilih reservasi slot saat `booking` dibuat dengan status `pending_payment`, lalu diberi `payment_expired_at` selama 15 menit.

**Alasan**

- Customer yang sudah berhasil mendapat slot tidak kehilangan tempat selama masih dalam jendela pembayaran.
- Admin sudah bisa melihat bahwa slot tersebut sedang ditahan untuk proses pembayaran.
- Jika invoice gagal dibuat atau DP expired, sistem mengembalikan request ke antrean `waiting`, sehingga slot dapat diproses ulang.
- Pendekatan ini seimbang antara kepastian untuk customer dan pemanfaatan slot bengkel.

**Konsekuensi**

- Ada kemungkinan slot tertahan sementara oleh customer yang belum membayar.
- Risiko itu dibatasi dengan expiry 15 menit dan mekanisme rollback status saat pembayaran gagal/expired.
