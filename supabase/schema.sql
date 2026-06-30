-- ===========================================================================
-- Historique de conversations — Challenge IA TechCorp
-- À exécuter dans Supabase : Dashboard → SQL Editor → coller → Run.
-- Prérequis : avoir activé l'intégration Clerk (Authentication → Third-Party
-- Auth → Clerk) pour que auth.jwt()->>'sub' = l'ID utilisateur Clerk.
-- ===========================================================================

-- 1) Tables -----------------------------------------------------------------

create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null default (auth.jwt() ->> 'sub'),
  title      text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz not null default now()
);

create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at);

create index if not exists conversations_user_idx
  on public.conversations (user_id, created_at desc);

-- 2) Row Level Security : chacun ne voit que SES données ---------------------

alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

-- Conversations : accès limité au propriétaire (user_id = sub du JWT Clerk)
create policy "conversations_owner"
  on public.conversations for all
  to authenticated
  using      (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

-- Messages : accès limité aux messages des conversations de l'utilisateur
create policy "messages_owner"
  on public.messages for all
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.user_id = (auth.jwt() ->> 'sub')
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.user_id = (auth.jwt() ->> 'sub')
    )
  );
