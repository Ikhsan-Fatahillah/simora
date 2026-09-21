# Kunci Jawaban Form Notula — Practice (Latihan 1–3) & Expert

Dokumen ini merangkum kunci jawaban setiap field pada form notula rapat SIMORA, disesuaikan dengan
`documents/kunci-jawaban.pdf` (8 halaman, memuat Practice Latihan 1–3 dan Level Expert Form Notula).

**Sumber:**
- `documents/kunci-jawaban.pdf` — kunci resmi (isi, kata kunci wajib, bobot, KKM).
- `js/pages/latihan.js` — konstanta `RUBRIK_NOTULA`, `BOBOT`, `LATIHAN_CONFIG` (implementasi penilaian).

Semua form notula memakai satu form yang sama; isinya dibedakan per level lewat rubrik.

---

## 1. Skema Penilaian (sama untuk semua level sesuai PDF)

| Aspek | Field Terkait (PDF) | Bobot |
|---|---|---|
| Kelengkapan identitas rapat | Kop Surat, Agenda, Hari/Tanggal, Waktu, Tempat, Organisasi, Peserta | 20 |
| Ketepatan susunan acara | Susunan Acara | 10 |
| Ketepatan isi rapat | Isi Rapat | 40 |
| Ketepatan hasil rapat | Penutup / Hasil Rapat | 30 |
| **Total** | | **100** |

**KKM: 75/100** untuk Latihan 1, Latihan 2, Latihan 3, dan Expert.

Metode penilaian pada PDF adalah **Metode A (keyword-matching)**: jawaban dinilai benar bila memuat
kata kunci yang ditetapkan. Pencocokan di aplikasi:

1. Jawaban dan kata kunci dinormalisasi lebih dulu: huruf kecil, tanda baca/simbol (titik, koma,
   tanda hubung, garis miring, tanda kurung, persen, dan lainnya) dianggap spasi, spasi berlebih
   dirapikan. Contoh: "Kinerja-Pegawai (Menurun), 75%" → "kinerja pegawai menurun 75";
   "Rp50.000" → "rp50 000".
2. Pencocokan memakai substring (kata kunci cukup muncul di dalam jawaban); jawaban tidak perlu
   sama persis dengan susunan kalimat pada kunci.
3. **Satu field benar bila jawaban memuat minimal salah satu kata kunci** field tersebut — seluruh
   kata kunci digabung menjadi satu daftar OR. Benar atau salah, tidak ada nilai setengah.
4. Bobot dibagi rata per field (identitas: 20 ÷ jumlah field) dan per pembicara (isi rapat: 40 ÷
   jumlah pembicara pada rubrik).

Catatan efek normalisasi tanda baca: kata kunci yang mengandung simbol ikut berubah bentuk, sehingga
sedikit lebih longgar (`75%` dinilai sebagai `75`, `e-commerce` menjadi `e commerce` sedangkan
`ecommerce` tetap punya kata kunci tersendiri).

**Field khusus:**

| Field | Aturan |
|---|---|
| Hari/Tanggal | memakai input tanggal, dinilai sama persis. Kunci PDF: Latihan 1 "Senin"/"10 Juni 2024", Latihan 2 "Rabu"/"25 September 2024", Latihan 3 "31 Agustus 2022", Expert "21 Oktober 2022". |
| Waktu | memakai dua input jam (mulai & selesai), keduanya harus sama persis dengan kunci PDF (mis. 09.00–12.00). |
| Organisasi Rapat | di aplikasi ditandai `bebas: true`, jadi **selalu dianggap benar**; nilai Pemimpin Rapat dan Notulis hanya tampil di kolom tanda tangan. |

---

## 2. Practice Latihan 1 — PT Permindo Sikucha (`practice-l1`)

Rapat: Senin, 10 Juni 2024, 09.00–12.00 WIB, Ruang Rapat PT Permindo Sikucha.
Tanggal penulisan notula (PDF): Senin, 10 Juni 2024. Video: `ZwK2DS2vPQA`. **KKM 75/100.**

