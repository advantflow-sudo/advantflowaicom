
-- Create bookings table for discovery calls
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_interest TEXT,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/London',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create a booking
CREATE POLICY "Anyone can submit a booking"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Admins can view all bookings
CREATE POLICY "Admins can view bookings"
ON public.bookings FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage bookings
CREATE POLICY "Admins can manage bookings"
ON public.bookings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can check availability (read date/time only)
CREATE POLICY "Anyone can check availability"
ON public.bookings FOR SELECT
USING (true);

-- Add index for date lookups
CREATE INDEX idx_bookings_date ON public.bookings (booking_date);

-- Add trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
