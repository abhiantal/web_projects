# 🎓 Campus Circle (Powered by NexGen)
## Modular Supabase Database Architecture – Table-by-Table Reference

All SQL schema files are organized cleanly in this directory (`C:\StudioProjects\websit\sql\`), separated by individual table and functional domain.

---

### 📋 Migration Execution Order

When running these scripts in the **Supabase Dashboard -> SQL Editor**, execute them in numerical order:

| File Name | Primary Table / Component | Purpose & Description |
| :--- | :--- | :--- |
| **`00_init_schemas_and_helpers.sql`** | Extensions & Schema | Enables `uuid-ossp`, `pgcrypto`, creates `internal` schema and `update_updated_at_column()` trigger function. |
| **`01_profiles.sql`** | `public.profiles` | User accounts with roles (`student`, `teacher`, `admin`), auto-sync trigger on auth signup, and RLS policies. |
| **`02_subjects.sql`** | `public.subjects` | Academic courses, semester mapping (1–8), branch, credits, syllabus links, and visual theme tokens. |
| **`03_exams.sql`** | `public.exams` | Exam timetables (MTE/ETE/Backlog), countdown trackers, exam room numbers, and seating allocation URLs. |
| **`04_assignments.sql`** | `public.assignments` | Teacher-posted coursework briefs, due date timestamps, max marks, and attachments. |
| **`05_assignment_submissions.sql`** | `public.assignment_submissions` | Student file uploads, submission timestamps, grades, and teacher feedback with RLS privacy. |
| **`06_pyqs.sql`** | `public.pyqs` | Previous Year Question vault with year/semester filtering, solved badges, and download counter RPC. |
| **`07_practice_questions.sql`** | `public.practice_questions` | Interactive coding & theory question bank (modeled after `exam_sem_6`), complexity meters, and code solutions. |
| **`08_user_practice_status.sql`** | `public.user_practice_status` | Student mastery tracker (`mastered`, `review_later`, `starred`) for personalized study progress. |
| **`09_projects.sql`** | `public.projects` | Student showcase gallery and "Find My Teammate" role matcher with upvoting RPC. |
| **`10_campus_posts.sql`** | `public.campus_posts` | Campus notices and broadcast feed with automatic faculty verification badges and pinned announcements. |
| **`11_storage_buckets.sql`** | Storage Buckets | Configures Supabase Storage buckets (`pyqs`, `assignments`, `submissions`, `avatars`, `project_assets`) and bucket RLS policies. |
| **`12_seed_mock_data.sql`** | Initial Seed Data | Pre-populates Semester 6 subjects (AAPS, CD, NLP, SE, WT, DAA), sample exams, and practice questions from `exam_sem_6`. |

---

### 🚀 Quick 1-Click Execution

To set up everything at once:
1. Open your Supabase Project: **[database.new](https://database.new)** or your active project.
2. Go to the **SQL Editor** tab on the left sidebar.
3. You can run files `00` through `12` sequentially, or combine them into a single migration query!
