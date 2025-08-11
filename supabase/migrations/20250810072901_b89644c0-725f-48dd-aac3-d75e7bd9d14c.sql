
-- Create admin roles system
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles 
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles" ON public.user_roles 
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles" ON public.user_roles 
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Create traffic analytics table
CREATE TABLE public.traffic_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on traffic_analytics
ALTER TABLE public.traffic_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for traffic analytics
CREATE POLICY "Anyone can insert traffic data" ON public.traffic_analytics 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view traffic data" ON public.traffic_analytics 
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Insert admin role for yash.pawar@theemcoe.org
-- This will be done via a function that runs after user creation
CREATE OR REPLACE FUNCTION public.handle_admin_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the email is the admin email
  IF NEW.email = 'yash.pawar@theemcoe.org' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for admin assignment
CREATE TRIGGER assign_admin_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_assignment();

-- Update articles table to track more stats
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);

-- Enable realtime for tables
ALTER TABLE public.articles REPLICA IDENTITY FULL;
ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER TABLE public.traffic_analytics REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traffic_analytics;
