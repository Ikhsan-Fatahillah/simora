/**
 * SIMORA - Auth Screens: Landing & Login
 * Akun bawaan: username "siswa", password "siswa123" (tanpa registrasi).
 */

import { showToast } from "../ui.js";
import { playWrong, playCorrect } from "../sfx.js";

export const AUTH_ACCOUNT = {
    username: "siswa",
    password: "siswa123"
};

// Session dianggap valid hanya bila login memakai akun bawaan.
export function validSession(state) {
    return !!(
        state?.auth?.isLoggedIn &&
        state?.auth?.username === AUTH_ACCOUNT.username
    );
}

export function initAuth(app) {
    // Landing Screen -> Login Screen
    document.getElementById("btn-landing-start").addEventListener("click", () => {
        document.getElementById("screen-landing").classList.remove("active");
        document.getElementById("screen-login").classList.add("active");
    });

    // Login Screen -> Landing Screen (Back Button)
    document.getElementById("btn-login-back").addEventListener("click", () => {
        document.getElementById("screen-login").classList.remove("active");
        document.getElementById("screen-landing").classList.add("active");
    });

    // Login Submit -> verifikasi akun, baru masuk (tanpa register)
    const loginForm = document.getElementById("login-form");
    const loginCard = document.getElementById("login-card");
    const errorBox = document.getElementById("login-error");

    // Tombol lihat/sembunyikan password
    const pwInput = document.getElementById("login-password");
    const pwToggle = document.getElementById("login-password-toggle");
    pwToggle.addEventListener("click", () => {
        const showing = pwInput.type === "text";
        pwInput.type = showing ? "password" : "text";
        pwToggle.classList.toggle("showing", !showing);
        pwToggle.setAttribute("aria-label", showing ? "Lihat password" : "Sembunyikan password");
        pwInput.focus();
    });

    const showError = (message) => {
        errorBox.style.display = "flex";
        errorBox.textContent = message;
        loginCard.classList.remove("shake");
        void loginCard.offsetWidth; // restart animasi
        loginCard.classList.add("shake");
        setTimeout(() => loginCard.classList.remove("shake"), 450);
        playWrong();
    };

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value;

        errorBox.style.display = "none";

        if (!username || !password) {
            showError("⚠️ Username dan password wajib diisi.");
            return;
        }
        if (username !== AUTH_ACCOUNT.username) {
            showError(`⚠️ Username "${username}" tidak terdaftar.`);
            return;
        }
        if (password !== AUTH_ACCOUNT.password) {
            showError("⚠️ Password salah. Silakan coba lagi.");
            return;
        }

        // Berhasil login → mulai session & tampilkan onboarding
        app.state.auth.isLoggedIn = true;
        app.state.auth.username = AUTH_ACCOUNT.username;
        app.state.auth.hasCompletedOnboarding = false;
        app.saveState();

        document.getElementById("screen-login").classList.remove("active");
        document.getElementById("screen-onboarding").classList.add("active");
        playCorrect();
        showToast("Berhasil masuk akun!", "success");
    });
}
