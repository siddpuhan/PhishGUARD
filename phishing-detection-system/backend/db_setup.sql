-- Create Users Table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  username text not null,
  email text not null unique,
  password text not null, -- hashed
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Scans Table
create table public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  input_type text not null, -- 'url' or 'email'
  content text not null,
  result jsonb not null, -- stores { isPhishing, confidence, features }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) - Optional but recommended
-- For this simple backend-as-proxy setup, we are using the service_role key 
-- (or anon key if we implement policies) from the backend, 
-- but since the backend handles auth, standard table access is fine for now.
alter table public.users enable row level security;
alter table public.scans enable row level security;

-- Policy to allow full access for now (since backend handles logic)
create policy "Allow all access" on public.users for all using (true);
create policy "Allow all access" on public.scans for all using (true);
