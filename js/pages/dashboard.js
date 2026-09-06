/**
 * SIMORA - Dashboard Page: menu halaman (atas) + progress belajar segmented bar (bawah)
 */

export function renderDashboard(app) {
    const container = document.getElementById("dashboard-container");
    if (!container) return;

    const t = app.state.tests;

    // --- Section Atas: menu halaman ---
    const MENU = [
        { target: "atp", emoji: "📘", title: "ATP", desc: "Alur Tujuan Pembelajaran" },
        { target: "beginner", emoji: "🌱", title: "Beginner", desc: "Materi & contoh notula" },
        { target: "practice", emoji: "⚙️", title: "Practice", desc: "Latihan notula rapat" },
        { target: "expert", emoji: "⚡", title: "Expert", desc: "Kuis & tantangan akhir" },
        { target: "referensi", emoji: "📚", title: "Referensi", desc: "Sumber belajar" },
        { target: "profil", emoji: "👨‍💻", title: "Profil Pengembang", desc: "Info developer" }
    ];

    const menuHtml = MENU.map(m => `
        <button data-target="${m.target}" class="card glass dash-card" style="cursor: pointer; border: none; text-align: left; display: flex; flex-direction: column; gap: 6px; padding: 18px 16px;">
            <div class="menu-icon" style="font-size: 1.8rem;">${m.emoji}</div>
            <div style="font-weight: 800; font-family: var(--font-heading); font-size: 1.05rem;">${m.title}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">${m.desc}</div>
        </button>
    `).join("");

    // --- Section Bawah: Progres Belajar (horizontal progress line) ---
    const LEVELS = [
        { id: "beginner", label: "Beginner" },
        { id: "practice-l1", label: "Practice 1" },
        { id: "practice-l2", label: "Practice 2" },
        { id: "practice-l3", label: "Practice 3" },
        { id: "expert", label: "Expert" }
    ];
    // Aktif: tahap selesai (✓) + tahap yang sedang dicapai (unlocked & semua prasyarat selesai).
    // Tahap locked / di belakang celah → disable.
    let allPriorDone = true;
    const stepHtml = LEVELS.map((l, i) => {
        const status = t[l.id]?.status;
        const done = status === "completed";
        const isCurrent = !done && status === "unlocked" && allPriorDone;
        const active = done || isCurrent;
        if (!done && status !== "unlocked") allPriorDone = false;
        if (!done && allPriorDone && status === "unlocked") allPriorDone = false; // current = gap pertama

        const circle = done
            ? `<div style="width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; background: linear-gradient(135deg, var(--success), #34d399); color: #fff; box-shadow: 0 0 12px rgba(16, 185, 129, 0.45); flex-shrink: 0;">✓</div>`
            : isCurrent
            ? `<div style="width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff; box-shadow: 0 0 12px rgba(59, 130, 246, 0.45); flex-shrink: 0;">${i + 1}</div>`
            : `<div style="width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; background: var(--bg-card); border: 2px solid var(--border-color); color: var(--text-muted); flex-shrink: 0;">${i + 1}</div>`;

        return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                ${circle}
                <div style="font-size: 0.7rem; font-weight: 700; margin-top: 8px; text-align: center; color: ${active ? 'var(--text-primary)' : 'var(--text-muted)'};">${l.label}</div>
            </div>
        `;
    }).join("");

    const activeCount = LEVELS.filter((l, i) => {
        const before = LEVELS.slice(0, i).every(x => t[x.id]?.status === "completed");
        return before && t[l.id]?.status === "completed";
    }).length;
    const fillFrac = LEVELS.length > 1 ? activeCount / (LEVELS.length - 1) : 1;
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Section Atas: Menu -->
            <div class="card glass">
                <h3 style="margin-bottom: 16px;">Menu</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;" class="dash-menu-grid">
                    ${menuHtml}
                </div>
            </div>

            <!-- Section Bawah: Progres Belajar -->
            <div class="card glass">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin-bottom: 0;">Progres Belajar</h3>
                    <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">${activeCount} dari ${LEVELS.length} tahap</span>
                </div>
                <div style="position: relative; margin: 4px 0 8px;">
                    <div style="position: absolute; top: 15px; left: 10%; right: 10%; height: 4px; background: rgba(255,255,255,0.12); border-radius: 50px;"></div>
                    <div style="position: absolute; top: 15px; left: 10%; width: calc(80% * ${fillFrac}); height: 4px; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 50px; transition: width 0.4s ease;"></div>
                    <div style="display: flex; position: relative;">${stepHtml}</div>
                </div>
            </div>
        </div>
    `;
}
