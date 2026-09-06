# Product Requirements Document (PRD)

# SIMORA

> **Pengembangan Media Pembelajaran Interaktif Berbasis Website dengan Pendekatan Gamifikasi**

---

## 1. Informasi Produk

| Item             | Detail                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Nama Produk      | **Simora**                                                                                            |
| Jenis Produk     | Website Media Pembelajaran Interaktif                                                                 |
| Pendekatan       | Gamifikasi                                                                                            |
| Platform         | Website                                                                                               |
| Target Pengguna  | Peserta didik / siswa                                                                                 |
| Tujuan Utama     | Membantu pengguna mempelajari materi melalui pembelajaran interaktif berbasis kuis dan sistem progres |
| Status           | Development                                                                                           |
| Data Development | **Dummy Data** untuk tahap awal pengembangan dan pengujian                                            |

### Tagline

Landing page saat ini menggunakan tagline:

**"Sistem Monitoring dan Evaluasi Pembelajaran Interaktif"**

> Tagline dapat disesuaikan kembali dengan materi pembelajaran yang digunakan.

---

# 2. Latar Belakang

Proses pembelajaran konvensional terkadang membuat peserta didik kurang tertarik untuk mempelajari materi secara mandiri. Penyampaian materi yang bersifat satu arah juga dapat menyebabkan rendahnya keterlibatan pengguna dalam proses pembelajaran.

Oleh karena itu, diperlukan sebuah media pembelajaran yang lebih interaktif, menarik, dan mampu memberikan motivasi kepada peserta didik untuk belajar secara bertahap.

**Simora** dikembangkan sebagai media pembelajaran berbasis website yang menerapkan pendekatan **gamifikasi**. Pengguna dapat mempelajari materi melalui beberapa tingkatan kemampuan, yaitu **Beginner, Practice, dan Expert**.

Setiap tingkatan menyediakan soal pilihan ganda yang dapat dikerjakan oleh pengguna. Hasil pengerjaan akan digunakan untuk menampilkan perkembangan belajar pengguna melalui halaman **Progress**.

---

# 3. Tujuan Produk

Simora memiliki tujuan untuk:

1. Menyediakan media pembelajaran yang interaktif dan mudah digunakan.
2. Meningkatkan keterlibatan peserta didik dalam proses pembelajaran.
3. Menerapkan konsep gamifikasi dalam pembelajaran berbasis website.
4. Membantu peserta didik mengetahui perkembangan kemampuan mereka.
5. Memberikan pengalaman belajar secara bertahap melalui beberapa level.
6. Menyediakan sumber referensi pembelajaran yang dapat digunakan pengguna untuk memperdalam materi.

---

# 4. Target User

## 4.1 Peserta Didik

Pengguna utama Simora adalah peserta didik yang menggunakan website untuk:

* Mempelajari materi pembelajaran.
* Mengerjakan soal.
* Meningkatkan kemampuan melalui level pembelajaran.
* Melihat perkembangan belajar.
* Mengakses referensi pembelajaran.

## 4.2 Pengembang

Pengembang website bertanggung jawab terhadap:

* Pengembangan sistem.
* Pengembangan konten pembelajaran.
* Pengelolaan soal.
* Pemeliharaan website.
* Penyediaan informasi pengembang pada halaman Profile.

---

# 5. User Journey

Alur utama pengguna pada Simora:

```text
Landing Page
      ↓
    Login
      ↓
 Onboarding (Sapaan)
      ↓
 ┌────┴────────┐
 ↓             ↓
Panduan     Dashboard (ATP)
(Modal)         ↓
           Buka Menu Tes
                ↓
        Pilih Level (Beginner → Practice → Expert)
                ↓
      Preview Tes (Popup Petunjuk)
                ↓
          Soal Pilihan Ganda
                ↓
       Feedback + Pembahasan
                ↓
     Hasil (Lulus ≥ 70% / Belum Lulus)
                ↓
             Progress
```

Halaman lain yang dapat diakses pengguna:

```text
Dashboard (ATP)
        │
        ├── Tes (Beginner / Practice / Expert)
        ├── Progres
        ├── Referensi
        └── Profil Dev
```

