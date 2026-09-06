/**
 * SIMORA - Progres: Laporan Capaian Pembelajaran
 * 3 section vertikal: Header (nama + % capaian) → Tahap (3 card) → Badge (1 besar + progress bar level)
 */

const LEVELS = ["beginner", "practice-l1", "practice-l2", "practice-l3", "expert"];

export function renderProgres(app) {
    const container = document.getElementById("progres-container");
    if (!container) return;

    const t = app.state.tests;
    const completedCount = LEVELS.filter(id => t[id]?.status === "completed").length;
    const pct = Math.round((completedCount / LEVELS.length) * 100);

    const beginnerDone = t.beginner?.status === "completed";
    const practiceDone = ["practice-l1", "practice-l2", "practice-l3"].every(id => t[id]?.status === "completed");
    const expertDone = t.expert?.status === "completed";

    // --- 1. HEADER ---
    const headerHtml = `
        <div class="card glass" style="text-align: center; padding: 32px;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">📊</div>
            <h2 style="margin-bottom: 4px;">Laporan Capaian</h2>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">Ahmad Rizki · XI MPLB 1</p>
            <div style="margin: 20px auto 8px; max-width: 420px;">
                <div style="font-size: 2.4rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary);">${pct}%</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Persentase Selesai</div>
            </div>
            <div class="xp-bar-container" style="width: 100%; max-width: 420px; margin: 0 auto; height: 14px; border-radius: 8px;">
                <div class="xp-bar-fill" style="width: ${pct}%; border-radius: 8px; background: linear-gradient(90deg, var(--success), #34d399);"></div>
                <span class="xp-text" style="font-size: 0.8rem;">${completedCount} dari ${LEVELS.length} level selesai</span>
            </div>
        </div>
    `;

    // --- 2. TAHAP (3 card) ---
    const tahapCard = (emoji, title, done, note) => `
        <div class="card glass" style="text-align: center; padding: 24px 16px; ${done ? 'border-color: var(--success);' : 'opacity: 0.85;'}">
            <div style="font-size: 2rem; margin-bottom: 8px;">${emoji}</div>
            <h3 style="font-size: 1.1rem; margin-bottom: 10px;">${title}</h3>
            ${done
                ? `<span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 50px; background: rgba(16, 185, 129, 0.12); color: var(--success); font-weight: 700; font-size: 0.85rem;">✓ Selesai</span>`
                : `<span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 50px; background: rgba(100, 116, 139, 0.12); color: var(--text-muted); font-weight: 700; font-size: 0.85rem;">🔒 Terkunci</span>`}
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 12px; min-height: 36px;">${note}</p>
        </div>
    `;

    const tahapHtml = `
        <div class="card glass">
            <h3 style="margin-bottom: 16px;">🎯 Tahap Pembelajaran</h3>
            <div class="shop-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
                ${tahapCard("🌱", "Beginner", beginnerDone, "Pelajari materi & contoh notula rapat.")}
                ${tahapCard("⚙️", "Practice", practiceDone, "Latihan membuat notula dari simulasi rapat.")}
                ${tahapCard("⚡", "Expert", expertDone, "Kuis Point Rush & tantangan notula akhir.")}
            </div>
        </div>
    `;

    // --- 3. BADGE (1 besar sesuai level + progress bar kecil level) ---
    let badgeNow = { emoji: "🎖️", name: "Belum Ada Badge", desc: "Selesaikan Level Beginner untuk meraih lencana pertamamu." };
    if (expertDone) badgeNow = { emoji: "🏆", name: "Notulis Expert", desc: "Lencana tertinggi — kamu menguasai pembuatan notula rapat!" };
    else if (practiceDone) badgeNow = { emoji: "🥇", name: "Notulis Terampil", desc: "Diraih setelah menyelesaikan seluruh latihan Practice Level." };
    else if (beginnerDone) badgeNow = { emoji: "🌱", name: "Notulis Pemula", desc: "Diraih setelah menyelesaikan Level Beginner." };

    const badgeLevels = [
        { label: "Pemula", done: beginnerDone },
        { label: "Terampil", done: practiceDone },
        { label: "Expert", done: expertDone }
    ];

    const segmentHtml = badgeLevels.map(b => `
        <div style="flex: 1; text-align: center;">
            <div style="height: 8px; border-radius: 50px; background: ${b.done ? 'linear-gradient(90deg, var(--primary), var(--secondary))' : 'rgba(0,0,0,0.08)'}; box-shadow: ${b.done ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none'};"></div>
            <div style="font-size: 0.7rem; font-weight: 700; margin-top: 6px; color: ${b.done ? 'var(--text-primary)' : 'var(--text-muted)'};">
                ${b.done ? "✓ " : ""}${b.label}
            </div>
        </div>
    `).join("");

    const badgeHtml = `
        <div class="card glass" style="text-align: center; padding: 28px 20px;">
            <h3 style="margin-bottom: 20px;">🏅 Badge Level</h3>
            <div style="font-size: 3.5rem; margin-bottom: 8px; ${beginnerDone || practiceDone || expertDone ? 'filter: drop-shadow(0 0 18px rgba(245, 158, 11, 0.4));' : 'filter: grayscale(0.8); opacity: 0.6;'}">${badgeNow.emoji}</div>
            <div style="font-weight: 800; font-family: var(--font-heading); font-size: 1.3rem;">${badgeNow.name}</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px; max-width: 360px; margin-left: auto; margin-right: auto;">${badgeNow.desc}</p>
            <div style="display: flex; gap: 6px; max-width: 380px; margin: 22px auto 0;">${segmentHtml}</div>
        </div>
    `;

    // --- Susun vertikal ---
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            ${headerHtml}
            ${tahapHtml}
            ${badgeHtml}
        </div>
    `;
}