### Identitas Rapat

| Field | Isi (PDF) | Kata kunci wajib (PDF) |
|---|---|---|
| Agenda Rapat | Meningkatkan disiplin untuk meningkatkan omset perusahaan | `disiplin`, `omset` |
| Hari/Tanggal | Senin, 10 Juni 2024 | `Senin`, `10 Juni 2024` |
| Waktu | 09.00 – 12.00 WIB | `09.00`/`9`, `12.00`/`12` |
| Tempat | Ruang Rapat PT Permindo Sikucha | `ruang rapat`, `PT Permindo Sikucha` |
| Organisasi — Pemimpin Rapat | Pimpinan | — (tidak dinilai) |
| Organisasi — Notulis | Sekretaris | — (tidak dinilai) |
| Peserta Rapat | 1. Pimpinan · 2. Sekretaris · 3. Manajer Pemasaran · 4. Manajer Kepegawaian & Umum · 5. Manajer Keuangan | `pimpinan`, `sekretaris`, `pemasaran`, `kepegawaian`, `umum`, `keuangan` |

### Susunan Acara (10 poin)

| Poin | Isi | Kata kunci per poin |
|---|---|---|
| 1 | Pembukaan | `pembukaan` |
| 2 | Laporan/Diskusi | `laporan` / `diskusi` |
| 3 | Penutup | `penutup` |

### Isi Rapat (40 poin)

| Pembicara (PDF) | Poin kunci wajib |
|---|---|
| Manajer Pemasaran | Karyawan tidak disiplin, target/omset tidak tercapai, teguran belum efektif |
| Manajer Kepegawaian & Umum | Lebih dari 5 kali absen tanpa alasan jelas, sudah ada peringatan tertulis, perlu tindakan lebih tegas, absensi masih manual, usul sistem absensi digital |
| Manajer Keuangan | Omset turun 15% dalam 3 bulan, usul restrukturisasi sistem insentif |

### Penutup / Hasil Rapat (30 poin)

1. Menerapkan sistem absensi berbasis teknologi/digital.
2. Manajer Kepegawaian & Umum menyusun peraturan lebih ketat dan memberikan sanksi.

Kata kunci wajib: `absensi digital`/`teknologi`, `peraturan ketat`, `sanksi`.

---

## 3. Practice Latihan 2 — PT Sinar Abadi Jaya (`practice-l2`)

Rapat: Rabu, 25 September 2024, 13.00–15.00 WIB, Ruang Rapat Utama Kantor Pusat.
Tanggal penulisan notula (PDF): Rabu, 25 September 2024. Video: `e6LQbyzshE0`. **KKM 75/100.**

### Identitas Rapat

| Field | Isi (PDF) | Kata kunci wajib (PDF) |
|---|---|---|
| Agenda Rapat | Membahas kondisi keuangan dan pemasaran perusahaan | `keuangan`, `pemasaran` |
| Hari/Tanggal | Rabu, 25 September 2024 | `Rabu`, `25 September 2024` |
| Waktu | 13.00 – 15.00 WIB | `13.00`, `15.00` |
| Tempat | Ruang Rapat Utama Kantor Pusat | `ruang rapat utama`, `kantor pusat` |
| Organisasi — Pemimpin Rapat | Pimpinan | — (tidak dinilai) |
| Organisasi — Notulis | Sekretaris (merangkap Moderator) | — (tidak dinilai) |
| Peserta Rapat | 1. Pimpinan · 2. Sekretaris (merangkap Moderator) · 3. Manajer Pemasaran · 4. Manajer Keuangan · 5. Manajer SDM & Produksi | `pimpinan`, `sekretaris`, `moderator`, `pemasaran`, `keuangan`, `SDM`, `produksi` |

### Susunan Acara (10 poin)

`pembukaan` · `laporan`/`diskusi` · `penutup`

### Isi Rapat (40 poin)