---

# 6. Struktur Halaman

Simora terdiri dari beberapa halaman utama:

1. Landing Page
2. Login
3. Onboarding (Welcome Page)
4. Panduan (Modal)
5. Dashboard (ATP — Capaian & Tujuan Pembelajaran)
6. Tes (Daftar Level: Beginner, Practice, Expert)
7. Quiz (Pengerjaan Soal)
8. Progress
9. Referensi
10. Profile

---

# 7. Functional Requirements

## 7.1 Landing Page

### Deskripsi

Landing Page merupakan halaman pertama yang dilihat pengguna ketika mengakses Simora.

### Content

Landing Page minimal menampilkan:

* Logo / nama **Simora**
* Tagline
* Deskripsi singkat mengenai Simora
* Dua kartu fitur utama (Modul ATP Mandiri & Tes Evaluasi Bertingkat)
* Button **Mulai Petualangan Belajar**

### Functional Requirement

| ID    | Requirement                                                      |
| ----- | ---------------------------------------------------------------- |
| LP-01 | Sistem harus menampilkan nama "Simora".                          |
| LP-02 | Sistem harus menampilkan tagline Simora.                         |
| LP-03 | Sistem harus menyediakan informasi singkat mengenai Simora.      |
| LP-04 | Sistem harus menyediakan button "Mulai Petualangan Belajar".     |
| LP-05 | Ketika button diklik, pengguna diarahkan ke halaman Login.       |
| LP-06 | Landing menampilkan fitur utama (Modul ATP & Tes Bertingkat).    |

---

# 8. Login

### Deskripsi

Halaman Login digunakan untuk melakukan autentikasi pengguna.

### Input

* Username
* Password

### Functional Requirement

| ID    | Requirement                                                          |
| ----- | -------------------------------------------------------------------- |
| LG-01 | Sistem harus menyediakan input username.                             |
| LG-02 | Sistem harus menyediakan input password.                             |
| LG-03 | Sistem harus menyediakan button Login.                               |
| LG-04 | Sistem melakukan autentikasi sisi klien dengan akun dummy.           |
| LG-05 | Jika data valid, pengguna diarahkan ke halaman Onboarding.           |
| LG-06 | Password harus ditampilkan secara tersembunyi.                       |
| LG-07 | Tombol kembali mengarahkan pengguna ke Landing Page.                 |

### Validation

* Username wajib diisi.
* Password wajib diisi.
* (Development) Validasi backend belum diterapkan — seluruh input diterima sebagai akun dummy (`pahlawan_simora`).

---

# 9. Onboarding (Welcome Page)

### Deskripsi

Onboarding merupakan halaman awal setelah pengguna berhasil login.

Halaman ini memberikan dua pilihan utama kepada pengguna:

* **Baca Panduan Penggunaan** — membuka modal panduan tanpa meninggalkan halaman.
* **Masuk ke Dashboard (ATP)** — masuk ke workspace aplikasi.

### Functional Requirement

| ID    | Requirement                                                  |
| ----- | ------------------------------------------------------------ |
| OB-01 | Sistem menampilkan sapaan kepada pengguna.                   |
| OB-02 | Sistem menampilkan button Panduan Penggunaan.                |
| OB-03 | Sistem menampilkan button Dashboard (ATP).                   |
| OB-04 | Button Panduan membuka modal panduan.                        |
| OB-05 | Button Dashboard menampilkan workspace aplikasi.             |
| OB-06 | Status onboarding disimpan sehingga tidak muncul berulang.   |

---

# 10. Panduan

### Deskripsi

Halaman Panduan memberikan informasi mengenai cara menggunakan Simora.

### Content

Panduan diimplementasikan sebagai modal yang menjelaskan:

1. Alur Tujuan Pembelajaran (CP & TP).
2. Mekanisme pengerjaan tes secara bertahap.
3. Penjelasan level Beginner, Practice, dan Expert.
4. Kriteria kelulusan (minimal 70%).
5. Cara memantau progres.

### Functional Requirement

