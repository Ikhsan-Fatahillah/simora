/**
 * SIMORA - Konfeti ringan (vanilla canvas, tanpa library)
 * fireConfetti() → semburan partikel warna; auto hilang & bersih.
 */

const COLORS = ["#2979ff", "#00c2f3", "#7c4dff", "#00e676", "#ffd740", "#ff4081", "#40c4ff", "#ffffff"];

let canvas = null;
let ctx = null;
let parts = [];
let rafId = null;
let visible = false;

function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
}

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function fireConfetti({
    count = 120,
    originX = 0.5,
    originY = 0.4,
    power = 1,
    spread = Math.PI * 1.4,
} = {}) {
    // Hormati preferensi user: tanpa konfeti bila animasi dikurangi
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ensureCanvas();

    const cx = window.innerWidth * originX;
    const cy = window.innerHeight * originY;

    for (let i = 0; i < count; i++) {
        // Semburan ke atas (sudut acak dari -90° ± spread)
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
        const speed = (4 + Math.random() * 7) * power;
        const isRound = Math.random() < 0.35;
        parts.push({
            x: cx + (Math.random() - 0.5) * 30,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: isRound ? 5 + Math.random() * 5 : (6 + Math.random() * 5),
            color: COLORS[(Math.random() * COLORS.length) | 0],
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.3,
            round: isRound,
            life: 80 + Math.random() * 45,
            maxLife: 125,
            gravity: 0.16,
        });
    }

    show();
    if (!rafId) loop();
}

function show() {
    visible = true;
    canvas.style.display = "block";
    canvas.style.opacity = "1";
}

function hide() {
    visible = false;
    canvas.style.display = "none";
    parts = [];
    cancelAnimationFrame(rafId);
    rafId = null;
}

function loop() {
    rafId = requestAnimationFrame(loop);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy = p.vy * 0.99 + p.gravity;
        p.rot += p.vr;
        p.life--;

        if (p.life <= 0 || p.y > window.innerHeight + 30) {
            parts.splice(i, 1);
            continue;
        }

        const alpha = Math.min(1, (p.life / p.maxLife) * 2);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.round) {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        }
        ctx.restore();
    }

    ctx.globalAlpha = 1;

    if (!parts.length) hide();
}
