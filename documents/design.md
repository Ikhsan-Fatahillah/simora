# SIMORA — Design System & Style Reference

> Dark glassmorphism learning dashboard — a deep navy canvas with translucent frosted-glass cards, indigo-violet gradient accents, and gamification HUD elements (level badge, XP bar, streak) as the splash of color.

**Theme:** dark (default) + light

SIMORA menghadirkan workspace belajar bertema gelap (dark-first): latar navy pekat `#0b0f19` dengan kartu kaca (glassmorphism) transparan ber-blur, aksen gradien indigo `#6366f1` menuju ungu `#a855f7`, serta elemen gamifikasi (level, XP, streak) sebagai penanda warna. Tipografi memakai dua font Google: **Outfit** untuk judul (geometric, ramah) dan **Plus Jakarta Sans** untuk body. Komponen flat dengan sudut membulat 8/12/16px, elevasi halus melalui shadow lembut, dan palet status semantik (emerald/amber/rose) yang konsisten untuk feedback jawaban, status level, dan notifikasi.

---

## Tokens — Warna (Dark, default)

| Name | Value | Token | Role |
|------|-------|-------|------|
| App Background | `#0b0f19` | `--bg-app` | Canvas halaman (dark), termasuk layar penuh auth & onboarding |
| Card Glass | `rgba(22,28,45,0.4)` | `--bg-card` | Permukaan kartu kaca; hover `rgba(30,39,63,0.6)` |
| Border | `rgba(255,255,255,0.08)` | `--border-color` | Hairline border kartu, divider, input |
| Border Glow | `rgba(99,102,241,0.3)` | `--border-color-glow` | Border hover kartu yang menyala |
| Text Primary | `#f3f4f6` | `--text-primary` | Heading & body utama |
| Text Secondary | `#9ca3af` | `--text-secondary` | Teks pendukung, deskripsi |
| Text Muted | `#6b7280` | `--text-muted` | Placeholder, status terkunci |
| Indigo | `#6366f1` | `--primary` | Aksen utama: CTA, nav aktif, fokus, progres kuis |
| Purple | `#a855f7` | `--secondary` | Aksen gradien pelengkap primary |
| Emerald | `#10b981` | `--success` | Jawaban benar, level selesai |
| Rose | `#ef4444` | `--danger` | Jawaban salah, aksi keluar/bahaya |
| Amber | `#f59e0b` | `--warning` | Status menunggu / belum dikerjakan |
| XP Blue | `#3b82f6` | `--xp-color` | Bar XP di HUD |
| Heart Pink | `#ec4899` | `--heart-color` | Warna gamifikasi pendukung |
| Coin Yellow | `#eab308` | `--coin-color` | Warna gamifikasi pendukung |
| Streak Orange | `#f97316` | `--streak-color` | Ikon streak harian |

### Light Theme (`[data-theme="light"]`)

| Name | Value |
|------|-------|
| App Background | `#f8fafc` |
| Card Glass | `rgba(255,255,255,0.7)`; hover `rgba(255,255,255,0.95)` |
| Border | `rgba(0,0,0,0.06)`; glow `rgba(99,102,241,0.2)` |
| Text Primary / Secondary / Muted | `#0f172a` / `#475569` / `#94a3b8` |
| Shadow | `0 8px 32px 0 rgba(31,38,135,0.05)` |

---

## Tokens — Tipografi

| Property | Value |
|----------|-------|
| Heading | `--font-heading: 'Outfit', -apple-system, sans-serif` (weight 700–800, judul halaman 1.8–2.8rem) |
| Body | `--font-body: 'Plus Jakarta Sans', -apple-system, sans-serif` (base 16px, line-height 1.5) |
| Sumber | Google Fonts: Outfit (300/400/600/800), Plus Jakarta Sans (300/400/500/700) |