| ID    | Requirement                                   |
| ----- | --------------------------------------------- |
| GD-01 | Sistem menampilkan panduan penggunaan Simora. |
| GD-02 | Sistem menjelaskan mekanisme pengerjaan soal. |
| GD-03 | Sistem menjelaskan setiap level pembelajaran. |
| GD-04 | Sistem menjelaskan XP, level, dan kriteria kelulusan. |

---

# 11. Dashboard (ATP)

### Deskripsi

Dashboard (view ATP) merupakan halaman utama pembelajaran yang memberikan gambaran Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) Fase E Algoritma dan Pemrograman.

### Content

Dashboard menampilkan:

### A. Capaian Pembelajaran (CP)

Hero section berisi kompetensi yang diharapkan setelah menyelesaikan pembelajaran: berpikir komputasional, dasar pemrograman, percabangan & perulangan, serta fungsi modular.

### B. Tujuan Pembelajaran (TP)

Tiga Tujuan Pembelajaran yang dipetakan ke tingkat tes:

* **TP-01: Tipe Data & Variabel** → Tes Beginner.
* **TP-02: Percabangan & Perulangan** → Tes Practice.
* **TP-03: Fungsi & Array** → Tes Expert.

### C. Akses Tes

Button **Buka Menu Tes** mengarahkan pengguna ke halaman Tes untuk memilih level.

### Functional Requirement

| ID    | Requirement                                    |
| ----- | ---------------------------------------------- |
| DB-01 | Sistem menampilkan capaian pembelajaran (CP).  |
| DB-02 | Sistem menampilkan tujuan pembelajaran (TP).   |
| DB-03 | Sistem menyediakan akses menuju halaman Tes.   |
| DB-04 | Pengguna dapat membuka halaman Tes.            |

---

# 12. Beginner

### Deskripsi

Beginner merupakan level pembelajaran dasar yang digunakan untuk menguji pemahaman awal pengguna.

### Flow

```text
Beginner
   ↓
Preview Tes (Popup Petunjuk)
   ↓
"Mulai Tes Sekarang"
   ↓
Soal 1
   ↓
Pilih Jawaban
   ↓
Feedback + Pembahasan
   ↓
Lanjut
   ↓
Soal Berikutnya
   ↓
...
   ↓
Selesai → Evaluasi Kelulusan (≥ 70%)
```

### Popup (Preview Tes)

Sebelum soal ditampilkan, sistem menampilkan overlay preview tes berisi sapaan, deskripsi tes, petunjuk (lulus minimal 70%), difficulty, reward XP, dan jumlah soal.

Contoh judul:

> **Halo, Pahlawan SIMORA! Selamat datang di Tes Beginner**

Button:

**Mulai Tes Sekarang**

### Soal

Soal menggunakan format pilihan ganda.

Setiap soal memiliki:

* Nomor soal.
* Pertanyaan.
* Beberapa pilihan jawaban.
* Button Lanjut.

### Functional Requirement

| ID    | Requirement                                                      |
| ----- | ---------------------------------------------------------------- |
| BG-01 | Sistem menampilkan popup sebelum test dimulai.                   |
| BG-02 | Popup menampilkan sapaan kepada pengguna.                        |
| BG-03 | Sistem menyediakan button Mulai.                                 |
| BG-04 | Ketika Mulai diklik, sistem menampilkan soal pertama.            |
| BG-05 | Sistem menampilkan soal dalam bentuk pilihan ganda.              |
| BG-06 | Pengguna dapat memilih satu jawaban.                             |
| BG-07 | Sistem menyimpan jawaban pengguna.                               |
| BG-08 | Pengguna dapat berpindah ke soal berikutnya.                     |
| BG-09 | Sistem menampilkan indikator nomor/progres soal.                 |
| BG-10 | Setelah seluruh soal selesai, sistem menyimpan hasil pengerjaan. |
| BG-11 | Skor minimal 70% dinyatakan lulus dan membuka level Practice.   |

---

# 13. Practice

### Deskripsi

Practice merupakan level pembelajaran menengah.

Mekanisme pengerjaan sama dengan Beginner, tetapi tingkat kesulitan soal lebih tinggi.

### Level

