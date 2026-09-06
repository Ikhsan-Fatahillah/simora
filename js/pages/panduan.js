// Halaman Panduan Penggunaan SIMORA: 4 card (Pengantar, Navigasi, Isi Menu, Gamifikasi) yang membuka modal.
const PANDUAN_SECTIONS = {
    pengantar: {
        title: "👋 Pengantar — Petunjuk Umum",
        html: `
            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; margin-bottom: 12px;">
                Terima kasih telah bergabung dalam <strong style="color: var(--text-primary);">SIMORA</strong>, media pembelajaran interaktif pada materi pembuatan notula rapat. Sebelum memulai, perhatikan informasi penting berikut:
            </p>
            <ol style="margin-left: 20px; color: var(--text-secondary); font-size: 0.95rem; line-height: 2;">
                <li>Awali pembelajaran dengan berdoa.</li>
                <li>Pelajari Panduan ini agar memahami fungsi tiap menu.</li>
                <li>Masuk dengan akun pengguna Anda (nama, nomor absen, dan kelas).</li>
                <li>Pelajari halaman <strong style="color: var(--text-primary);">ATP</strong> agar proses belajar lebih terarah.</li>
                <li>Selesaikan menu <strong style="color: var(--text-primary);">Beginner</strong>: pahami materi dan contoh notula rapat.</li>
                <li>Kerjakan menu <strong style="color: var(--text-primary);">Practice</strong> secara berurutan (Latihan 1–3); tiap latihan harus tuntas sebelum lanjut.</li>
                <li>Setelah Practice tuntas, menu <strong style="color: var(--text-primary);">Expert</strong> terbuka — kerjakan kuis Point Rush dan tantangan notula akhir dengan sungguh-sungguh.</li>
                <li>Pantau progres belajar melalui menu <strong style="color: var(--text-primary);">Progres</strong>.</li>
                <li><strong style="color: var(--text-primary);">SELAMAT BELAJAR!</strong></li>
            </ol>`
    },
    navigasi: {
        title: "🧭 Navigasi",
        html: `
            <div class="quests-list" style="gap: 10px;">
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">🏠 Dashboard</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Ringkasan belajar dan menu cepat.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">🎯 ATP</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Melihat elemen, Capaian Pembelajaran (CP), dan Tujuan Pembelajaran (TP).</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">📘 Beginner</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Belajar materi dan contoh notula rapat.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">✍️ Practice</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Latihan membuat notula dari simulasi rapat (Latihan 1–3).</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">🏆 Expert</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Kuis Point Rush dan tantangan notula akhir.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">📊 Progres</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Laporan capaian belajar dari Beginner hingga Expert.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">📚 Referensi</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Sumber belajar tambahan materi notula rapat.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">👤 Profil Pengembang</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Informasi pengembang aplikasi.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">🌗 Ubah Tema</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Mengganti tema gelap/terang.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">🚪 Keluar Akun</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Mengakhiri sesi dan kembali ke halaman awal.</p>
                </div></div>
            </div>`
    },
    isi: {
        title: "🗂️ Isi Menu",
        html: `
            <div class="quests-list" style="gap: 10px;">
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Alur Tujuan Pembelajaran (ATP)</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Pahami elemen, capaian, dan tujuan pembelajaran agar proses belajar lebih terarah.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Menu Beginner</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Pelajari materi (definisi, fungsi, tips) dan contoh notula rapat sebelum masuk ke tahap praktik.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Menu Practice</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Berlatih membuat notula dari simulasi rapat secara bertahap: Latihan 1, 2, dan 3. Selesaikan setiap latihan untuk membuka latihan berikutnya.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Menu Expert</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Uji pemahaman lewat kuis Point Rush (10 soal) lalu lanjut ke tantangan membuat notula rapat dengan durasi rapat lebih panjang.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Menu Progres</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Pantau persentase dan status capaian belajar dari Beginner hingga Expert.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Menu Referensi</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Eksplor lebih dalam materi notula rapat melalui referensi yang diberikan.</p>
                </div></div>
            </div>`
    },
    gamifikasi: {
        title: "🏆 Sistem Gamifikasi",
        html: `
            <div class="quests-list" style="gap: 10px;">
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Kriteria Kelulusan</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Setiap latihan Practice harus diselesaikan dengan notula yang lengkap sebelum membuka latihan berikutnya (nilai minimal 75). Kuis Expert dinyatakan tuntas untuk lanjut ke tantangan notula akhir.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">XP & Level</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Setiap capaian memberikan XP. Saat XP memenuhi ambang, level pengguna naik — tampil pada HUD di bagian atas layar.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Streak</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Setiap penyelesaian latihan/kuis menambah streak belajar yang tampil pada HUD.</p>
                </div></div>
                <div class="quest-item"><div class="quest-details">
                    <span class="quest-item-title" style="font-size: 1rem;">Point Rush (kuis Expert)</span>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Tiap soal diberi batas waktu 15 detik dengan countdown ring. Jawab benar di bawah 5 detik untuk bonus +15 poin per soal. Total poin baru ditampilkan di akhir kuis.</p>
                </div></div>
            </div>`
    }
};

export function initPanduan() {
    const overlay = document.getElementById("panduan-overlay");
    if (!overlay) return;

    const titleEl = document.getElementById("panduan-modal-title");
    const bodyEl = document.getElementById("panduan-modal-body");
    const closeBtn = document.getElementById("btn-panduan-modal-close");

    const open = (key) => {
        const content = PANDUAN_SECTIONS[key];
        if (!content) return;
        titleEl.innerHTML = content.title;
        bodyEl.innerHTML = content.html;
        overlay.classList.add("show");
    };

    document.querySelectorAll("[data-panduan]").forEach((btn) => {
        btn.addEventListener("click", () => open(btn.getAttribute("data-panduan")));
    });

    closeBtn.addEventListener("click", () => overlay.classList.remove("show"));
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("show");
    });

    // Tutup modal saat keluar dari layar panduan
    const backBtn = document.getElementById("btn-panduan-back");
    const startBtn = document.getElementById("btn-panduan-start");
    const hide = () => overlay.classList.remove("show");
    if (backBtn) backBtn.addEventListener("click", hide);
    if (startBtn) startBtn.addEventListener("click", hide);
}
