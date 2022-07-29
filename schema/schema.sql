CREATE OR REPLACE FUNCTION generate_uid(size INT) RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  bytes BYTEA := gen_random_bytes(size);
  l INT := length(characters);
  i INT := 0;
  output TEXT := '';
BEGIN
  WHILE i < size LOOP
    output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;

/** 
* Teams
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table teams (
  -- UUID from auth.users
  id uuid references auth.users not null,
  team_id text primary key unique not null default generate_uid(15) unique,
  team_name text,
  -- The customer's billing address, stored in JSON format.
  billing_address jsonb,
  -- Stores your customer's payment instruments.
  payment_method jsonb,
  created timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table teams enable row level security;

/** 
* Members
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table members (
  member_id text primary key unique not null default generate_uid(15) unique,
  member_team_id text references teams(team_id) not null,
  member_user_id uuid references auth.users,
  created timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table members enable row level security;

-- Parameters need to be prefixed because the name clashes with `om`'s columns
CREATE FUNCTION is_member_of(_member_user_id uuid, _member_team_id text) RETURNS bool AS $$
SELECT EXISTS (
  SELECT 1
  FROM members mem
  WHERE mem.member_team_id = _member_team_id
  AND mem.member_user_id = _member_user_id
);
$$ LANGUAGE sql SECURITY DEFINER;
-- Function is owned by postgres which bypasses RLS

create policy "Can view own user data." on members for select using (is_member_of(auth.uid(), member_team_id));
create policy "Can update own user data." on members for update using (is_member_of(auth.uid(), member_team_id));
create policy "Can insert own user data." on members for insert with check (is_member_of(auth.uid(), member_team_id));

create policy "Members can view team data." on teams for select using (is_member_of(auth.uid(), team_id));
create policy "Can view own team data." on teams for select using (auth.uid() = id);
create policy "Can update own user data." on teams for update using (is_member_of(auth.uid(), team_id));
create policy "Can insert own user data." on teams for insert with check (auth.uid() = id);

/** 
* Team Invites
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table invites (
  -- UUID from auth.users
  id uuid references auth.users not null,
  invite_id text primary key unique not null default generate_uid(15) unique,
  team_id text references teams not null,
  email text default null,
  accepted boolean default false,
  created timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table invites enable row level security;
create policy "Can view own user data." on invites for select using (email in (select email from users where auth.email() = email));
create policy "Can update own user data." on invites for update using (email in (select email from users where auth.email() = email));
create policy "Can insert own user data." on invites for insert with check (email in (select email from users where auth.email() = email));

/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create type user_types as enum ('platform', 'user');
create table users (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  email text,
  user_type user_types,
  paypal_email text default null,
  team_id text references teams not null
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can view affiliate user data." on users for select using (id in (select invited_user_id from affiliates where invited_user_id = id));
create policy "Can update own user data." on users for update using (auth.uid() = id);

/** 
* Companies
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table companies (
  -- UUID from auth.users
  id uuid references auth.users not null,
  team_id text references teams not null,
  company_id text primary key unique not null default generate_uid(15) unique,
  company_name text,
  company_url text,
  company_image text,
  company_meta jsonb,
  company_currency text,
  company_handle text unique default null,
  company_affiliates jsonb,
  stripe_account_data jsonb,
  domain_verified boolean default false,
  stripe_id text unique,
  active_company boolean default false,
  created timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table companies enable row level security;
create policy "Can view own user data." on companies for select using (is_member_of(auth.uid(), team_id));
create policy "Can update own user data." on companies for update using (is_member_of(auth.uid(), team_id));
create policy "Can insert own user data." on companies for insert with check (is_member_of(auth.uid(), team_id));
create policy "Can delete own user data." on companies for delete using (is_member_of(auth.uid(), team_id));

/** 
* Campaigns
* Note: This table contains user data. Users should only be able to view and update their own data.
*/