```text
Beginner
↓
Dasar

Practice
↓
Menengah

Expert
↓
Lanjutan
```

### Functional Requirement

| ID    | Requirement                                                            |
| ----- | ---------------------------------------------------------------------- |
| PR-01 | Sistem menampilkan popup sapaan sebelum test.                          |
| PR-02 | Sistem menampilkan soal Practice setelah pengguna menekan Mulai.       |
| PR-03 | Soal menggunakan format pilihan ganda.                                 |
| PR-04 | Pengguna dapat memilih jawaban.                                        |
| PR-05 | Pengguna dapat berpindah ke soal berikutnya.                           |
| PR-06 | Sistem menyimpan hasil pengerjaan Practice.                            |
| PR-07 | Tingkat kesulitan soal Practice harus lebih tinggi dibanding Beginner. |
| PR-08 | Skor minimal 70% membuka level Expert.                                 |

---

# 14. Expert

### Deskripsi

Expert merupakan level pembelajaran tingkat lanjut.

Level ini digunakan untuk menguji pemahaman pengguna terhadap materi dengan soal yang lebih kompleks.

### Functional Requirement

| ID    | Requirement                                                          |
| ----- | -------------------------------------------------------------------- |
| EX-01 | Sistem menampilkan popup sapaan sebelum test.                        |
| EX-02 | Sistem menampilkan soal Expert setelah pengguna menekan Mulai.       |
| EX-03 | Soal menggunakan format pilihan ganda.                               |
| EX-04 | Pengguna dapat memilih jawaban.                                      |
| EX-05 | Pengguna dapat berpindah ke soal berikutnya.                         |
| EX-06 | Sistem menyimpan hasil pengerjaan Expert.                            |
| EX-07 | Tingkat kesulitan soal Expert harus lebih tinggi dibanding Practice. |
| EX-08 | Hasil tes Expert menjadi penyempurna ketercapaian ATP.               |

---

# 15. Sistem Gamifikasi

Gamifikasi merupakan komponen utama dalam Simora.

## 15.1 XP (Experience Points)

Pengguna memperoleh XP saat **lulus** sebuah tes. XP tidak diberikan per jawaban.

| Level    | Reward XP |
| -------- | --------- |
| Beginner | 50 XP     |
| Practice | 85 XP     |
| Expert   | 120 XP    |

> Nilai reward dapat dikonfigurasi pada `DEFAULT_STATE` di `app.js`.

### Requirement

| ID    | Requirement                                    |
| ----- | ---------------------------------------------- |
| GM-01 | Sistem menghitung skor akhir tes (persentase). |
| GM-02 | Sistem memberikan XP jika skor ≥ 70%.          |
| GM-03 | Sistem menyimpan total XP pengguna.            |
| GM-04 | Sistem menampilkan XP pada HUD header.         |

---

## 15.2 Level

Simora memiliki tiga level:

### 🟢 Beginner

Tingkat dasar.

### 🟡 Practice

Tingkat menengah.

### 🔴 Expert

Tingkat lanjutan.

Sistem dapat menggunakan hasil pengerjaan untuk menunjukkan perkembangan pengguna pada setiap level.

---

## 15.3 Progress

Progress menunjukkan perkembangan pengguna dalam menyelesaikan pembelajaran.

Contoh:

```text
Beginner
████████████████████ 100%

Practice
██████████████░░░░░░ 70%

Expert
██████░░░░░░░░░░░░░░ 30%
```

---

## 15.4 Level Pengguna & Streak

Selain tingkat tes, pengguna memiliki level pengguna yang naik saat XP memenuhi ambang (`xpNeeded`).

* Setiap tes lulus menambah **streak** (+1).
* `xpNeeded` naik ×1,3 setiap kali naik level.
* Level, XP bar, dan streak ditampilkan pada HUD header.

### Requirement

| ID    | Requirement                                          |
| ----- | ---------------------------------------------------- |
| GM-05 | Sistem menampilkan level pengguna pada HUD.          |
| GM-06 | Sistem menambah streak setiap kali lulus tes.        |
| GM-07 | Sistem menaikkan level saat XP memenuhi ambang.      |
| GM-08 | Sistem menambah XP yang dibutuhkan saat naik level.  |