Skala yang dipakai: 2.8rem (judul landing), 1.8rem (header view), 1.4rem (sub-judul), 1.35rem (teks soal), 1.1rem (feedback title), 0.95rem (body/UI), 0.85–0.9rem (meta), 0.65–0.7rem (XP text, badge status).

---

## Tokens — Bentuk & Elevasi

- **Radius:** `--radius-lg: 16px` (kartu, overlay), `--radius-md: 12px` (tombol, input, item, opsi kuis), `--radius-sm: 8px` (badge, tombol aksi tes), pill 50px (HUD stats bar, badge status, reward pill), lingkaran (badge level, ikon feedback).
- **Shadow:** `--shadow-main: 0 8px 32px 0 rgba(0,0,0,0.37)`; glow primary `0 4px 15px var(--primary-glow)`.
- **Transisi:** `--transition: all 0.3s cubic-bezier(0.4,0,0.2,1)`.

---

## Layout

- Workspace: grid `260px 1fr` — sidebar kiri sticky (100vh) + main-content (padding `32px 48px`, scroll vertikal sendiri).
- HUD header: pill stats bar di atas main content (badge level, XP bar, streak).
- Layar penuh (landing/login/onboarding): fixed `100vw x 100vh`, konten terpusat, `--bg-app`.
- **<=1024px:** grid dashboard kolom tunggal.
- **<=768px:** sidebar disembunyikan, muncul **bottom-nav** fixed (tinggi 64px, blur 20px), main padding `16px 20px`, HUD full-width, XP bar menyempit ke 100px.

---

## Komponen

### Glass Card (`.card`)
Permukaan `var(--bg-card)` transparan + `backdrop-filter: blur(16px)`, border hairline, radius 16px, `--shadow-main`. Hover: background menguat & border menyala (`--border-color-glow`).

### Primary Button (`.btn-primary`)
Gradien `135deg` indigo → purple, teks putih, weight 700, radius 12px, glow shadow. Hover: `translateY(-2px)` + glow lebih kuat. Dipakai untuk CTA utama (Mulai Belajar, Masuk, Mulai Tes).

### Sidebar & Navigation (`.nav-item`)
Item radius 12px, hover `rgba(255,255,255,0.04)`, aktif: gradien indigo + glow shadow. Terdapat item sekunder lebih kecil (Referensi, Profil Dev), divider putus-putus, serta tombol tema & logout di footer sidebar. Mobile memakai bottom-nav 5 item.

### HUD Stats Bar (`.user-stats-bar`)
Pill radius 50px, `blur(12px)`, memuat:
- **Level badge:** lingkaran 36px gradien indigo→purple dengan glow.
- **XP bar:** 180px x 12px, fill gradien `--xp-color → #60a5fa`, teks putih overlay.
- **Streak:** ikon api oranye dengan `drop-shadow` glow.

### Tes Level Card (`.tes-card`)
Preview panel (tinggi 120px, border dashed, emoji besar), badge status pill kanan-atas, tombol aksi. Status:
- **Belum Mulai:** border/aksen indigo.
- **Selesai:** aksen emerald, tombol "Lihat Hasil (X%)".
- **Terkunci:** `opacity 0.55`, `grayscale(0.8)`, `pointer-events: none`, emoji 🔒.

### Quest Overlay (Preview Tes)
Overlay fixed `rgba(11,15,25,0.7)` + blur 8px; konten `#111827` (light: `#ffffff`) radius 16px, muncul dengan animasi scale. Berisi greeting, deskripsi, petunjuk kelulusan 70%, badge difficulty berwarna (emerald/amber/rose), reward pill (+XP biru, jumlah soal emerald), tombol **Mulai Tes Sekarang**.

