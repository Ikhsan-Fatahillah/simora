/**
 * SIMORA - Latihan (1 & 2): Video simulasi rapat + Form Lembar Jawab Notula Rapat
 * Satu view generik; konten (narasi, video, judul) diisi sesuai latihan aktif.
 */

import { navigateTo } from "../navigation.js";
import { showToast } from "../ui.js";
import { pushSiswaResult } from "../supabase.js";

const LATIHAN_CONFIG = {
    "practice-l1": {
        title: "Latihan 1 — Simulasi Rapat",
        narasi: "PT Permindo Sikucha sedang mengadakan rapat pada hari Senin, 10 Juni 2024, pukul 09.00–12.00 WIB, bertempat di Ruang Rapat PT Permindo Sikucha. Rapat ini membahas penurunan omset perusahaan yang disebabkan oleh masalah kedisiplinan di bagian marketing. Simaklah simulasi rapat berikut, kemudian buatlah notula rapat sesuai format yang telah kamu pelajari!",
        videoSrc: "https://www.youtube.com/embed/8a8DgYHNC9Q"
    },
    "practice-l2": {
        title: "Latihan 2 — Simulasi Rapat",
        narasi: "PT Sinar Abadi Jaya sedang mengadakan rapat pada hari Rabu, 25 September 2024, pukul 13.00–15.00 WIB, bertempat di Ruang Rapat Utama Kantor Pusat. Rapat ini membahas kondisi keuangan dan pemasaran perusahaan yang sedang mengalami penurunan. Simaklah simulasi rapat berikut, kemudian buatlah notula rapat sesuai format yang telah kamu pelajari!",
        videoSrc: "https://www.youtube.com/embed/Gq6ZXea1p0E"
    },
    "practice-l3": {
        title: "Latihan 3 — Simulasi Rapat",
        narasi: "PT Nusantara Bangun Karya sedang mengadakan rapat evaluasi kinerja pegawai pada hari Rabu, 31 Agustus 2022, pukul 08.00–11.00 WIB, bertempat di Hotel The Langham 2, Ruang B, Jakarta Pusat. Simaklah simulasi rapat berikut, kemudian buatlah notula rapat sesuai format yang telah kamu pelajari!",
        videoSrc: "https://www.youtube.com/embed/nhmcJFQBtu8"
    },
    expert: {
        title: "Tantangan Akhir — Simulasi Rapat",
        narasi: "Sirclo Store sedang mengadakan rapat pada hari Jumat, 21 Oktober 2022, pukul 08.00–10.00 WIB, bertempat di Ruang Meeting Sirclo Store, untuk membahas penurunan omset perusahaan. Simaklah simulasi rapat berikut dengan saksama, kemudian buatlah notula rapat sesuai format yang telah kamu pelajari!",
        videoSrc: "https://www.youtube.com/embed/DGW5Vkq4cWI"
    }
};

const NEXT_LEVEL = {
    "practice-l1": "practice-l2",
    "practice-l2": "practice-l3",
    "practice-l3": "expert"
};

/**
 * Rubrik penilaian notula (total bobot 100 poin).
 * Aturan cocok kata kunci:
 * - groups  → SEMUA grup harus terpenuhi; tiap grup berisi alternatif (salah satu cukup).
 * - exact   → field pakai selector (tanggal), nilainya harus sama persis.
 * - rentang → field waktu (mulai & selesai), keduanya harus sama persis.
 * - pemimpin + notulis → field Organisasi Rapat dinilai dari kedua nama.
 * - bebas   → asal terisi, otomatis benar.
 * Skor tiap bagian = bobot × (jumlah benar / jumlah yang dinilai), lalu dibulatkan.
 */
