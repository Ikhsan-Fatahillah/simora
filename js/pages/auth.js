/**
 * SIMORA - Auth Screens: Landing & Login (Supabase Auth)
 * Login pakai username; backend memetakan ke email virtual {username}@simora.local.
 * Role (siswa/admin) diambil dari tabel profiles setelah login.
 * Akun siswa dibuat oleh admin (tidak ada registrasi mandiri).
 */

import { showToast } from "../ui.js";
import { playWrong, playCorrect } from "../sfx.js";
import { navigateTo } from "../navigation.js";
import { signInWithUsername, fetchCurrentProfile, pullSiswaState, preloadSoal } from "../supabase.js";
import { loadState, stateKeyFor } from "../store.js";

function friendlyError(err) {
    const msg = String(err?.message || err || "").toLowerCase();
    if (msg.includes("invalid login credentials")) return "Username atau password salah.";
    if (msg.includes("email not confirmed")) return "Email belum dikonfirmasi. Hubungi admin.";
    return err?.message || "Gagal masuk. Coba lagi.";
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

    // Login Submit -> verifikasi via Supabase, lalu masuk sesuai role
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

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value;

        errorBox.style.display = "none";

        if (!username || !password) {
            showError("⚠️ Username dan password wajib diisi.");
            return;
        }

        // Login ke Supabase Auth
        try {
            await signInWithUsername(username, password);
        } catch (err) {
            showError(`⚠️ ${friendlyError(err)}`);
            return;
        }

        // Ambil profil (role) dari tabel profiles
        let profile = null;
        try {
            profile = await fetchCurrentProfile();
        } catch (_) {
            profile = null;
        }
        if (!profile) {
            showError("⚠️ Akun tidak ditemukan. Hubungi admin.");
            return;
        }

        // Pindah ke state lokal milik akun ini (fresh bila pertama kali login).
        // Progres antar-siswa tidak bocor di perangkat yang sama.
        const nextKey = stateKeyFor(profile.username);
        app.state = loadState(nextKey);
        app._stateKey = nextKey;

        // Mulai session aplikasi
        app.state.auth.isLoggedIn = true;
        app.state.auth.username = profile.username;
        app.state.auth.role = profile.role;
        app.state.auth.nama = profile.nama;
        app.state.auth.hasCompletedOnboarding = profile.role === "admin";
        app.saveState();

        // Siswa: tarik progres & soal dari Supabase ke state akun ini.
        if (profile.role === "siswa") {
            try {
                await pullSiswaState(app.state);
                await preloadSoal(app.state);
                app.saveState();
            } catch (err) {
                console.warn("Gagal sinkron data siswa saat login:", err);
            }
        }

        document.getElementById("screen-login").classList.remove("active");

        // Admin: tanpa onboarding, langsung ke dashboard admin.
        if (profile.role === "admin") {
            document.getElementById("admin-workspace").style.display = "grid";
            navigateTo(app, "admin-dashboard");
            playCorrect();
            showToast("Berhasil masuk sebagai Admin!", "success");
            return;
        }

        // Siswa: tampilkan onboarding seperti biasa.
        document.getElementById("screen-onboarding").classList.add("active");
        playCorrect();
        showToast("Berhasil masuk akun!", "success");
    });
}
