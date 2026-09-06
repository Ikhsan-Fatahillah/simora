# Panduan Push Kode SIMORA ke GitHub

Panduan untuk mengirim kode project SIMORA dari laptop ke repository GitHub yang sudah kamu siapkan. Jalankan semua perintah di Terminal dari folder project:

```bash
cd /Users/skyshi/Desktop/simora
```

---

## 1. Persiapan (sekali saja)

### a. Pastikan Git sudah terpasang

```bash
git --version
```

Jika muncul versi (misal `git version 2.39.0`), Git siap.

### b. Siapkan URL repository GitHub

Buka repository kosong yang sudah kamu buat di GitHub, salin alamatnya. Ada dua bentuk:

- HTTPS: `https://github.com/username/nama-repo.git`
- SSH: `git@github.com:username/nama-repo.git`

Catatan: HTTPS biasanya paling mudah. Saat push, Git akan meminta username dan **token** (bukan password biasa). Token dibuat di GitHub: *Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token*, centang scope `repo`.

---

## 2. Inisialisasi Git di folder project

```bash
git init
git branch -M main
```

`git init` membuat folder `.git` di project. `git branch -M main` memastikan nama branch utama adalah `main` (bukan `master`).

---

## 3. Lihat file apa saja yang akan dikirim

```bash
git status
```

File berwarna merah = baru/berubah dan belum terdaftar (untracked).

---

## 4. Daftarkan semua file

```bash
git add .
```

Perintah ini memasukkan semua file project ke staging area.

> Tips: kalau tidak ingin mengirim file tertentu (misal file sangat besar atau berisi data pribadi), buat file `.gitignore` dulu lalu tulis nama filenya, misalnya:
>
> ```text
> .DS_Store
> *.log
> ```
>
> Baru jalankan `git add .` lagi.

---

## 5. Commit perubahan

```bash
git commit -m "Initial commit: SIMORA - media pembelajaran interaktif notula rapat"
```

Commit adalah "snapshot" kode. Pesan dalam tanda kutip bisa kamu ubah sendiri.

---

## 6. Hubungkan ke repository GitHub

```bash
git remote add origin https://github.com/username/nama-repo.git
```

Ganti `https://github.com/username/nama-repo.git` dengan URL repository kamu (HTTPS atau SSH).

Cek remote sudah terpasang:

```bash
git remote -v
```

Harus muncul dua baris `origin` (fetch dan push).

---

## 7. Push kode ke GitHub

```bash
git push -u origin main
```

- `-u` membuat branch `main` lokal "mengikuti" branch `main` di GitHub, jadi push berikutnya cukup `git push`.
- Jika pakai HTTPS, masukkan username GitHub lalu token sebagai password.
- Jika push ditolak karena repository berisi file (misal README dibuat saat membuat repo), tarik dulu:

```bash
git pull origin main --allow-unrelated-histories
```

lalu ulangi `git push -u origin main`.

---

## 8. Verifikasi

Buka halaman repository di GitHub. Semua file SIMORA (index.html, style.css, js/, documents/, favicon.svg) seharusnya sudah tampil.

---

## Update kode berikutnya (rutin)

Setiap kali selesai mengubah kode, jalankan tiga perintah ini:

```bash
git add .
git commit -m "Deskripsi perubahan yang kamu lakukan"
git push
```

---

## Mengatasi masalah umum

| Masalah | Solusi |
| --- | --- |
| `fatal: not a git repository` | Jalankan `git init` dulu (langkah 2) |
| `remote origin already exists` | Ganti URL: `git remote set-url origin <url-baru>` |
| Password login GitHub ditolak | Pakai **token** sebagai password, bukan password akun |
| `main` vs `master` | Pastikan pakai `git branch -M main` sebelum push |
| Ingin hapus dari GitHub | `git rm --cached <nama-file>` lalu commit & push (file tetap ada di laptop) |