const RUBRIK_NOTULA = {
    "practice-l1": {
        kkm: 70,
        // Kelengkapan identitas rapat (20 poin)
        identitas: [
            { label: "Agenda Rapat", groups: [["disiplin"], ["omset"]] },
            { label: "Hari/Tanggal", exact: "2024-06-10" },
            { label: "Waktu", rentang: ["09:00", "12:00"] },
            { label: "Tempat", groups: [["ruang rapat"], ["pt permindo sikucha"]] },
            { label: "Organisasi Rapat", bebas: true },
            { label: "Peserta Rapat", groups: [["pemasaran"], ["kepegawaian", "hrd"], ["umum"], ["keuangan"]] }
        ],
        // Ketepatan susunan acara (10 poin)
        acara: { label: "Susunan Acara", groups: [["pembukaan"], ["laporan", "diskusi"], ["penutup"]] },
        // Ketepatan isi rapat (40 poin) — dinilai per pembicara
        isi: {
            label: "Isi Rapat",
            pembicara: [
                { nama: ["pemasaran"], groups: [["karyawan tidak disiplin"], ["target tidak tercapai", "omset tidak tercapai"], ["teguran belum efektif"]] },
                { nama: ["kepegawaian", "hrd"], groups: [["lebih dari 5 kali absen tanpa alasan jelas"], ["sudah ada peringatan tertulis"], ["perlu tindakan lebih tegas"]] },
                { nama: ["umum"], groups: [["absensi masih manual"], ["usul sistem absensi digital"]] },
                { nama: ["keuangan"], groups: [["omset turun 15% dalam 3 bulan"], ["usul restrukturisasi sistem insentif"]] }
            ]
        },
        // Ketepatan hasil rapat (30 poin)
        penutup: { label: "Penutup/Hasil Rapat", groups: [["absensi digital", "teknologi"], ["peraturan ketat"], ["sanksi"]] }
    },
    "practice-l2": {
        kkm: 75,
        // Kelengkapan identitas rapat (20 poin)
        identitas: [
            { label: "Agenda Rapat", groups: [["keuangan"], ["pemasaran"]] },
            { label: "Hari/Tanggal", exact: "2024-09-25" },
            { label: "Waktu", rentang: ["13:00", "15:00"] },
            { label: "Tempat", groups: [["ruang rapat utama"], ["kantor pusat"]] },
            { label: "Organisasi Rapat", bebas: true },
            { label: "Peserta Rapat", groups: [["pemasaran"], ["keuangan"], ["sdm"], ["produksi"], ["moderator"], ["notulis"]] }
        ],
        // Ketepatan susunan acara (10 poin)
        acara: { label: "Susunan Acara", groups: [["pembukaan"], ["laporan", "diskusi"], ["penutup"]] },
        // Ketepatan isi rapat (40 poin) — dinilai per pembicara
        isi: {
            label: "Isi Rapat",
            pembicara: [
                { nama: ["pemasaran"], groups: [["penjualan menurun", "penurunan penjualan", "penjualan mengalami penurunan"], ["fitur produk kurang menarik", "fitur kurang menarik"], ["perubahan tren konsumen", "tren konsumen"]] },
                { nama: ["keuangan"], groups: [["keuangan menurun", "keuangan mengalami penurunan", "penurunan keuangan"], ["kurangi kegiatan tidak perlu", "kegiatan tidak perlu"], ["awasi ketat keuangan", "awasi ketat"]] },
                { nama: ["sdm"], groups: [["efisiensi"], ["tingkatkan mutu produk", "mutu produk"], ["perluas pasar", "perluasan pasar"], ["tingkatkan laba", "laba"]] },
                { nama: ["produksi"], groups: [["ekspansi"], ["ekspansi perlu dilakukan", "perlu dilakukan"]] }
            ]
        },
        // Ketepatan hasil rapat (30 poin)
        penutup: { label: "Penutup/Hasil Rapat", groups: [["penurunan"], ["mutu produk", "perluasan pasar"], ["ekspansi"]] }
    },
    "practice-l3": {
        kkm: 75,
        // Kelengkapan identitas rapat (20 poin)
        identitas: [
            { label: "Agenda Rapat", groups: [["evaluasi"], ["kinerja"]] },
            { label: "Hari/Tanggal", exact: "2022-08-31" },
            { label: "Waktu", rentang: ["08:00", "11:00"] },
            { label: "Tempat", groups: [["hotel the langham", "the langham"], ["ruang b"], ["jakarta pusat"]] },
            {
                label: "Organisasi Rapat",
                pemimpin: [["muhammad wildan rezi", "wildan rezi", "wildan"]],
                notulis: [["alaika syamsa", "alaika"]]
            },
            { label: "Peserta Rapat", groups: [["kepegawaian"], ["produksi"], ["pemasaran"], ["direktur"]] }
        ],
        // Ketepatan susunan acara (10 poin)
        acara: { label: "Susunan Acara", groups: [["pembukaan"], ["pembahasan", "diskusi"], ["penutup"]] },
        // Ketepatan isi rapat (40 poin) — dinilai per pembicara
        isi: {
            label: "Isi Rapat",
            pembicara: [
                {
                    nama: ["kepegawaian", "syafina"],
                    groups: [
                        ["kinerja pegawai menurun", "kinerja menurun"],
                        ["kehadiran 75", "75%", "75 %"],
                        ["keterlambatan 70", "70%", "70 %"],
                        ["cuti di luar libur", "cuti di luar hari libur"],
                        ["tidak disiplin"]
                    ]
                },
                {
                    nama: ["staff", "staf", "karyawan", "yuliah", "lutfiah", "rohani", "ambar"],
                    groups: [
                        ["hari libur kurang", "libur kurang", "cuti hanya 1 minggu"],
                        ["kerja hari minggu", "hari minggu"],
                        ["jam masuk kerja terlalu pagi", "terlalu pagi"],
                        ["potongan gaji"],
                        ["motivasi", "apresiasi"]
                    ]
                },
                {
                    nama: ["direktur utama", "wildan"],
                    groups: [["kebijakan baru", "kebijakan"], ["kedisiplinan"]]
                },
                {
                    nama: ["kepegawaian", "syafina"],
                    groups: [
                        ["ketegasan kerja di luar jam kerja", "ketegasan"],
                        ["hak libur"]
                    ]
                },
                {
                    nama: ["kepala bagian produksi", "bella"],
                    groups: [
                        ["reward untuk kerja di hari libur", "reward"],
                        ["cuti ditambah", "1 bulan"],
                        ["pelatihan", "diklat"]
                    ]
                },
                {
                    nama: ["kepala bagian pemasaran", "wanda"],
                    groups: [
                        ["reward non-uang", "piagam", "sertifikat"],
                        ["toleransi keterlambatan"],
                        ["potong rp50.000", "rp50.000", "50.000"],
                        ["jam masuk kerja dari jam 6 ke jam 8", "jam 8"]
                    ]
                }
            ]
        },
        // Ketepatan hasil rapat (30 poin)
        penutup: {
            label: "Penutup/Hasil Rapat",
            groups: [["kerja hari libur"], ["toleransi keterlambatan"], ["jam masuk kerja"], ["pelatihan", "diklat"], ["reward"]]
        }
    },
    expert: {
        kkm: 75,
        // Kelengkapan identitas rapat (20 poin)
        identitas: [
            { label: "Agenda Rapat", groups: [["omset"], ["penurunan"]] },
            { label: "Hari/Tanggal", exact: "2022-10-21" },
            { label: "Waktu", rentang: ["08:00", "10:00"] },
            { label: "Tempat", groups: [["ruang meeting"], ["sirclo store", "sirclo"]] },
            {
                label: "Organisasi Rapat",
                pemimpin: [["rika ramadhania", "rika"]],
                notulis: [["jeni wulandari", "jeni"]]
            },
            { label: "Peserta Rapat", groups: [["pemasaran"], ["produksi"], ["keuangan"], ["notulis", "dokumenter"]] }
        ],
        // Ketepatan susunan acara (10 poin)
        acara: { label: "Susunan Acara", groups: [["pembukaan"], ["pembahasan"], ["penutup"]] },
        // Ketepatan isi rapat (40 poin) — dinilai per pembicara
        isi: {
            label: "Isi Rapat",
            pembicara: [
                {
                    nama: ["pimpinan", "pemimpin", "rika"],
                    groups: [["omset menurun"], ["strategi"]]
                },
                {
                    nama: ["pemasaran", "lina"],
                    groups: [["turun 40", "40%", "40 %"], ["pesaing"], ["kualitas"]]
                },
                {
                    nama: ["keuangan", "vinanda"],
                    groups: [["stabil"], ["target"]]
                },
                {
                    nama: ["produksi", "nonik"],
                    groups: [["lancar"], ["mesin"], ["servis"]]
                },
                {
                    nama: ["pimpinan", "pemimpin", "rika"],
                    groups: [["pihak terkait", "hubungi"], ["servis"]]
                },
                {
                    nama: ["sekretaris", "cantika"],
                    groups: [["promosi"], ["monoton"], ["medsos", "media sosial", "e-commerce", "ecommerce"]]
                },
                {
                    nama: ["produksi", "nonik"],
                    groups: [["minimalis"], ["terjangkau"]]
                },
                {
                    nama: ["keuangan", "vinanda"],
                    groups: [["tidak setuju"], ["kurangi produksi"], ["diskon"]]
                },
                {
                    nama: ["produksi", "nonik"],
                    groups: [["menyanggah", "diskon besar"], ["untung sedikit"]]
                },
                {
                    nama: ["keuangan", "vinanda"],
                    groups: [["untung sedikit lebih baik", "tidak laku"]]
                },
                {
                    nama: ["pimpinan", "pemimpin", "rika"],
                    groups: [["hentikan produksi"], ["diskon"]]
                },
                {
                    nama: ["pemasaran", "lina"],
                    groups: [["konten visual", "medsos", "media sosial"], ["supplier", "jangkauan"]]
                }
            ]
        },
        // Ketepatan hasil rapat (30 poin)
        penutup: {
            label: "Penutup/Hasil Rapat",
            groups: [["servis mesin", "servis"], ["media sosial", "medsos"], ["e-commerce", "ecommerce"], ["diskon"], ["target"]]
        }
    }
};

