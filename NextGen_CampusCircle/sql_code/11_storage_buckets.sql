-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 11: STORAGE BUCKETS & POLICIES (Supabase Storage)
-- ============================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('pyqs', 'pyqs', true),
    ('assignments', 'assignments', true),
    ('submissions', 'submissions', false),
    ('avatars', 'avatars', true),
    ('project_assets', 'project_assets', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ============================================================
-- STORAGE RLS POLICIES
-- ============================================================

-- PYQs: Public read, Authenticated upload
CREATE POLICY "pyqs_storage_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'pyqs');

CREATE POLICY "pyqs_storage_auth_upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'pyqs');

-- Assignments: Public read, Faculty/Admin upload
CREATE POLICY "assignments_storage_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'assignments');

CREATE POLICY "assignments_storage_faculty_upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'assignments'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

-- Submissions: Private - Owner student and teacher can read
CREATE POLICY "submissions_storage_select" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'submissions'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role IN ('teacher', 'admin')
            )
        )
    );

CREATE POLICY "submissions_storage_student_upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'submissions'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Avatars: Public read, User upload own
CREATE POLICY "avatars_storage_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_storage_auth_upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Project Assets: Public read, Authenticated upload
CREATE POLICY "project_assets_storage_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'project_assets');

CREATE POLICY "project_assets_storage_auth_upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'project_assets');
