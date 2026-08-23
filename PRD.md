# Technical Test — Junior Fullstack Developer (Versi Ringkas)

**Stack:** Laravel 12, MySQL, Blade/Livewire (atau Vue/React) + Payment Gateway pilihan kamu (Midtrans, Xendit, Stripe, dll — sandbox/test mode)
**Waktu:** 3–5 hari
**Level:** Junior Fullstack

---

## Masalah yang harus diselesaikan

Kami mengelola tempat servis kendaraan (bengkel) kecil, dan mau punya sistem booking online supaya customer tidak perlu telepon-telepon lagi. Customer pilih jenis servis, pilih tanggal & jam yang tersedia, lalu bayar DP (uang muka) online untuk mengunci jadwalnya — sisanya dibayar cash di tempat setelah servis selesai. Kalau customer tidak jadi datang, DP hangus (jadi ini juga cara kami menyaring booking yang tidak serius).

Setiap mekanik cuma bisa pegang satu kendaraan dalam satu slot waktu. Kami punya beberapa mekanik, jadi dalam satu jam bisa ada beberapa booking sekaligus asal mekaniknya beda orang.

Masalah yang sering kami alami: dua customer buka aplikasi bersamaan, lihat jam yang sama masih kosong, dan dua-duanya berhasil booking di jam & mekanik yang sama — padahal harusnya cuma satu yang bisa. Ini bikin kami harus batalkan salah satu secara manual dan itu selalu bikin customer kecewa.

Kami juga sering lupa pantau, mekanik mana yang jadwalnya sudah penuh hari itu dan mana yang masih kosong.

Kamu harus menentukan sendiri bagaimana representasi data & alur sistemnya, tapi beberapa hal yang harus dipikirkan:

1. Struktur tabel & relasinya (termasuk bagaimana merepresentasikan mekanik, slot waktu, dan booking)
2. Alur booking → pembayaran DP → konfirmasi, termasuk apa yang terjadi kalau pembayaran gagal/expired
3. Bagaimana menangani kasus rebutan slot & mekanik yang sama di waktu bersamaan (di brief disebutkan eksplisit — ini bukan kebetulan, pikirkan baik-baik solusinya)
4. Bagaimana aturan "DP hangus jika tidak datang" ini direpresentasikan dalam sistem (tidak harus otomatis penuh, tapi minimal statusnya jelas)


## Boleh Pakai AI? Boleh.

Boleh pakai AI apapun buat bantu ngoding. Yang penting kamu **paham** apa yang kamu bangun, karena setelah submit ada sesi review 30–45 menit: kamu jelasin alur & keputusan desain, ditanya "kenapa begini bukan begitu", dan diminta ubah sedikit kode secara live.

## Wajib Ada

1. Login customer & admin (role beda)
2. Daftar jenis servis (durasi & harga DP)
3. Booking → bayar DP sungguhan lewat payment gateway pilihanmu (sandbox/test mode)
4. Status booking berubah **otomatis** dari notifikasi webhook gateway (bukan admin klik manual), dan webhook-nya harus tervalidasi/aman
5. Solusi nyata buat cegah rebutan slot & mekanik yang sama
6. Dashboard admin: jadwal per mekanik per hari + daftar booking yang DP-nya belum dibayar

## Yang Harus Dikumpulkan

**1. Design Decision Log** (tulis SELAMA ngoding, bukan setelah selesai)
- Skema tabel / ERD
- Alur sistem dari booking sampai konfirmasi/gagal
- 2–3 keputusan teknis terpenting (misal: cara cegah rebutan slot, cara verifikasi webhook) — opsi apa saja yang kamu pertimbangkan dan kenapa pilih itu

**2. Kode di GitHub**
- Commit history bertahap (bukan satu commit "initial commit" isinya semua)
- README: cara install & run, kredensial test, API key sandbox gateway yang dipakai

**3. Sesi review teknis** (dijadwalkan setelah submit)

## Penilaian

| Aspek | Bobot |
|---|---|
| Design Decision Log | 25% |
| Solusi rebutan slot & mekanik | 20% |
| Alur booking → bayar → status update otomatis | 20% |
| Pemahaman saat review (bisa jelasin & modif kode sendiri) | 20% |
| Struktur kode, keamanan endpoint, kerapian | 15% |

> Aplikasi yang belum sempurna tapi Design Decision Log kuat dan bisa dijelasin dengan baik saat review lebih baik daripada aplikasi yang keliatan lengkap tapi kamu sendiri bingung kenapa kodenya begitu.

## Bonus (Opsional)

- Test otomatis (PHPUnit/Pest) khusus buat kasus rebutan slot
- Queue/Job buat proses yang tidak perlu blocking (misal notifikasi setelah DP sukses)
- Tampilan kalender/jadwal visual per mekanik