create type commission_types as enum ('percentage', 'fixed');
create table campaigns (
  -- UUID from auth.users
  id uuid references auth.users not null,
  team_id text references teams not null,
  campaign_id text primary key unique not null default generate_uid(15) unique,
  campaign_name text,
  commission_type commission_types,
  commission_value integer,
  company_id text references companies,
  cookie_window integer default 60,
  commission_period integer default 12,
  default_campaign boolean default false,
  campaign_public boolean default true,
  minimum_days_payout integer default 30,
  discount_code text default null,
  discount_value integer default null,
  discount_type commission_types,
  created timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table campaigns enable row level security;
create policy "Can view own user data." on campaigns for select using (is_member_of(auth.uid(), team_id));
create policy "Can update own user data." on campaigns for update using (is_member_of(auth.uid(), team_id));
create policy "Can insert own user data." on campaigns for insert with check (is_member_of(auth.uid(), team_id));
create policy "Can delete own user data." on campaigns for delete using (is_member_of(auth.uid(), team_id));

/**
* Affiliates
* Note: this is a private table that contains a mapping of user IDs and affiliates.
*/
create table affiliates (
  -- UUID from auth.users
  id uuid references auth.users not null,
  team_id text references teams not null,
  affiliate_id text primary key unique not null default generate_uid(20) unique,
  invite_email text,
  invited_user_id uuid references users(id) default null,
  campaign_id text references campaigns,
  company_id text references companies,
  accepted boolean default false,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  impressions integer default 0,
  referral_code text default null
);
alter table affiliates enable row level security;
create policy "Can view own user data." on affiliates for select using (is_member_of(auth.uid(), team_id));
create policy "Can update own user data." on affiliates for update using (is_member_of(auth.uid(), team_id));
create policy "Can insert own user data." on affiliates for insert with check (is_member_of(auth.uid(), team_id));
create policy "Can delete own user data." on affiliates for delete using (is_member_of(auth.uid(), team_id));

/**
* Referrals
* Note: this is a private table that contains a mapping of user IDs and referrals.
*/
create table referrals (
  -- UUID from auth.users
  id uuid references auth.users not null,
  team_id text references teams not null,
  referral_id text primary key unique not null default generate_uid(20) unique,
  affiliate_id text references affiliates,
  affiliate_code text,
  campaign_id text references campaigns,
  company_id text references companies,
  commission_type text,
  commission_value integer,
  cookie_window integer default 60,
  commission_period integer default 12,
  minimum_days_payout integer default 30,
  referral_converted boolean default false,
  referral_expiry text,
  created timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table referrals enable row level security;
create policy "Can view own user data." on referrals for select using (is_member_of(auth.uid(), team_id));
create policy "Can update own user data." on referrals for update using (is_member_of(auth.uid(), team_id));
create policy "Can insert own user data." on referrals for insert with check (is_member_of(auth.uid(), team_id));
create policy "Can delete own user data." on referrals for delete using (is_member_of(auth.uid(), team_id));

/**
* Commissions
* Note: this is a private table that contains a mapping of user IDs and commissions.
*/
create table commissions (
  -- UUID from auth.users
  id uuid references auth.users not null,
  team_id text references teams not null,
  commission_id text primary key unique not null default generate_uid(20) unique,
  company_id text references companies,
  campaign_id text references campaigns,
  affiliate_id text references affiliates,
  referral_id text references referrals,
  payment_intent_id text,
  commission_sale_value integer default null,
  commission_refund_value integer default null,
  paid_at text default null,
  commission_total integer default null,
  commission_due_date text default null,
  commission_description text default null,
  created timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table commissions enable row level security;
create policy "Can view own user data." on commissions for select using (is_member_of(auth.uid(), team_id));
create policy "Can update own user data." on commissions for update using (is_member_of(auth.uid(), team_id));
create policy "Can insert own user data." on commissions for insert with check (is_member_of(auth.uid(), team_id));
create policy "Can delete own user data." on commissions for delete using (is_member_of(auth.uid(), team_id));

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_team() 
returns trigger as $$
begin
  insert into public.members (member_user_id, member_team_id)
  values (new.id, new.team_id);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_team_created
  after insert on public.teams
  for each row execute procedure public.handle_new_team();

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
*/
create table customers (
  user_id uuid references auth.users not null,
  -- UUID from auth.users
  team_id text references teams not null primary key,
  -- The user's customer ID in Stripe. User must not be able to update this.
  stripe_customer_id text
);
alter table customers enable row level security;
-- No policies as this is a private table that the user must not have access to.

/** 
* PRODUCTS
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create table products (
  -- Product ID from Stripe, e.g. prod_1234.
  product_id text primary key,
  -- Whether the product is currently available for purchase.
  active boolean,
  -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
  name text,
  -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
  description text,
  -- A URL of the product image in Stripe, meant to be displayable to the customer.
  image text,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

/**
* PRICES
* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table prices (
  -- Price ID from Stripe, e.g. price_1234.
  id text primary key,
  -- The ID of the prduct that this price belongs to.
  product_id text references products, 
  -- Whether the price can be used for new purchases.
  active boolean,
  -- A brief description of the price.
  description text,
  -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
  unit_amount bigint,
  -- Three-letter ISO currency code, in lowercase.
  currency text check (char_length(currency) = 3),
  -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type pricing_type,
  -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
  interval pricing_plan_interval,
  -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
  interval_count integer,
  -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
  trial_period_days integer,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');
create table subscriptions (
  -- Subscription ID from Stripe, e.g. sub_1234.
  user_id uuid references auth.users not null,
  id text primary key,
  team_id text references teams not null,
  -- The status of the subscription object, one of subscription_status type above.
  status subscription_status,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb,
  -- ID of the price that created this subscription.
  price_id text references prices,
  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
  quantity integer,
  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancel_at_period_end boolean,
  -- Time at which the subscription was created.
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Start of the current period that the subscription has been invoiced for.
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  -- If the subscription has ended, the timestamp of the date the subscription ended.
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  -- A date in the future at which the subscription will automatically get canceled.
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the beginning of that trial.
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the end of that trial.
  trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (is_member_of(auth.uid(), team_id));

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime for table products, prices;

/**
 * Record referral impression function
 */
create function referralimpression (x int, affiliateid text) 
returns void as
$$
  update affiliates 
  set impressions = impressions + x
  where affiliate_id = affiliateid
$$ 
language sql volatile;