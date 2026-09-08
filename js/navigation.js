/**
 * SIMORA - Navigation between workspace views
 */

import { renderPractice } from "./pages/tes.js";
import { renderExpert } from "./pages/expert.js";
import { renderProgres } from "./pages/progres.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderAdminDashboard, renderAdminRekap, renderAdminSiswa } from "./pages/admin.js";
import { closeQuestOverlay, showConfirm } from "./ui.js";
import { setBgmDuck } from "./bgm.js";

export function navigateTo(app, viewId, opts = {}) {
    // Leave quiz safety check
    const inQuiz = app.currentView === "quiz" || app.currentView === "expert-quiz";
    const quizFinished = app.currentView === "expert-quiz" && app.expertState?.finished;
    if (inQuiz && !quizFinished && viewId !== app.currentView && !opts.skipGuard) {
        // Konfirmasi dengan modal custom; bila setuju baru lanjut navigasi
        showConfirm({
            title: "Tinggalkan Tes?",
            message: "Apakah Anda yakin ingin meninggalkan Tes? Seluruh jawaban saat ini akan hilang.",
            confirmText: "Ya, Tinggalkan",
            cancelText: "Lanjut Tes",
            danger: true,
            icon: "⚠️",
        }).then((ok) => {
            if (!ok) return;
            stopQuizTimers(app);
            doNavigate(app, viewId, opts);
        });
        return;
    }
    doNavigate(app, viewId, opts);
}

// Hentikan timer Point Rush bila keluar di tengah kuis
function stopQuizTimers(app) {
    if (app.currentView === "expert-quiz" && app.expertState) {
        if (app.expertState.timer) {
            clearInterval(app.expertState.timer);
            app.expertState.timer = null;
        }
        if (app.expertState.advanceTimer) {
            clearTimeout(app.expertState.advanceTimer);
            app.expertState.advanceTimer = null;
        }
    }
}

function doNavigate(app, viewId, opts = {}) {
    closeQuestOverlay();
    const welcome = document.getElementById("beginner-welcome-overlay");
    if (welcome) welcome.classList.remove("show");
    const practiceWelcome = document.getElementById("practice-welcome-overlay");
    if (practiceWelcome) practiceWelcome.classList.remove("show");
    const expertWelcome = document.getElementById("expert-welcome-overlay");
    if (expertWelcome) expertWelcome.classList.remove("show");
    const expertTransition = document.getElementById("expert-transition-overlay");
    if (expertTransition) expertTransition.classList.remove("show");
    const atpOverlay = document.getElementById("atp-overlay");
    if (atpOverlay) atpOverlay.classList.remove("show");

    // Render target view
    document.querySelectorAll(".app-view").forEach(view => {
        view.classList.remove("active");
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.add("active");
        app.currentView = viewId;
    }

    // Set navbar active statuses
    document.querySelectorAll(".sidebar .nav-item, .bottom-nav .nav-item").forEach(item => {
        if (item.getAttribute("data-target") === viewId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Screen updates on navigation
    if (viewId === "dashboard") {
        renderDashboard(app);
    } else if (viewId === "beginner") {
        // Beginner = materi page; reset ke menu & show welcome popup on entry
        document.getElementById("beginner-menu").style.display = "block";
        document.getElementById("beginner-materi").style.display = "none";
        document.getElementById("beginner-contoh").style.display = "none";
        document.getElementById("beginner-welcome-overlay").classList.add("show");
    } else if (viewId === "practice") {
        renderPractice(app);
        if (!opts.skipGreeting) {
            document.getElementById("practice-welcome-overlay").classList.add("show");
        }
    } else if (viewId === "expert") {
        renderExpert(app);
        const lvl = app.state.tests.expert;
        if (lvl && lvl.status !== "locked" && !opts.skipGreeting) {
            document.getElementById("expert-welcome-overlay").classList.add("show");
        }
    } else if (viewId === "progres") {
        renderProgres(app);
    } else if (viewId === "admin-dashboard") {
        renderAdminDashboard(app);
    } else if (viewId === "admin-rekap") {
        renderAdminRekap(app);
    } else if (viewId === "admin-siswa") {
        renderAdminSiswa(app);
    }

    // Backsound tetap menyala; volume dikurangi saat video rapat sedang diputar
    // (halaman latihan) agar video YouTube tetap jelas terdengar.
    setBgmDuck(viewId === "latihan");
}
