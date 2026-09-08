/**
 * SIMORA - Quiz Page: pengerjaan soal, feedback, dan evaluasi
 */

import { navigateTo } from "../navigation.js";
import { showToast, closeQuestOverlay, levelUpSplash, showConfirm } from "../ui.js";
import { fireConfetti } from "../confetti.js";
import { playCorrect, playWrong, playSuccess } from "../sfx.js";
import { pushSiswaResult } from "../supabase.js";

export function startQuiz(app, levelId) {
    const lvl = app.state.tests[levelId];
    if (!lvl) return;

    app.quizState.activeLevelId = levelId;
    app.quizState.questions = lvl.questions;
    app.quizState.currentIndex = 0;
    app.quizState.score = 0;
    app.quizState.answers = [];

    closeQuestOverlay();
    navigateTo(app, "quiz");
    renderQuestion(app);
}

function renderQuestion(app) {
    const currentQ = app.quizState.questions[app.quizState.currentIndex];

    // Update progress indicators
    const total = app.quizState.questions.length;
    const index = app.quizState.currentIndex;
    const progressPct = (index / total) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${progressPct}%`;
    document.getElementById("quiz-progress-text").textContent = `Pertanyaan ${index + 1} dari ${total}`;

    // Reset feedback panels
    const panel = document.getElementById("quiz-feedback-panel");
    panel.className = "quiz-feedback-panel";
    document.getElementById("btn-next-question").style.display = "none";

    // Display question
    document.getElementById("quiz-question-text").textContent = currentQ.q;

    // Render options
    const container = document.getElementById("quiz-options-container");
    container.innerHTML = "";

    currentQ.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `
            <span class="option-badge">${String.fromCharCode(65 + idx)}</span>
            <span class="option-text">${opt}</span>
        `;

        btn.addEventListener("click", () => {
            selectOption(app, idx, btn);
        });

        container.appendChild(btn);
    });
}

function selectOption(app, selectedIndex, selectedBtn) {
    const options = document.querySelectorAll(".option-btn");
    options.forEach(btn => btn.disabled = true);

    const currentQ = app.quizState.questions[app.quizState.currentIndex];
    const isCorrect = selectedIndex === currentQ.answer;

    // Catat jawaban per soal untuk riwayat (dilihat admin).
    app.quizState.answers[app.quizState.currentIndex] = {
        soal: currentQ.q,
        opsi: currentQ.options[selectedIndex],
        benar: isCorrect
    };

    const panel = document.getElementById("quiz-feedback-panel");
    const fbIcon = document.getElementById("feedback-icon");
    const fbTitle = document.getElementById("feedback-title");
    const fbDesc = document.getElementById("feedback-desc");

    panel.classList.add("show");

    if (isCorrect) {
        app.quizState.score++;
        playCorrect();
        selectedBtn.classList.add("correct-reveal");
        panel.classList.add("correct");
        fbIcon.innerHTML = `✓`;
        fbTitle.textContent = "Jawaban Benar!";
        fbDesc.textContent = currentQ.explain;
    } else {
        playWrong();
        selectedBtn.classList.add("incorrect-reveal");
        options[currentQ.answer].classList.add("correct-reveal");
        panel.classList.add("incorrect");
        fbIcon.innerHTML = `✗`;
        fbTitle.textContent = "Kurang Tepat!";
        fbDesc.textContent = currentQ.explain;

        // Shake animation
        const container = document.querySelector(".quiz-container");
        container.classList.add("shake");
        setTimeout(() => container.classList.remove("shake"), 400);
    }

    document.getElementById("btn-next-question").style.display = "block";
}

export function nextQuestion(app) {
    app.quizState.currentIndex++;

    if (app.quizState.currentIndex < app.quizState.questions.length) {
        renderQuestion(app);
    } else {
        finishQuiz(app);
    }
}

function finishQuiz(app) {
    const lvlId = app.quizState.activeLevelId;
    const lvl = app.state.tests[lvlId];
    if (!lvl) return;

    const finalScorePct = Math.round((app.quizState.score / lvl.questions.length) * 100);
    const threshold = lvl.passThreshold || 70; // KKM per tes (Practice latihan = 75)
    const isPassed = finalScorePct >= threshold;

    if (isPassed) {
        // Mark Completed
        lvl.status = "completed";
        lvl.score = finalScorePct;
        lvl.date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });

        // Reward XP
        app.state.user.xp += lvl.rewardXp;
        app.state.user.streak++;

        // Unlock next level in sequence
        if (lvlId === "beginner") {
            app.state.tests.practice.status = "unlocked";
            app.state.tests["practice-l1"].status = "unlocked";
        } else if (lvlId === "practice-l1") {
            app.state.tests["practice-l2"].status = "unlocked";
        } else if (lvlId === "practice-l2") {
            app.state.tests["practice-l3"].status = "unlocked";
        } else if (lvlId === "practice-l3") {
            app.state.tests.expert.status = "unlocked";
        }

        // Level Up logic
        let leveledUp = false;
        while (app.state.user.xp >= app.state.user.xpNeeded) {
            app.state.user.xp -= app.state.user.xpNeeded;
            app.state.user.level++;
            app.state.user.xpNeeded = Math.round(app.state.user.xpNeeded * 1.3);
            leveledUp = true;
        }

        showToast(`Lulus ${lvl.title}! Nilai: ${finalScorePct}%`, "success");
        if (leveledUp) {
            playSuccess();
            setTimeout(() => {
                levelUpSplash(app.state.user.level);
            }, 650);
        } else {
            // Kuis tuntas tanpa naik level → perayaan konfeti singkat
            setTimeout(() => fireConfetti({ count: 100, originY: 0.45 }), 350);
        }
    } else {
        showToast(`Belum Lulus! Nilai: ${finalScorePct}% (Butuh minimal ${threshold}%)`, "error");
    }

    app.saveState();

    // Kirim hasil ke Supabase (status stage + attempt + xp). Aman gagal (offline).
    pushSiswaResult(app.state, {
        levelId: lvlId,
        score: finalScorePct,
        completed: isPassed,
        answers: app.quizState.answers && app.quizState.answers.length ? app.quizState.answers : null
    }).catch(err => console.warn("Gagal sinkron hasil tes:", err));
    const isLatihan = lvlId.startsWith("practice-l");
    navigateTo(app, isLatihan ? "practice" : lvlId, { skipGreeting: true });
}

export async function exitQuiz(app) {
    const ok = await showConfirm({
        title: "Keluar dari Tes?",
        message: "Kembali ke daftar tes? Hasil pengerjaan saat ini tidak akan disimpan.",
        confirmText: "Keluar Tes",
        cancelText: "Lanjut Mengerjakan",
        danger: true,
        icon: "📕",
    });
    if (!ok) return;

    const lvlId = app.quizState.activeLevelId;
    const backView = lvlId && lvlId.startsWith("practice-l") ? "practice" : (lvlId || "beginner");
    // skipGuard: konfirmasi sudah tampil di atas, jangan tampil dua kali
    navigateTo(app, backView, { skipGreeting: true, skipGuard: true });
}
