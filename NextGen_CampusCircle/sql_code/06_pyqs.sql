-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 06: PYQ TABLE (Previous Year Questions Archive)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pyqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('MTE', 'ETE', 'Backlog', 'Quiz')),
    exam_year INT NOT NULL,                  -- e.g., 2023, 2024, 2025, 2026
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    title TEXT NOT NULL,
    paper_file_url TEXT NOT NULL,            -- PDF URL in Supabase Storage
    solution_file_url TEXT,                  -- Optional solution PDF/HTML URL
    has_solution BOOLEAN DEFAULT FALSE,
    verified_by_faculty BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES public.profiles(id),
    download_count INT NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_pyqs_subject_id ON public.pyqs(subject_id);
CREATE INDEX IF NOT EXISTS idx_pyqs_exam_year ON public.pyqs(exam_year);
CREATE INDEX IF NOT EXISTS idx_pyqs_exam_type ON public.pyqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_pyqs_semester ON public.pyqs(semester);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_pyqs_updated_at ON public.pyqs;
CREATE TRIGGER trg_pyqs_updated_at
    BEFORE UPDATE ON public.pyqs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RPC FUNCTION: increment_pyq_downloads
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_pyq_downloads(target_pyq_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.pyqs
    SET download_count = download_count + 1
    WHERE id = target_pyq_id;
END;
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;

-- 1. All visitors can view PYQs
CREATE POLICY "pyqs_select_public" ON public.pyqs
    FOR SELECT
    USING (true);

-- 2. Authenticated users can upload PYQs
CREATE POLICY "pyqs_insert_auth" ON public.pyqs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = uploaded_by);

-- 3. Faculty / Admin can verify and update PYQs
CREATE POLICY "pyqs_update_faculty_admin" ON public.pyqs
    FOR UPDATE
    TO authenticated
    USING (
        uploaded_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- 4. Admins or original uploader can delete
CREATE POLICY "pyqs_delete_auth" ON public.pyqs
    FOR DELETE
    TO authenticated
    USING (
        uploaded_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
