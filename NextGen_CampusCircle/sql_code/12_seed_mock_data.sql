-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 12: SEED DATA (Curriculum, Exams, PYQs & Practice Sets)
-- Ingesting Semester 6 Academic Subjects from exam_sem_6
-- ============================================================

-- 1. Insert Semester 6 Core Subjects
INSERT INTO public.subjects (code, name, short_name, branch, semester, credits, description, color_accent, icon_name)
VALUES 
    (
        'CS601',
        'Advanced Algorithms & Problem Solving',
        'AAPS',
        'CSE',
        6,
        4,
        'Advanced data structures, two pointers, prefix sums, DP, graph algorithms, and competitive programming patterns.',
        '#00d4aa',
        'code'
    ),
    (
        'CS602',
        'Compiler Design',
        'CD',
        'CSE',
        6,
        4,
        'Lexical analysis, LL/LR parsing algorithms, syntax directed translation, three-address code, and DAG code optimization.',
        '#6366f1',
        'cpu'
    ),
    (
        'CS603',
        'Natural Language Processing',
        'NLP',
        'CSE',
        6,
        3,
        'Tokenization, N-grams, TF-IDF vectorization, POS tagging, Word2Vec, sentiment classification, and transformer attention.',
        '#a855f7',
        'message-square'
    ),
    (
        'CS604',
        'Software Engineering',
        'SE',
        'CSE',
        6,
        3,
        'SDLC methodologies, Agile Scrum sprint metrics, COCOMO effort estimation numericals, and Black-box/White-box testing.',
        '#f59e0b',
        'layers'
    ),
    (
        'CS605',
        'Web Technology',
        'WT',
        'CSE',
        6,
        4,
        'Modern HTML5/CSS3 architecture, JavaScript ES6+ runtime, asynchronous event loops, REST APIs, and responsive layouts.',
        '#38bdf8',
        'globe'
    ),
    (
        'CS606',
        'Design & Analysis of Algorithms',
        'DAA',
        'CSE',
        6,
        4,
        'Asymptotic notations, Divide and Conquer, Greedy paradigms, Dynamic Programming, Backtracking, and NP-Completeness.',
        '#10b981',
        'git-branch'
    )
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    description = EXCLUDED.description;

-- 2. Insert Sample Upcoming Exams
DO $$
DECLARE
    v_aaps_id UUID;
    v_cd_id UUID;
    v_nlp_id UUID;
    v_se_id UUID;
    v_wt_id UUID;
