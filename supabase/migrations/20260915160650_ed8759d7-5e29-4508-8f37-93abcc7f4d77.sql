-- Clients can see and manage their own bookings/leads by verified email
CREATE POLICY "Clients can view own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Clients can update own booking details"
ON public.bookings FOR UPDATE TO authenticated
USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
WITH CHECK (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Clients can view own leads"
ON public.leads FOR SELECT TO authenticated
USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

GRANT SELECT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT ON public.leads TO authenticated;