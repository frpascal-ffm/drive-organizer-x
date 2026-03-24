
-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id);
  RETURN new;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trip types
CREATE TABLE public.trip_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.trip_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trip_types_select" ON public.trip_types FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trip_types_insert" ON public.trip_types FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trip_types_update" ON public.trip_types FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trip_types_delete" ON public.trip_types FOR DELETE USING (auth.uid() = user_id);

-- Vehicles
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  license_plate text NOT NULL,
  make text,
  model text,
  year integer,
  name text,
  status text DEFAULT 'active',
  fuel_type text DEFAULT 'Benzin',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicles_select" ON public.vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vehicles_insert" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vehicles_update" ON public.vehicles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "vehicles_delete" ON public.vehicles FOR DELETE USING (auth.uid() = user_id);

-- Drivers
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  name text,
  phone text,
  email text,
  address text,
  status text DEFAULT 'active',
  default_vehicle_id uuid REFERENCES public.vehicles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drivers_select" ON public.drivers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "drivers_insert" ON public.drivers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "drivers_update" ON public.drivers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "drivers_delete" ON public.drivers FOR DELETE USING (auth.uid() = user_id);

-- Trips
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trip_type_id uuid REFERENCES public.trip_types(id),
  trip_date timestamptz NOT NULL,
  pickup_address text,
  destination_address text,
  driver_id uuid REFERENCES public.drivers(id),
  vehicle_id uuid REFERENCES public.vehicles(id),
  status text NOT NULL DEFAULT 'pending',
  amount numeric NOT NULL DEFAULT 0,
  vat_rate numeric DEFAULT 19,
  passenger_name text,
  notes text,
  is_paid boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trips_select" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update" ON public.trips FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_delete" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- Trip comments
CREATE TABLE public.trip_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.trip_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trip_comments_select" ON public.trip_comments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trip_comments_insert" ON public.trip_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trip_comments_delete" ON public.trip_comments FOR DELETE USING (auth.uid() = user_id);

-- Company costs
CREATE TABLE public.company_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id),
  name text NOT NULL,
  cost_type text NOT NULL DEFAULT 'variable',
  amount numeric NOT NULL DEFAULT 0,
  period text NOT NULL DEFAULT 'einmalig',
  date_from date,
  date_to date,
  description text,
  vat_deductible boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.company_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company_costs_select" ON public.company_costs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "company_costs_insert" ON public.company_costs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "company_costs_update" ON public.company_costs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "company_costs_delete" ON public.company_costs FOR DELETE USING (auth.uid() = user_id);

-- Platform imports
CREATE TABLE public.platform_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform text NOT NULL,
  period_from date,
  period_to date,
  import_date timestamptz DEFAULT now(),
  filename text,
  status text DEFAULT 'completed',
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.platform_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platform_imports_select" ON public.platform_imports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "platform_imports_insert" ON public.platform_imports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "platform_imports_delete" ON public.platform_imports FOR DELETE USING (auth.uid() = user_id);

-- Platform revenues
CREATE TABLE public.platform_revenues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  import_id uuid REFERENCES public.platform_imports(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES public.drivers(id),
  vehicle_id uuid REFERENCES public.vehicles(id),
  platform text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  commission numeric DEFAULT 0,
  net_amount numeric DEFAULT 0,
  trip_count integer DEFAULT 0,
  period_from date,
  period_to date,
  reference text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.platform_revenues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platform_revenues_select" ON public.platform_revenues FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "platform_revenues_insert" ON public.platform_revenues FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "platform_revenues_update" ON public.platform_revenues FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "platform_revenues_delete" ON public.platform_revenues FOR DELETE USING (auth.uid() = user_id);

-- Company settings
CREATE TABLE public.company_settings (
  user_id uuid PRIMARY KEY,
  company_name text,
  company_address text,
  company_email text,
  company_phone text,
  postal_code text,
  city text,
  tax_id text,
  default_driver_share numeric DEFAULT 42,
  calculate_from_payout boolean DEFAULT true,
  include_vehicle_costs boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company_settings_select" ON public.company_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "company_settings_insert" ON public.company_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "company_settings_update" ON public.company_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
