-- SIMORA - Migration 0003
-- Hapus akun siswa oleh admin.
-- Fungsi security definer: hanya role admin yang boleh; menghapus auth.users
-- (profiles + user_stats + stage_progress + attempts ter-cascade oleh FK).

create or replace function public.hapus_siswa(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    v_role text;
begin
    if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
        raise exception 'Hanya admin yang boleh menghapus akun siswa';
    end if;

    select role into v_role from public.profiles where id = p_user_id;
    if v_role is null then
        raise exception 'Akun tidak ditemukan';
    end if;
    if v_role <> 'siswa' then
        raise exception 'Akun admin tidak bisa dihapus';
    end if;

    delete from auth.users where id = p_user_id;
    return true;
end;
$$;

revoke execute on function public.hapus_siswa(uuid) from public, anon;
grant execute on function public.hapus_siswa(uuid) to authenticated;

notify pgrst, 'reload schema';
