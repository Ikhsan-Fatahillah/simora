/**
 * SIMORA - Dashboard Page: 6 kartu menu mengisi seluruh area konten (3 atas, 3 bawah)
 */

export function renderDashboard(app) {
    const container = document.getElementById("dashboard-container");
    if (!container) return;

    // --- Menu halaman ---
    const MENU = [
        { target: "atp", emoji: "📘", title: "ATP", desc: "Alur Tujuan Pembelajaran" },
        { target: "beginner", emoji: "🌱", title: "Beginner", desc: "Materi & contoh notula" },
        { target: "practice", emoji: "⚙️", title: "Practice", desc: "Latihan notula rapat" },
        { target: "expert", emoji: "⚡", title: "Expert", desc: "Kuis & tantangan akhir" },
        { target: "referensi", emoji: "📚", title: "Referensi", desc: "Sumber belajar" },
        { target: "profil", emoji: "👨‍💻", title: "Profil Pengembang", desc: "Info developer" }
    ];

    const menuHtml = MENU.map(m => `
        <button data-target="${m.target}" class="card glass dash-card" style="cursor: pointer; border: none; text-align: left; display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: 32px 34px;">
            <div class="menu-icon" style="font-size: 3.6rem; line-height: 1;">${m.emoji}</div>
            <div style="font-weight: 800; font-family: var(--font-heading); font-size: 1.75rem; color: var(--dash-title, var(--text-primary));">${m.title}</div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 1.1rem; color: var(--dash-desc, var(--text-secondary)); line-height: 1.6;">${m.desc}</div>
                <span class="dash-arrow" aria-hidden="true">&#10132;</span>
            </div>
        </button>
    `).join("");

    container.innerHTML = `<div class="dash-menu-grid">${menuHtml}</div>`;
}