| Pembicara (PDF) | Poin kunci wajib |
|---|---|
| Manajer Pemasaran | Penjualan menurun; faktor penyebab: fitur produk kurang menarik, perubahan tren konsumen |
| Manajer Keuangan | Keuangan menurun sejak 2022–2024; usul: kurangi kegiatan tidak perlu, awasi ketat keuangan |
| Manajer SDM & Produksi | Bertanya soal efisiensi; dijawab: tingkatkan mutu produk, perluas pasar, tingkatkan laba. Bertanya soal ekspansi; dijawab ekspansi perlu dilakukan |

### Penutup / Hasil Rapat (30 poin)

1. Perusahaan sedang mengalami penurunan (keuangan & penjualan).
2. Fokus pada peningkatan mutu produk dan perluasan pasar untuk meningkatkan laba.
3. Ekspansi pasar akan dilakukan untuk membuka target yang jelas dan realistis.

Kata kunci wajib: `penurunan`, `mutu produk`/`perluasan pasar`, `ekspansi`.

---

## 4. Practice Latihan 3 — PT Nusantara Bangun Karya (`practice-l3`)

Rapat evaluasi kinerja pegawai: Rabu, 31 Agustus 2022, 08.00–11.00 WIB, Hotel The Langham 2,
Ruang B, Jakarta Pusat. Tanggal penulisan notula (PDF): Rabu, 31 Agustus 2022.
Video: `Hzb4uTb_334`. **KKM 75/100.**

### Identitas Rapat

| Field | Isi (PDF) | Kata kunci wajib (PDF) |
|---|---|---|
| Agenda Rapat | Rapat evaluasi kinerja pegawai | `evaluasi`, `kinerja` |
| Hari/Tanggal | Rabu, 31 Agustus 2022 | `31 Agustus 2022` |
| Waktu | 08.00 – 11.00 WIB | `08.00`/`8`, `11.00`/`11` |
| Tempat | Hotel The Langham 2, Ruang B, Jakarta Pusat | `Hotel The Langham`, `Ruang B`, `Jakarta Pusat` |
| Organisasi — Pemimpin Rapat | Pimpinan | — (tidak dinilai) |
| Organisasi — Notulis | Sekretaris | — (tidak dinilai) |
| Peserta Rapat | 1. Pimpinan · 2. Sekretaris · 3. Manajer Kepegawaian · 4. Manajer Produksi · 5. Manajer Pemasaran | `pimpinan`, `sekretaris`, `kepegawaian`, `produksi`, `pemasaran` |

### Susunan Acara (10 poin)

`pembukaan` · `pembahasan`/`diskusi` · `penutup`

### Isi Rapat (40 poin) — 6 pembicara

| # | Pembicara (PDF) | Poin kunci wajib |
|---|---|---|
| 1 | Manajer Kepegawaian | Kinerja pegawai menurun, kehadiran 75%, keterlambatan 70% (naik 15% dari sebelumnya), penyebab: cuti di luar libur & pegawai tidak disiplin waktu |
| 2 | Manajer Produksi & Pemasaran (menyampaikan aspirasi staff) | Hari libur kurang (cuti hanya 1 minggu/tahun), kerja hari Minggu tanpa tambahan gaji, jam masuk kerja terlalu pagi, potongan gaji besar, kurang motivasi/apresiasi |
| 3 | Pimpinan | Solusi: kebijakan baru soal kedisiplinan pegawai |
| 4 | Manajer Kepegawaian | Usul: ketegasan kerja di luar jam kerja, kepala divisi beri hak libur |
| 5 | Manajer Produksi | Usul: reward untuk kerja di hari libur, cuti ditambah jadi 1 bulan/tahun, pelatihan/diklat rutin |
| 6 | Manajer Pemasaran | Usul: reward non-uang (piagam/sertifikat), toleransi keterlambatan 3x/bulan lalu potong Rp50.000, ubah jam masuk kerja dari jam 6 ke jam 8 |

### Penutup / Hasil Rapat (30 poin)