### Quiz
- Progress bar 8px gradien indigo→purple + teks "Pertanyaan X dari Y".
- **Opsi jawaban:** border 2px, radius 12px, badge huruf A–D, hover lift.
- Setelah pilih: opsi benar `correct-reveal` (emerald), opsi salah `incorrect-reveal` (rose) + animasi **shake** pada kontainer.
- **Feedback panel:** slide-up dari bawah (`#1e293b` dark / `#f1f5f9` light), ikon lingkaran ✓/✗, judul "Jawaban Benar!"/"Kurang Tepat!", dan **pembahasan soal**.
- Tombol **Keluar Tes** (✕) untuk membatalkan pengerjaan.

### Toast Notification
Kolom kanan-bawah, slide-in, background `rgba(15,23,42,0.9)`, border-kiri warna sesuai tipe (success/error/xp/primary), auto-fade 3 detik.

### Forms
Input radius 12px, `focus`: border indigo + glow halus. Label weight 600 warna secondary.

---

## Do's & Don'ts

### Do
- Gunakan gradien indigo→purple untuk semua CTA utama & elemen aktif.
- Terapkan glassmorphism (transparansi + blur) pada kartu, sidebar, HUD, overlay.
- Pakai warna status semantik: emerald (benar/selesai), rose (salah/gagal), amber (menunggu).
- Selalu tampilkan pembahasan sebagai feedback setelah pengguna menjawab.
- Pertahankan dark-first; light theme sebagai opsi toggle yang tersimpan di `localStorage`.
- Konsisten: 8/12/16px radius, satu shadow token, transisi 0.3s.

### Don't
- Jangan gunakan warna aksen di luar palet gamifikasi yang sudah ada.
- Jangan tampilkan elemen status "Terkunci" dengan opacity penuh — harus terlihat redup/grayscale.
- Jangan pindah soal sebelum feedback ditampilkan.
- Jangan hilangkan HUD (level/XP/streak) — bagian inti identitas gamifikasi.
- Jangan gunakan shadow bertumpuk; elevasi cukup satu lapis `--shadow-main` + glow.

---

## Surfaces

| Level | Name | Dark Value | Light Value | Purpose |
|-------|------|-----------|-------------|---------|
| 0 | Page Canvas | `#0b0f19` | `#f8fafc` | Background layar penuh & main content |
| 1 | Glass Card | `rgba(22,28,45,0.4)` | `rgba(255,255,255,0.7)` | Kartu, sidebar, HUD, overlay content |
| 2 | Elevated Panel | `#111827` / `#1e293b` | `#ffffff` / `#f1f5f9` | Overlay content, panel feedback |

---

## Elevation

- **Kartu / sidebar / overlay:** `var(--shadow-main)` `0 8px 32px 0 rgba(0,0,0,0.37)`
- **CTA aktif:** `0 4px 15px var(--primary-glow)`; hover `0 6px 20px rgba(99,102,241,0.4)`
- **Nav aktif:** `0 4px 20px rgba(99,102,241,0.25)`

---

## Quick Start — CSS Custom Properties

```css
:root {
  /* Fonts */
  --font-heading: 'Outfit', -apple-system, sans-serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;

  /* Dark Theme (default) */
  --bg-app: #0b0f19;
  --bg-card: rgba(22, 28, 45, 0.4);
  --bg-card-hover: rgba(30, 39, 63, 0.6);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-color-glow: rgba(99, 102, 241, 0.3);
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;

  /* Gamification Accents */
  --primary: #6366f1;
  --primary-glow: rgba(99, 102, 241, 0.5);
  --secondary: #a855f7;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --xp-color: #3b82f6;
  --heart-color: #ec4899;
  --coin-color: #eab308;
  --streak-color: #f97316;

  /* UI Details */
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --shadow-main: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] {
  --bg-app: #f8fafc;
  --bg-card: rgba(255, 255, 255, 0.7);
  --bg-card-hover: rgba(255, 255, 255, 0.95);
  --border-color: rgba(0, 0, 0, 0.06);
  --border-color-glow: rgba(99, 102, 241, 0.2);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --shadow-main: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
}
```
