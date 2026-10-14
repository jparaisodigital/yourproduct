alter table public.profiles
  add column if not exists default_address_enabled boolean not null default false,
  add column if not exists default_province text,
  add column if not exists default_city_municipality text,
  add column if not exists default_barangay text,
  add column if not exists default_house_street text,
  add column if not exists default_landmark text;