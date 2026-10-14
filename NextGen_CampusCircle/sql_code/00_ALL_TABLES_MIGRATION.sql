-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📦 COMPLETE MASTER MIGRATION: ALL TABLES & LOGIC COMBINED
-- Run this single file in the Supabase SQL Editor to set up everything!
-- ============================================================

-- 00. EXTENSIONS & SCHEMAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS internal;
REVOKE ALL ON SCHEMA internal FROM PUBLIC;
GRANT USAGE ON SCHEMA internal TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY INVOKER
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 01. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    university TEXT NOT NULL DEFAULT 'Apex Institute of Technology',
    branch TEXT DEFAULT 'Computer Science & Engineering',
    semester INT CHECK (semester BETWEEN 1 AND 8) DEFAULT 6,
    roll_number TEXT,
    bio TEXT,
    is_faculty_verified BOOLEAN DEFAULT FALSE,
    social_links JSONB DEFAULT '{"github":"","linkedin":"","portfolio":""}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_branch ON public.profiles(branch);
CREATE INDEX IF NOT EXISTS idx_profiles_semester ON public.profiles(semester);
CREATE INDEX IF NOT EXISTS idx_profiles_university ON public.profiles(university);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- 02. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    branch TEXT NOT NULL DEFAULT 'CSE',
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    credits INT NOT NULL DEFAULT 4,
    syllabus_url TEXT,
    description TEXT,
    color_accent TEXT DEFAULT '#00d4aa',
    icon_name TEXT DEFAULT 'book-open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subjects_semester ON public.subjects(semester);
CREATE INDEX IF NOT EXISTS idx_subjects_branch ON public.subjects(branch);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);

DROP TRIGGER IF EXISTS trg_subjects_updated_at ON public.subjects;
CREATE TRIGGER trg_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects_select_public" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "subjects_insert_faculty_admin" ON public.subjects FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "subjects_update_faculty_admin" ON public.subjects FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "subjects_delete_admin" ON public.subjects FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 03. EXAMS
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

CREATE INDEX IF NOT EXISTS idx_exams_subject_id ON public.exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_exam_date ON public.exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_exams_exam_type ON public.exams(exam_type);

DROP TRIGGER IF EXISTS trg_exams_updated_at ON public.exams;
CREATE TRIGGER trg_exams_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exams_select_public" ON public.exams FOR SELECT USING (is_published = true);
CREATE POLICY "exams_insert_faculty_admin" ON public.exams FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "exams_update_faculty_admin" ON public.exams FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "exams_delete_faculty_admin" ON public.exams FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- 04. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    max_marks INT NOT NULL DEFAULT 100,
    attachment_url TEXT,
    submission_format TEXT DEFAULT 'PDF / GitHub Link',
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_subject_id ON public.assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);

DROP TRIGGER IF EXISTS trg_assignments_updated_at ON public.assignments;
CREATE TRIGGER trg_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_select_public" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "assignments_insert_faculty" ON public.assignments FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "assignments_update_creator_or_admin" ON public.assignments FOR UPDATE TO authenticated
    USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "assignments_delete_creator_or_admin" ON public.assignments FOR DELETE TO authenticated
    USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 05. ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_file_url TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.assignment_submissions(student_id);

DROP TRIGGER IF EXISTS trg_submissions_updated_at ON public.assignment_submissions;
CREATE TRIGGER trg_submissions_updated_at
    BEFORE UPDATE ON public.assignment_submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_select_own" ON public.assignment_submissions FOR SELECT TO authenticated
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_submissions.assignment_id AND (a.created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))));
CREATE POLICY "submissions_insert_student" ON public.assignment_submissions FOR INSERT TO authenticated
    WITH CHECK (student_id = auth.uid());
CREATE POLICY "submissions_update_student_or_grader" ON public.assignment_submissions FOR UPDATE TO authenticated
    USING ((student_id = auth.uid() AND grade IS NULL) OR EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_submissions.assignment_id AND (a.created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))));
CREATE POLICY "submissions_delete_student" ON public.assignment_submissions FOR DELETE TO authenticated
    USING (student_id = auth.uid() AND grade IS NULL);

-- 06. PYQS
CREATE TABLE IF NOT EXISTS public.pyqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('MTE', 'ETE', 'Backlog', 'Quiz')),
    exam_year INT NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    title TEXT NOT NULL,
    paper_file_url TEXT NOT NULL,
    solution_file_url TEXT,
    has_solution BOOLEAN DEFAULT FALSE,
    verified_by_faculty BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES public.profiles(id),
    download_count INT NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pyqs_subject_id ON public.pyqs(subject_id);
CREATE INDEX IF NOT EXISTS idx_pyqs_exam_year ON public.pyqs(exam_year);
CREATE INDEX IF NOT EXISTS idx_pyqs_exam_type ON public.pyqs(exam_type);

