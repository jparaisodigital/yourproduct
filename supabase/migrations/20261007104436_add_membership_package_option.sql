alter table public.membership_applications
add column if not exists fulfillment_status text not null default 'not-ready',
add column if not exists package_allocation jsonb not null default '[]'::jsonb,
add column if not exists package_inventory_deducted boolean not null default false,
add column if not exists package_inventory_deducted_at timestamp with time zone,
add column if not exists fulfillment_confirmed_at timestamp with time zone,
add column if not exists selected_package_option_id text,
add column if not exists delivery_details jsonb;

create index if not exists membership_applications_fulfillment_status_idx
on public.membership_applications(fulfillment_status);

create index if not exists membership_applications_selected_package_option_id_idx
on public.membership_applications(selected_package_option_id);
