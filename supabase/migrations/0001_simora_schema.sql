-- ============================================================
-- SIMORA - Migration 0001: skema backend + RLS + seed awal
-- Jalankan sekali di Supabase Dashboard > SQL Editor.
-- Isi: tabel data siswa, progres, bank soal, materi, referensi,
--      fungsi & trigger profil otomatis, seed admin + siswa + soal.
-- ============================================================

-- ---------- TABEL ----------

-- Profil & role user (1:1 dengan auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    role text not null default 'siswa' check (role in ('siswa', 'admin')),
    username text not null unique,
    nama text not null,
    created_at timestamptz not null default now()
);

-- Statistik gamifikasi per user
create table if not exists public.user_stats (
    user_id uuid primary key references public.profiles (id) on delete cascade,
    level int not null default 1,
    xp int not null default 0,
    xp_needed int not null default 100,
    streak int not null default 0,
    updated_at timestamptz not null default now()
);

-- Status tiap tahap belajar per user (beginner, practice-l1..l3, expert)
create table if not exists public.stage_progress (
    user_id uuid not null references public.profiles (id) on delete cascade,
    stage_key text not null check (stage_key in ('beginner', 'practice-l1', 'practice-l2', 'practice-l3', 'expert')),
    status text not null default 'locked' check (status in ('locked', 'unlocked', 'completed')),
    score int,
    done_at timestamptz,
    updated_at timestamptz not null default now(),
    primary key (user_id, stage_key)
);

-- Riwayat pengerjaan (jawaban detail per submit)
create table if not exists public.attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade,
    stage_key text not null,
    answers jsonb,
    score int,
    created_at timestamptz not null default now()
);

-- Bank soal (admin CRUD)
create table if not exists public.questions (
    id serial primary key,
    stage_key text not null,
    question text not null,
    options jsonb not null,
    answer int not null,
    explain text default '',
    difficulty text default 'mudah',
    urutan int not null default 0,
    active boolean not null default true
);

-- Materi belajar dinamis (admin CRUD)
create table if not exists public.materi (
    id serial primary key,
    section text not null default 'beginner',
    title text not null,
    content text not null,
    urutan int not null default 0,
    active boolean not null default true
);

-- Daftar referensi (admin CRUD)
create table if not exists public.referensi (
    id serial primary key,
    tipe text not null default 'buku' check (tipe in ('video', 'buku')),
    title text not null,
    sumber text,
    url text,
    keterangan text,
    active boolean not null default true
);

-- ---------- HELPER ROLES ----------

-- Cek apakah user yang login berperan admin (security definer: bebas RLS, tak ada rekursi).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
    );
$$;

-- ---------- TRIGGER PROFIL OTOMATIS ----------

-- Saat auth user dibuat, buat baris profiles + user_stats.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_role text;
    v_username text;
    v_nama text;
