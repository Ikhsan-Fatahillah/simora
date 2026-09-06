/**
 * SIMORA - Entry point: bootstrap seluruh halaman & event wiring
 */

import { loadState, saveState } from "./store.js";
import { showToast, closeQuestOverlay, showConfirm } from "./ui.js";
import { playClick } from "./sfx.js";
import { unlockBgm, startBgm, stopBgm } from "./bgm.js";
import { navigateTo } from "./navigation.js";
import { initAuth, validSession } from "./pages/auth.js";
import { initOnboarding } from "./pages/onboarding.js";
import { renderPractice } from "./pages/tes.js";
import { startQuiz, nextQuestion, exitQuiz } from "./pages/quiz.js";
import { initLatihan, initLatihanNext } from "./pages/latihan.js";
import { renderExpert, initExpert } from "./pages/expert.js";
import { renderProgres } from "./pages/progres.js";
import { initAtp } from "./pages/atp.js";
import { initPanduan } from "./pages/panduan.js";

function init() {
    // Guard: sesi lama yang tidak valid (belum login / akun tidak dikenal)
    // tidak boleh membuka dashboard — paksa kembali ke layar landing.
    const stored = loadState();
    if (!validSession(stored)) {
        stored.auth.isLoggedIn = false;
        stored.auth.hasCompletedOnboarding = false;
        stored.auth.username = null;
        saveState(stored);
    }

    // Shared app context
    const app = {
        state: stored,
        currentView: "atp",
        quizState: {
            activeLevelId: null,
            questions: [],
            currentIndex: 0,
            score: 0,
            answers: []
        },
        saveState() {
            saveState(this.state);
        }
    };
    window.app = app;

    // Initial screen check
    document.querySelectorAll(".full-screen-view").forEach(s => s.classList.remove("active"));
    document.getElementById("app-workspace").style.display = "none";

    if (!app.state.auth.isLoggedIn) {
        document.getElementById("screen-landing").classList.add("active");
    } else if (!app.state.auth.hasCompletedOnboarding) {
        document.getElementById("screen-onboarding").classList.add("active");
    } else {
        document.getElementById("app-workspace").style.display = "grid";
        navigateTo(app, "dashboard");
    }

    // Initial renders
    renderPractice(app);
    renderExpert(app);
    renderProgres(app);

    // Page event wiring
    initAuth(app);
    initOnboarding(app);
    initLatihan(app);
    initLatihanNext(app);
    initExpert(app);
    initAtp();
    initPanduan();

    // --- Backsound & tombol suara ---
    // Backsound: nyala sejak berhasil login, mati hanya saat logout.
    // Tombol ikon suara tampil di pojok kanan atas semua halaman setelah login.
    const wsAudioBtn = document.getElementById("ws-audio-toggle");
    const landingAudioBtn = document.getElementById("btn-audio-toggle");
    const setWsAudioVisible = (visible) => {
        if (wsAudioBtn) wsAudioBtn.style.display = visible ? "flex" : "none";
    };

    const syncBgm = () => {
        const muted = localStorage.getItem("simora_muted") === "1";
        const loggedIn = !!app.state.auth.isLoggedIn;
        setWsAudioVisible(loggedIn);
        if (wsAudioBtn) {
            wsAudioBtn.title = muted ? "Suara: Mati" : "Suara: Nyala";
            wsAudioBtn.classList.toggle("muted", muted);
        }
        if (loggedIn && !muted) {
            unlockBgm();
            startBgm();
        } else {
            stopBgm();
        }
    };

    // Sidebar, bottom-nav & in-view links (event delegation utk elemen dinamis)
    document.addEventListener("click", (e) => {
        // Sound effect halus pada tiap interaksi (tombol, link, menu, kartu navigasi).
        // .option-btn dikecualikan: jawaban quiz sudah punya suara benar/salah sendiri.
        const interactive = e.target.closest("button, a, [data-target], .nav-item, input, select, textarea");
        if (interactive && !e.target.closest(".option-btn")) playClick();
        syncBgm(); // gestur pertama (mis. setelah login): mulai backsound

        const target = e.target.closest("[data-target]");
        if (target) {
            navigateTo(app, target.getAttribute("data-target"));
        }
    });

    // Enter pada form login = login sukses → mulai backsound seketika
    document.addEventListener("submit", () => syncBgm());

    // Audio toggle (pojok landing & pojok kanan atas halaman login)
    const applyAudioToggle = (muted) => {
        localStorage.setItem("simora_muted", muted ? "1" : "0");
        if (landingAudioBtn) landingAudioBtn.classList.toggle("muted", muted);
        syncBgm();
    };

    const toggleAudio = () => {
        const isMuted = localStorage.getItem("simora_muted") === "1";
        applyAudioToggle(!isMuted);
    };
    if (landingAudioBtn) landingAudioBtn.addEventListener("click", toggleAudio);
    if (wsAudioBtn) wsAudioBtn.addEventListener("click", toggleAudio);
    applyAudioToggle(localStorage.getItem("simora_muted") === "1");
    setWsAudioVisible(!!app.state.auth.isLoggedIn);

    // Logout Handlers
    const handleLogout = async () => {
        const ok = await showConfirm({
            title: "Keluar dari SIMORA?",
            message: "Apakah Anda yakin ingin keluar dari akun? Kamu bisa masuk kembali kapan saja.",
            confirmText: "Keluar",
            cancelText: "Batal",
            danger: true,
            icon: "🚪",
        });
        if (!ok) return;

        app.state.auth.isLoggedIn = false;
        app.state.auth.hasCompletedOnboarding = false;
        app.state.auth.username = null; // end session: bersihkan identitas akun
        app.saveState();

        document.querySelectorAll(".full-screen-view").forEach(s => s.classList.remove("active"));
        document.getElementById("app-workspace").style.display = "none";
        document.getElementById("screen-landing").classList.add("active");
        syncBgm();
        showToast("Berhasil keluar akun!", "success");
    };

    document.getElementById("logout-btn").addEventListener("click", handleLogout);

    // Quest overlay controls (Tes)
    document.getElementById("close-quest-overlay").addEventListener("click", () => {
        closeQuestOverlay();
    });

    // Beginner welcome popup close
    document.getElementById("btn-beginner-welcome-close").addEventListener("click", () => {
        document.getElementById("beginner-welcome-overlay").classList.remove("show");
    });

    // Practice welcome popup close
    document.getElementById("btn-practice-welcome-close").addEventListener("click", () => {
        document.getElementById("practice-welcome-overlay").classList.remove("show");
    });

    // Beginner menu -> sub halaman
    const showBeginnerSection = (section) => {
        document.getElementById("beginner-menu").style.display = section === "menu" ? "block" : "none";
        document.getElementById("beginner-materi").style.display = section === "materi" ? "block" : "none";
        document.getElementById("beginner-contoh").style.display = section === "contoh" ? "block" : "none";
    };

    document.getElementById("btn-beginner-materi").addEventListener("click", () => showBeginnerSection("materi"));
    document.getElementById("btn-beginner-contoh").addEventListener("click", () => showBeginnerSection("contoh"));
    document.getElementById("btn-beginner-back-menu").addEventListener("click", () => showBeginnerSection("menu"));
    document.getElementById("btn-beginner-back-menu-2").addEventListener("click", () => showBeginnerSection("menu"));

    // Beginner (materi) -> Practice: tandai selesai & buka kunci Practice
    document.getElementById("btn-beginner-to-practice").addEventListener("click", () => {
        const beginner = app.state.tests.beginner;
        beginner.status = "completed";
        beginner.score = 100;
        beginner.date = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
        app.state.tests.practice.status = "unlocked";
        app.state.tests["practice-l1"].status = "unlocked";
        app.saveState();
        navigateTo(app, "practice");
        showToast("Materi selesai! Practice Level terbuka!", "success");
    });

    document.getElementById("btn-start-quest").addEventListener("click", () => {
        if (app.quizState.activeLevelId) {
            startQuiz(app, app.quizState.activeLevelId);
        }
    });

    // Quiz interactions
    document.getElementById("btn-exit-quiz").addEventListener("click", () => {
        exitQuiz(app);
    });

    document.getElementById("btn-next-question").addEventListener("click", () => {
        nextQuestion(app);
    });
}

window.addEventListener("DOMContentLoaded", init);
