/**
 * SIMORA - Expert Level: Kuis "Point Rush" (ujian akhir notula rapat)
 *
 * - Countdown ring 15 detik di sekitar nomor soal
 * - Bonus +15 poin bila jawaban benar di bawah 5 detik
 * - Feedback instan berupa animasi saja (tanpa popup teks pembahasan)
 * - Total poin disembunyikan selama kuis, hanya muncul di layar hasil akhir
 */

import { navigateTo } from "../navigation.js";
import { playCorrect, playWrong } from "../sfx.js";
import { fireConfetti } from "../confetti.js";
import { renderLatihan } from "./latihan.js";

const TIME_PER_QUESTION = 15;   // detik per soal
const BONUS_WINDOW = 5;         // benar < 5 detik → bonus
const BASE_POINTS = 100;        // poin per jawaban benar
const BONUS_POINTS = 15;        // bonus kecepatan
const FEEDBACK_MS = 1100;       // durasi animasi sebelum lanjut soal
const RING_CIRCUMFERENCE = 163.36; // 2 * π * 26

export function renderExpert(app) {
    const container = document.getElementById("level-expert-container");
    if (!container) return;
    container.innerHTML = "";

    const lvl = app.state.tests.expert;
    const card = document.createElement("div");

    let cardClass = "tes-card card glass";
    let actionText = "Mulai Kuis";
    let statusLabel = "Belum Mulai";
    let statusClass = "unlocked";
    let emoji = "⚡";
    let disabled = false;

    if (lvl.status === "locked") {
        cardClass += " locked";
        actionText = "Terkunci";
        statusLabel = "Terkunci";
        statusClass = "locked";
        emoji = "🔒";
        disabled = true;
    } else if (lvl.status === "completed") {
        cardClass += " completed";
        actionText = "Ulangi Kuis";
        statusLabel = `Selesai · ${lvl.score}%`;
        statusClass = "completed";
        emoji = "🏆";
    } else {
        cardClass += " active-level";
    }

    card.className = cardClass;
    card.innerHTML = `
        <span class="tes-badge-status ${statusClass}">${statusLabel}</span>
        <div class="tes-level-preview">${emoji}</div>
        <div class="shop-item-details">
            <h3 class="shop-item-name">Level: ${lvl.title}</h3>
            <p class="shop-item-desc" style="margin-top: 4px;">${lvl.desc}</p>
        </div>
        <button class="btn-tes-action ${lvl.status === 'completed' ? 'completed-btn' : ''}" ${disabled ? 'disabled' : ''}>
            ${actionText}
        </button>
    `;

    const btn = card.querySelector(".btn-tes-action");
    if (!disabled) {
        btn.addEventListener("click", () => startExpertQuiz(app));
    }

    container.appendChild(card);
}

export function startExpertQuiz(app) {
    const lvl = app.state.tests.expert;
    if (!lvl || lvl.status === "locked") return;

    // Bersihkan timer/sisa kuis sebelumnya bila ada
    if (app.expertState?.timer) clearInterval(app.expertState.timer);
    if (app.expertState?.advanceTimer) clearTimeout(app.expertState.advanceTimer);

    app.expertState = {
        questions: lvl.questions,
        currentIndex: 0,
        totalPoints: 0,
        correctCount: 0,
        bonusPoints: 0,
        answered: false,
        timeLeft: TIME_PER_QUESTION,
        finished: false,
        timer: null,
        advanceTimer: null
    };

    resetExpertQuizUi();
    document.getElementById("expert-welcome-overlay")?.classList.remove("show");
    navigateTo(app, "expert-quiz");
    renderExpertQuestion(app);
}

function resetExpertQuizUi() {
    const active = document.getElementById("expert-quiz-active");
    if (active) active.style.display = "block";
}

function renderExpertQuestion(app) {
    const state = app.expertState;
    const q = state.questions[state.currentIndex];
    const total = state.questions.length;
    const index = state.currentIndex;

    state.answered = false;

    // Progress bar & label
    document.getElementById("expert-progress-fill").style.width = `${(index / total) * 100}%`;
    document.getElementById("expert-progress-text").textContent = `Soal ${index + 1} dari ${total}`;

    // Ring: nomor soal di tengah, reset penuh
    const fg = document.getElementById("expert-timer-fg");
    fg.style.transition = "none";
    fg.style.strokeDashoffset = "0";
    document.getElementById("expert-timer-qnum").textContent = index + 1;
    document.getElementById("expert-timer-secs").textContent = TIME_PER_QUESTION;
    document.getElementById("expert-timer").classList.remove("danger");

    // Soal & opsi
    document.getElementById("expert-question-text").textContent = q.q;
    const container = document.getElementById("expert-options-container");
    container.innerHTML = "";
    container.classList.remove("feedback-correct", "feedback-wrong");
    document.getElementById("expert-quiz-card").classList.remove("shake");

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `
            <span class="option-badge">${String.fromCharCode(65 + idx)}</span>
            <span class="option-text">${opt}</span>
        `;
        btn.addEventListener("click", () => selectExpertAnswer(app, idx, btn));
        container.appendChild(btn);
    });

    startExpertTimer(app);
}