DROP TRIGGER IF EXISTS trg_pyqs_updated_at ON public.pyqs;
CREATE TRIGGER trg_pyqs_updated_at
    BEFORE UPDATE ON public.pyqs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_pyq_downloads(target_pyq_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.pyqs SET download_count = download_count + 1 WHERE id = target_pyq_id;
END;
$$;

ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pyqs_select_public" ON public.pyqs FOR SELECT USING (true);
CREATE POLICY "pyqs_insert_auth" ON public.pyqs FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "pyqs_update_faculty_admin" ON public.pyqs FOR UPDATE TO authenticated
    USING (uploaded_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')));
CREATE POLICY "pyqs_delete_auth" ON public.pyqs FOR DELETE TO authenticated
    USING (uploaded_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- 07. PRACTICE QUESTIONS
CREATE TABLE IF NOT EXISTS public.practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    exam_stage TEXT NOT NULL CHECK (exam_stage IN ('MTE', 'ETE', 'Backlog', 'General')) DEFAULT 'ETE',
    question_number INT DEFAULT 1,
    title TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
    problem_statement TEXT NOT NULL,
    sample_input TEXT,
    sample_output TEXT,
    time_complexity TEXT DEFAULT 'O(N)',
    space_complexity TEXT DEFAULT 'O(1)',
    complexity_rating TEXT CHECK (complexity_rating IN ('good', 'ok', 'bad')) DEFAULT 'good',
    code_java TEXT,
    code_python TEXT,
    code_cpp TEXT,
    pseudocode_steps JSONB DEFAULT '[]'::jsonb,
    insights TEXT,
    pitfalls_warning TEXT,
    upvotes INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_practice_subject_id ON public.practice_questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_practice_topic ON public.practice_questions(topic);

DROP TRIGGER IF EXISTS trg_practice_questions_updated_at ON public.practice_questions;
CREATE TRIGGER trg_practice_questions_updated_at
    BEFORE UPDATE ON public.practice_questions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practice_questions_select_public" ON public.practice_questions FOR SELECT USING (true);
CREATE POLICY "practice_questions_insert_faculty_admin" ON public.practice_questions FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')));
CREATE POLICY "practice_questions_update_faculty_admin" ON public.practice_questions FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')));
CREATE POLICY "practice_questions_delete_faculty_admin" ON public.practice_questions FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')));

-- 08. USER PRACTICE STATUS
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

CREATE INDEX IF NOT EXISTS idx_practice_status_user_id ON public.user_practice_status(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_status_question_id ON public.user_practice_status(question_id);

DROP TRIGGER IF EXISTS trg_user_practice_status_updated_at ON public.user_practice_status;
CREATE TRIGGER trg_user_practice_status_updated_at
    BEFORE UPDATE ON public.user_practice_status
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.user_practice_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practice_status_select_own" ON public.user_practice_status FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "practice_status_insert_own" ON public.user_practice_status FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "practice_status_update_own" ON public.user_practice_status FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "practice_status_delete_own" ON public.user_practice_status FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 09. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Full Stack Web',
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    banner_image_url TEXT,
    looking_for_teammates BOOLEAN NOT NULL DEFAULT FALSE,
    open_roles TEXT[] NOT NULL DEFAULT '{}',
    mentor_faculty_id UUID REFERENCES public.profiles(id),
    is_faculty_endorsed BOOLEAN NOT NULL DEFAULT FALSE,
    upvotes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON public.projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.upvote_project(target_project_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.projects SET upvotes = upvotes + 1 WHERE id = target_project_id;
END;
$$;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_select_public" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_auth" ON public.projects FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
CREATE POLICY "projects_update_creator_or_admin" ON public.projects FOR UPDATE TO authenticated
    USING (creator_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "projects_delete_creator_or_admin" ON public.projects FOR DELETE TO authenticated
    USING (creator_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- 10. CAMPUS POSTS
CREATE TABLE IF NOT EXISTS public.campus_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (
        category IN ('Official Notice', 'Exam Alert', 'Project Collab', 'Internship', 'Academic Discussion', 'Lost & Found')
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

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.campus_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.campus_posts(category);

DROP TRIGGER IF EXISTS trg_campus_posts_updated_at ON public.campus_posts;
CREATE TRIGGER trg_campus_posts_updated_at
    BEFORE UPDATE ON public.campus_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_post_author_role()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.author_id AND role IN ('teacher', 'admin')) THEN
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
    FOR EACH ROW EXECUTE FUNCTION public.handle_post_author_role();

CREATE OR REPLACE FUNCTION public.upvote_campus_post(target_post_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.campus_posts SET upvotes = upvotes + 1 WHERE id = target_post_id;
END;
$$;

ALTER TABLE public.campus_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_select_public" ON public.campus_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_auth" ON public.campus_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "posts_update_author_or_admin" ON public.campus_posts FOR UPDATE TO authenticated
    USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "posts_delete_author_or_admin" ON public.campus_posts FOR DELETE TO authenticated
    USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
