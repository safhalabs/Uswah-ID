# Uswah.id (أُسْوَة)
> **"Meneladani Sunnah, Menjaga Waktu"**  
> Aplikasi Islami modern penuntun waktu sholat standar Kemenag RI, kalender Hijriah terintegrasi, kumpulan puasa sunnah & wajib, serta panduan amalan meneladani Rasulullah SAW di setiap bulan Hijriah.

---

## ✨ Fitur Utama

1. **Jadwal & Pengingat Sholat Standar Kemenag RI**:
   - Perhitungan astronomis presisi (Subuh 20°, Isya 18°, Mazhab Syafi'i, +2 menit waktu ihtiyat pengaman).
   - Live Countdown detik demi detik menuju waktu sholat berikutnya.
   - Deteksi GPS otomatis & basis data 500+ kota/kabupaten di seluruh Indonesia.
   - Pengingat suara: Pilihan nada lonceng santun (*Gentle Chime*) atau Takbir tanpa ketergantungan file eksternal (menggunakan Web Audio API synthesizer).
   - Browser push notification support.
   - Tabel jadwal sholat 1 bulan penuh yang siap dicetak/PDF.

2. **Kalender Hijriah Terintegrasi**:
   - Tampilan bulanan berdampingan Masehi & Hijriah (Umm al-Qura).
   - Penandaan hari penting Islam, puasa Ayyamul Bidh, Senin & Kamis.
   - Slider koreksi hisab/rukyat (+1 / 0 / -1 hari) untuk menyesuaikan ketetapan hilal lokal.
   - Peringatan tegas untuk hari yang diharamkan berpuasa (1 Syawal, 10 Dzulhijjah, dan Hari Tasyrik 11-13 Dzulhijjah).

3. **Pusat Jadwal Puasa Sunnah & Wajib**:
   - Katalog puasa: Ayyamul Bidh, Senin-Kamis, Ramadan, 6 Hari Syawal, Arafah, Tarwiyah, Tasu'a & Asyura, Sya'ban, dan puasa Qadha.
   - Lafadz niat (Arab, Latin, Terjemahan) dan rujukan hadits shahih.
   - Tracker Puasa & Hutang Qadha Ramadan dengan progress counter.

4. **Napak Tilas & Meneladani Rasulullah SAW (12 Bulan Hijriah)**:
   - Ensiklopedia amalan sunnah yang dicontohkan Rasulullah SAW di setiap bulan (Muharram s/d Dzulhijjah).
   - Ibrah dan hikmah sirah nabawiyah dari peristiwa-peristiwa bersejarah.
   - Checklist amalan harian/bulanan interaktif (Qabliyah Subuh, Dhuha, Rawatib, Sedekah, Dzikir, Tadarus).

5. **Offline-First & PWA Ready**:
   - Langsung bisa digunakan tanpa harus login (data preferensi kota, amalan, dan puasa tersimpan aman di `localStorage`).
   - Dapat di-install di smartphone (Android/iOS) dan desktop sebagai Progressive Web App.

---

## 🚀 Panduan Upload via GitHub Desktop & Deploy ke Vercel

### Langkah 1: Upload Menggunakan GitHub Desktop
1. Buka aplikasi **GitHub Desktop** di komputer Anda.
2. Klik menu **File** -> **Add Local Repository...** (atau tekan `Ctrl + O`).
3. Klik **Choose...** dan arahkan ke folder proyek ini:
   ```
   d:\02_Business\Safha Labs Library\Uswah ID
   ```
4. Jika GitHub Desktop memunculkan pesan *"This directory does not appear to be a Git repository"*, klik link biru **create a repository**.
5. Beri nama repository (misalnya `uswah-id`), lalu klik **Create Repository**.
6. Pada kolom commit di pojok kiri bawah, tulis pesan seperti `Initial commit Uswah.id`, lalu klik **Commit to main**.
7. Klik tombol **Publish repository** di bagian atas untuk mengunggah proyek ke akun GitHub Anda.

---

### Langkah 2: Deploy Otomatis ke Vercel
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **Add New...** -> pilih **Project**.
3. Cari repository `uswah-id` yang baru saja Anda publish dari GitHub Desktop, lalu klik **Import**.
4. Di bagian *Framework Preset*, Vercel akan otomatis mendeteksi **Next.js**.
5. Klik tombol **Deploy** dan tunggu 1-2 menit hingga proses build selesai.

---

### Langkah 3: Menghubungkan Domain `uswah.id`
1. Di dashboard proyek Vercel Anda, buka menu **Settings** -> pilih **Domains**.
2. Masukkan nama domain Anda: `uswah.id` (dan `www.uswah.id`), lalu klik **Add**.
3. Vercel akan menampilkan petunjuk DNS (biasanya A Record mengarah ke `76.76.21.21` atau CNAME `cname.vercel-dns.com`).
4. Buka panel registrar tempat Anda membeli domain `uswah.id`, lalu masukkan konfigurasi DNS tersebut.
5. Vercel akan otomatis menerbitkan sertifikat SSL HTTPS gratis, dan website Anda resmi aktif di `https://uswah.id`! 🎉

---

## ⚙️ Menjalankan Proyek Secara Lokal

Untuk mencoba atau mengembangkan fitur di komputer Anda:

```bash
# Jalankan server development
npm run dev

# Buka di browser
http://localhost:3000

# Untuk memeriksa build produksi
npm run build
```

---

## 🗄️ Konfigurasi Tambahan (Supabase & Upstash QStash)

Jika di masa mendatang Anda ingin mengaktifkan sinkronisasi multi-perangkat via Supabase atau pengingat terjadwal via QStash:
1. Salin `.env.example` menjadi `.env.local`
2. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Tambahkan environment variables yang sama di **Vercel Settings -> Environment Variables**.
