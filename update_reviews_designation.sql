-- Run this to add the designation column to your existing reviews table
alter table public.reviews 
add column if not exists designation text default 'Student';