function startExpertTimer(app) {
    const state = app.expertState;
    state.timeLeft = TIME_PER_QUESTION;

    const fg = document.getElementById("expert-timer-fg");
    const secs = document.getElementById("expert-timer-secs");
    const ring = document.getElementById("expert-timer");

    if (state.timer) clearInterval(state.timer);

    // Animasi ring menyusut selama 15 detik
    requestAnimationFrame(() => {
        fg.style.transition = `stroke-dashoffset ${TIME_PER_QUESTION}s linear`;
        fg.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
    });

    state.timer = setInterval(() => {
        state.timeLeft -= 0.1;
        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            clearInterval(state.timer);
            state.timer = null;
            handleExpertTimeout(app);
            return;
        }
        secs.textContent = Math.ceil(state.timeLeft);
        // Warna ring berbahaya saat waktu < 5 detik
        ring.classList.toggle("danger", state.timeLeft <= BONUS_WINDOW);
    }, 100);
}

function stopExpertTimer(app) {
    const state = app.expertState;
    if (state?.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    if (state?.advanceTimer) {
        clearTimeout(state.advanceTimer);
        state.advanceTimer = null;
    }
}

function selectExpertAnswer(app, selectedIndex, selectedBtn) {
    const state = app.expertState;
    if (state.answered) return;
    state.answered = true;
    stopExpertTimer(app);

    const q = state.questions[state.currentIndex];
    const isCorrect = selectedIndex === q.answer;
    const options = document.querySelectorAll("#expert-options-container .option-btn");
    options.forEach(btn => btn.disabled = true);

    const card = document.getElementById("expert-quiz-card");
    const container = document.getElementById("expert-options-container");

    if (isCorrect) {
        const fast = state.timeLeft > TIME_PER_QUESTION - BONUS_WINDOW;
        state.correctCount++;
        state.totalPoints += BASE_POINTS + (fast ? BONUS_POINTS : 0);
        if (fast) state.bonusPoints += BONUS_POINTS;

        selectedBtn.classList.add("correct-reveal", "correct-pop");
        container.classList.add("feedback-correct");
        playCorrect();
    } else {
        selectedBtn.classList.add("incorrect-reveal");
        options[q.answer].classList.add("correct-reveal");
        container.classList.add("feedback-wrong");
        card.classList.add("shake");
        setTimeout(() => card.classList.remove("shake"), 450);
        playWrong();
    }

    // Alur cepat: lanjut otomatis tanpa popup teks
    state.advanceTimer = setTimeout(() => advanceExpert(app), FEEDBACK_MS);
}

function handleExpertTimeout(app) {
    const state = app.expertState;
    if (state.answered) return;
    state.answered = true;

    const q = state.questions[state.currentIndex];
    const options = document.querySelectorAll("#expert-options-container .option-btn");
    options.forEach(btn => btn.disabled = true);
    options[q.answer].classList.add("correct-reveal");

    const card = document.getElementById("expert-quiz-card");
    const container = document.getElementById("expert-options-container");
    container.classList.add("feedback-wrong");
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 450);
    playWrong();

    state.advanceTimer = setTimeout(() => advanceExpert(app), FEEDBACK_MS);
}

function advanceExpert(app) {
    const state = app.expertState;
    state.currentIndex++;
    if (state.currentIndex < state.questions.length) {
        renderExpertQuestion(app);
    } else {
        showExpertTransition(app);
    }
}

function showExpertTransition(app) {
    const state = app.expertState;
    state.finished = true;

    // Kuis tuntas → popup transisi menuju tantangan notula (tanpa tampilkan skor)
    document.getElementById("expert-transition-overlay").classList.add("show");
    fireConfetti({ count: 130, originY: 0.45, power: 1.1 });
}

export function initExpert(app) {
    // Popup greeting → MULAI langsung masuk kuis
    document.getElementById("btn-expert-welcome-start").addEventListener("click", () => {
        startExpertQuiz(app);
    });

    // Keluar dari kuis (konfirmasi & stop timer ditangani guard di navigation)
    document.getElementById("btn-exit-expert-quiz").addEventListener("click", () => {
        navigateTo(app, "expert", { skipGreeting: true });
    });

    // Kuis tuntas → lanjut ke tantangan notula (form, bukan skor)
    document.getElementById("btn-expert-transition-start").addEventListener("click", () => {
        renderLatihan(app, "expert");
        navigateTo(app, "latihan");
    });
}
