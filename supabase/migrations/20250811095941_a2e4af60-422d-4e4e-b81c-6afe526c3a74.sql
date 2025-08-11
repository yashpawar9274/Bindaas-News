-- Fix the critical security issue: Remove public access to profiles table
DROP POLICY "Users can view all profiles" ON public.profiles;

-- Create secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);