/** Bobot tiap bagian penilaian (total 100) */
const BOBOT = { identitas: 20, acara: 10, isi: 40, penutup: 30 };

/** Normalisasi jawaban: huruf kecil & spasi dirapikan. */
function norm(v) {
    return (v || "").toString().toLowerCase().replace(/\s+/g, " ").trim();
}

/** Satu grup benar bila salah satu alternatifnya ada di dalam jawaban. */
function grupCocok(teks, alternatif) {
    return alternatif.some(a => teks.includes(norm(a)));
}

/** Field benar bila semua grupnya terpenuhi. */
function fieldCocok(teks, grup) {
    return grup.every(g => grupCocok(teks, g));
}

/** Nilai satu field identitas berdasarkan aturan rubriknya. */
function fieldBenar(item, jawaban) {
    if (item.bebas) return true;
    if (item.exact) return norm(jawaban) === item.exact;
    if (item.rentang) return norm(jawaban.mulai) === item.rentang[0] && norm(jawaban.selesai) === item.rentang[1];
    if (item.pemimpin) {
        return fieldCocok(norm(jawaban.pemimpin), item.pemimpin)
            && fieldCocok(norm(jawaban.notulis), item.notulis);
    }
    return fieldCocok(norm(jawaban), item.groups);
}

/**
 * Isi Rapat: kumpulkan semua baris yang namanya cocok dengan pembicara pada rubrik
 * (boleh ditulis 1 baris atau dipecah beberapa baris), lalu nilai gabungan point-nya.
 */
