/**
 * SIMORA - Konfigurasi Supabase (frontend).
 * Hanya memuat nilai PUBLIK dari documents/.env.
 * Jangan pernah menaruh secret/service key di sini (file ini dikirim ke browser).
 */
export const SUPABASE_URL = "https://yzdkdbzxzlljqndmmeht.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_p5smVIQ5GmA2pTD7Uw8fXg_Of2w4gLr";

// Email virtual dipakai login: {username}@simora.local
export const EMAIL_DOMAIN = "simora.local";

export function emailForUsername(username) {
    const u = String(username || "").trim().toLowerCase();
    return `${u}@${EMAIL_DOMAIN}`;
}

export function usernameFromEmail(email) {
    return String(email || "").split("@")[0];
}