BEGIN
    SELECT id INTO v_aaps_id FROM public.subjects WHERE code = 'CS601';
    SELECT id INTO v_cd_id FROM public.subjects WHERE code = 'CS602';
    SELECT id INTO v_nlp_id FROM public.subjects WHERE code = 'CS603';
    SELECT id INTO v_se_id FROM public.subjects WHERE code = 'CS604';
    SELECT id INTO v_wt_id FROM public.subjects WHERE code = 'CS605';

    -- Insert Sample Exams if not already existing
    IF NOT EXISTS (SELECT 1 FROM public.exams WHERE subject_id = v_aaps_id AND exam_type = 'ETE') THEN
        INSERT INTO public.exams (subject_id, exam_type, exam_date, start_time, end_time, room_number, block_name, guidelines)
        VALUES 
            (v_aaps_id, 'ETE', '2026-06-15', '09:30:00', '12:30:00', 'Room 302', 'Turing Academic Block', 'Calculator not permitted. Bring blue/black pens and university ID.'),
            (v_cd_id, 'ETE', '2026-06-18', '09:30:00', '12:30:00', 'Room 304', 'Turing Academic Block', 'Grammar conversion scratch sheets will be provided.'),
            (v_nlp_id, 'ETE', '2026-06-22', '09:30:00', '12:30:00', 'Room 201', 'Aryabhata Block', 'Statistical tables provided in exam hall.'),
            (v_se_id, 'ETE', '2026-06-25', '09:30:00', '12:30:00', 'Room 205', 'Aryabhata Block', 'COCOMO numerical formulas cheat sheet permitted if stamped.'),
            (v_wt_id, 'ETE', '2026-06-28', '09:30:00', '12:30:00', 'Lab 4 & 5', 'Computer Center', 'Hands-on practical + theoretical viva.');
    END IF;

    -- 3. Insert Sample Interactive Practice Questions (from exam_sem_6)
    IF NOT EXISTS (SELECT 1 FROM public.practice_questions WHERE subject_id = v_aaps_id) THEN
        INSERT INTO public.practice_questions (
            subject_id, topic, exam_stage, question_number, title, difficulty,
            problem_statement, sample_input, sample_output, time_complexity, space_complexity,
            complexity_rating, code_java, insights, pitfalls_warning
        )
        VALUES 
        (
            v_aaps_id,
            'Prefix Sum & Sliding Window',
            'ETE',
            1,
            'Subarray Sum Equals K with Negative Numbers',
            'Medium',
            'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
            'nums = [1, 1, 1], k = 2',
            '2',
            'O(N)',
            'O(N)',
            'good',
            'import java.util.HashMap;\n\npublic class Solution {\n    public static int subarraySum(int[] nums, int k) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        map.put(0, 1);\n        int count = 0, sum = 0;\n        for (int num : nums) {\n            sum += num;\n            if (map.containsKey(sum - k)) {\n                count += map.get(sum - k);\n            }\n            map.put(sum, map.getOrDefault(sum, 0) + 1);\n        }\n        return count;\n    }\n}',
            'Always initialize the frequency map with map.put(0, 1) to account for valid subarrays that start at index 0.',
            'Two-pointer / sliding window fails when negative numbers exist in the array. Hash map prefix sum is strictly required!'
        ),
        (
            v_aaps_id,
            'Stack & Two Pointers',
            'ETE',
            2,
            'Implement Two Stacks in a Single Array',
            'Easy',
            'Design a data structure that implements two stacks using only one array of size N such that neither stack overflows until all N elements are consumed.',
            'push1(5), push2(10), push2(15), pop1()',
            '5',
            'O(1)',
            'O(1)',
            'good',
            'public class TwoStacks {\n    int[] arr;\n    int top1, top2, size;\n\n    public TwoStacks(int n) {\n        size = n;\n        arr = new int[n];\n        top1 = -1;\n        top2 = n;\n    }\n\n    public void push1(int x) {\n        if (top1 < top2 - 1) arr[++top1] = x;\n        else throw new StackOverflowError("Stack 1 Overflow");\n    }\n\n    public void push2(int x) {\n        if (top1 < top2 - 1) arr[--top2] = x;\n        else throw new StackOverflowError("Stack 2 Overflow");\n    }\n\n    public int pop1() {\n        if (top1 >= 0) return arr[top1--];\n        return -1;\n    }\n\n    public int pop2() {\n        if (top2 < size) return arr[top2++];\n        return -1;\n    }\n}',
            'Start Stack 1 from the left edge (index 0) moving right, and Stack 2 from the right edge (index N-1) moving left.',
            'Ensure boundary check: top1 < top2 - 1 before pushing into either stack.'
        ),
        (
            v_cd_id,
            'Parsing Algorithms',
            'ETE',
            1,
            'First and Follow Computation for Non-Terminals',
            'Medium',
            'Given a context-free grammar with productions E -> T E'', E'' -> + T E'' | ε, compute the FIRST and FOLLOW sets.',
            'Grammar: E -> T E'', E'' -> + T E'' | ε',
            'FIRST(E) = {(, id}, FOLLOW(E) = {$, )}',
            'O(V * P)',
            'O(V)',
            'good',
            '// Java pseudocode for calculating First and Follow\n// Using DFS graph traversal on non-terminal dependencies',
            'If ε is in FIRST(Y1), look into FIRST(Y2). If all symbols derive ε, add ε to FIRST of LHS.',
            'Never include ε in the FOLLOW set of any non-terminal!'
        );
    END IF;

    -- 4. Insert Sample PYQs
    IF NOT EXISTS (SELECT 1 FROM public.pyqs WHERE subject_id = v_aaps_id) THEN
        INSERT INTO public.pyqs (subject_id, exam_type, exam_year, semester, title, paper_file_url, solution_file_url, has_solution, verified_by_faculty, download_count)
        VALUES
            (v_aaps_id, 'ETE', 2025, 6, 'AAPS End-Term Exam Paper 2025 (Official Solved)', 'pyqs/aaps_ete_2025.pdf', 'pyqs/aaps_ete_2025_solutions.pdf', true, true, 482),
            (v_cd_id, 'ETE', 2025, 6, 'Compiler Design ETE June 2025 with Numericals', 'pyqs/compiler_design_ete_2025.pdf', 'pyqs/cd_numericals_solutions.pdf', true, true, 340),
            (v_nlp_id, 'ETE', 2025, 6, 'NLP Comprehensive ETE 2025 with Transformers', 'pyqs/nlp_ete_2025.pdf', NULL, false, false, 215),
            (v_se_id, 'ETE', 2025, 6, 'Software Engineering ETE 2025 COCOMO Solved', 'pyqs/se_ete_2025.pdf', 'pyqs/se_cocomo_solutions.pdf', true, true, 290),
            (v_wt_id, 'ETE', 2025, 6, 'Web Technology ETE 2025 PYQ & Solutions', 'pyqs/web_tech_ete_2025.pdf', 'pyqs/web_tech_ete_solutions.pdf', true, true, 510);
    END IF;
END $$;
