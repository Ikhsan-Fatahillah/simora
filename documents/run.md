# Menjalankan SIMORA di Localhost (via Terminal)

SIMORA adalah aplikasi web statis (HTML + CSS + JavaScript ES Modules). Karena memakai `import/export` antar file JS, **tidak bisa dibuka langsung** dengan double-click `index.html` — harus disajikan lewat server HTTP lokal.

---

## 1. Buka Terminal

Di macOS: buka app **Terminal**, lalu arahkan ke folder project:

```bash
cd /Users/skyshi/Desktop/simora
```

## 2. Jalankan server lokal

Pilih salah satu (cukup satu cara):

### Opsi A — Python 3 (bawaan macOS, paling simpel)

```bash
python3 -m http.server 8080
```

### Opsi B — Node.js (jika sudah terpasang)

```bash
npx serve -l 8080
```

### Opsi C — PHP (jika terpasang)

```bash
php -S localhost:8080
```

> Semua opsi di atas menyajikan file dari **folder root** `/Users/skyshi/Desktop/simora`.

## 3. Buka di browser

Kunjungi:

```
http://localhost:8080
```

Cara cepat membuka dari terminal macOS:

```bash
open http://localhost:8080
```

---

## Catatan penting

- **Jangan jalankan server dari sub-folder** (mis. dari dalam `documents/`), karena path aset seperti `js/main.js`, `style.css`, dan `documents/backsound.mp3` relatif ke root project.
- **Ganti port jika 8080 sudah terpakai**, misalnya:
  ```bash
  python3 -m http.server 8000
  ```
  lalu buka `http://localhost:8000`.
- **Menghentikan server**: tekan `Ctrl + C` di terminal yang sama.
- **Video YouTube, backsound, dan Google Fonts** butuh koneksi internet.
- Sound (klik/backsound) baru aktif setelah ada interaksi pertama di halaman (kebijakan autoplay browser). Jika tidak terdengar, pastikan ikon suara 🔊 di pojok kanan atas dalam keadaan nyala.