begin
    v_role := coalesce(new.raw_user_meta_data ->> 'role', 'siswa');
    v_username := coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1));
    v_nama := coalesce(nullif(new.raw_user_meta_data ->> 'nama', ''), v_username);

    insert into public.profiles (id, role, username, nama)
    values (new.id, v_role, v_username, v_nama)
    on conflict (id) do nothing;

    insert into public.user_stats (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- RLS ----------

alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.stage_progress enable row level security;
alter table public.attempts enable row level security;
alter table public.questions enable row level security;
alter table public.materi enable row level security;
alter table public.referensi enable row level security;

-- Hapus policy lama dulu agar file aman dijalankan ulang.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;
drop policy if exists "profiles_delete_admin" on public.profiles;
drop policy if exists "user_stats_select_own_or_admin" on public.user_stats;
drop policy if exists "user_stats_insert_own" on public.user_stats;
drop policy if exists "user_stats_update_own" on public.user_stats;
drop policy if exists "stage_progress_select_own_or_admin" on public.stage_progress;
drop policy if exists "stage_progress_insert_own" on public.stage_progress;
drop policy if exists "stage_progress_update_own" on public.stage_progress;
drop policy if exists "stage_progress_delete_own" on public.stage_progress;
drop policy if exists "attempts_select_own_or_admin" on public.attempts;
drop policy if exists "attempts_insert_own" on public.attempts;
drop policy if exists "questions_select_active_or_admin" on public.questions;
drop policy if exists "questions_insert_admin" on public.questions;
drop policy if exists "questions_update_admin" on public.questions;
drop policy if exists "questions_delete_admin" on public.questions;
drop policy if exists "materi_select_active_or_admin" on public.materi;
drop policy if exists "materi_insert_admin" on public.materi;
drop policy if exists "materi_update_admin" on public.materi;
drop policy if exists "materi_delete_admin" on public.materi;
drop policy if exists "referensi_select_active_or_admin" on public.referensi;
drop policy if exists "referensi_insert_admin" on public.referensi;
drop policy if exists "referensi_update_admin" on public.referensi;
drop policy if exists "referensi_delete_admin" on public.referensi;

-- profiles: user bisa baca dirinya; admin baca semua & kelola
create policy "profiles_select_own_or_admin" on public.profiles
    for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_admin" on public.profiles
    for update using (public.is_admin());
create policy "profiles_delete_admin" on public.profiles
    for delete using (public.is_admin());

-- user_stats: tulis/baca sendiri; admin baca semua
create policy "user_stats_select_own_or_admin" on public.user_stats
    for select using (auth.uid() = user_id or public.is_admin());
create policy "user_stats_insert_own" on public.user_stats
    for insert with check (auth.uid() = user_id);
create policy "user_stats_update_own" on public.user_stats
    for update using (auth.uid() = user_id);

-- stage_progress: siswa kelola progresnya sendiri; admin baca semua
create policy "stage_progress_select_own_or_admin" on public.stage_progress
    for select using (auth.uid() = user_id or public.is_admin());
create policy "stage_progress_insert_own" on public.stage_progress
    for insert with check (auth.uid() = user_id);
create policy "stage_progress_update_own" on public.stage_progress
    for update using (auth.uid() = user_id);
create policy "stage_progress_delete_own" on public.stage_progress
    for delete using (auth.uid() = user_id);

-- attempts: siswa simpan & baca riwayatnya; admin baca semua
create policy "attempts_select_own_or_admin" on public.attempts
    for select using (auth.uid() = user_id or public.is_admin());
create policy "attempts_insert_own" on public.attempts
    for insert with check (auth.uid() = user_id);

-- questions: siswa baca soal aktif; admin kelola semua
create policy "questions_select_active_or_admin" on public.questions
    for select using (active = true or public.is_admin());
create policy "questions_insert_admin" on public.questions
    for insert with check (public.is_admin());
create policy "questions_update_admin" on public.questions
    for update using (public.is_admin());
create policy "questions_delete_admin" on public.questions
    for delete using (public.is_admin());

-- materi: siswa baca aktif; admin kelola semua
create policy "materi_select_active_or_admin" on public.materi
    for select using (active = true or public.is_admin());
create policy "materi_insert_admin" on public.materi
    for insert with check (public.is_admin());
create policy "materi_update_admin" on public.materi
    for update using (public.is_admin());
create policy "materi_delete_admin" on public.materi
    for delete using (public.is_admin());

-- referensi: siswa baca aktif; admin kelola semua
create policy "referensi_select_active_or_admin" on public.referensi
    for select using (active = true or public.is_admin());
create policy "referensi_insert_admin" on public.referensi
    for insert with check (public.is_admin());
create policy "referensi_update_admin" on public.referensi
    for update using (public.is_admin());
create policy "referensi_delete_admin" on public.referensi
    for delete using (public.is_admin());

-- ---------- SEED: AKUN AWAL ----------
-- Admin:  admin / admin123
-- Siswa:  siswa / siswa123  (akun contoh; akun lain dibuat admin)

-- Auth.users tidak punya constraint unique sederhana di email, jadi tak bisa
-- pakai ON CONFLICT. Guard manual: hanya insert bila email belum ada.
insert into auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
     raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
select
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'admin@simora.local', crypt('admin123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"admin","nama":"Admin SIMORA","role":"admin"}'::jsonb, now(), now()
where not exists (select 1 from auth.users where email = 'admin@simora.local');

insert into auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
     raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
select
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'siswa@simora.local', crypt('siswa123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"siswa","nama":"Siswa Demo","role":"siswa"}'::jsonb, now(), now()
where not exists (select 1 from auth.users where email = 'siswa@simora.local');

-- ---------- SEED: BANK SOAL (dari isi aplikasi lama) ----------

insert into public.questions (stage_key, question, options, answer, explain, difficulty, urutan)
select * from (values
-- BEGINNER (3 soal)
('beginner',
 'Manakah sintaks pendeklarasian variabel di JavaScript yang bernilai konstan?',
 jsonb_build_array('const pi = 3.14;', 'let pi = 3.14;', 'var pi = 3.14;', 'pi := 3.14;'),
 0,
 'const digunakan untuk mendeklarasikan variabel bernilai tetap (konstan) yang nilainya tidak dapat diubah setelah inisialisasi.',
 'mudah', 1),
('beginner',
 'Manakah nilai yang bertipe data Boolean?',
 jsonb_build_array($$'true'$$, 'true', '1', 'null'),
 1,
 'Tipe data Boolean hanya memiliki dua nilai literal: true atau false (tanpa tanda kutip).',
 'mudah', 2),
('beginner',
 'Tipe data apakah yang dihasilkan dari kode berikut: let nama = ''SIMORA'';?',
 jsonb_build_array('Number', 'Boolean', 'String', 'Object'),
 2,
 'Karakter yang diapit tanda kutip tunggal atau ganda didefinisikan sebagai tipe data String.',
 'mudah', 3),

-- LATIHAN 1 (3 soal)
('practice-l1',
 'Apa yang dimaksud dengan notula rapat?',
 jsonb_build_array('Daftar hadir peserta rapat', 'Catatan singkat mengenai jalannya rapat beserta keputusan yang diambil', 'Undangan resmi untuk mengadakan rapat', 'Susunan acara rapat'),
 1,
 'Notula adalah catatan singkat mengenai jalannya rapat, termasuk hal-hal yang dibicarakan dan diputuskan.',
 'mudah', 1),
('practice-l1',
 'Manakah fungsi utama notula rapat?',
 jsonb_build_array('Sebagai hiasan administrasi kantor', 'Sebagai bukti bahwa rapat telah dilaksanakan', 'Sebagai pengganti undangan rapat', 'Sebagai daftar gaji karyawan'),
 1,
 'Notula berfungsi sebagai bukti bahwa rapat telah diadakan sekaligus pegangan bersama dalam pelaksanaan keputusan.',
 'mudah', 2),
('practice-l1',
 'Berikut ini yang BUKAN merupakan fungsi notula rapat adalah...',
 jsonb_build_array('Dokumen resmi pembahasan dan keputusan rapat', 'Alat evaluasi pencapaian tujuan rapat', 'Bahan pertimbangan untuk rapat selanjutnya', 'Pembatas ruang rapat'),
 3,
 'Notula berfungsi sebagai dokumen resmi, bukti rapat, pegangan bersama, bahan pertimbangan, dan alat evaluasi - bukan pembatas ruang rapat.',
 'mudah', 3),

-- LATIHAN 2 (3 soal)
('practice-l2',
 'Bagian mana yang wajib ada dalam format notula rapat?',
 jsonb_build_array('Hari/tanggal, waktu, tempat, dan peserta rapat', 'Jumlah peserta undangan yang tidak hadir', 'Warna pakaian ketua rapat', 'Riwayat pendidikan notulis'),
 0,
 'Format notula memuat identitas rapat seperti hari/tanggal, waktu, tempat, peserta, agenda, serta hasil dan keputusan rapat.',
 'sedang', 1),
('practice-l2',
 'Apa yang dimaksud dengan kuorum dalam rapat?',
 jsonb_build_array('Jumlah minimal peserta agar rapat sah', 'Pengambilan keputusan lewat suara terbanyak', 'Penundaan sementara jalannya rapat', 'Catatan singkat jalannya rapat'),
 0,
 'Kuorum adalah jumlah minimal peserta yang harus hadir agar rapat dianggap sah.',
 'sedang', 2),
('practice-l2',
 'Istilah yang tepat untuk pengambilan keputusan lewat suara terbanyak adalah...',
 jsonb_build_array('Kuorum', 'Voting', 'Skorsing', 'Notulensi'),
 1,
 'Voting adalah pengambilan keputusan melalui suara terbanyak.',
 'sedang', 3),

-- LATIHAN 3 (3 soal)
('practice-l3',
 'Dalam mencatat jalannya rapat, hal yang paling penting dicatat adalah...',
 jsonb_build_array('Seluruh ucapan pembicara kata demi kata', 'Inti pembicaraan, keputusan, dan hal-hal penting', 'Candaan peserta rapat', 'Jam kedatangan setiap peserta'),
 1,
 'Notulis cukup mencatat inti pembicaraan, fokus pada hal penting dan keputusan - bukan kata demi kata.',
 'sedang', 1),
('practice-l3',
 'Sikap yang harus dimiliki seorang notulis saat rapat adalah...',
 jsonb_build_array('Memihak pendapat teman', 'Objektif dan netral', 'Berbicara paling banyak', 'Meninggalkan rapat lebih awal'),
 1,
 'Notulis harus tetap objektif dan netral, tidak memihak salah satu pendapat.',
 'sedang', 2),
('practice-l3',
 'Setelah rapat selesai, langkah notulis selanjutnya adalah...',
 jsonb_build_array('Langsung pulang tanpa mencatat apa pun', 'Merapikan catatan menjadi notula yang jelas dan mudah dipahami', 'Mengirim undangan rapat baru', 'Menghapus seluruh catatan rapat'),
 1,
 'Setelah rapat, notulis merapikan catatan menjadi notula yang jelas, dengan keputusan dan kesimpulan yang tegas.',
 'sedang', 3),

-- EXPERT (10 soal)
('expert',
 'Apa pengertian notula rapat yang paling tepat?',
 jsonb_build_array('Undangan resmi untuk menghadiri rapat', 'Catatan singkat mengenai jalannya rapat serta hal yang dibicarakan dan diputuskan', 'Daftar hadir peserta rapat', 'Laporan keuangan hasil rapat'),
 1, '', 'sulit', 1),
('expert',
 'Notula berfungsi sebagai bukti bahwa rapat telah dilaksanakan. Apa manfaat lain dari fungsi ini?',
 jsonb_build_array('Menjadi tolok ukur/manometer kesuksesan rapat', 'Mengganti kehadiran peserta yang tidak hadir', 'Menentukan siapa yang menjadi ketua rapat', 'Menjadi undangan rapat berikutnya'),
 0, '', 'sulit', 2),
('expert',
 'Berikut ini yang BUKAN termasuk fungsi notula rapat adalah...',
 jsonb_build_array('Dokumen resmi pembahasan dan keputusan rapat', 'Alat evaluasi pencapaian tujuan rapat', 'Menentukan gaji karyawan yang hadir', 'Pegangan bersama pelaksanaan keputusan rapat'),
 2, '', 'sulit', 3),
('expert',
 'Notula sangat diperlukan supaya semua keputusan rapat dapat dijadikan pegangan bersama untuk...',
 jsonb_build_array('Pelaksanaan tindak lanjut rapat', 'Menentukan siapa yang salah dalam rapat', 'Menilai kinerja notulis', 'Mengganti agenda rapat berikutnya'),
 0, '', 'sulit', 4),
('expert',
 'Hal yang perlu dilakukan notulis SEBELUM rapat berlangsung adalah...',
 jsonb_build_array('Membacakan hasil rapat', 'Memperoleh informasi latar belakang materi yang akan dibahas', 'Menandatangani notula', 'Membagikan dokumen ke peserta'),
 1, '', 'sulit', 5),
('expert',
 'Istilah "skorsing" dalam rapat berarti...',
 jsonb_build_array('Jumlah minimal peserta agar rapat sah', 'Penundaan sementara jalannya rapat', 'Cara pengambilan keputusan lewat suara terbanyak', 'Instruksi pimpinan atas suatu dokumen'),
 1, '', 'sulit', 6),
('expert',
 'Kenapa notulis perlu memahami istilah/bahasa teknis yang dibahas dalam rapat?',
 jsonb_build_array('Supaya bisa jadi pemimpin rapat berikutnya', 'Agar tidak salah mencatat maksud pembicaraan dan keputusan rapat', 'Agar terlihat lebih profesional di depan peserta', 'Supaya rapat selesai lebih cepat'),
 1, '', 'sulit', 7),
('expert',
 'Apa nama bagi orang yang menjadi pembuat notula rapat?',
 jsonb_build_array('Notuler', 'Notulis', 'Notulen', 'Sekretaris'),
 1, '', 'sulit', 8),
('expert',
 'Apa yang sebaiknya dilakukan notulis setelah rapat selesai?',
 jsonb_build_array('Membiarkan catatan apa adanya tanpa dirapikan', 'Merapikan catatan menjadi notula yang jelas dan memastikan keputusan tertulis tegas', 'Menghapus catatan karena sudah tidak diperlukan', 'Menunggu notulis lain untuk menyelesaikannya'),
 1, '', 'sulit', 9),
('expert',
 'Notula ditandatangani oleh pihak-pihak berikut, KECUALI...',
 jsonb_build_array('Ketua rapat', 'Notulis', 'Sekretaris', 'Seluruh peserta rapat tanpa terkecuali'),
 3, '', 'sulit', 10)
) as seed(stage_key, question, options, answer, explain, difficulty, urutan)
where not exists (select 1 from public.questions);
