/**
 * SIMORA - Onboarding & Panduan screens
 */

import { navigateTo } from "../navigation.js";
import { showToast } from "../ui.js";

export function initOnboarding(app) {
    // Onboarding Screen -> Panduan Page (Standalone)
    document.getElementById("btn-onboarding-guide").addEventListener("click", () => {
        document.getElementById("screen-onboarding").classList.remove("active");
        document.getElementById("screen-panduan").classList.add("active");
    });

    // Panduan Page -> Back to Onboarding
    document.getElementById("btn-panduan-back").addEventListener("click", () => {
        document.getElementById("screen-panduan").classList.remove("active");
        document.getElementById("screen-onboarding").classList.add("active");
    });

    // Panduan Page -> Enter Dashboard (popup selamat datang dulu)
    document.getElementById("btn-panduan-start").addEventListener("click", () => {
        document.getElementById("onboarding-welcome-overlay").classList.add("show");
    });

    // Onboarding Screen -> Enter Dashboard (popup selamat datang dulu)
    document.getElementById("btn-onboarding-dashboard").addEventListener("click", () => {
        document.getElementById("onboarding-welcome-overlay").classList.add("show");
    });

    // Popup selamat datang -> Dashboard
    document.getElementById("btn-onboarding-dashboard-start").addEventListener("click", () => {
        document.getElementById("onboarding-welcome-overlay").classList.remove("show");
        enterDashboard(app);
    });

    function enterDashboard(app) {
        app.state.auth.hasCompletedOnboarding = true;
        app.saveState();

        document.getElementById("screen-onboarding").classList.remove("active");
        document.getElementById("screen-panduan").classList.remove("active");
        document.getElementById("app-workspace").style.display = "grid";
        navigateTo(app, "dashboard");
        showToast("Selamat datang di Dashboard SIMORA!", "success");
    }
}