---

# 16. Progress

### Deskripsi

Halaman Progress digunakan untuk melihat perkembangan belajar pengguna.

### Content

Progress menampilkan:

* Indikator kelulusan ATP (persentase keseluruhan).
* Jumlah tingkat tes yang dituntaskan (x dari 3).
* Status setiap level (Terkunci / Belum Dikerjakan / Lulus).
* Nilai (skor %) dan tanggal pengerjaan untuk level yang lulus.

### Contoh

```text
Indikator Kelulusan ATP
████████████░░░░░░░░░░ 50% Selesai

Anda telah menuntaskan 1 dari 3 Tingkat Tes SIMORA.

Tingkat: Beginner   Nilai: 90% (30 Agu 2026)   Lulus
Tingkat: Practice   Nilai: -                    Belum Dikerjakan
Tingkat: Expert     Nilai: -                    Terkunci
```

### Functional Requirement

| ID    | Requirement                                              |
| ----- | -------------------------------------------------------- |
| PG-01 | Sistem menampilkan indikator kelulusan ATP.              |
| PG-02 | Sistem menampilkan jumlah tes yang dituntaskan.          |
| PG-03 | Sistem menampilkan status setiap level.                  |
| PG-04 | Sistem menampilkan skor setiap level yang lulus.         |
| PG-05 | Sistem menampilkan tanggal pengerjaan.                   |
| PG-06 | Progress diperbarui setelah pengguna menyelesaikan test. |

---

# 17. Referensi

### Deskripsi

Halaman Referensi menyediakan sumber pembelajaran yang dapat digunakan pengguna untuk mempelajari materi lebih lanjut.

### Content

Setiap referensi minimal memiliki:

* Judul sumber.
* Deskripsi singkat.
* Nama sumber/website.
* Link.

Contoh:

```text
Referensi Pembelajaran

[Judul Referensi]
Deskripsi singkat mengenai sumber.
Sumber: Website XYZ

[Pelajari →]
```

### Functional Requirement

| ID    | Requirement                                      |
| ----- | ------------------------------------------------ |
| RF-01 | Sistem menampilkan daftar referensi.             |
| RF-02 | Setiap referensi memiliki judul.                 |
| RF-03 | Setiap referensi memiliki deskripsi.             |
| RF-04 | Sistem menyediakan link menuju sumber referensi. |
| RF-05 | Link dapat dibuka oleh pengguna.                 |

---

# 18. Profile

### Deskripsi

Halaman Profile berisi informasi mengenai pengembang Simora.

### Content

* Nama pengembang.
* Foto/avatar (opsional).
* Institusi.
* Program studi.
* Deskripsi singkat.
* Kontak/social media (opsional).
* Informasi mengenai pengembangan Simora.

### Functional Requirement

| ID    | Requirement                                             |
| ----- | ------------------------------------------------------- |
| PF-01 | Sistem menampilkan informasi pengembang.                |
| PF-02 | Sistem menampilkan deskripsi pengembang.                |
| PF-03 | Sistem dapat menampilkan foto/avatar pengembang.        |
| PF-04 | Sistem dapat menampilkan informasi kontak/social media. |

---

# 19. Navigation

Setelah login, pengguna dapat mengakses menu utama melalui navigation bar/sidebar.

```text
SIMORA

ATP          (Dashboard — Capaian & Tujuan Pembelajaran)
Tes          (Daftar Level: Beginner, Practice, Expert)
Progres      (Laporan Capaian Belajar)
Referensi    (Sumber Belajar)
Profil Dev   (Informasi Pengembang)

Ubah Tema    (Dark / Light)
Keluar Akun  (Logout)
```

### Requirement

* Navigation tersedia pada halaman utama aplikasi.
* Menu aktif memiliki indikator visual.
* Pengguna dapat berpindah antar halaman.
* Logout mengakhiri session dan mengarahkan kembali ke Landing Page.
* Tema (dark/light) dapat diubah dan tersimpan.
* HUD menampilkan level, XP, dan streak pengguna.

