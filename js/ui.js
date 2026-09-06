/**
 * SIMORA - Shared UI helpers: splash, toast, quest overlay
 */

import { fireConfetti } from "./confetti.js";

// Splash singkat saat naik level (tidak memblokir interaksi)
export function levelUpSplash(level) {
    fireConfetti({ count: 180, originY: 0.5, power: 1.15 });
    const el = document.createElement("div");
    el.className = "levelup-splash";
    el.innerHTML = `<span class="levelup-star">✨</span><strong>LEVEL ${level}</strong><span class="levelup-star">✨</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1700);
}

export function closeQuestOverlay() {
    const overlay = document.getElementById("quest-preview-overlay");
    if (overlay) {
        overlay.classList.remove("show");
    }
}

// --- TOAST NOTIFICATIONS ---
export function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let emoji = "ℹ️";
    if (type === "success") emoji = "🎉";
    else if (type === "error") emoji = "⚠️";
    else if (type === "xp") emoji = "✨";

    toast.innerHTML = `
        <span class="toast-icon">${emoji}</span>
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// --- MODAL KONFIRMASI (pengganti confirm() bawaan browser) ---
// Menampilkan dialog konfirmasi custom; resolve true bila Ya/Konfirmasi dipilih.
export function showConfirm({
    title = "Konfirmasi",
    message = "Apakah Anda yakin?",
    confirmText = "Ya, Lanjut",
    cancelText = "Batal",
    danger = false,
    icon = "❓",
} = {}) {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.innerHTML = `
            <div class="modal-card" role="dialog" aria-modal="true" aria-label="${title}">
                <span class="modal-icon">${icon}</span>
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary modal-btn modal-cancel">${cancelText}</button>
                    <button type="button" class="btn-primary modal-btn modal-ok${danger ? " danger" : ""}">${confirmText}</button>
                </div>
            </div>`;

        const cleanup = () => {
            document.removeEventListener("keydown", onKey);
            overlay.classList.remove("show");
            setTimeout(() => overlay.remove(), 250);
        };
        const finish = (val) => {
            if (overlay.dataset.closed) return;
            overlay.dataset.closed = "1";
            cleanup();
            resolve(val);
        };
        const onKey = (e) => {
            if (e.key === "Escape") finish(false);
        };

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add("show"));
        document.addEventListener("keydown", onKey);

        overlay.addEventListener("mousedown", (e) => {
            if (e.target === overlay) finish(false);
        });
        overlay.querySelector(".modal-cancel").addEventListener("click", () => finish(false));
        overlay.querySelector(".modal-ok").addEventListener("click", () => finish(true));

        // Fokus tombol Batal agar Enter tidak langsung mengonfirmasi
        overlay.querySelector(".modal-cancel").focus();
    });
}
