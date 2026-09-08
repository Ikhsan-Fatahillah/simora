/**
 * SIMORA - Client Supabase (frontend).
 * Pakai publishable key saja. Semua akses dijaga RLS di database.
 * Secret/service key TIDAK pernah ada di sisi browser.
 *
 * supabase-js dimuat via CDN (lihat index.html), global: window.supabase.
 */
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, emailForUsername } from "./config.js";

let client = null;

export function getClient() {
    if (client) return client;
    if (!window.supabase || !window.supabase.createClient) {
        throw new Error("supabase-js belum dimuat. Cek tag script CDN di index.html.");
    }
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return client;
}

// Login memakai username (di-backend: email virtual {username}@simora.local)
export async function signInWithUsername(username, password) {
    const sb = getClient();
    const { data, error } = await sb.auth.signInWithPassword({
        email: emailForUsername(username),
        password
    });
    if (error) throw error;
    return data;
}

export async function signOutCurrentUser() {
    const sb = getClient();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
}

export function getSession() {
    const sb = getClient();
    return sb.auth.getSession();
}

export function onAuthChange(callback) {
    const sb = getClient();
    return sb.auth.onAuthStateChange(callback);
}

// Profil (nama, role) dari tabel profiles untuk user yang sedang login.
export async function fetchCurrentProfile() {
    const sb = getClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;

    const { data, error } = await sb
        .from("profiles")
        .select("id, role, username, nama")
        .eq("id", user.id)
        .maybeSingle();
    if (error) throw error;
    return data;
}

export async function isAdmin() {
    const profile = await fetchCurrentProfile();
    return !!profile && profile.role === "admin";
}

// ============ Sinkronisasi data siswa (progres, stats, soal) ============

function fmtTgl(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export async function currentDbUserId() {
    const { data: { user } } = await getClient().auth.getUser();
    return user ? user.id : null;
}

// Tarik stats + progres siswa dari DB ke state lokal (panggil saat boot/login).
export async function pullSiswaState(stored) {
    const uid = await currentDbUserId();
    if (!uid) return stored;
    const sb = getClient();
    try {
        const [{ data: st, error: se }, { data: pr, error: pe }] = await Promise.all([
            sb.from("user_stats").select("*").eq("user_id", uid).maybeSingle(),
            sb.from("stage_progress").select("*").eq("user_id", uid)
        ]);
        if (!se && st) {
            stored.user = Object.assign({}, stored.user, {
                level: st.level, xp: st.xp, xpNeeded: st.xp_needed, streak: st.streak
            });
        }
        if (!pe && Array.isArray(pr)) {
            for (const r of pr) {
                const lv = stored.tests && stored.tests[r.stage_key];
                if (!lv) continue;
                lv.status = r.status;
                if (typeof r.score === "number") lv.score = r.score;
                const d = fmtTgl(r.done_at);
                if (d) lv.date = d;
            }
        }
    } catch (err) {
        console.warn("Gagal tarik state dari Supabase:", err);
    }
    return stored;
}

// Kirim hasil tes: status semua stage (selesai/terbuka) + attempt + stats.
// Dipanggil sekali di tiap titik "tes selesai". Aman offline: gagal hanya console.warn.
export async function pushSiswaResult(stored, { levelId, score, completed, answers }) {
    const uid = await currentDbUserId();
    if (!uid || !completed) return;
    const sb = getClient();

    const rows = [];
    const STAGE_KEYS = ["beginner", "practice-l1", "practice-l2", "practice-l3", "expert"];
    for (const k of STAGE_KEYS) {
        const lv = stored.tests && stored.tests[k];
        if (!lv) continue;
        rows.push({
            stage_key: k,
            status: lv.status,
            score: typeof lv.score === "number" ? lv.score : null,
            done_at: k === levelId && completed ? new Date().toISOString() : (lv.date ? new Date().toISOString() : null)
        });
    }
    for (const r of rows) {
        try {
            const { error } = await sb.from("stage_progress")
                .upsert({ user_id: uid, ...r }, { onConflict: "user_id,stage_key" });
            if (error) console.warn("gagal simpan stage", r.stage_key, error.message);
        } catch (e) { console.warn(e); }
    }

    try {
        await sb.from("attempts").insert({
            user_id: uid,
            stage_key: levelId,
            score: score ?? null,
            answers: answers && (Array.isArray(answers) ? answers.length > 0 : true) ? answers : null
        });
    } catch (e) { console.warn("gagal simpan attempt:", e); }

    const u = stored.user || {};
    try {
        await sb.from("user_stats").upsert(
            { user_id: uid, level: u.level || 1, xp: u.xp || 0, xp_needed: u.xpNeeded || 100, streak: u.streak || 0 },
            { onConflict: "user_id" }
        );
    } catch (e) { console.warn("gagal simpan stats:", e); }
}

// Simpan satu baris riwayat pengerjaan tanpa menyentuh status stage/stats.
// Dipakai untuk yang log-nya terpisah dari penyelesaian tahap (mis. kuis Expert).
export async function logAttempt(stageKey, answers, score = null) {
    const uid = await currentDbUserId();
    if (!uid) return;
    try {
        await getClient().from("attempts").insert({
            user_id: uid,
            stage_key: stageKey,
            score,
            answers
        });
    } catch (e) {
        console.warn("gagal log attempt:", e);
    }
}

// Muat bank soal dari DB ke state (ganti soal embed). Fallback: soal lokal tetap.
export async function preloadSoal(stored) {
    const uid = await currentDbUserId();
    if (!uid) return stored;
    try {
        const { data, error } = await getClient()
            .from("questions")
            .select("stage_key,question,options,answer,explain")
            .order("urutan", { ascending: true });
        if (error || !data || !data.length) return stored;
        const grouped = {};
        for (const q of data) {
            (grouped[q.stage_key] = grouped[q.stage_key] || []).push({
                q: q.question,
                options: q.options,
                answer: q.answer,
                explain: q.explain || ""
            });
        }
        for (const [k, list] of Object.entries(grouped)) {
            const lv = stored.tests && stored.tests[k];
            if (lv && list.length) lv.questions = list;
        }
    } catch (e) {
        console.warn("preload soal gagal:", e);
    }
    return stored;
}