function pembicaraBenar(rows, item) {
    const cocok = rows.filter(r => item.nama.some(n => norm(r.nama).includes(norm(n))));
    if (!cocok.length) return false;
    return fieldCocok(norm(cocok.map(r => r.point).join(" ")), item.groups);
}

/**
 * Hitung skor berbobot notula + status KKM.
 * Kembalikan null bila latihan ini belum punya rubrik.
 */
function nilaiNotula(lvlId, d) {
    const r = RUBRIK_NOTULA[lvlId];
    if (!r) return null;

    const salah = [];

    // 1. Kelengkapan identitas rapat (20 poin) — dibagi rata per field
    const jawabanIdentitas = {
        "Agenda Rapat": d.agenda,
        "Hari/Tanggal": d.tanggal,
        "Waktu": { mulai: d.waktu, selesai: d.waktuSelesai },
        "Tempat": d.tempat,
        "Organisasi Rapat": { pemimpin: d.pemimpin, notulis: d.notulis },
        "Peserta Rapat": d.peserta.join(" ")
    };
    let identitasBenar = 0;
    r.identitas.forEach(f => {
        if (fieldBenar(f, jawabanIdentitas[f.label])) identitasBenar++;
        else salah.push(f.label);
    });
    let skor = BOBOT.identitas * (identitasBenar / r.identitas.length);

    // 2. Ketepatan susunan acara (10 poin)
    if (fieldCocok(norm(d.susunanAcara.join(" ")), r.acara.groups)) skor += BOBOT.acara;
    else salah.push(r.acara.label);

    // 3. Ketepatan isi rapat (40 poin) — dibagi rata per pembicara
    const isiBenar = r.isi.pembicara.filter(p => pembicaraBenar(d.isiRapat, p)).length;
    skor += BOBOT.isi * (isiBenar / r.isi.pembicara.length);
    if (isiBenar < r.isi.pembicara.length) salah.push(r.isi.label);

    // 4. Ketepatan hasil rapat (30 poin)
    if (fieldCocok(norm(d.penutup), r.penutup.groups)) skor += BOBOT.penutup;
    else salah.push(r.penutup.label);

    const score = Math.round(skor);
    return { score, kkm: r.kkm, lulus: score >= r.kkm, salah };
}

