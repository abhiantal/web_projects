-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 07: PRACTICE QUESTIONS TABLE (Interactive Problem Lab)
-- Modeled after exam_sem_6 Interactive Practice Sets
-- ============================================================

CREATE TABLE IF NOT EXISTS public.practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,                     -- e.g., 'Dynamic Programming', 'LR Parsers', 'COCOMO'
    exam_stage TEXT NOT NULL CHECK (exam_stage IN ('MTE', 'ETE', 'Backlog', 'General')) DEFAULT 'ETE',
    question_number INT DEFAULT 1,
    title TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
    problem_statement TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    sample_input TEXT,
    sample_output TEXT,
    time_complexity TEXT DEFAULT 'O(N)',     -- e.g., 'O(N log N)'
    space_complexity TEXT DEFAULT 'O(1)',    -- e.g., 'O(1)'
    complexity_rating TEXT CHECK (complexity_rating IN ('good', 'ok', 'bad')) DEFAULT 'good',
    code_java TEXT,                          -- Complete runnable Java solution
    code_python TEXT,                        -- Python implementation
    code_cpp TEXT,                           -- C++ implementation
    pseudocode_steps JSONB DEFAULT '[]'::jsonb,
    insights TEXT,                           -- Strategic Pro-Tip / Viva insight
    pitfalls_warning TEXT,                   -- Edge case / exam trap warning
    upvotes INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_practice_subject_id ON public.practice_questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_practice_topic ON public.practice_questions(topic);
CREATE INDEX IF NOT EXISTS idx_practice_exam_stage ON public.practice_questions(exam_stage);
CREATE INDEX IF NOT EXISTS idx_practice_difficulty ON public.practice_questions(difficulty);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_practice_questions_updated_at ON public.practice_questions;
CREATE TRIGGER trg_practice_questions_updated_at
    BEFORE UPDATE ON public.practice_questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;

-- 1. All users can read practice questions
CREATE POLICY "practice_questions_select_public" ON public.practice_questions
    FOR SELECT
    USING (true);

-- 2. Faculty / Admin can insert/update practice questions
CREATE POLICY "practice_questions_insert_faculty_admin" ON public.practice_questions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "practice_questions_update_faculty_admin" ON public.practice_questions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "practice_questions_delete_faculty_admin" ON public.practice_questions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );
