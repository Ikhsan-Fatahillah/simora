-- ============================================================
-- SIMORA - Migration 0002: Admin membuat akun siswa
-- Jalankan di Supabase Dashboard > SQL Editor.
-- Fungsi security definer (berjalan sebagai postgres) sehingga
-- admin cukup pakai publishable key via RPC — secret key TIDAK
-- pernah dibutuhkan dari frontend.
-- ============================================================

drop function if exists public.create_siswa(text, text, text);

create or replace function public.create_siswa(
    p_username text,
    p_nama text,
    p_password text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_username text;
    v_email text;
    v_uid uuid;
    v_instance uuid;
    r record;
begin
    -- Hanya admin yang boleh memanggil
    if not public.is_admin() then
        raise exception 'Hanya admin yang boleh membuat akun siswa';
    end if;

    v_username := lower(btrim(p_username));
    v_email := v_username || '@simora.local';

    if v_username = '' or p_nama is null or btrim(p_nama) = '' then
        raise exception 'Nama dan username wajib diisi';
    end if;
    if p_password is null or length(p_password) < 6 then
        raise exception 'Password minimal 6 karakter';
    end if;

    if exists (select 1 from public.profiles where username = v_username)
       or exists (select 1 from auth.users where lower(email) = v_email) then
        raise exception 'Username sudah dipakai, pilih username lain';
    end if;

    v_uid := gen_random_uuid();
    select instance_id into v_instance from auth.users limit 1;

    insert into auth.users
        (id, instance_id, aud, role, email, encrypted_password,
         email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
         created_at, updated_at)
    values
        (v_uid, v_instance, 'authenticated', 'authenticated', v_email,
         extensions.crypt(p_password, extensions.gen_salt('bf')),
         now(),
         '{"provider": "email", "providers": ["email"]}',
         jsonb_build_object('username', v_username, 'nama', btrim(p_nama), 'role', 'siswa'),
         now(), now());

    -- Kolom teks nullable lain diisi '' (GoTrue butuh string, bukan NULL).
    -- Kecuali kolom unique: phone & email.
    for r in
        select column_name
        from information_schema.columns
        where table_schema = 'auth' and table_name = 'users'
          and data_type in ('text', 'character varying')
          and is_nullable = 'YES'
          and column_name not in ('phone', 'email')
    loop
        execute format(
            'update auth.users set %I = coalesce(%I, '''') where id = $1 and %I is null',
            r.column_name, r.column_name, r.column_name
        ) using v_uid;
    end loop;

    -- Identitas email (dibutuhkan GoTrue untuk login password)
    insert into auth.identities
        (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values
        (gen_random_uuid(), v_uid::text, v_uid,
         jsonb_build_object('sub', v_uid::text, 'email', v_email),
         'email', now(), now(), now());

    return v_uid;
end;
$$;

-- Hanya role authenticated (yang sudah login) yang boleh mengeksekusi;
-- guard is_admin() di dalam fungsi menjaga yang boleh memanggil.
grant execute on function public.create_siswa(text, text, text) to authenticated;

notify pgrst, 'reload schema';
