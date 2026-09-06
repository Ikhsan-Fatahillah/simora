/**
 * SIMORA - Sound effects via Web Audio API (tanpa file audio eksternal)
 * Menghormati pengaturan mute (localStorage "simora_muted").
 */

let ctx = null;

// AudioContext dibuat saat interaksi pertama (kebijakan autoplay browser)
function ensureCtx() {
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
}

function isMuted() {
    return localStorage.getItem("simora_muted") === "1";
}

// Nada dasar: frekuensi, mulai (dt), durasi, bentuk gelombang, volume
function tone(freq, start, dur, type = "sine", vol = 0.04) {
    const ac = ensureCtx();
    if (!ac || isMuted()) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + start);
    gain.gain.setValueAtTime(0, ac.currentTime + start);
    gain.gain.linearRampToValueAtTime(vol, ac.currentTime + start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(ac.currentTime + start);
    osc.stop(ac.currentTime + start + dur + 0.02);
}

// Klik halus tiap interaksi tombol/menu/kartu
export function playClick() {
    tone(1400, 0, 0.05, "triangle", 0.075);
}

// Jawaban benar: chime naik dua nada
export function playCorrect() {
    tone(659, 0, 0.1, "sine", 0.065);
    tone(880, 0.08, 0.16, "sine", 0.065);
}

// Jawaban salah: nada rendah pendek
export function playWrong() {
    tone(220, 0, 0.14, "square", 0.05);
}

// Sukses / naik level: arpeggio ceria
export function playSuccess() {
    tone(523, 0, 0.11, "sine", 0.06);
    tone(659, 0.1, 0.11, "sine", 0.06);
    tone(784, 0.2, 0.2, "sine", 0.06);
}
