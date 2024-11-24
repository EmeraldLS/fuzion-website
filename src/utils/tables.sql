-- First, let's create our tables
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text not null check (role in ('admin', 'worker')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Worker assignments (links workers to admin)
create table public.worker_assignments (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id) not null,
  worker_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(admin_id, worker_id)
);

-- Create policies for profiles table
create policy "Users can view their own profile" on profiles for
select using (auth.uid () = id);

create policy "Only admins can create worker profiles" on profiles for
insert
with
    check (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

-- Create policies for products table
create policy "Anyone can view products" on products for
select using (true);

create policy "Only admins can insert products" on products for
insert
with
    check (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

create policy "Only admins can update products" on products for
update using (
    exists (
        select 1
        from profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

create policy "Only admins can delete products" on products for delete using (
    exists (
        select 1
        from profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- Create policies for worker assignments
create policy "Admins can view their worker assignments" on worker_assignments for
select using (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

create policy "Only admins can create worker assignments" on worker_assignments for
insert
with
    check (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

-- Enable RLS on all tables
alter table profiles enable row level security;

alter table products enable row level security;

alter table worker_assignments enable row level security;

-- Create function to register new worker
create or replace function register_worker(
  worker_email text,
  worker_password text,
  admin_id uuid
) returns uuid as $$
declare
  new_user_id uuid;
begin
  
  if not exists (
    select 1 from profiles
    where id = admin_id
    and role = 'admin'
  ) then
    raise exception 'Invalid admin ID or not an admin user';
  end if;

  
  select id into new_user_id from auth.users where email = worker_email;

  
  if new_user_id is null then
    
    
  end if;

  
  if not exists (
    select 1 from profiles where id = new_user_id
  ) then
    insert into public.profiles (id, role)
    values (new_user_id, 'worker');
  end if;

  
  insert into public.worker_assignments (admin_id, worker_id)
  values (admin_id, new_user_id);

  return new_user_id;
end;
$$ language plpgsql

security definer;