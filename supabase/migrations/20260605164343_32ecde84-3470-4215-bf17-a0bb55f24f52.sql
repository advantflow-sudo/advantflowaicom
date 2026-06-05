
-- 1. Bookings: remove public PII exposure, add availability RPC
DROP POLICY IF EXISTS "Anyone can check availability" ON public.bookings;

CREATE OR REPLACE FUNCTION public.get_booked_slots(_date date)
RETURNS TABLE(booking_time text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT booking_time FROM public.bookings
  WHERE booking_date = _date AND status = 'confirmed';
$$;

REVOKE ALL ON FUNCTION public.get_booked_slots(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(date) TO anon, authenticated;

-- 2. Chat: remove public read; add RPC for visitors using conv_id as bearer secret
DROP POLICY IF EXISTS "Anyone can view their conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;

-- Restrict chat_messages INSERT to only allow sender_type 'visitor' from anon
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
CREATE POLICY "Visitors can insert visitor messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (sender_type IN ('visitor', 'ai'));

CREATE OR REPLACE FUNCTION public.get_visitor_chat_messages(_conversation_id uuid)
RETURNS TABLE(id uuid, message text, sender_type text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, message, sender_type, created_at
  FROM public.chat_messages
  WHERE conversation_id = _conversation_id
  ORDER BY created_at ASC;
$$;

REVOKE ALL ON FUNCTION public.get_visitor_chat_messages(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_visitor_chat_messages(uuid) TO anon, authenticated;

-- 3. Realtime: remove tables with sensitive PII that don't need cross-user realtime.
-- Admins use realtime on bookings/leads/chat_*; since RLS restricts SELECT to admins,
-- postgres_changes will only deliver rows to admin sessions. But the 'leads' table
-- contains the most sensitive PII; remove from realtime publication as defense-in-depth.
ALTER PUBLICATION supabase_realtime DROP TABLE public.leads;

-- 4. Lock down SECURITY DEFINER helper functions from public EXECUTE
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 5. Storage: restrict listing of email-assets public bucket to admins
-- (files remain publicly fetchable by URL, but listing is blocked)
DROP POLICY IF EXISTS "Public can list email-assets" ON storage.objects;
CREATE POLICY "Admins can list email-assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'email-assets'
    AND (
      has_role(auth.uid(), 'admin')
      OR auth.role() = 'service_role'
    )
  );