function formHtml() {
    return `
        <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Agenda Rapat</label>
            <input class="form-input" id="lat-agenda" type="text" placeholder="Tulis agenda rapat...">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Hari/Tanggal</label>
                <input class="form-input" id="lat-tanggal" type="date">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Waktu</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input class="form-input" id="lat-waktu" type="time" style="flex: 1; min-width: 0;" title="Waktu mulai">
                    <span style="font-weight: 700; color: var(--text-secondary);">–</span>
                    <input class="form-input" id="lat-waktu-selesai" type="time" style="flex: 1; min-width: 0;" title="Waktu selesai">
                    <span style="font-weight: 700; color: var(--text-secondary);">WIB</span>
                </div>
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Tempat</label>
            <input class="form-input" id="lat-tempat" type="text" placeholder="cth: Ruang Rapat / Google Meet">
        </div>

        <div class="l1-group">
            <p class="l1-group-title">Organisasi Rapat</p>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Pemimpin Rapat</label>
                <input class="form-input" id="lat-pemimpin" type="text" placeholder="Nama pemimpin rapat...">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Notulis</label>
                <input class="form-input" id="lat-notulis" type="text" placeholder="Nama notulis...">
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Peserta Rapat</label>
            <div id="lat-peserta-rows" style="display: flex; flex-direction: column; gap: 10px;">
                <input class="form-input" type="text" placeholder="Nama peserta...">
            </div>
            <button type="button" class="btn-add-row" id="btn-add-peserta">+ Tambah Peserta</button>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Susunan Acara</label>
            <div id="lat-acara-rows" style="display: flex; flex-direction: column; gap: 10px;">
                <input class="form-input" type="text" placeholder="Susunan acara...">
            </div>
            <button type="button" class="btn-add-row" id="btn-add-acara">+ Tambah Susunan Acara</button>
        </div>

        <div class="l1-group">
            <p class="l1-group-title">Isi Rapat</p>
            <div id="lat-pembicara-rows" style="display: flex; flex-direction: column; gap: 12px;">
                ${pembicaraRowHtml()}
            </div>
            <button type="button" class="btn-add-row" id="btn-add-pembicara">+ Tambah Pembicara</button>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Penutup / Hasil Rapat</label>
            <textarea class="form-input" id="lat-penutup" rows="4" placeholder="Kesimpulan dan keputusan rapat..."></textarea>
        </div>

        <!-- Tempat & tanggal surat (tanggal berjalan) -->
        <div style="margin-top: 22px;">
            <div style="text-align: right; font-weight: 700; color: var(--text-primary);" id="lat-ttd-date">
                Yogyakarta, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>

            <!-- Kolom TTD (bukan input, hanya tampilan pelengkap) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 56px;">
                <div style="text-align: center;">
                    <div style="font-weight: 700; color: var(--text-primary);">Mengetahui,</div>
                    <div style="height: 72px;"></div>
                    <div style="border-top: 2px solid var(--text-primary); opacity: 0.85; margin: 0 8px;"></div>
                    <div style="margin-top: 10px; font-weight: 700; color: var(--text-primary);" id="ttd-pemimpin-nama"></div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">Pemimpin Rapat</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-weight: 700; color: var(--text-primary);">Notulis,</div>
                    <div style="height: 72px;"></div>
                    <div style="border-top: 2px solid var(--text-primary); opacity: 0.85; margin: 0 8px;"></div>
                    <div style="margin-top: 10px; font-weight: 700; color: var(--text-primary);" id="ttd-notulis-nama"></div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">Notulis</div>
                </div>
            </div>
        </div>

        <button type="submit" class="btn-primary" style="justify-content: center;">Kumpulkan Jawaban</button>
    `;
}

