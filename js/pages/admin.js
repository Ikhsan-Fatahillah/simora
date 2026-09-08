/**
 * SIMORA - Admin Pages: Dashboard Admin & Rekap Hasil Belajar
 * Data dibaca langsung dari Supabase (semua akun siswa + stage_progress).
 */

import { getClient } from "../supabase.js";
import { showToast } from "../ui.js";

// Urutan & nama tampilan tahap belajar yang dipantau admin.
const ROW_ORDER = ["beginner", "practice-l1", "practice-l2", "practice-l3", "expert"];
const TAHAP_NAME = {
    "beginner": "Beginner",
    "practice-l1": "Latihan 1",
    "practice-l2": "Latihan 2",
    "practice-l3": "Latihan 3",
    "expert": "Expert"
};

const STATUS = {
    completed: { label: "Selesai", icon: "✅", fg: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
    unlocked:  { label: "Tersedia", icon: "🔓", fg: "#2979ff", bg: "rgba(41, 121, 255, 0.12)" },
    locked:    { label: "Terkunci", icon: "🔒", fg: "#94a3b8", bg: "rgba(148, 163, 184, 0.15)" }
};
const STATUS_NONE = { label: "Belum Mulai", icon: "○", fg: "#64748b", bg: "rgba(100, 116, 139, 0.12)" };

function tglLabel(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function pill(status) {
    const meta = STATUS[status] || STATUS_NONE;
    return `
        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
            border-radius: 50px; background: ${meta.bg}; color: ${meta.fg};
            font-weight: 700; font-size: 0.75rem; white-space: nowrap;">
            ${meta.icon} ${meta.label}
        </span>`;
}

function scoreText(score) {
    return score != null ? `${score}%` : "—";
}

// ---------- Ambil data monitoring dari Supabase ----------

async function fetchAdminData() {
    const sb = getClient();
    const { data: students, error: pe } = await sb
        .from("profiles")
        .select("id, nama, username, created_at")
        .eq("role", "siswa")
        .order("nama", { ascending: true });
    if (pe) throw pe;

    const ids = students.map(s => s.id);
    const emptyIds = ids.length ? ids : [null];
    const [{ data: prog }, { data: stats }, { data: att }] = await Promise.all([
        sb.from("stage_progress").select("user_id, stage_key, status, score, done_at").in("user_id", emptyIds),
        sb.from("user_stats").select("user_id, level, xp").in("user_id", emptyIds),
        sb.from("attempts").select("user_id, stage_key, answers, score, created_at").in("user_id", emptyIds).order("created_at", { ascending: false })
    ]);

    const progBy = {};
    (prog || []).forEach(r => {
        (progBy[r.user_id] = progBy[r.user_id] || {})[r.stage_key] = {
            status: r.status, score: r.score, done_at: r.done_at
        };
    });
    const statBy = {};
    (stats || []).forEach(r => { statBy[r.user_id] = r; });
    const attBy = {};
    (att || []).forEach(a => {
        const bucket = attBy[a.user_id] = attBy[a.user_id] || {};
        (bucket[a.stage_key] = bucket[a.stage_key] || []).push(a);
    });

    return students.map(s => ({
        id: s.id,
        nama: s.nama,
        username: s.username,
        dibuat: tglLabel(s.created_at),
        stat: statBy[s.id] || null,
        prog: progBy[s.id] || {},
        attempts: attBy[s.id] || {}
    }));
}

// Baris per siswa per tahap (dipakai dashboard & rekap & CSV).
function stageRows(student) {
    return ROW_ORDER.map(key => {
        const d = student.prog[key] || {};
        return {
            id: key,
            title: TAHAP_NAME[key],
            status: d.status || null,
            score: typeof d.score === "number" ? d.score : null,
            date: tglLabel(d.done_at)
        };
    });
}

function allRows(students) {
    const rows = [];
    students.forEach(s => stageRows(s).forEach(r => rows.push({ student: s, ...r })));
    return rows;
}

function studentDoneCount(student) {
    return stageRows(student).filter(r => r.status === "completed").length;
}

// ---------- Dashboard ----------

export async function renderAdminDashboard(app) {
    const container = document.getElementById("admin-dashboard-container");
    if (!container) return;

    container.innerHTML = `<div style="color: var(--text-secondary); padding: 12px;">Menyiapkan data dari Supabase…</div>`;
    let students;
    try {
        students = await fetchAdminData();
    } catch (err) {
        console.error("Gagal ambil data admin:", err);
        container.innerHTML = `
            <div class="card glass" style="padding: 24px; color: var(--text-secondary); text-align: center;">
                Gagal memuat data siswa dari Supabase. Coba buka halaman ini lagi.
            </div>`;
        return;
    }

    const rows = allRows(students);
    const done = rows.filter(r => r.status === "completed");
    const scores = done.map(r => r.score).filter(s => s != null);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    const best = scores.length ? Math.max(...scores) : null;

    // Rata-rata jumlah tahap selesai per siswa (mis. 4 dari 5), bukan total global.
    const avgDone = students.length ? done.length / students.length : 0;
    const fmtAvgDone = Number.isInteger(avgDone) ? String(avgDone) : avgDone.toFixed(1).replace(".", ",");

    const stats = [
        { emoji: "👥", label: "Siswa Terdaftar", value: `${students.length}`, fg: "#2979ff", bg: "rgba(41, 121, 255, 0.12)" },
        { emoji: "🎯", label: "Rata-rata Tahap Selesai", value: `${fmtAvgDone} dari ${ROW_ORDER.length}`, fg: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
        { emoji: "📊", label: "Rata-rata Nilai", value: avg != null ? `${avg}%` : "—", fg: "#f59e0b", bg: "rgba(245, 158, 11, 0.14)" },
        { emoji: "🏆", label: "Nilai Tertinggi", value: best != null ? `${best}%` : "—", fg: "#ec4899", bg: "rgba(236, 72, 153, 0.12)" }
    ];

    const studentList = students.length ? students.map(s => {
        const c = studentDoneCount(s);
        const st = s.stat || {};
        const segs = stageRows(s).map(r => {
            const on = r.status === "completed";
            return `<span style="width: 14px; height: 8px; border-radius: 4px; background: ${
                on ? "#10b981" : "#1e293b"
            }; flex-shrink: 0;"></span>`;
        }).join("");
        return `
            <div style="display: flex; align-items: center; gap: 14px; padding: 14px 4px;
                border-bottom: 1px dashed var(--border-color);">
                <div style="width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; color: #fff; font-size: 1rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));">
                    ${(s.nama || "?").charAt(0).toUpperCase()}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 0.95rem;">${s.nama}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">
                        @${s.username} · Level ${st.level || 1}${st.xp ? " · " + st.xp + " XP" : ""}
                    </div>
                </div>
                <div style="display: flex; gap: 3px;">${segs}</div>
                <span style="font-weight: 800; font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap;">${c}/${ROW_ORDER.length}</span>
            </div>`;
    }).join("") : `
        <div style="padding: 18px 4px; color: var(--text-secondary); font-size: 0.9rem; text-align: center;">
            Belum ada akun siswa. Akun siswa dibuat oleh admin.
        </div>`;

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="card glass" style="display: flex; justify-content: space-between; align-items: center;
                gap: 20px; flex-wrap: wrap; background: linear-gradient(135deg, rgba(41, 121, 255, 0.10), rgba(0, 194, 243, 0.05)), var(--bg-card);">
                <div style="flex: 1; min-width: 240px;">
                    <h3 style="font-size: 1.4rem; margin-bottom: 6px;">🛡️ Selamat datang, Admin!</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; margin-bottom: 16px;">
                        Pantau perkembangan belajar ${students.length ? `${students.length} siswa` : "siswa"} di SIMORA.
                        Data dibaca langsung dari Supabase — setiap hasil tes siswa tersinkron otomatis.
                    </p>
                    <button class="btn-primary" data-target="admin-rekap" style="justify-content: center;">
                        Lihat Rekap Nilai
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
                <div style="font-size: 4.2rem; line-height: 1;">📈</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
                ${stats.map(s => `
                    <div class="card glass" style="display: flex; flex-direction: column; gap: 10px; padding: 20px;">
                        <div style="width: 44px; height: 44px; border-radius: 14px; background: ${s.bg};
                            display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">${s.emoji}</div>
                        <div>
                            <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-heading); color: ${s.fg}; line-height: 1.2;">${s.value}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-top: 2px;">${s.label}</div>
                        </div>
                    </div>`).join("")}
            </div>

            <div class="card glass">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                    <h3 style="margin-bottom: 0;">Perkembangan Siswa</h3>
                    <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">
                        ${done.length} tahap selesai${avg != null ? ` · rata-rata ${avg}%` : ""}
                    </span>
                </div>
                <div>${studentList}</div>
            </div>
        </div>
    `;
}

// ---------- Rekap ----------

export async function renderAdminRekap(app) {
    const container = document.getElementById("admin-rekap-container");
    if (!container) return;

    container.innerHTML = `<div style="color: var(--text-secondary); padding: 12px;">Menyiapkan data dari Supabase…</div>`;
    let students;
    try {
        students = await fetchAdminData();
    } catch (err) {
        console.error("Gagal ambil data admin:", err);
        container.innerHTML = `
            <div class="card glass" style="padding: 24px; color: var(--text-secondary); text-align: center;">
                Gagal memuat data siswa dari Supabase. Coba buka halaman ini lagi.
            </div>`;
        return;
    }

    const body = students.map((s, i) => {
        const stageCells = stageRows(s).map(r => {
            const attempts = (s.attempts && s.attempts[r.id]) || [];
            return `
            <td style="padding: 14px 10px; vertical-align: top; text-align: center; border-bottom: 1px solid var(--border-color);">
                <div style="font-weight: 800; font-size: 1.05rem; color: ${r.status === "completed" ? "var(--success)" : "var(--text-secondary)"};">${scoreText(r.score)}</div>
                <div style="margin-top: 6px;">${pill(r.status)}</div>
                ${attempts.length ? `
                <button class="btn-tes-action js-view-answers" data-uid="${s.id}" data-stage="${r.id}"
                    style="margin-top: 8px; padding: 5px 10px; font-size: 0.72rem;">
                    Lihat Jawaban${attempts.length > 1 ? ` (${attempts.length})` : ""}
                </button>` : ""}
            </td>`;
        }).join("");

        return `
        <tr>
            <td style="padding: 14px 10px; color: var(--text-muted); font-size: 0.85rem; text-align: center; border-bottom: 1px solid var(--border-color);">${i + 1}</td>
            <td style="padding: 14px 10px; border-bottom: 1px solid var(--border-color); min-width: 170px;">
                <div style="font-weight: 700; font-size: 0.92rem;">${s.nama}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">@${s.username}</div>
            </td>
            ${stageCells}
        </tr>`;
    }).join("");

    container.innerHTML = `
        <div class="card glass">
            <div style="margin-bottom: 8px;">
                <h3 style="margin-bottom: 4px;">Rekap Hasil Belajar</h3>
                <p style="color: var(--text-secondary); font-size: 0.82rem; margin: 0;">
                    ${students.length} siswa · 1 baris per siswa · nilai per tahap dari Supabase
                </p>
            </div>
            <div style="overflow-x: auto; margin-top: 12px;">
                <table style="width: 100%; border-collapse: collapse; min-width: 960px;">
                    <thead>
                        <tr style="text-align: left; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.6px;">
                            <th style="padding: 8px 10px; text-align: center;">No</th>
                            <th style="padding: 8px 10px;">Siswa</th>
                            ${ROW_ORDER.map(k => `
                            <th style="padding: 8px 10px; text-align: center;">${TAHAP_NAME[k]}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>${body || `
                        <tr><td colspan="7" style="padding: 20px; text-align: center; color: var(--text-secondary);">
                            Belum ada siswa. Akun siswa dibuat oleh admin.
                        </td></tr>`}</tbody>
                </table>
            </div>
        </div>
    `;

    // Klik "Lihat Jawaban" → modal detail pengerjaan siswa.
    container.querySelectorAll(".js-view-answers").forEach((btn) => {
        btn.addEventListener("click", () => {
            const st = students.find(x => x.id === btn.dataset.uid);
            if (st) openAttemptsModal(st, btn.dataset.stage);
        });
    });
}

// ---------- Detail Jawaban Siswa (modal) ----------

function fmtAnswerLines(ans) {
    const a = ans || {};
    const row = (l, v) => v ? `<div style="margin: 0 0 8px; font-size: 0.85rem; line-height: 1.6;"><strong>${l}:</strong> ${v}</div>` : "";
    const list = (l, arr) => (arr && arr.length) ? `<div style="margin: 0 0 8px; font-size: 0.85rem; line-height: 1.6;"><strong>${l}:</strong> ${arr.map(x => typeof x === "string" ? x : (x.nama ? x.nama + (x.point ? ` — ${x.point}` : "") : JSON.stringify(x))).join("; ")}</div>` : "";

    if (a.jenis === "notula") {
        return row("Agenda Rapat", a.agenda)
            + row("Hari/Tanggal", a.tanggal) + row("Waktu", a.waktu) + row("Tempat", a.tempat)
            + row("Pemimpin Rapat", a.pemimpin) + row("Notulis", a.notulis)
            + list("Peserta", a.peserta) + list("Susunan Acara", a.susunanAcara)
            + list("Isi Rapat", a.isiRapat) + row("Penutup/Hasil", a.penutup);
    }
    if (a.jenis === "kuiz") {
        const per = (Array.isArray(a.perSoal) ? a.perSoal : []).map((s, i) => `
            <div style="padding: 8px 10px; border-radius: 10px; background: var(--bg-main); margin-bottom: 8px;">
                <div style="font-weight: 700; margin-bottom: 4px;">${i + 1}. ${s.soal || ""}</div>
                <div style="color: ${s.benar ? "var(--success)" : "var(--danger)"}; font-weight: 700;">
                    ${s.benar ? "✓" : "✗"} ${s.opsi ?? "(tidak dijawab)"}
                </div>
            </div>`).join("");
        return per || "<div>Kosong</div>";
    }
    return `<pre style="white-space: pre-wrap; font-size: 0.8rem; margin: 0;">${JSON.stringify(a, null, 2)}</pre>`;
}

function openAttemptsModal(student, stageKey) {
    const list = (student.attempts && student.attempts[stageKey]) || [];
    if (!list.length) return;
    const title = TAHAP_NAME[stageKey] || stageKey;
    const body = list.map((at, i) => `
        <div style="border: 1px dashed var(--border-color); border-radius: 14px; padding: 14px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                <strong>${title} · Pengerjaan ${list.length - i}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted);">
                    ${at.score != null ? `${at.score}%` : ""}${at.created_at ? ` · ${tglLabel(at.created_at)}` : ""}
                </span>
            </div>
            ${fmtAnswerLines(at.answers)}
        </div>`).join("");

    const overlay = document.createElement("div");
    overlay.style.cssText = "position: fixed; inset: 0; background: rgba(2, 6, 23, 0.7); display: flex; align-items: center; justify-content: center; z-index: 20000; padding: 20px;";
    overlay.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 18px;
            max-width: 620px; width: 100%; max-height: 82vh; overflow-y: auto; padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 10px;">
                <h3 style="margin: 0;">Jawaban — ${student.nama} · ${title}</h3>
                <button class="btn-tes-action" data-close style="padding: 8px 14px;">Tutup</button>
            </div>
            ${body}
        </div>`;
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.closest("[data-close]")) close();
    });
    document.body.appendChild(overlay);
}

// Pop-up konfirmasi hapus akun siswa. Progres siswa ikut terhapus permanen.
function confirmHapusAkun(userId, nama, onDone) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position: fixed; inset: 0; background: rgba(2, 6, 23, 0.7); display: flex; align-items: center; justify-content: center; z-index: 20000; padding: 20px;";
    overlay.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 18px;
            max-width: 420px; width: 100%; padding: 24px; text-align: center;">
            <div style="width: 52px; height: 52px; margin: 0 auto 14px; border-radius: 50%;
                background: rgba(244, 63, 94, 0.12); color: var(--danger);
                display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <h3 style="margin-bottom: 8px;">Hapus akun "${nama}"?</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.7; margin-bottom: 20px;">
                Seluruh progres belajar, rekap nilai, dan jawaban siswa ini akan
                <strong style="color: var(--danger);">dihapus permanen</strong>. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn-tes-action" data-close style="padding: 11px 18px;">Batal</button>
                <button class="btn-primary js-confirm-del" data-id="${userId}"
                    style="justify-content: center; background: var(--danger); border-color: var(--danger); padding: 11px 18px;">
                    Hapus Akun
                </button>
            </div>
        </div>`;

    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.closest("[data-close]")) close();
    });

    overlay.querySelector(".js-confirm-del").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.textContent = "Menghapus…";
        try {
            const { data, error } = await getClient().rpc("hapus_siswa", {
                p_user_id: e.currentTarget.dataset.id
            });
            if (error) throw error;
            if (!data) throw new Error("Fungsi hapus_siswa belum ada di database. Jalankan migration 0003.");
            showToast("Akun siswa berhasil dihapus.", "success");
            close();
            if (onDone) await onDone();
        } catch (err) {
            console.error("Gagal hapus akun:", err);
            showToast(err.message || "Gagal menghapus akun", "error");
            btn.disabled = false;
            btn.textContent = "Hapus Akun";
        }
    });

    document.body.appendChild(overlay);
}