---

# 20. Data Model

> **Catatan Development:** Pada tahap awal pengembangan, seluruh data menggunakan **dummy data**. Dummy data digunakan untuk mensimulasikan data pengguna, soal, jawaban, progress, poin, dan referensi sebelum sistem terhubung dengan database atau data produksi.

Implementasi awal tidak memerlukan data pengguna maupun konten pembelajaran yang sebenarnya. Struktur data tetap dibuat mengikuti model berikut agar nantinya mudah diganti dengan data dari database.

Struktur data aktual: state aplikasi disimpan di `localStorage` dengan key `simora_atp_state`.

```text
simora_atp_state
├── auth
│   ├── isLoggedIn
│   └── hasCompletedOnboarding
├── user
│   ├── level
│   ├── xp
│   ├── xpNeeded
│   └── streak
└── tests
    ├── beginner  (status, score, date, questions[])
    ├── practice  (status, score, date, questions[])
    └── expert    (status, score, date, questions[])
```

## Test

```text
Test
├── id
├── title
├── desc
├── difficulty
├── rewardXp
├── status        (unlocked | locked | completed)
├── score
├── date
└── questions[]
    └── { q, options[], answer, explain }
```

Setiap soal menyimpan pertanyaan, opsi jawaban (A-D), indeks jawaban benar, dan penjelasan (pembahasan) yang ditampilkan sebagai feedback.

> Preferensi tema disimpan terpisah pada key `simora_theme` (`dark`/`light`).

---

# 21. Status Progress

Setiap level memiliki status:

| Status          | Deskripsi                                                    |
| --------------- | ------------------------------------------------------------ |
| Terkunci        | Level terkunci, menunggu kelulusan level sebelumnya.         |
| Belum Mulai     | Level terbuka, belum dikerjakan.                             |
| Selesai         | Level lulus (skor ≥ 70%) dengan skor & tanggal tersimpan.    |

---

# 22. Non-Functional Requirements

## 22.1 Usability

* Interface harus mudah dipahami oleh peserta didik.
* Navigasi harus sederhana.
* Informasi penting harus mudah ditemukan.
* Feedback setelah memilih jawaban harus jelas.

## 22.2 Performance

* Halaman harus dapat dimuat dengan cepat.
* Perpindahan antar soal tidak boleh menyebabkan reload halaman yang tidak diperlukan.
* Sistem harus mampu menyimpan jawaban secara konsisten.

## 22.3 Responsive

Website harus dapat digunakan pada:

* Desktop.
* Laptop.
* Tablet.
* Smartphone.

## 22.4 Security

* Password tidak boleh ditampilkan dalam bentuk plaintext.
* Session pengguna harus dikelola dengan aman.
* Pengguna tidak boleh dapat mengakses data pengguna lain.
* Input pengguna harus divalidasi.

---

# 23. Feedback Interaksi

Untuk meningkatkan unsur gamifikasi, sistem dapat memberikan feedback setelah pengguna menjawab.

Setelah menjawab, sistem menampilkan panel feedback yang naik dari bawah berisi:

### Jawaban Benar

* Opsi terpilih disorot hijau.
* Panel feedback bertanda `✓` dan teks **Jawaban Benar!**.
* Menampilkan **pembahasan** soal.

### Jawaban Salah

* Opsi terpilih disorot merah, opsi benar disorot hijau.
* Panel feedback bertanda `✗` dan teks **Kurang Tepat!**.
* Animasi shake pada kontainer kuis.
* Menampilkan **pembahasan** soal.

Feedback disertai button **Lanjutkan** untuk berpindah ke soal berikutnya.

---

# 24. Hasil Test

Setelah pengguna menyelesaikan seluruh soal, sistem menghitung skor akhir dan mengevaluasi kelulusan (≥ 70%).

### Lulus

* Level ditandai **completed** dengan skor & tanggal tersimpan.
* XP reward ditambahkan dan streak bertambah.
* Level berikutnya terbuka (unlock).
* Toast notifikasi `Lulus Level {X}! Nilai: {skor}%`.
* Notifikasi `Naik Level` muncul jika XP mencapai ambang.

