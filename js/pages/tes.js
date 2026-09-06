/**
 * SIMORA - Level Pages (Beginner / Practice / Expert) & quest preview overlay
 */

import { navigateTo } from "../navigation.js";
import { renderLatihan } from "./latihan.js";

export function renderLevel(app, lvlId) {
    const container = document.getElementById(`level-${lvlId}-container`);
    if (!container) return;
    container.innerHTML = "";

    const lvl = app.state.tests[lvlId];
    const card = document.createElement("div");

    // Build card state classes
    let cardClass = "tes-card card glass";
    let actionText = "Mulai Tes";
    let statusLabel = "Belum Mulai";
    let statusClass = "unlocked";
    let emoji = "🧠";

    if (lvl.status === "locked") {
        cardClass += " locked";
        actionText = "Terkunci";
        statusLabel = "Terkunci";
        statusClass = "locked";
        emoji = "🔒";
    } else if (lvl.status === "completed") {
        cardClass += " completed";
        actionText = `Lihat Hasil (${lvl.score}%)`;
        statusLabel = "Selesai";
        statusClass = "completed";
        emoji = "🏆";
    } else {
        cardClass += " active-level";
        emoji = lvlId === "beginner" ? "🌱" : (lvlId === "practice" ? "⚙️" : "⚡️");
    }

    card.className = cardClass;
    card.innerHTML = `
        <span class="tes-badge-status ${statusClass}">${statusLabel}</span>
        <div class="tes-level-preview">${emoji}</div>
        <div class="shop-item-details">
            <h3 class="shop-item-name">Level: ${lvl.title}</h3>
            <p class="shop-item-desc" style="margin-top: 4px;">${lvl.desc}</p>
        </div>
        <button class="btn-tes-action ${lvl.status === 'completed' ? 'completed-btn' : ''}" ${lvl.status === 'locked' ? 'disabled' : ''}>
            ${actionText}
        </button>
    `;

    // Action triggers
    const btn = card.querySelector(".btn-tes-action");
    btn.addEventListener("click", () => {
        openQuestOverlay(app, lvl);
    });

    container.appendChild(card);
}

export function renderPractice(app) {
    const container = document.getElementById("level-practice-container");
    if (!container) return;
    container.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "shop-grid";
    container.appendChild(grid);

    ["practice-l1", "practice-l2", "practice-l3"].forEach((lvlId) => {
        const lvl = app.state.tests[lvlId];
        if (!lvl) return;

        const card = document.createElement("div");
        let cardClass = "tes-card card glass";
        let emoji = "✍️";
        let statusLabel = "Tersedia";
        let statusClass = "unlocked";
        let actionText = "Mulai Latihan";
        let disabled = false;

        if (lvl.status === "locked") {
            cardClass += " locked";
            emoji = "🔒";
            statusLabel = "Terkunci";
            statusClass = "locked";
            actionText = "Terkunci";
            disabled = true;
        } else if (lvl.status === "completed") {
            cardClass += " completed";
            emoji = "🏆";
            statusLabel = "Selesai";
            statusClass = "completed";
            actionText = `Ulangi (${lvl.score}%)`;
        } else {
            cardClass += " active-level";
        }

        card.className = cardClass;
        card.innerHTML = `
            <span class="tes-badge-status ${statusClass}">${statusLabel}</span>
            <div class="tes-level-preview">${emoji}</div>
            <div class="shop-item-details">
                <h3 class="shop-item-name">${lvl.title}</h3>
                <p class="shop-item-desc" style="margin-top: 4px;">${lvl.desc}</p>
            </div>
            <button class="btn-tes-action ${lvl.status === 'completed' ? 'completed-btn' : ''}" ${disabled ? 'disabled' : ''}>
                ${actionText}
            </button>
        `;

        const btn = card.querySelector(".btn-tes-action");
        if (!disabled) {
            if (lvlId === "practice-l1" || lvlId === "practice-l2" || lvlId === "practice-l3") {
                // Latihan = video simulasi + form lembar jawab (tanpa popup informasi)
                btn.addEventListener("click", () => {
                    renderLatihan(app, lvlId);
                    navigateTo(app, "latihan");
                });
            } else {
                btn.addEventListener("click", () => openQuestOverlay(app, lvl));
            }
        }

        grid.appendChild(card);
    });
}

export function openQuestOverlay(app, lvl) {
    app.quizState.activeLevelId = lvl.id;

    document.getElementById("quest-title").textContent = `Halo, Pahlawan SIMORA! Selamat datang di Tes ${lvl.title}`;
    document.getElementById("quest-desc").innerHTML = `${lvl.desc}<br><br><strong>Petunjuk Tes:</strong> Jawablah semua pertanyaan pilihan ganda dengan teliti. Dapatkan skor minimal 70% untuk lulus dan membuka tingkat berikutnya!`;
    document.getElementById("quest-difficulty").textContent = lvl.difficulty;
    document.getElementById("quest-reward-xp").textContent = lvl.rewardXp;
    document.getElementById("quest-question-count").textContent = lvl.questions.length;

    // Custom badges for levels
    const badge = document.getElementById("quest-difficulty");
    badge.className = "quest-badge";
    if (lvl.difficulty === "Mudah") {
        badge.style.borderColor = "var(--success)";
        badge.style.color = "var(--success)";
        badge.style.background = "rgba(16, 185, 129, 0.1)";
    } else if (lvl.difficulty === "Sedang") {
        badge.style.borderColor = "var(--warning)";
        badge.style.color = "var(--warning)";
        badge.style.background = "rgba(245, 158, 11, 0.1)";
    } else {
        badge.style.borderColor = "var(--danger)";
        badge.style.color = "var(--danger)";
        badge.style.background = "rgba(239, 68, 68, 0.1)";
    }

    const overlay = document.getElementById("quest-preview-overlay");
    overlay.classList.add("show");
}
