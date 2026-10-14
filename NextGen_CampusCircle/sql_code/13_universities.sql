-- ============================================================
-- 🎓 CAMPUS CIRCLE (POWERED BY NEXGEN)
-- 📁 FILE 13: UNIVERSITIES TABLE (Directory, History & Placements)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,                -- e.g., 'apex-institute', 'dtu', 'nit'
    name TEXT NOT NULL,                       -- e.g., 'Apex Institute of Technology'
    short_name TEXT NOT NULL,                 -- e.g., 'AIT', 'DTU'
    location TEXT NOT NULL,                   -- e.g., 'Chandigarh / Mohali, India'
    established_year INT NOT NULL DEFAULT 1998,
    history TEXT NOT NULL,                    -- Comprehensive heritage and founding vision
    ranking_nirf TEXT DEFAULT 'Rank #28 in Engineering',
    accreditation TEXT DEFAULT 'NAAC A++ Grade',
    logo_url TEXT,
    banner_url TEXT,
    student_count INT DEFAULT 14500,
    faculty_count INT DEFAULT 850,
    faculty_ratio TEXT DEFAULT '1:17',
    programs JSONB NOT NULL DEFAULT '[]'::jsonb,
    placements JSONB NOT NULL DEFAULT '{}'::jsonb,
    website_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_universities_slug ON public.universities(slug);
CREATE INDEX IF NOT EXISTS idx_universities_name ON public.universities(name);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
DROP TRIGGER IF EXISTS trg_universities_updated_at ON public.universities;
CREATE TRIGGER trg_universities_updated_at
    BEFORE UPDATE ON public.universities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- 1. All visitors can read university profiles
CREATE POLICY "universities_select_public" ON public.universities
    FOR SELECT
    USING (true);

-- 2. Only admin can insert/modify university records
CREATE POLICY "universities_manage_admin" ON public.universities
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================
INSERT INTO public.universities (slug, name, short_name, location, established_year, history, ranking_nirf, accreditation, student_count, faculty_count, faculty_ratio, programs, placements, website_url)
VALUES 
(
    'galgotias-university',
    'Galgotias University',
    'GU',
    'Plot No. 2, Sector 17-A, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201',
    2011,
    'Galgotias University, situated on the Yamuna Expressway in Greater Noida, Uttar Pradesh, is one of India''s leading multidisciplinary private universities. Established in 2011 by the Galgotias Educational Institutions, the university holds the prestigious NAAC A+ accreditation with a high score of 3.37. Renowned for its cutting-edge research ecosystems, modern engineering computing clusters, and vibrant student-led technical societies, Galgotias University is home to over 32,000 students from across 180+ global regions.',
    'Ranked Top 100 in India (NIRF) • #1 Private University in UP',
    'NAAC A+ Grade (3.37 CGPA)',
    32000,
    1450,
    '1:19',
    '[
        {"name": "B.Tech Computer Science & Engineering", "duration": "4 Years", "seats": 1200, "specializations": ["Artificial Intelligence & ML", "Cloud Architecture & DevOps", "Cybersecurity"]},
        {"name": "B.Tech CSE (AI & Machine Learning)", "duration": "4 Years", "seats": 480, "specializations": ["Generative AI", "Computer Vision", "Deep Learning"]},
        {"name": "Bachelor of Computer Applications (BCA)", "duration": "3 Years", "seats": 360, "specializations": ["Full Stack Development", "Mobile App Architecture"]},
        {"name": "Master of Computer Applications (MCA)", "duration": "2 Years", "seats": 180, "specializations": ["Enterprise Cloud Applications", "Data Science"]},
        {"name": "Master of Business Administration (MBA)", "duration": "2 Years", "seats": 300, "specializations": ["Financial Analytics", "Marketing & Brand Strategy"]}
    ]'::jsonb,
    '{
        "highest_package": "₹1.50 Crore PA (International) / ₹44 LPA (National)",
        "average_package": "₹6.80 LPA",
        "median_package": "₹5.40 LPA",
        "placement_rate": "96.4%",
        "total_offers": "8,500+",
        "marquee_recruiters": ["Microsoft", "Google", "Amazon", "Cognizant", "Infosys", "Wipro", "Capgemini", "TCS", "Accenture", "Deloitte"]
    }'::jsonb,
    'https://www.galgotiasuniversity.edu.in'
),
(
    'noida-international-university',
    'Noida International University',
    'NIU',
    'Plot 1, Sector 17-A, Yamuna Expressway, Gautam Buddha Nagar, Greater Noida, Uttar Pradesh 203201',
    2010,
    'Noida International University (NIU) is a premier 75-acre world-class educational hub strategically located on the Yamuna Expressway in Greater Noida, opposite the Formula 1 Buddh International Circuit. Founded in 2010 under Uttar Pradesh State Legislature Act No. 27, NIU houses 12 constituent schools covering Engineering & Technology, Business Management, Law, and the esteemed NIIMS 450+ bed super-specialty teaching hospital. Welcoming scholars from over 54 countries, NIU is known for multicultural global education and high-impact industrial partnerships.',
    'Awarded Best Private University in North India • Top 50 Emerging Tech Universities',
    'UGC Recognized (Section 2(f)) • AICTE Approved',
    18500,
    980,
    '1:18',
    '[
        {"name": "B.Tech Computer Science & Engineering", "duration": "4 Years", "seats": 360, "specializations": ["Cloud Computing & DevOps", "Cyber Security", "Data Science"]},
        {"name": "B.Tech Information Technology", "duration": "4 Years", "seats": 180, "specializations": ["Enterprise Software Systems", "Cloud Infrastructure"]},
        {"name": "Bachelor of Computer Applications (BCA)", "duration": "3 Years", "seats": 240, "specializations": ["Web Application Development", "Mobile Computing"]},
        {"name": "Bachelor of Business Administration (BBA)", "duration": "3 Years", "seats": 240, "specializations": ["International Business", "Digital Marketing"]},
        {"name": "M.Tech Computer Science & Engineering", "duration": "2 Years", "seats": 60, "specializations": ["Advanced Computing", "Distributed Systems"]}
    ]'::jsonb,
    '{
        "highest_package": "₹36.5 LPA",
        "average_package": "₹5.85 LPA",
        "median_package": "₹4.80 LPA",
        "placement_rate": "93.2%",
        "total_offers": "3,200+",
        "marquee_recruiters": ["IBM", "HCLTech", "Tech Mahindra", "Infosys", "Paytm", "Wipro", "Capgemini", "BYJU''S", "Amazon"]
    }'::jsonb,
    'https://niu.edu.in'
)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    history = EXCLUDED.history,
    placements = EXCLUDED.placements;