### Belum Lulus

* Toast notifikasi `Belum Lulus! Nilai: {skor}% (Butuh minimal 70%)`.
* Level dapat diulang.

> Saat ini belum ada layar ringkasan hasil — setelah selesai, pengguna dikembalikan ke halaman Tes.

---

# 25. Acceptance Criteria

## Landing Page

* [ ] Nama Simora tampil.
* [ ] Tagline tampil.
* [ ] Button "Mulai Petualangan Belajar" tersedia.
* [ ] Button mengarahkan ke halaman Login.

## Login

* [ ] Username dapat diinput.
* [ ] Password dapat diinput.
* [ ] Login diterima dan mengarahkan ke Onboarding.
* [ ] Password tersembunyi saat diinput.

## Onboarding

* [ ] Sapaan pengguna tampil.
* [ ] Pilihan Panduan tersedia.
* [ ] Pilihan Dashboard tersedia.
* [ ] Navigation bekerja dengan baik.

## Dashboard (ATP)

* [ ] Capaian pembelajaran (CP) tampil.
* [ ] Tujuan pembelajaran (TP) tampil.
* [ ] Button Buka Menu Tes tersedia.

## Beginner

* [ ] Preview tes (popup) tampil sebelum test.
* [ ] Button Mulai Tes tersedia.
* [ ] Soal pilihan ganda tampil.
* [ ] Pengguna dapat memilih jawaban.
* [ ] Feedback + pembahasan tampil.
* [ ] Pengguna dapat melanjutkan ke soal berikutnya.
* [ ] Hasil test tersimpan.
* [ ] Lulus (≥ 70%) membuka level Practice.

## Practice

* [ ] Preview tes (popup) tampil.
* [ ] Soal Practice tampil.
* [ ] Pengguna dapat memilih jawaban.
* [ ] Pengguna dapat berpindah soal.
* [ ] Hasil Practice tersimpan.
* [ ] Soal memiliki tingkat kesulitan menengah.
* [ ] Lulus (≥ 70%) membuka level Expert.

## Expert

* [ ] Preview tes (popup) tampil.
* [ ] Soal Expert tampil.
* [ ] Pengguna dapat memilih jawaban.
* [ ] Pengguna dapat berpindah soal.
* [ ] Hasil Expert tersimpan.
* [ ] Soal memiliki tingkat kesulitan lanjutan.

## Gamifikasi

* [ ] Sistem menghitung skor akhir.
* [ ] Sistem memberikan XP jika lulus (≥ 70%).
* [ ] Total XP tersimpan.
* [ ] Level pengguna naik saat XP memenuhi ambang.
* [ ] Streak bertambah setiap lulus.
* [ ] Progress level diperbarui.

## Progress

* [ ] Indikator kelulusan ATP tampil.
* [ ] Status setiap level tampil (Terkunci / Belum Mulai / Selesai).
* [ ] Score level tampil.
* [ ] Tanggal pengerjaan tampil.

## Referensi

* [ ] Daftar referensi tampil.
* [ ] Judul referensi tampil.
* [ ] Deskripsi referensi tampil.
* [ ] Link dapat diakses.

## Profile

* [ ] Informasi pengembang tampil.
* [ ] Deskripsi pengembang tampil.
* [ ] Informasi tambahan dapat ditampilkan.

---

# 26. MVP Scope

### Data MVP

Pada tahap MVP/development awal, sistem menggunakan **dummy data** terlebih dahulu. Penggunaan dummy data bertujuan untuk memfokuskan pengembangan pada UI, user flow, interaksi soal, sistem scoring, gamifikasi, dan progress tanpa bergantung pada database maupun data produksi.

Dummy data minimal mencakup:

* Dummy akun pengguna untuk proses login.
* Dummy data soal untuk level Beginner, Practice, dan Expert.
* Dummy pilihan jawaban dan kunci jawaban.
* Dummy data poin dan skor.
* Dummy data progress pengguna.
* Dummy data referensi pembelajaran.
* Dummy data informasi pengembang.

Setelah seluruh fitur MVP berjalan dengan baik, dummy data dapat digantikan dengan data aktual dan/atau database.

