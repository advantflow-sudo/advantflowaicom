
-- Add lead scoring and status tracking columns
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS lead_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_status text DEFAULT 'new',
ADD COLUMN IF NOT EXISTS score_reason text,
ADD COLUMN IF NOT EXISTS follow_up_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS follow_up_sent_at timestamp with time zone;

-- Add index for lead management
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(lead_score DESC);