// Pop-up form tambah akun siswa — window terpisah yang bisa ditutup.
function openFormTambahSiswa(onCreated) {
    if (document.getElementById("overlay-form-siswa")) return;

    const overlay = document.createElement("div");
    overlay.id = "overlay-form-siswa";
    overlay.style.cssText = "position: fixed; inset: 0; background: rgba(2, 6, 23, 0.7); display: flex; align-items: center; justify-content: center; z-index: 20000; padding: 20px;";
    overlay.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 18px;
            max-width: 460px; width: 100%; max-height: 86vh; overflow-y: auto; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 6px;">
                <h3 style="margin: 0;">➕ Tambah Akun Siswa</h3>
                <button class="btn-tes-action" data-close style="padding: 8px 14px;" aria-label="Tutup">✕</button>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 18px;">
                Akun dibuat di Supabase Auth — siswa langsung bisa login dengan username & password ini.
            </p>
            <form id="form-create-siswa" style="display: flex; flex-direction: column; gap: 14px;">
                <div>
                    <label for="inp-siswa-nama" style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 6px;">Nama Lengkap</label>
                    <input id="inp-siswa-nama" class="form-input" type="text" placeholder="cth: Siti Lestiani" required>
                </div>
                <div>
                    <label for="inp-siswa-username" style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 6px;">Username</label>
                    <input id="inp-siswa-username" class="form-input" type="text" placeholder="cth: lestiani" autocomplete="off" required>
                </div>
                <div>
                    <label for="inp-siswa-password" style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 6px;">Password</label>
                    <input id="inp-siswa-password" class="form-input" type="text" placeholder="minimal 6 karakter" autocomplete="off" required minlength="6">
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 4px;">
                    <button type="button" class="btn-tes-action" data-close style="padding: 11px 18px;">Batal</button>
                    <button type="submit" class="btn-primary" style="justify-content: center; padding: 11px 18px;">
                        Buat Akun Siswa
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </form>
        </div>`;

    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.closest("[data-close]")) close();
    });

    overlay.querySelector("#form-create-siswa").addEventListener("submit", async (e) => {
        e.preventDefault();
        const nama = document.getElementById("inp-siswa-nama").value.trim();
        const username = document.getElementById("inp-siswa-username").value.trim();
        const password = document.getElementById("inp-siswa-password").value;
        const btn = e.currentTarget.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = "Membuat akun…";
        try {
            const { data, error } = await getClient().rpc("create_siswa", {
                p_username: username,
                p_nama: nama,
                p_password: password
            });
            if (error) throw error;
            if (!data) throw new Error("Fungsi create_siswa belum ada di database. Jalankan migration 0002.");
            showToast(`Akun "${username}" berhasil dibuat!`, "success");
            close();
            if (onCreated) await onCreated();
        } catch (err) {
            console.error("Gagal buat akun:", err);
            showToast(err.message || "Gagal membuat akun", "error");
            btn.disabled = false;
            btn.innerHTML = 'Buat Akun Siswa <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    });

    document.body.appendChild(overlay);
}

// ---------- Kelola Siswa (admin membuat akun siswa via RPC) ----------

export async function renderAdminSiswa(app) {
    const container = document.getElementById("admin-siswa-container");
    if (!container) return;

    const draw = async () => {
        container.innerHTML = `<div style="color: var(--text-secondary); padding: 12px;">Memuat data siswa…</div>`;
        let students;
        try {
            students = await fetchAdminData();
        } catch (err) {
            console.error("Gagal ambil data siswa:", err);
            container.innerHTML = `
                <div class="card glass" style="padding: 24px; color: var(--text-secondary); text-align: center;">
                    Gagal memuat data siswa dari Supabase. Coba buka halaman ini lagi.
                </div>`;
            return;
        }

        const rows = students.map((s, i) => `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px 10px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">${i + 1}</td>
                <td style="padding: 12px 10px; font-weight: 700; font-size: 0.92rem;">${s.nama}</td>
                <td style="padding: 12px 10px; color: var(--text-secondary); font-size: 0.85rem;">@${s.username}</td>
                <td style="padding: 12px 10px; color: var(--text-secondary); font-size: 0.85rem;">${s.dibuat || "—"}</td>
                <td style="padding: 12px 10px; font-weight: 800; text-align: center; color: var(--success);">${studentDoneCount(s)}/5</td>
                <td style="padding: 12px 10px; text-align: center;">
                    <button class="btn-icon-hapus js-del-siswa" data-id="${s.id}" data-nama="${s.nama}"
                        title="Hapus akun ${s.nama}" aria-label="Hapus akun"
                        style="width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(244, 63, 94, 0.3);
                            background: rgba(244, 63, 94, 0.1); color: var(--danger); cursor: pointer;
                            display: inline-flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </td>
            </tr>`).join("");

        container.innerHTML = `
            <div class="card glass">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 12px; flex-wrap: wrap;">
                    <h3 style="margin-bottom: 0;">Daftar Siswa</h3>
                    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">${students.length} akun</span>
                        <button class="btn-primary" id="btn-toggle-form-siswa" style="padding: 10px 16px; justify-content: center;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 5v14M5 12h14"/></svg>
                            Tambah Akun Siswa
                        </button>
                    </div>
                </div>
                <div style="overflow-x: auto; margin-top: 12px;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 520px;">
                        <thead>
                            <tr style="text-align: left; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.6px;">
                                <th style="padding: 8px 10px; text-align: center;">No</th>
                                <th style="padding: 8px 10px;">Nama</th>
                                <th style="padding: 8px 10px;">Username</th>
                                <th style="padding: 8px 10px;">Dibuat</th>
                                <th style="padding: 8px 10px; text-align: center;">Tahap Selesai</th>
                                <th style="padding: 8px 10px; text-align: center;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>${rows || `
                            <tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-secondary);">
                                Belum ada siswa. Klik "Tambah Akun Siswa" untuk membuat akun pertama.
                            </td></tr>`}</tbody>
                    </table>
                </div>
            </div>
        `;

        const addBtn = document.getElementById("btn-toggle-form-siswa");
        if (addBtn) {
            addBtn.addEventListener("click", () => openFormTambahSiswa(draw));
        }

        // Hapus akun siswa (dengan pop-up konfirmasi).
        container.querySelectorAll(".js-del-siswa").forEach((btn) => {
            btn.addEventListener("click", () => {
                confirmHapusAkun(btn.dataset.id, btn.dataset.nama, draw);
            });
        });
    };

    await draw();
}
