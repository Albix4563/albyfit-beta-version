-- Tabella per lo storico delle notifiche admin inviate
create table if not exists public.admin_notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  type text not null check (type in ('info', 'warning', 'success', 'update')),
  sent_by uuid references auth.users(id) on delete cascade,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  target_users integer not null default 0,
  notification_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Abilita RLS
alter table public.admin_notifications enable row level security;

-- Policy per permettere solo all'admin di leggere e scrivere
create policy "Admin can manage notifications" on public.admin_notifications
  for all using (
    auth.email() = 'albertorossi2005@gmail.com'
  );

-- Indici per performance
create index if not exists admin_notifications_sent_at_idx on public.admin_notifications(sent_at desc);
create index if not exists admin_notifications_sent_by_idx on public.admin_notifications(sent_by);
create index if not exists admin_notifications_type_idx on public.admin_notifications(type);
