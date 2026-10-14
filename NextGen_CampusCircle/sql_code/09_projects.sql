-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 09: PROJECTS TABLE (Showcase & Teammate Matcher)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Full Stack Web', -- Web, Mobile, AI/ML, Cloud, IoT, Systems
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    banner_image_url TEXT,
    looking_for_teammates BOOLEAN NOT NULL DEFAULT FALSE,
    open_roles TEXT[] NOT NULL DEFAULT '{}',         -- e.g., ['Backend Engineer', 'UI/UX Designer']
    mentor_faculty_id UUID REFERENCES public.profiles(id),
    is_faculty_endorsed BOOLEAN NOT NULL DEFAULT FALSE,
    upvotes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON public.projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_looking_teammates ON public.projects(looking_for_teammates) WHERE looking_for_teammates = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_upvotes ON public.projects(upvotes DESC);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RPC FUNCTION: upvote_project
-- ============================================================
CREATE OR REPLACE FUNCTION public.upvote_project(target_project_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.projects
    SET upvotes = upvotes + 1
    WHERE id = target_project_id;
END;
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 1. All visitors can view projects
CREATE POLICY "projects_select_public" ON public.projects
    FOR SELECT
    USING (true);

-- 2. Authenticated users can submit projects
CREATE POLICY "projects_insert_auth" ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (creator_id = auth.uid());

-- 3. Project creators can update their own project, Admins can update all
CREATE POLICY "projects_update_creator_or_admin" ON public.projects
    FOR UPDATE
    TO authenticated
    USING (
        creator_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 4. Project creators can delete their project, Admins can delete all
CREATE POLICY "projects_delete_creator_or_admin" ON public.projects
    FOR DELETE
    TO authenticated
    USING (
        creator_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
