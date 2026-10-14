-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 05: ASSIGNMENT SUBMISSIONS TABLE (Student Uploads & Grading)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_file_url TEXT NOT NULL,        -- Uploaded file link in Supabase Storage
    github_repo_url TEXT,
    submission_notes TEXT,
    grade NUMERIC(5,2),
    feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id),
    graded_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.assignment_submissions(student_id);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_submissions_updated_at ON public.assignment_submissions;
CREATE TRIGGER trg_submissions_updated_at
    BEFORE UPDATE ON public.assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- 1. Students can view their own submissions
CREATE POLICY "submissions_select_own" ON public.assignment_submissions
    FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_submissions.assignment_id
            AND (a.created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- 2. Students can submit their assignment
CREATE POLICY "submissions_insert_student" ON public.assignment_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

-- 3. Students can update their own un-graded submission
CREATE POLICY "submissions_update_student_or_grader" ON public.assignment_submissions
    FOR UPDATE
    TO authenticated
    USING (
        (student_id = auth.uid() AND grade IS NULL)
        OR EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_submissions.assignment_id
            AND (a.created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- 4. Students can delete their un-graded submission
CREATE POLICY "submissions_delete_student" ON public.assignment_submissions
    FOR DELETE
    TO authenticated
    USING (student_id = auth.uid() AND grade IS NULL);