function pembicaraRowHtml() {
    return `
        <div class="pembicara-row">
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Nama/Jabatan Pembicara</label>
                <input class="form-input" type="text" placeholder="cth: Sdr. Setiadi (Ketua)">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Point Pembicaraan</label>
                <textarea class="form-input" rows="3" placeholder="Inti pembicaraan..."></textarea>
            </div>
        </div>
    `;
}

export function renderLatihan(app, lvlId) {
    const cfg = LATIHAN_CONFIG[lvlId];
    if (!cfg) return false;

    // Sekali pakai: latihan yang sudah selesai tidak boleh dikerjakan ulang.
    if (tolakKerjaUlang(app, lvlId)) return false;

    app.latihanActive = lvlId;
    app.latihanBack = lvlId === "expert" ? "expert" : "practice";

    document.getElementById("latihan-title").textContent = cfg.title;
    document.getElementById("latihan-narasi").textContent = cfg.narasi;

    // Tombol kembali menyesuaikan asal halaman
    const backBtn = document.getElementById("btn-latihan-back");
    backBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Kembali ke ${app.latihanBack === "expert" ? "Expert" : "Practice"}
    `;

    // Reset video: sembunyikan sampai tombol "Saya Sudah Membaca" diklik
    const iframe = document.getElementById("latihan-video-iframe");
    iframe.removeAttribute("src");
    iframe.dataset.src = cfg.videoSrc;
    document.getElementById("latihan-video-wrap").style.display = "none";
    document.getElementById("btn-latihan-reveal-video").style.display = "";

    // Render ulang form (kosong)
    document.getElementById("form-latihan").innerHTML = formHtml();
    return true;
}

/**
 * Cegah pengerjaan ulang tahap sekali-pakai (Practice & Expert).
 * Kalau sudah selesai: tampilkan pesan penolakan + hasil sebelumnya, lalu kembalikan true.
 */
export function tolakKerjaUlang(app, lvlId) {
    const lvl = app.state.tests?.[lvlId];
    if (!lvl || lvl.status !== "completed") return false;

    showToast(`🔒 ${lvl.title} hanya bisa dikerjakan sekali. Hasilmu sudah tersimpan.`, "error");
    tampilkanHasilTersimpan(app, lvlId);
    return true;
}

/** Tampilkan halaman Hasil berisi skor yang sudah tersimpan (tanpa membuka form). */
function tampilkanHasilTersimpan(app, lvlId) {
    const lvl = app.state.tests[lvlId];
    const keExpert = lvlId === "expert";

    document.getElementById("latihan-score").textContent = typeof lvl.score === "number" ? lvl.score : "—";

    const feedback = document.getElementById("latihan-feedback");
    feedback.innerHTML = `🔒 ${lvl.title} hanya bisa dikerjakan sekali.`
        + `<br><span style="font-weight: 600;">Ini hasil kamu sebelumnya${lvl.date ? ` (${lvl.date})` : ""}.</span>`;
    feedback.style.color = "var(--danger)";

    document.getElementById("btn-latihan-next-label").textContent = `Kembali ke ${keExpert ? "Expert" : "Practice"}`;
    app.latihanBack = keExpert ? "expert" : "practice";

    navigateTo(app, "hasil-latihan");
}

export function initLatihan(app) {
    // Kembali ke halaman asal (Practice / Expert)
    document.getElementById("btn-latihan-back").addEventListener("click", () => {
        const back = app.latihanBack === "expert" ? "expert" : "practice";
        navigateTo(app, back, { skipGreeting: true });
    });

    // Video hanya muncul setelah narasi dibaca
    document.getElementById("btn-latihan-reveal-video").addEventListener("click", () => {
        document.getElementById("btn-latihan-reveal-video").style.display = "none";
        const wrap = document.getElementById("latihan-video-wrap");
        wrap.style.display = "block";
        const iframe = document.getElementById("latihan-video-iframe");
        if (!iframe.src) iframe.src = iframe.dataset.src;
    });

    // Tombol tambah field (delegasi karena form di-render ulang)
    document.getElementById("form-latihan").addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-add-row");
        if (!btn) return;

        if (btn.id === "btn-add-peserta") {
            document.getElementById("lat-peserta-rows")
                .insertAdjacentHTML("beforeend", `<input class="form-input" type="text" placeholder="Nama peserta...">`);
        } else if (btn.id === "btn-add-acara") {
            document.getElementById("lat-acara-rows")
                .insertAdjacentHTML("beforeend", `<input class="form-input" type="text" placeholder="Susunan acara...">`);
        } else if (btn.id === "btn-add-pembicara") {
            document.getElementById("lat-pembicara-rows")
                .insertAdjacentHTML("beforeend", pembicaraRowHtml());
        }
    });

    // Sinkronkan nama di kolom TTD dengan field Pemimpin Rapat / Notulis
    document.getElementById("form-latihan").addEventListener("input", (e) => {
        const id = e.target.id;
        if (id === "lat-pemimpin") {
            const el = document.getElementById("ttd-pemimpin-nama");
            if (el) el.textContent = e.target.value.trim();
        } else if (id === "lat-notulis") {
            const el = document.getElementById("ttd-notulis-nama");
            if (el) el.textContent = e.target.value.trim();
        }
    });

    // Submit: validasi isian lalu tandai latihan selesai
    document.getElementById("form-latihan").addEventListener("submit", (e) => {
        e.preventDefault();

        const lvlId = app.latihanActive;
        const lvl = app.state.tests[lvlId];
        if (!lvl) return;

        const val = (id) => document.getElementById(id).value.trim();
        const peserta = [...document.querySelectorAll("#lat-peserta-rows .form-input")]
            .map(i => i.value.trim()).filter(Boolean);
        const acara = [...document.querySelectorAll("#lat-acara-rows .form-input")]
            .map(i => i.value.trim()).filter(Boolean);
        const pembicara = [...document.querySelectorAll("#lat-pembicara-rows .pembicara-row")]
            .map(row => {
                const inputs = row.querySelectorAll(".form-input");
                return { nama: inputs[0].value.trim(), point: inputs[1].value.trim() };
            })
            .filter(p => p.nama && p.point);

        const checks = {
            "Agenda Rapat": val("lat-agenda"),
            "Hari/Tanggal": val("lat-tanggal"),
            "Waktu": val("lat-waktu") && val("lat-waktu-selesai"),
            "Tempat": val("lat-tempat"),
            "Pemimpin Rapat": val("lat-pemimpin"),
            "Notulis": val("lat-notulis"),
            "Peserta Rapat": peserta.length > 0,
            "Susunan Acara": acara.length > 0,
            "Isi Rapat": pembicara.length > 0,
            "Penutup/Hasil Rapat": val("lat-penutup")
        };

        const kosong = Object.keys(checks).filter(k => !checks[k]);
        if (kosong.length) {
            showToast(`Lengkapi dulu: ${kosong.join(", ")}`, "error");
            return;
        }

        // Bungkus isi notula jadi data terstruktur → disimpan ke riwayat (dilihat admin).
        const notulaData = {
            jenis: "notula",
            agenda: checks["Agenda Rapat"] ? val("lat-agenda") : null,
            tanggal: val("lat-tanggal"),
            waktu: val("lat-waktu"),
            waktuSelesai: val("lat-waktu-selesai"),
            tempat: val("lat-tempat"),
            pemimpin: val("lat-pemimpin"),
            notulis: val("lat-notulis"),
            peserta,
            susunanAcara: acara,
            isiRapat: pembicara,
            penutup: val("lat-penutup")
        };

        // Penilaian: cocokkan tiap field dengan kata kunci pada rubrik.
        const nilai = nilaiNotula(lvlId, notulaData);

        // Tandai selesai
        lvl.status = "completed";
        lvl.score = nilai ? nilai.score : 100;
        lvl.date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
        app.saveState();

        // Kirim hasil ke Supabase (status stage + attempt + stats). Aman gagal (offline).
        pushSiswaResult(app.state, { levelId: lvlId, score: lvl.score, completed: true, answers: notulaData })
            .catch(err => console.warn("Gagal sinkron latihan:", err));

        // Expert: tantangan akhir → langsung kembali ke menu Expert (tanpa halaman skor)
        if (lvlId === "expert") {
            // Expert tidak lewat halaman Hasil, jadi skor + status KKM diumumkan lewat toast.
            const pesan = nilai
                ? `🏆 Tantangan akhir selesai! Skor ${nilai.score} — ${nilai.lulus ? "lulus" : "belum lulus"} KKM ${nilai.kkm}.`
                : "🏆 Tantangan akhir selesai! Kamu berhasil menuntaskan Expert Level!";
            showToast(pesan, nilai && !nilai.lulus ? "error" : "success");
            navigateTo(app, "expert", { skipGreeting: true });
            return;
        }

        // Practice: buka kunci latihan berikutnya & tampilkan halaman Hasil
        const nextId = NEXT_LEVEL[lvlId];
        if (nextId) app.state.tests[nextId].status = "unlocked";
        document.getElementById("latihan-score").textContent = lvl.score;
        document.getElementById("btn-latihan-next-label").textContent = "Lanjut ke Latihan Berikutnya";
        const feedback = document.getElementById("latihan-feedback");
        if (nilai) {
            const status = nilai.lulus
                ? `✅ Lulus KKM (${nilai.kkm})`
                : `⚠️ Belum lulus KKM ${nilai.kkm}`;
            feedback.innerHTML = status + (nilai.salah.length
                ? `<br><span style="color: var(--danger); font-weight: 600;">Belum sesuai: ${nilai.salah.join(", ")}</span>`
                : "");
            feedback.style.color = nilai.lulus ? "var(--success)" : "var(--danger)";
        } else {
            feedback.textContent = `🎉 Kamu berhasil melewati ${lvl.title}!`;
            feedback.style.color = "var(--success)";
        }
        navigateTo(app, "hasil-latihan");
    });
}

export function initLatihanNext(app) {
    document.getElementById("btn-latihan-next").addEventListener("click", () => {
        navigateTo(app, app.latihanBack || "practice", { skipGreeting: true });
    });
}
