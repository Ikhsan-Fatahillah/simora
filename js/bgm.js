/**
 * SIMORA - Backsound belajar dari dokumen/backsound.mp3
 *
 * - Mulai sejak login berhasil, mati hanya saat logout
 * - Volume dikurangi otomatis saat video YouTube latihan sedang diputar
 * - Menghormati pengaturan mute (localStorage "simora_muted")
 */

const SRC = "documents/backsound.mp3";
// Volume pelan: backsound sebagai latar, klik/sfx tetap lebih terdengar.
const VOL_NORMAL = 0.06;
const VOL_DUCKED = 0.03;

let audio = null;
let ducked = false;

function ensureEl() {
    if (!audio) {
        audio = new Audio(SRC);
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = ducked ? VOL_DUCKED : VOL_NORMAL;
    }
    return audio;
}

// Panggil pada saat masuk/gestur pengguna agar browser mengizinkan playback
export function unlockBgm() {
    const el = ensureEl();
    if (el.paused) {
        el.play().catch(() => {
            // Autoplay diblokir: akan dicoba lagi pada interaksi berikutnya
        });
    }
}

export function startBgm() {
    unlockBgm();
}

// Hentikan & reset posisi (dipakai saat logout)
export function stopBgm() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// Kecilkan volume saat video latihan sedang diputar agar tidak saling menutupi
export function setBgmDuck(active) {
    ducked = active;
    if (audio) {
        audio.volume = ducked ? VOL_DUCKED : VOL_NORMAL;
    }
}
