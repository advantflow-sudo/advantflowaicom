
-- Allow admins to read leads
CREATE POLICY "Admins can view leads"
ON public.leads FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Allow admins to view all profiles (for admin dashboard client list)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
