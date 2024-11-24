-- Enable Row-Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable Row-Level Security on the products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Enable Row-Level Security on the worker_assignments table
ALTER TABLE public.worker_assignments ENABLE ROW LEVEL SECURITY;