Untuk versi **MVP**, fitur yang wajib dikembangkan adalah:

### Core

* [x] Landing Page
* [x] Login
* [x] Onboarding (Welcome Page)
* [x] Panduan (Modal)
* [x] Dashboard (ATP)
* [x] Tes (Beginner, Practice, Expert)
* [x] Quiz interaktif + pembahasan
* [x] Progress
* [x] Referensi
* [x] Profile
* [x] Theme toggle (dark/light)

### Gamification

* [x] XP reward per tes lulus
* [x] Score & kriteria kelulusan 70%
* [x] Level pengguna & naik level
* [x] Streak
* [x] Unlock level berurutan
* [x] HUD (Level, XP bar, Streak)
* [x] Feedback jawaban + pembahasan
* [x] Toast notifikasi

### Authentication

* [x] Login
* [x] Session user
* [x] Logout

---

# 27. Future Development

Fitur berikut dapat dikembangkan pada versi berikutnya:

### Gamifikasi Lanjutan

* Badge/Achievement.
* Leaderboard.
* Reward / Daily Challenge.

### Pembelajaran

* Materi pembelajaran interaktif.
* Video pembelajaran.
* Flashcard.
* Simulasi.
* Randomized question.
* Bank soal.

### User

* Registrasi akun.
* Edit profile.
* Avatar.
* Riwayat pengerjaan.
* Statistik pembelajaran.

### Admin

* Admin dashboard.
* CRUD soal.
* CRUD materi.
* CRUD referensi.
* Monitoring pengguna.
* Monitoring hasil belajar.
* Export hasil belajar.

---

# 28. Success Metrics

Keberhasilan Simora dapat diukur melalui:

| Metric               | Indikator                                    |
| -------------------- | -------------------------------------------- |
| Completion Rate      | Persentase pengguna yang menyelesaikan level |
| Quiz Completion      | Jumlah test yang diselesaikan                |
| Average Score        | Rata-rata skor pengguna                      |
| Progress             | Persentase penyelesaian pembelajaran         |
| Engagement           | Frekuensi pengguna mengakses Simora          |
| Retention            | Pengguna yang kembali menggunakan Simora     |
| Learning Improvement | Perbandingan performa antar level            |

---

# 28. Prioritas Fitur

| Prioritas | Fitur           |
| --------- | --------------- |
| P0        | Login           |
| P0        | Dashboard       |
| P0        | Beginner        |
| P0        | Practice        |
| P0        | Expert          |
| P0        | Sistem soal     |
| P0        | Scoring         |
| P0        | Point           |
| P0        | Progress        |
| P1        | Panduan         |
| P1        | Referensi       |
| P1        | Profile         |
| P2        | Badge           |
| P2        | Leaderboard     |
| P2        | Achievement     |
| P2        | Admin Dashboard |

---

# 29. Definition of Done

Fitur dianggap selesai apabila:

1. Fitur telah diimplementasikan sesuai requirement.
2. UI telah sesuai dengan desain.
3. User dapat menjalankan flow tanpa error.
4. Data pengguna tersimpan dengan benar.
5. Sistem telah diuji pada desktop dan mobile.
6. Validasi input telah diterapkan.
7. Tidak terdapat bug kritis.
8. Acceptance criteria telah terpenuhi.
9. Fitur telah mendapatkan approval dari Product Owner/Pengembang.

---

# 30. Kesimpulan

**Simora** merupakan media pembelajaran interaktif berbasis website yang menggabungkan pembelajaran dengan pendekatan gamifikasi.

Konsep utama Simora adalah memberikan pengalaman belajar secara bertahap melalui tiga level:

> **Beginner → Practice → Expert**

Pengguna dapat mengerjakan soal pilihan ganda, memperoleh poin, melihat skor, dan memantau perkembangan pembelajaran melalui halaman Progress.

Dengan pendekatan tersebut, Simora diharapkan dapat menjadi media pembelajaran yang tidak hanya menyampaikan materi, tetapi juga meningkatkan **interaksi, motivasi, dan keterlibatan pengguna dalam proses belajar.**
