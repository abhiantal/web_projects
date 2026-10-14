-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 03: EXAMS TABLE (Timetables, Countdowns & Seating)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('MTE', 'ETE', 'Backlog', 'Practical', 'Quiz')),
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number TEXT,
    block_name TEXT DEFAULT 'Academic Block 1',
    seating_plan_url TEXT,
    admit_card_url TEXT,
    guidelines TEXT DEFAULT 'Bring physical ID Card and Hall Ticket. Electronic devices strictly prohibited.',
    is_published BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_exams_subject_id ON public.exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_exam_date ON public.exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_exams_exam_type ON public.exams(exam_type);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_exams_updated_at ON public.exams;
CREATE TRIGGER trg_exams_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- 1. All visitors can read published exams
CREATE POLICY "exams_select_public" ON public.exams
    FOR SELECT
    USING (is_published = true);

-- 2. Faculty / Admin can manage exams
CREATE POLICY "exams_insert_faculty_admin" ON public.exams
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "exams_update_faculty_admin" ON public.exams
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "exams_delete_faculty_admin" ON public.exams
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );
