-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 10: CAMPUS POSTS TABLE (Notices & Broadcasts)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.campus_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (
        category IN (
            'Official Notice',
            'Exam Alert',
            'Project Collab',
            'Internship',
            'Academic Discussion',
            'Lost & Found'
        )
    ),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    attachment_url TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_official_faculty BOOLEAN NOT NULL DEFAULT FALSE,
    upvotes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.campus_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.campus_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON public.campus_posts(is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.campus_posts(created_at DESC);

-- ============================================================
-- TRIGGER: updated_at & auto-tag faculty posts
-- ============================================================
DROP TRIGGER IF EXISTS trg_campus_posts_updated_at ON public.campus_posts;
CREATE TRIGGER trg_campus_posts_updated_at
    BEFORE UPDATE ON public.campus_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to set is_official_faculty if author is teacher/admin
CREATE OR REPLACE FUNCTION public.handle_post_author_role()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = NEW.author_id AND role IN ('teacher', 'admin')
    ) THEN
        NEW.is_official_faculty = TRUE;
    ELSE
        NEW.is_official_faculty = FALSE;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_post_faculty_status ON public.campus_posts;
CREATE TRIGGER trg_set_post_faculty_status
    BEFORE INSERT ON public.campus_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_post_author_role();

-- ============================================================
-- RPC FUNCTION: upvote_campus_post
-- ============================================================
CREATE OR REPLACE FUNCTION public.upvote_campus_post(target_post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.campus_posts
    SET upvotes = upvotes + 1
    WHERE id = target_post_id;
END;
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.campus_posts ENABLE ROW LEVEL SECURITY;

-- 1. All visitors can read posts
CREATE POLICY "posts_select_public" ON public.campus_posts
    FOR SELECT
    USING (true);

-- 2. Authenticated users can create posts
CREATE POLICY "posts_insert_auth" ON public.campus_posts
    FOR INSERT
    TO authenticated
    WITH CHECK (author_id = auth.uid());

-- 3. Author can edit own post, Admin can edit all
CREATE POLICY "posts_update_author_or_admin" ON public.campus_posts
    FOR UPDATE
    TO authenticated
    USING (
        author_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 4. Author can delete own post, Admin can delete all
CREATE POLICY "posts_delete_author_or_admin" ON public.campus_posts
    FOR DELETE
    TO authenticated
    USING (
        author_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
