
-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false);

-- Storage policies: clients can upload/view files for their projects, admins can manage all
CREATE POLICY "Users can view their project files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-files'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.client_projects WHERE client_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can upload to their project files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-files'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.client_projects WHERE client_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete their project files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-files'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.client_projects WHERE client_id = auth.uid()
    )
  )
);

-- Track files with metadata
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files for their projects"
ON public.project_files FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR project_id IN (
    SELECT id FROM public.client_projects WHERE client_id = auth.uid()
  )
);

CREATE POLICY "Users can upload files to their projects"
ON public.project_files FOR INSERT
WITH CHECK (
  auth.uid() = uploaded_by
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR project_id IN (
      SELECT id FROM public.client_projects WHERE client_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can delete files"
ON public.project_files FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
