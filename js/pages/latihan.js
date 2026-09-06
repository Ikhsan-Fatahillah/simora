/**
 * SIMORA - Latihan (1 & 2): Video simulasi rapat + Form Lembar Jawab Notula Rapat
 * Satu view generik; konten (narasi, video, judul) diisi sesuai latihan aktif.
 */

import { navigateTo } from "../navigation.js";
import { showToast } from "../ui.js";

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

function formHtml() {
    return `
        <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Agenda Rapat</label>
            <input class="form-input" id="lat-agenda" type="text" placeholder="Tulis agenda rapat...">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Hari/Tanggal</label>
                <input class="form-input" id="lat-tanggal" type="text" placeholder="cth: Senin, 10 Agustus 2026">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Waktu</label>
                <input class="form-input" id="lat-waktu" type="text" placeholder="cth: 09.00 - 11.00 WIB">
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
    if (!cfg) return;

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
            "Waktu": val("lat-waktu"),
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

        // Tandai selesai
        lvl.status = "completed";
        lvl.score = 100;
        lvl.date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
        app.saveState();

        // Expert: tantangan akhir → langsung kembali ke menu Expert (tanpa halaman skor)
        if (lvlId === "expert") {
            showToast("🏆 Tantangan akhir selesai! Kamu berhasil menuntaskan Expert Level!", "success");
            navigateTo(app, "expert", { skipGreeting: true });
            return;
        }

        // Practice: buka kunci latihan berikutnya & tampilkan halaman Hasil
        const nextId = NEXT_LEVEL[lvlId];
        if (nextId) app.state.tests[nextId].status = "unlocked";
        document.getElementById("latihan-score").textContent = lvl.score;
        document.getElementById("latihan-feedback").innerHTML = `🎉 Kamu berhasil melewati ${lvl.title}!`;
        navigateTo(app, "hasil-latihan");
    });
}

export function initLatihanNext(app) {
    document.getElementById("btn-latihan-next").addEventListener("click", () => {
        navigateTo(app, "practice", { skipGreeting: true });
    });
}
