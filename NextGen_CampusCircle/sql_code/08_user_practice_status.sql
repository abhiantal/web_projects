-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 08: USER PRACTICE STATUS TABLE (Bookmarks & Progress)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_practice_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.practice_questions(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('mastered', 'review_later', 'starred', 'solved')) DEFAULT 'starred',
    personal_notes TEXT,
    attempts_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_practice_status_user_id ON public.user_practice_status(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_status_question_id ON public.user_practice_status(question_id);
CREATE INDEX IF NOT EXISTS idx_practice_status_status ON public.user_practice_status(status);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_user_practice_status_updated_at ON public.user_practice_status;
CREATE TRIGGER trg_user_practice_status_updated_at
    BEFORE UPDATE ON public.user_practice_status
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.user_practice_status ENABLE ROW LEVEL SECURITY;

-- 1. Users can only select their own practice records
CREATE POLICY "practice_status_select_own" ON public.user_practice_status
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- 2. Users can insert their own status
CREATE POLICY "practice_status_insert_own" ON public.user_practice_status
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- 3. Users can update their own status
CREATE POLICY "practice_status_update_own" ON public.user_practice_status
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- 4. Users can delete their own status
CREATE POLICY "practice_status_delete_own" ON public.user_practice_status
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