1. Peniadaan kerja di hari libur.
2. Toleransi keterlambatan 3x/bulan, lebih dari itu potong gaji Rp50.000.
3. Perubahan jam masuk kerja dari jam 6 menjadi jam 8.
4. Pengadaan pelatihan dan diklat pegawai secara rutin.
5. Pemberian reward (piagam/sertifikat, dsb).

Kata kunci wajib: `kerja hari libur`, `toleransi keterlambatan`, `jam masuk kerja`,
`pelatihan`/`diklat`, `reward`.

---

## 5. Level Expert (Form Notula) — Sirclo Store (`expert`)

Rapat: Jumat, 21 Oktober 2022, 08.00–10.00 WIB, Ruang Meeting Sirclo Store.
Tanggal penulisan notula (PDF): Jumat, 21 Oktober 2022. Video: `fMUP8CxNv3w`. **KKM 75/100.**

### Identitas Rapat

| Field | Isi (PDF) | Kata kunci wajib (PDF) |
|---|---|---|
| Agenda Rapat | Membahas penurunan omset perusahaan | `omset`, `penurunan` |
| Hari/Tanggal | Jumat, 21 Oktober 2022 | `21 Oktober 2022` |
| Waktu | 08.00 – 10.00 WIB | `08.00`/`8`, `10.00` |
| Tempat | Ruang Meeting Sirclo Store | `ruang meeting`, `Sirclo Store` |
| Organisasi — Pemimpin Rapat | Pimpinan | — (tidak dinilai) |
| Organisasi — Notulis | Sekretaris (merangkap Notulis & Dokumenter) | — (tidak dinilai) |
| Peserta Rapat | 1. Pimpinan · 2. Sekretaris (merangkap Notulis & Dokumenter) · 3. Manajer Pemasaran · 4. Manajer Produksi · 5. Manajer Keuangan | `pimpinan`, `sekretaris`, `notulis`, `pemasaran`, `produksi`, `keuangan` |

### Susunan Acara (10 poin)

1. Pembukaan (dibuka Sekretaris, sambutan Pimpinan).
2. Pembahasan (laporan divisi, pembahasan inti, tanya jawab).
3. Penutup (kesimpulan rapat dan penutup).

Kata kunci: `pembukaan` · `pembahasan`/`diskusi` · `penutup`

### Isi Rapat (40 poin) — 12 pembicara

| # | Pembicara (PDF) | Poin kunci wajib |
|---|---|---|
| 1 | Pimpinan | Omset menurun signifikan, akan bahas strategi peningkatan |
| 2 | Manajer Pemasaran | Penjualan turun 40% dalam 4 bulan, penyebab: pesaing harga lebih terjangkau meski kualitas kita lebih unggul |
| 3 | Manajer Keuangan | Kondisi keuangan stabil, penjualan 4 bulan terakhir masih capai target |
| 4 | Manajer Produksi | Produksi lancar, tapi mesin sering bermasalah, perlu servis dan pembersihan |
| 5 | Pimpinan | Minta segera hubungi pihak terkait untuk servis mesin |
| 6 | Sekretaris | Usul perbarui cara promosi karena monoton (medsos & e-commerce) |
| 7 | Manajer Produksi | Usul produksi produk minimalis harga terjangkau untuk bersaing |
| 8 | Manajer Keuangan | Tidak setuju usul produksi; usul kurangi produksi, fokus jual produk yang ada, diskon 10–25% untuk distributor/konsumen tetap/pembeli besar |
| 9 | Manajer Produksi | Menyanggah: diskon besar = untung sedikit |
| 10 | Manajer Keuangan | Menjawab: untung sedikit lebih baik daripada barang tidak laku |
| 11 | Pimpinan | Keputusan: ikuti saran keuangan — hentikan produksi sementara, fokus jual barang yang ada, diskon 10–25% |
| 12 | Manajer Pemasaran | Setuju, akan promosi via konten visual medsos + diskon + perluas jangkauan supplier baru |

### Penutup / Hasil Rapat (30 poin)

1. Servis dan pembersihan mesin produksi.
2. Pemasaran melalui media sosial.
3. Menjual produk secara online melalui e-commerce.
4. Mengurangi/menghentikan sementara produksi barang yang masih banyak stok.
5. Fokus penjualan produk tersedia dengan diskon 10–25%.
6. Liburan akhir tahun untuk karyawan jika target perusahaan terpenuhi.

Kata kunci wajib: `servis mesin`, `media sosial`, `e-commerce`, `diskon`, `target`.

> Catatan: Expert tidak menampilkan halaman skor. Form notula Expert dibuka setelah kuis
> "Point Rush" (10 soal) selesai, dan kuis tersebut tidak memakai aturan pengulangan.

---

## 6. Aturan Kelulusan & Pengulangan (Latihan 1 → 2 → 3 → Expert)

Berlaku untuk Latihan 1, 2, dan 3 (KKM 75 sesuai PDF):

1. **Lulus** (skor ≥ KKM): latihan ditandai selesai dan tahap berikutnya terbuka.
2. **Belum lulus** (skor < KKM): latihan **tidak ditandai selesai**, tahap berikutnya **tetap
   terkunci**, dan siswa **wajib mengulang** latihan yang sama.
   - Kartu di halaman Practice berubah menjadi "Belum Lulus · (skor)%" dengan tombol
     "Ulangi Latihan".
   - Halaman Hasil menampilkan pesan belum lulus KKM beserta daftar field yang belum sesuai, dan
     tombol lanjut berubah menjadi "Ulangi Latihan X".
   - Pengerjaan ulang membuka form kosong (video simulasi diputar ulang dari awal).
   - Setiap percobaan dicatat sebagai riwayat pengerjaan, tetapi status tahap di database tidak
     diubah sampai siswa lulus.
3. Expert hanya terbuka setelah Latihan 1–3 berstatus selesai.

**Pengecualian kuis Expert ("Point Rush"):** aturan pengulangan tidak berlaku. Kuis berjalan sampai
soal terakhir dan apa pun hasilnya siswa langsung lanjut ke form notula Expert. Tidak ada tombol
mengulang kuis, dan skor kuis tidak menghalangi tahap apa pun.

---

## 7. Penyesuaian Rubrik terhadap PDF

1. **KKM Latihan 1 diseragamkan menjadi 75.** Sebelumnya rubrik memakai 70, sedangkan PDF menetapkan
   75/100 (sama dengan Latihan 2, 3, dan Expert). Sudah diperbaiki.
2. **Kata kunci lain sudah sesuai PDF.** Agenda, waktu, tempat, peserta, susunan acara, isi rapat
   per pembicara, dan penutup pada Latihan 1–3 serta Expert tidak perlu diubah — daftar kata kunci
   di rubrik sudah mencakup seluruh kata kunci wajib PDF.
3. **Rubrik memakai sebagian kata kunci tambahan** yang tidak ada di PDF (mis. nama pembicara dalam
   video seperti "syafina", "wildan", "bella", "wanda", serta variasi "hrd", "pemimpin",
   "dokumenter"). Sifatnya pelengkap: seluruh kata kunci wajib PDF tetap ada, jadi penilaian tetap
   sesuai PDF dan lebih toleran terhadap jawaban berbasis nama.
4. **Field Organisasi Rapat tidak dinilai.** PDF mencantumkan isi Organisasi (Pemimpin Rapat:
   Pimpinan; Notulis: Sekretaris) tetapi tidak menetapkan kata kunci wajib untuk field ini, sehingga
   di aplikasi field ini selalu dianggap benar.
5. **Aplikasi tidak memiliki field "Kop Surat"** meskipun PDF menyebutkannya pada aspek kelengkapan
   identitas rapat. Bobot identitas 20 poin di aplikasi dibagi rata ke 6 field (Agenda, Hari/Tanggal,
   Waktu, Tempat, Organisasi, Peserta).
6. **Hari/Tanggal dan Waktu dinilai sama persis**, karena form memakai input tanggal dan jam
   (bukan teks bebas), sehingga siswa otomatis menghasilkan format yang sama dengan kunci.
