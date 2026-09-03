-- =========================================================
-- Port-Fresh Frozen Foods — Supabase schema
-- Run this in Supabase SQL editor after creating your project
-- =========================================================

-- Extra profile info on top of Supabase's built-in auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamptz default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  name text not null,
  slug text not null unique,
  description text,
  unit text not null default '1kg bag',
  price numeric(10,2) not null check (price >= 0),
  stock_qty integer not null default 0 check (stock_qty >= 0),
  image_urls text[] default '{}',
  video_url text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  label text default 'Home',
  full_address text not null,
  city text,
  phone text,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table public.delivery_slots (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sun
  start_time time not null,
  end_time time not null,
  is_active boolean default true
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  address_id uuid references public.addresses(id),
  delivery_slot_id uuid references public.delivery_slots(id),
  status text not null default 'pending'
    check (status in ('pending','confirmed','out_for_delivery','delivered','cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','failed','refunded')),
  payment_reference text,
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,   -- snapshot, survives product edits/deletes
  unit_price numeric(10,2) not null,
  qty integer not null check (qty > 0)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- Profiles: users see/edit only their own row; admins see all
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Products & categories: public read, admin write
create policy "products_public_read" on public.products
  for select using (is_active = true or public.is_admin());
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Addresses: only the owner (or admin)
create policy "addresses_owner" on public.addresses
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

-- Orders: customers see their own; admin sees/manages all
create policy "orders_owner_read" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_owner_insert" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin());

-- Order items: visible if you can see the parent order
create policy "order_items_owner_read" on public.order_items
  for select using (
    exists (select 1 from public.orders o
            where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
  );
create policy "order_items_owner_insert" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o
            where o.id = order_id and o.user_id = auth.uid())
  );

-- Reviews: public read, owner write
create policy "reviews_public_read" on public.reviews
  for select using (true);
create policy "reviews_owner_write" on public.reviews
  for insert with check (auth.uid() = user_id);

-- =========================================================
-- Auto-create a profile row whenever someone signs up
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed categories to get started
insert into public.categories (name, slug) values
  ('Fish', 'fish'),
  ('Chicken', 'chicken'),
  ('Seafood', 'seafood'),
  ('Meat', 'meat'),
  ('Frozen Vegetables', 'frozen-vegetables');
