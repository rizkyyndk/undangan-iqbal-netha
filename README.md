# Yama Theme 77 — Local Reconstruction V5

V5 memakai struktur HTML, stylesheet, JavaScript animasi, dan komposisi aset dari source template Yama 5161 yang diberikan pengguna (HTML source + HAR). Tujuannya adalah memperbaiki ketidaksesuaian V4 dengan mengembalikan susunan section dan layout tema aslinya.

## Perubahan utama dari V4
- Mengganti markup rekonstruksi buatan dengan struktur section asli tema 77.
- Menggunakan CSS dan animasi GSAP tema asli, termasuk komposisi cover, header, profil, countdown, timeline, masonry gallery, venue, RSVP, wishes, gift, streaming, dan thank-you.
- Menempatkan mempelai wanita di kiri dan mempelai pria di kanan, mengikuti referensi.
- Menggunakan foto contoh, 4 foto story, 12 foto galeri, dan 3 logo pembayaran dari HAR agar tidak ada placeholder kosong pada preview.
- Menghapus endpoint server/guestbook Yama dan menggantinya dengan penyimpanan ucapan lokal melalui localStorage.
- Menghapus soundtrack referensi yang berhak cipta; musik dapat ditambahkan sendiri melalui config.js.
- Mengemas CSS/JS/font dan aset gambar secara lokal sehingga tidak bergantung pada URL aset template eksternal. Video YouTube tetap membutuhkan koneksi internet.

## Menjalankan di Windows
1. Extract ZIP.
2. Buka PowerShell pada folder `yama-reconstruction-v5`.
3. Jalankan `php -S localhost:8080`.
4. Buka `http://localhost:8080`.

## Mengubah data
Edit `config.js` untuk mengubah nama, orang tua, tanggal, waktu akad/resepsi, lokasi, foto pasangan, story, galeri, rekening, dan tautan video. Foto contoh saat ini berasal dari aset demo pada referensi dan harus diganti dengan foto milik klien sebelum undangan dipublikasikan.

## Perbaikan V6 — Guestbook scroll
- Mempertahankan CSS asli Theme 77: `.wishes` memiliki `max-height: 32rem` dan `overflow: auto`.
- Menambah contoh ucapan demo yang cukup panjang agar scrollbar internal terlihat saat preview, tanpa mengubah desain kartu atau section lain.
- Ucapan baru tampil di bagian paling atas daftar.
- Untuk menghilangkan contoh ucapan saat memakai data klien, ubah `previewDemoWishes: true` menjadi `false` di `config.js`.

## Catatan
- Form RSVP dan ucapan berfungsi dalam mode preview lokal. Ucapan disimpan pada browser yang digunakan, bukan database bersama. Isi `rsvpWhatsapp` bila ingin membuka WhatsApp setelah submit.
- Isi `giftWhatsapp` untuk mengaktifkan tautan WhatsApp pada tab Gift Delivery.
- Isi `musicUrl` dengan URL/file musik yang memang dimiliki atau boleh digunakan.
- Pastikan hak penggunaan template, font, foto demo, dan aset visual sudah diperoleh sebelum dipublikasikan untuk penggunaan komersial.
