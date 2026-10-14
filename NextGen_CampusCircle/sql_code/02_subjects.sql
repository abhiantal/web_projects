-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 02: SUBJECTS TABLE (Academic Courses & Curriculum)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,                -- e.g., 'CS601', 'CS602'
    name TEXT NOT NULL,                       -- e.g., 'Advanced Algorithms & Problem Solving'
    short_name TEXT NOT NULL,                 -- e.g., 'AAPS', 'CD', 'NLP', 'WT', 'SE', 'DAA'
    branch TEXT NOT NULL DEFAULT 'CSE',
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    credits INT NOT NULL DEFAULT 4,
    syllabus_url TEXT,
    description TEXT,
    color_accent TEXT DEFAULT '#00d4aa',      -- UI Theme accent for badges
    icon_name TEXT DEFAULT 'book-open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON public.subjects(semester);
CREATE INDEX IF NOT EXISTS idx_subjects_branch ON public.subjects(branch);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_subjects_updated_at ON public.subjects;
CREATE TRIGGER trg_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- 1. All visitors can read subjects
CREATE POLICY "subjects_select_public" ON public.subjects
    FOR SELECT
    USING (true);

-- 2. Only authenticated faculty or admin can insert/modify subjects
CREATE POLICY "subjects_insert_faculty_admin" ON public.subjects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "subjects_update_faculty_admin" ON public.subjects
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "subjects_delete_admin" ON public.subjects
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
