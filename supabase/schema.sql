-- Sharod Darshan Supabase SQL Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Areas Table
create table public.areas (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  district text not null,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Pujo Places Table
create table public.pujo_places (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  type text not null,
  area text not null,
  district text not null,
  address text not null,
  description text,
  year integer,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'hidden')),
  submitter_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Pujo Images Table
create table public.pujo_images (
  id uuid default uuid_generate_v4() primary key,
  pujo_place_id uuid references public.pujo_places(id) on delete cascade not null,
  cloudinary_url text not null,
  cloudinary_public_id text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'hidden')),
  submitter_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Image Reports Table
create table public.image_reports (
  id uuid default uuid_generate_v4() primary key,
  image_id uuid references public.pujo_images(id) on delete cascade not null,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null,
  status text default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Place Views Table
create table public.place_views (
  id uuid default uuid_generate_v4() primary key,
  pujo_place_id uuid references public.pujo_places(id) on delete cascade not null,
  view_count integer default 0,
  last_viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (pujo_place_id)
);

-- Create trigger to automatically create profile for new auth.users
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.areas enable row level security;
alter table public.pujo_places enable row level security;
alter table public.pujo_images enable row level security;
alter table public.image_reports enable row level security;
alter table public.place_views enable row level security;

-- Utility function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- 1. Profiles Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Areas Policies
create policy "Areas are viewable by everyone." on public.areas
  for select using (true);
create policy "Only admins can modify areas." on public.areas
  for all using (public.is_admin());

-- 3. Pujo Places Policies
create policy "Approved pujo places are viewable by everyone." on public.pujo_places
  for select using (status = 'approved');
create policy "Users can view their own pending/rejected places." on public.pujo_places
  for select using (auth.uid() = submitter_id);
create policy "Admins can view all pujo places." on public.pujo_places
  for select using (public.is_admin());
create policy "Authenticated users can insert pujo places." on public.pujo_places
  for insert with check (auth.uid() = submitter_id);
create policy "Only admins can update/delete pujo places." on public.pujo_places
  for update using (public.is_admin());
create policy "Only admins can delete pujo places." on public.pujo_places
  for delete using (public.is_admin());

-- 4. Pujo Images Policies
create policy "Approved images are viewable by everyone." on public.pujo_images
  for select using (status = 'approved');
create policy "Users can view their own pending/rejected images." on public.pujo_images
  for select using (auth.uid() = submitter_id);
create policy "Admins can view all images." on public.pujo_images
  for select using (public.is_admin());
create policy "Authenticated users can insert images." on public.pujo_images
  for insert with check (auth.uid() = submitter_id);
create policy "Only admins can update images." on public.pujo_images
  for update using (public.is_admin());
create policy "Only admins can delete images." on public.pujo_images
  for delete using (public.is_admin());

-- 5. Image Reports Policies
create policy "Admins can view all reports." on public.image_reports
  for select using (public.is_admin());
create policy "Authenticated users can insert reports." on public.image_reports
  for insert with check (auth.uid() = reporter_id);
create policy "Only admins can update/delete reports." on public.image_reports
  for update using (public.is_admin());
create policy "Only admins can delete reports." on public.image_reports
  for delete using (public.is_admin());

-- 6. Place Views Policies
create policy "Place views are viewable by everyone." on public.place_views
  for select using (true);
create policy "Anyone can update place views (increment)." on public.place_views
  for update using (true);
create policy "Anyone can insert place views initially." on public.place_views
  for insert with check (true);

-- Indexes for performance
create index if not exists idx_pujo_places_slug on public.pujo_places(slug);
create index if not exists idx_pujo_places_status on public.pujo_places(status);
create index if not exists idx_pujo_places_district on public.pujo_places(district);
create index if not exists idx_pujo_places_area on public.pujo_places(area);
create index if not exists idx_pujo_images_status on public.pujo_images(status);
create index if not exists idx_pujo_images_place_id on public.pujo_images(pujo_place_id);
