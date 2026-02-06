-- Run this SQL in your Supabase SQL Editor to enable the Reviews feature

-- 1. Create the reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.reviews enable row level security;

-- 3. Create Policy: Allow anyone to read reviews (Public)
create policy "Reviews are public" 
on public.reviews 
for select 
using (true);

-- 4. Create Policy: Allow anyone to insert/create reviews (Public)
-- Note: In a stricter app, you might want to limit this to authenticated users only.
-- If so, change 'true' to 'auth.role() = 'authenticated''
create policy "Anyone can submit reviews" 
on public.reviews 
for insert 
with check (true);

-- 5. Enable Realtime updates for this table
-- This allows the website to update instantly when a new review comes in
alter publication supabase_realtime add table public.reviews;
