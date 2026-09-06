// Halaman ATP: 3 card (Elemen, CP, TP) yang membuka modal berisi rincian topik.
const ATP_CONTENT = {
    elemen: {
        title: "🧩 Elemen",
        html: `
            <span class="badge-title">Elemen</span>
            <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary); margin-top: 12px; margin-bottom: 0;">
                <strong style="color: var(--text-primary);">Pengelolaan Rapat/Pertemuan di Bidang Manajemen Perkantoran dan Layanan Bisnis.</strong>
                Elemen ini menjadi fondasi keilmuan yang dipelajari peserta didik, mencakup pemahaman dan penerapan praktik pengelolaan rapat/pertemuan di dunia perkantoran serta layanan bisnis.
            </p>`
    },
    cp: {
        title: "🎯 Capaian Pembelajaran (CP)",
        html: `
            <span class="badge-title">Capaian Pembelajaran (CP)</span>
            <h4 style="margin: 12px 0 8px; font-size: 1.3rem; color: var(--text-primary);">Fase F: Pengelolaan Rapat/Pertemuan</h4>
            <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 0;">
                Pada akhir Fase F, peserta didik mampu memahami dan menerapkan tahapan persiapan rapat/pertemuan baik secara online maupun offline, termasuk menyusun bahan presentasi dan membuat notula rapat.
            </p>`
    },
    tp: {
        title: "🗺️ Tujuan Pembelajaran (TP)",
        html: `
            <span class="badge-title">Tujuan Pembelajaran (TP)</span>
            <div class="quests-list" style="gap: 12px; margin-top: 12px;">
                <div class="quest-item" style="background: rgba(59, 130, 246, 0.03); border-color: rgba(59, 130, 246, 0.15);">
                    <div class="quest-details">
                        <span class="quest-item-title" style="font-weight: 700; color: #1d4ed8;">TP-01: Memahami Notula Rapat</span>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Memahami pengertian dan fungsi notula rapat.</p>
                    </div>
                </div>
                <div class="quest-item" style="background: rgba(168, 85, 247, 0.03); border-color: rgba(168, 85, 247, 0.15);">
                    <div class="quest-details">
                        <span class="quest-item-title" style="font-weight: 700; color: #d8b4fe;">TP-02: Mengidentifikasi Unsur Notula Rapat</span>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Mengidentifikasi unsur-unsur/format notula rapat.</p>
                    </div>
                </div>
                <div class="quest-item" style="background: rgba(236, 72, 153, 0.03); border-color: rgba(236, 72, 153, 0.15);">
                    <div class="quest-details">
                        <span class="quest-item-title" style="font-weight: 700; color: #fbcfe8;">TP-03: Membuat Notula Rapat</span>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">Membuat notula rapat berdasarkan jalannya rapat.</p>
                    </div>
                </div>
            </div>`
    }
};

export function initAtp() {
    const overlay = document.getElementById("atp-overlay");
    if (!overlay) return;

    const titleEl = document.getElementById("atp-modal-title");
    const bodyEl = document.getElementById("atp-modal-body");
    const closeBtn = document.getElementById("btn-atp-close");

    const open = (key) => {
        const content = ATP_CONTENT[key];
        if (!content) return;
        titleEl.innerHTML = content.title;
        bodyEl.innerHTML = content.html;
        overlay.classList.add("show");
    };

    document.querySelectorAll("[data-atp]").forEach((btn) => {
        btn.addEventListener("click", () => open(btn.getAttribute("data-atp")));
    });

    closeBtn.addEventListener("click", () => overlay.classList.remove("show"));
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("show");
    });
}
