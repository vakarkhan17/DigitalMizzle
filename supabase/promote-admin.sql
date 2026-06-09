-- Run this in Supabase SQL Editor after vakar.khan@gmail.com has registered.
insert into public.profiles (id, full_name, email, role)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', 'Vakar Khan'),
  coalesce(email, ''),
  'admin'
from auth.users
where lower(email) = 'vakar.khan@gmail.com'
on conflict (id) do update
set
  full_name = case
    when public.profiles.full_name = '' then excluded.full_name
    else public.profiles.full_name
  end,
  email = excluded.email,
  role = 'admin',
  updated_at = now();

select id, full_name, email, role
from public.profiles
where lower(email) = 'vakar.khan@gmail.com';
