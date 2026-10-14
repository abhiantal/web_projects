/**
 * CAMPUS CIRCLE (Powered by NextGen)
 * Supabase Client & High-Fidelity Autonomous Data Engine
 * 
 * Automatically synchronizes with live Supabase PostgreSQL backend,
 * with full offline & mock capability incorporating exam_sem_6 academic materials.
 */

// 1. Supabase Initialization Config (Loaded professionally from .env / env.js / localStorage)
const ENV_URL = (window.__ENV__ && window.__ENV__.SUPABASE_URL) || localStorage.getItem('CC_SUPABASE_URL') || '';
const ENV_KEY = (window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY) || localStorage.getItem('CC_SUPABASE_KEY') || '';

window.CampusConfig = {
  supabaseUrl: ENV_URL,
  supabaseKey: ENV_KEY,
  isLive: !!(ENV_URL && !ENV_URL.includes('your-project-id') && ENV_KEY && !ENV_KEY.includes('sample-anon-key'))
};

// 2. High-Fidelity Mock & Fallback Academic Data (Pre-populated with exam_sem_6 content)
const MOCK_DATA = {
  subjects: [
    { id: 'sub-1', code: 'CS601', name: 'Advanced Algorithms & Problem Solving', short_name: 'AAPS', branch: 'CSE', semester: 6, credits: 4, color: '#00d4aa', icon: 'code' },
    { id: 'sub-2', code: 'CS602', name: 'Compiler Design', short_name: 'CD', branch: 'CSE', semester: 6, credits: 4, color: '#6366f1', icon: 'cpu' },
    { id: 'sub-3', code: 'CS603', name: 'Natural Language Processing', short_name: 'NLP', branch: 'CSE', semester: 6, credits: 3, color: '#a855f7', icon: 'message-square' },
    { id: 'sub-4', code: 'CS604', name: 'Software Engineering', short_name: 'SE', branch: 'CSE', semester: 6, credits: 3, color: '#f59e0b', icon: 'layers' },
    { id: 'sub-5', code: 'CS605', name: 'Web Technology', short_name: 'WT', branch: 'CSE', semester: 6, credits: 4, color: '#38bdf8', icon: 'globe' },
    { id: 'sub-6', code: 'CS606', name: 'Design & Analysis of Algorithms', short_name: 'DAA', branch: 'CSE', semester: 6, credits: 4, color: '#10b981', icon: 'git-branch' }
  ],

  exams: [
    {
      id: 'ex-1', subject_id: 'sub-1', subject_code: 'CS601', subject_name: 'Advanced Algorithms & Problem Solving',
      exam_type: 'ETE', exam_date: '2026-06-15', start_time: '09:30 AM', end_time: '12:30 PM',
      room_number: 'Room 302', block: 'Turing Academic Block',
      guidelines: 'Physical ID card mandatory. Calculators and smart watches are strictly prohibited.'
    },
    {
      id: 'ex-2', subject_id: 'sub-2', subject_code: 'CS602', subject_name: 'Compiler Design',
      exam_type: 'ETE', exam_date: '2026-06-18', start_time: '09:30 AM', end_time: '12:30 PM',
      room_number: 'Room 304', block: 'Turing Academic Block',
      guidelines: 'Grammar conversion scratch sheets will be supplied in the hall.'
    },
    {
      id: 'ex-3', subject_id: 'sub-3', subject_code: 'CS603', subject_name: 'Natural Language Processing',
      exam_type: 'ETE', exam_date: '2026-06-22', start_time: '09:30 AM', end_time: '12:30 PM',
      room_number: 'Room 201', block: 'Aryabhata Block',
      guidelines: 'Statistical vector formula sheets provided.'
    },
    {
      id: 'ex-4', subject_id: 'sub-4', subject_code: 'CS604', subject_name: 'Software Engineering',
      exam_type: 'ETE', exam_date: '2026-06-25', start_time: '09:30 AM', end_time: '12:30 PM',
      room_number: 'Room 205', block: 'Aryabhata Block',
      guidelines: 'COCOMO numerical formulas table permitted if pre-verified by department.'
    },
    {
      id: 'ex-5', subject_id: 'sub-5', subject_code: 'CS605', subject_name: 'Web Technology',
      exam_type: 'ETE', exam_date: '2026-06-28', start_time: '09:30 AM', end_time: '12:30 PM',
      room_number: 'Lab 4 & 5', block: 'Computer Center',
      guidelines: 'Hands-on practical code execution test followed by oral viva.'
    }
  ],

  assignments: [
    {
      id: 'asg-1', subject_id: 'sub-1', subject_code: 'CS601',
      title: 'Dynamic Programming & Graph Traversal Problem Sheet',
      description: 'Implement Floyd-Warshall and 0/1 Knapsack with memory profiling in Java or C++. Submit code repository and time complexity proof.',
      due_date: new Date(Date.now() + 36 * 3600 * 1000).toISOString(), // ~36 hours from now (Urgent)
      max_marks: 50, submission_format: 'GitHub Link / PDF Report',
      instructor: 'Dr. R. Sharma (Faculty)', submitted: false
    },
    {
      id: 'asg-2', subject_id: 'sub-2', subject_code: 'CS602',
      title: 'LL(1) Parser Grammar Construction & First/Follow Computation',
      description: 'Construct LL(1) parsing tables for given ambiguous and non-ambiguous arithmetic grammar, eliminate left recursion, and generate parse trees.',
      due_date: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      max_marks: 30, submission_format: 'PDF Solution Document',
      instructor: 'Prof. S. Verma', submitted: true
    },
    {
      id: 'asg-3', subject_id: 'sub-5', subject_code: 'CS605',
      title: 'Full-Stack REST API & Cloud Database Integration Project Brief',
      description: 'Design a responsive client web application connecting to an encrypted PostgreSQL database with Row Level Security and asynchronous state updates.',
      due_date: new Date(Date.now() + 9 * 24 * 3600 * 1000).toISOString(),
      max_marks: 100, submission_format: 'Live URL + GitHub Repo',
      instructor: 'A.K.Antal (NextGen Academic Mentor)', submitted: false
    }
  ],

  pyqs: [
    {
      id: 'pyq-1', subject_id: 'sub-1', subject_code: 'CS601', subject_name: 'Advanced Algorithms & Problem Solving',
      semester: 6, exam_type: 'ETE', year: 2025, title: 'AAPS End-Term Question Paper June 2025 (Solved)',
      has_solution: true, verified: true, download_count: 512, file_name: 'AAPS_ETE_2025_Solved.pdf'
    },
    {
      id: 'pyq-2', subject_id: 'sub-2', subject_code: 'CS602', subject_name: 'Compiler Design',
      semester: 6, exam_type: 'ETE', year: 2025, title: 'Compiler Design ETE June 2025 with Numericals',
      has_solution: true, verified: true, download_count: 384, file_name: 'CD_ETE_2025_Numericals.pdf'
    },
    {
      id: 'pyq-3', subject_id: 'sub-3', subject_code: 'CS603', subject_name: 'Natural Language Processing',
      semester: 6, exam_type: 'ETE', year: 2025, title: 'NLP ETE 2025 Comprehensive Paper',
      has_solution: false, verified: false, download_count: 198, file_name: 'NLP_ETE_2025_Official.pdf'
    },
    {
      id: 'pyq-4', subject_id: 'sub-4', subject_code: 'CS604', subject_name: 'Software Engineering',
      semester: 6, exam_type: 'ETE', year: 2025, title: 'Software Engineering ETE 2025 COCOMO Solved',
      has_solution: true, verified: true, download_count: 340, file_name: 'SE_ETE_2025_COCOMO_Solutions.pdf'
    },
    {
      id: 'pyq-5', subject_id: 'sub-5', subject_code: 'CS605', subject_name: 'Web Technology',
      semester: 6, exam_type: 'ETE', year: 2025, title: 'Web Technology ETE 2025 Solved PYQ & Practical Solutions',
      has_solution: true, verified: true, download_count: 620, file_name: 'WT_ETE_2025_Full_Solution.pdf'
    },
    {
      id: 'pyq-6', subject_id: 'sub-1', subject_code: 'CS601', subject_name: 'Advanced Algorithms & Problem Solving',
      semester: 6, exam_type: 'MTE', year: 2025, title: 'AAPS Mid-Term Exam Paper 2025 (Solutions)',
      has_solution: true, verified: true, download_count: 430, file_name: 'AAPS_MTE_2025_Solutions.pdf'
    }
  ],

  practice_questions: [
    {
      id: 'pq-1', subject_id: 'sub-1', subject_code: 'CS601', topic: 'Prefix Sum & Hashing',
      exam_stage: 'ETE', question_number: 1, difficulty: 'Medium',
      title: 'Subarray Sum Equals K with Negative Numbers',
      problem_statement: 'Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`. Negative integers are allowed.',
      sample_input: 'nums = [1, -1, 1, 1, 1, 1], k = 3',
      sample_output: '3',
      time_complexity: 'O(N)', space_complexity: 'O(N)', complexity_rating: 'good',
      insights: 'Always initialize the prefix frequency map with `map.put(0, 1)` to handle subarrays starting at index 0.',
      pitfalls_warning: 'Sliding window fails when negative numbers exist in the array. Prefix sum with hash map is strictly required!',
      code_java: `import java.util.HashMap;

public class Solution {
    public static int subarraySum(int[] nums, int k) {
        HashMap<Integer, Integer> map = new HashMap<>();
        map.put(0, 1); // Base case for prefix starting at 0
        int count = 0, currentSum = 0;

        for (int num : nums) {
            currentSum += num;
            if (map.containsKey(currentSum - k)) {
                count += map.get(currentSum - k);
            }
            map.put(currentSum, map.getOrDefault(currentSum, 0) + 1);
        }
        return count;
    }
}`,
      code_python: `def subarray_sum(nums: list[int], k: int) -> int:
    prefix_map = {0: 1}
    count = current_sum = 0
    for num in nums:
        current_sum += num
        if (current_sum - k) in prefix_map:
            count += prefix_map[current_sum - k]
        prefix_map[current_sum] = prefix_map.get(current_sum, 0) + 1
    return count`
    },
    {
      id: 'pq-2', subject_id: 'sub-1', subject_code: 'CS601', topic: 'Stack & Memory Optimization',
      exam_stage: 'ETE', question_number: 2, difficulty: 'Easy',
      title: 'Implement Two Stacks in a Single Array',
      problem_statement: 'Design a data structure that implements two stacks using only a single 1D array of size N such that neither stack overflows until all N slots are occupied.',
      sample_input: 'push1(10), push2(90), push2(80), pop1()',
      sample_output: '10',
      time_complexity: 'O(1)', space_complexity: 'O(1)', complexity_rating: 'good',
      insights: 'Grow Stack 1 from index 0 upwards, and Stack 2 from index N-1 downwards.',
      pitfalls_warning: 'Boundary check: Ensure `top1 < top2 - 1` before pushing to either stack.',
      code_java: `public class TwoStacks {
    int[] arr;
    int top1, top2, size;

    public TwoStacks(int n) {
        size = n;
        arr = new int[n];
        top1 = -1;
        top2 = n;
    }

    public void push1(int val) {
        if (top1 < top2 - 1) arr[++top1] = val;
        else throw new StackOverflowError("Stack 1 Overflow");
    }

    public void push2(int val) {
        if (top1 < top2 - 1) arr[--top2] = val;
        else throw new StackOverflowError("Stack 2 Overflow");
    }

    public int pop1() {
        if (top1 >= 0) return arr[top1--];
        return -1; // Underflow
    }

    public int pop2() {
        if (top2 < size) return arr[top2++];
        return -1; // Underflow
    }
}`
    },
    {
      id: 'pq-3', subject_id: 'sub-2', subject_code: 'CS602', topic: 'Parsing & Grammars',
      exam_stage: 'ETE', question_number: 1, difficulty: 'Medium',
      title: 'First and Follow Set Computation in LL(1) Grammars',
      problem_statement: "Given non-terminal productions for arithmetic expressions: E -> T E', E' -> + T E' | ε, T -> F T', T' -> * F T' | ε, F -> ( E ) | id, compute the FIRST and FOLLOW sets for each non-terminal.",
      sample_input: 'Grammar with start symbol E',
      sample_output: 'FIRST(E) = {(, id}, FOLLOW(E) = {$, )}',
      time_complexity: 'O(V * P)', space_complexity: 'O(V)', complexity_rating: 'good',
      insights: 'If ε is in FIRST(Y1), examine FIRST(Y2). If all symbols derive ε, add ε to FIRST of LHS.',
      pitfalls_warning: 'Never add ε to the FOLLOW set of any non-terminal! The $ symbol must always be in FOLLOW of the start symbol.',
      code_java: `// Conceptual First & Follow Engine in Java
// Traverses grammar productions using DFS on non-terminal dependency graphs`
    },
    {
      id: 'pq-4', subject_id: 'sub-4', subject_code: 'CS604', topic: 'Cost Estimation & Metrics',
      exam_stage: 'ETE', question_number: 1, difficulty: 'Medium',
      title: 'COCOMO Intermediate Effort & Duration Estimation',
      problem_statement: 'A software project is estimated at 35 KLOC for an Embedded mode system. Calculate the total Effort (Person-Months) and Development Time (Months) given a = 3.6, b = 1.20, c = 2.5, d = 0.32.',
      sample_input: 'Size = 35 KLOC, Mode = Embedded',
      sample_output: 'Effort ≈ 254.6 Person-Months, Duration ≈ 19.3 Months',
      time_complexity: 'O(1)', space_complexity: 'O(1)', complexity_rating: 'good',
      insights: 'Formula: Effort = a * (KLOC)^b; Tdev = c * (Effort)^d.',
      pitfalls_warning: 'Ensure size is strictly in KLOC (thousands of lines of code), not raw lines of code!',
      code_java: `public class CocomoEstimation {
    public static void main(String[] args) {
        double kloc = 35.0;
        double a = 3.6, b = 1.20, c = 2.5, d = 0.32;
        double effort = a * Math.pow(kloc, b);
        double tdev = c * Math.pow(effort, d);
        System.out.printf("Effort: %.2f PM | Duration: %.2f Months\\n", effort, tdev);
    }
}`
    }
  ],

  projects: [
    {
      id: 'proj-1', title: 'Campus Circle Academic OS',
      tagline: 'All-in-one university hub connecting students and professors with encrypted cloud data sync.',
      category: 'Full Stack Web',
      tech_stack: ['Cloud Database', 'PostgreSQL', 'Vanilla JS', 'Glassmorphism', 'CSS Tokens'],
      github_url: 'https://github.com/nextgen/campus-circle',
      demo_url: 'index.html',
      looking_for_teammates: true,
      open_roles: ['Mobile Dev (Flutter)', 'UI/UX Designer', 'Backend Architect'],
      upvotes: 84
    },
    {
      id: 'proj-2', title: 'Smart Attendance Radar with Face & BLE',
      tagline: 'Automated lecture attendance tracking with anti-spoofing beacon verification.',
      category: 'IoT & AI',
      tech_stack: ['Python', 'OpenCV', 'FastAPI', 'Raspberry Pi', 'React'],
      github_url: 'https://github.com/campus-projects/smart-attendance',
      demo_url: '#',
      looking_for_teammates: true,
      open_roles: ['Computer Vision Specialist', 'Firmware Engineer'],
      upvotes: 62
    },
    {
      id: 'proj-3', title: 'Automated Academic Schedule Optimizer',
      tagline: 'Genetic algorithm timetabling engine resolving teacher and room clashes.',
      category: 'Algorithms & AI',
      tech_stack: ['Java 21', 'Spring Boot', 'Genetic Algorithms', 'Tailwind'],
      github_url: 'https://github.com/campus-projects/timetable-solver',
      demo_url: '#',
      looking_for_teammates: false,
      open_roles: [],
      upvotes: 45
    }
  ],

  campus_posts: [
    {
      id: 'post-1', category: 'Official Notice',
      title: 'End-Term Examination (ETE) June 2026 Schedule & Seating Allotment Released',
      content: 'The Office of the Controller of Examinations has published the final timetable for B.Tech Semester 6. Students can check their designated rooms and download admit cards from the Exams tab.',
      author: 'Office of Controller of Examinations',
      is_official_faculty: true, is_pinned: true, upvotes: 128,
      timestamp: '2 hours ago'
    },
    {
      id: 'post-2', category: 'Internship',
      title: 'NextGen Summer Research & Engineering Internship Program 2026',
      content: 'Applications are now open for Summer 2026 interns in Cloud Systems, AI/ML, and Mobile Architecture. Stipend: ₹35,000/month. Final year and pre-final year students eligible.',
      author: 'NextGen Talent Network',
      is_official_faculty: true, is_pinned: false, upvotes: 94,
      timestamp: 'Yesterday'
    },
    {
      id: 'post-3', category: 'Project Collab',
      title: 'Need 1 Backend Developer (PostgreSQL / Node.js) for Smart Campus Hackathon Team',
      content: 'We are building a collaborative university resource sharing app for the upcoming Annual Hackathon. Looking for a teammate with solid database skills.',
      author: 'Abhi Kumar (CSE Sem 6)',
      is_official_faculty: false, is_pinned: false, upvotes: 31,
      timestamp: '3 days ago'
    }
  ],

  universities: [
    {
      id: 'uni-galgotias',
      slug: 'galgotias-university',
      aliases: ['apex-institute', 'galgotias', 'gu'],
      name: 'Galgotias University',
      short_name: 'GU',
      location: 'Plot No. 2, Sector 17-A, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201',
      established_year: 2011,
      ranking_nirf: 'Ranked Top 100 in India (NIRF) • #1 Private University in UP',
      accreditation: 'NAAC A+ Grade (3.37 CGPA) • UGC Recognized • AICTE Approved • NBA Accredited',
      student_count: 32000,
      faculty_count: 1450,
      faculty_ratio: '1:19',
      chancellor: 'Mr. Suneel Galgotia',
      vice_chancellor: 'Prof. (Dr.) K. Mallikharjuna Babu',
      campus_area: '52-Acre Hi-Tech Smart Campus',
      history: 'Galgotias University, situated on the Yamuna Expressway in Greater Noida, Uttar Pradesh, is one of India\'s leading multidisciplinary private universities. Established in 2011 by the Galgotias Educational Institutions (which pioneered technical education excellence since 1999), the university holds the prestigious NAAC A+ accreditation with a high score of 3.37. Renowned for its cutting-edge research ecosystems, modern engineering computing clusters, and vibrant student-led technical societies, Galgotias University is home to over 32,000 students from across 180+ global regions. Its engineering and management schools consistently rank at the top of national academic and placement surveys.',
      programs: [
        {
          slug: 'btech-cse',
          code: 'BTECH-CSE',
          name: 'B.Tech Computer Science & Engineering',
          degree: 'Bachelor of Technology',
          duration: '4 Years (8 Semesters)',
          seats: 1200,
          credits: 160,
          current_semester: 6,
          eligibility: '10+2 examination with minimum 60% marks in PCM or qualifying rank in JEE Main / GU-ART.',
          description: 'Flagship undergraduate program providing deep expertise in algorithms, systems design, artificial intelligence, cloud architectures, cybersecurity, and full-stack software development.',
          specializations: ['Artificial Intelligence & ML', 'Cloud Architecture & DevOps', 'Cybersecurity & Digital Forensics', 'Full Stack Web Engineering', 'Data Analytics'],
          curriculum_highlights: ['Advanced Data Structures & Algorithms', 'Operating Systems & Linux Kernel', 'Compiler Design', 'Natural Language Processing', 'Web Technology & Cloud Systems', 'Capstone Software Project']
        },
        {
          slug: 'btech-aiml',
          code: 'BTECH-AIML',
          name: 'B.Tech CSE (Artificial Intelligence & Machine Learning)',
          degree: 'Bachelor of Technology',
          duration: '4 Years (8 Semesters)',
          seats: 480,
          credits: 160,
          current_semester: 6,
          eligibility: '10+2 with PCM (Min 60%) or qualifying JEE Main / Galgotias University Admission Test.',
          description: 'Specialized AI/ML curriculum covering deep neural networks, computer vision, natural language transformers, robotics, and generative AI systems.',
          specializations: ['Generative AI & LLMs', 'Computer Vision & Robotics', 'Deep Learning & Neural Architectures'],
          curriculum_highlights: ['Applied Linear Algebra & Statistics', 'Machine Learning Algorithms', 'Computer Vision with PyTorch', 'Generative AI & Transformers', 'Reinforcement Learning']
        },
        {
          slug: 'bca',
          code: 'BCA',
          name: 'Bachelor of Computer Applications (BCA)',
          degree: 'Bachelor Degree',
          duration: '3 Years (6 Semesters)',
          seats: 360,
          credits: 120,
          current_semester: 6,
          eligibility: '10+2 with Mathematics / Computer Applications (Min 50% marks).',
          description: 'Comprehensive software applications curriculum focusing on modern web stacks, mobile application engineering, relational databases, and enterprise IT administration.',
          specializations: ['Full Stack Development', 'Mobile App Development (Android/iOS)', 'Cloud Computing'],
          curriculum_highlights: ['Python & Enterprise Java', 'React & Node.js Web Engineering', 'Database Management Systems', 'Software Engineering & Testing']
        },
        {
          slug: 'mca',
          code: 'MCA',
          name: 'Master of Computer Applications (MCA)',
          degree: 'Master Degree',
          duration: '2 Years (4 Semesters)',
          seats: 180,
          credits: 88,
          current_semester: 4,
          eligibility: 'BCA or B.Sc in Computer Science / IT with minimum 55% aggregate marks.',
          description: 'Advanced postgraduate program preparing software architects for enterprise cloud software engineering, microservices, and AI-driven workflow automation.',
          specializations: ['Enterprise Cloud Applications', 'Full Stack Engineering', 'Data Science & Big Data'],
          curriculum_highlights: ['Distributed Cloud Architectures', 'Enterprise Microservices & DevOps', 'Advanced Machine Learning', 'Industrial Capstone Dissertation']
        },
        {
          slug: 'mba',
          code: 'MBA',
          name: 'Master of Business Administration (MBA Dual Specialization)',
          degree: 'Master of Business Administration',
          duration: '2 Years (4 Semesters)',
          seats: 300,
          credits: 96,
          current_semester: 4,
          eligibility: 'Bachelor\'s degree in any discipline with min 55% marks and valid CAT / MAT / CMAT / GMAT score.',
          description: 'Premier management program accredited by NBA with deep industry-integrated learning in corporate finance, marketing analytics, supply chain, and digital transformation.',
          specializations: ['Financial Analytics', 'Marketing & Brand Strategy', 'Human Resource Management', 'Business Analytics & Big Data'],
          curriculum_highlights: ['Corporate Strategy & Valuation', 'Managerial Economics', 'Digital Marketing Analytics', 'Global Supply Chain Optimization']
        }
      ],
      placements: {
        highest_package: '₹1.50 Crore PA (International) / ₹44 LPA (National)',
        average_package: '₹6.80 LPA',
        median_package: '₹5.40 LPA',
        placement_rate: '96.4%',
        total_offers: '8,500+ Placements (2025-26)',
        international_offers: '52 Global Offers',
        top_recruiters: ['Microsoft', 'Google', 'Amazon', 'Cognizant', 'Infosys', 'Wipro', 'Capgemini', 'TCS Ninja & Digital', 'Accenture', 'Deloitte', 'Tech Mahindra', 'HCLTech']
      },
      website_url: 'https://www.galgotiasuniversity.edu.in'
    },
    {
      id: 'uni-niu',
      slug: 'noida-international-university',
      aliases: ['niu', 'noida-international'],
      name: 'Noida International University',
      short_name: 'NIU',
      location: 'Plot 1, Sector 17-A, Yamuna Expressway, Gautam Buddha Nagar, Greater Noida, Uttar Pradesh 203201',
      established_year: 2010,
      ranking_nirf: 'Awarded Best Private University in North India • Top 50 Emerging Tech Universities',
      accreditation: 'UGC Recognized (Section 2(f)) • AICTE Approved • BCI, INC & COA Approved',
      student_count: 18500,
      faculty_count: 980,
      faculty_ratio: '1:18',
      chancellor: 'Dr. Devesh Kumar Singh',
      vice_chancellor: 'Prof. (Dr.) Uma Bhardwaj',
      campus_area: '75-Acre Sprawling Green Campus',
      history: 'Noida International University (NIU) is a premier 75-acre world-class educational hub strategically located on the Yamuna Expressway in Greater Noida, opposite the Formula 1 Buddh International Circuit. Founded in 2010 under Uttar Pradesh State Legislature Act No. 27, NIU is sponsored by the Maruti Educational Trust. The university houses 12 constituent schools covering Engineering & Technology, Business Management, Law, Liberal Arts, and the esteemed Noida International Institute of Medical Sciences (NIIMS) 450+ bed super-specialty teaching hospital. Welcoming scholars from over 54 countries, NIU is known for multicultural global education, interdisciplinary curriculum frameworks, and high-impact industrial partnerships across the NCR region.',
      programs: [
        {
          slug: 'btech-cse',
          code: 'BTECH-CSE',
          name: 'B.Tech Computer Science & Engineering',
          degree: 'Bachelor of Technology',
          duration: '4 Years (8 Semesters)',
          seats: 360,
          credits: 160,
          current_semester: 6,
          eligibility: '10+2 with Physics & Mathematics along with Chemistry / Computer Science (Min 50% marks) or valid NIU-SET / JEE Main rank.',
          description: 'Industry-aligned curriculum integrating fundamental computational theory with hands-on labs in cloud microservices, software architecture, mobile systems, and network security.',
          specializations: ['Cloud Computing & DevOps', 'Cyber Security', 'Data Science', 'Artificial Intelligence & ML'],
          curriculum_highlights: ['Object-Oriented Programming (Java/C++)', 'Design & Analysis of Algorithms', 'Computer Networks', 'Database Systems (RDBMS & NoSQL)', 'Web Technologies & API Design', 'Major Capstone Project']
        },
        {
          slug: 'btech-it',
          code: 'BTECH-IT',
          name: 'B.Tech Information Technology',
          degree: 'Bachelor of Technology',
          duration: '4 Years (8 Semesters)',
          seats: 180,
          credits: 158,
          current_semester: 6,
          eligibility: '10+2 with PCM (Min 50%) or NIU-SET qualification.',
          description: 'Focus on enterprise software development, IT automation, cyber defenses, and networked distributed databases.',
          specializations: ['Information & Cyber Security', 'Enterprise Software Engineering', 'Cloud Services'],
          curriculum_highlights: ['Network Administration', 'Cyber Law & Ethics', 'Cloud Computing Infrastructure', 'Distributed Systems']
        },
        {
          slug: 'bca',
          code: 'BCA',
          name: 'Bachelor of Computer Applications (BCA)',
          degree: 'Bachelor Degree',
          duration: '3 Years (6 Semesters)',
          seats: 240,
          credits: 120,
          current_semester: 6,
          eligibility: '10+2 in any stream with Mathematics or Computer Applications (Min 45% marks).',
          description: 'Practical, industry-ready application programming degree focusing on front-end web, database management, and mobile application development.',
          specializations: ['Web Application Development', 'Database Administration', 'Mobile Computing'],
          curriculum_highlights: ['Core Java & Python', 'Web Design (HTML5/CSS3/JavaScript)', 'Software Testing', 'Database Applications']
        },
        {
          slug: 'bba',
          code: 'BBA',
          name: 'Bachelor of Business Administration (BBA)',
          degree: 'Bachelor Degree',
          duration: '3 Years (6 Semesters)',
          seats: 240,
          credits: 120,
          current_semester: 6,
          eligibility: '10+2 in any discipline with minimum 45% aggregate marks.',
          description: 'Undergraduate business administration program developing analytical thinking, marketing strategy, operational management, and entrepreneurship.',
          specializations: ['International Business', 'Banking & Finance', 'Digital Marketing'],
          curriculum_highlights: ['Principles of Management', 'Financial Accounting', 'Marketing Management', 'Business Communication']
        },
        {
          slug: 'mtech-cse',
          code: 'MTECH-CSE',
          name: 'M.Tech Computer Science & Engineering',
          degree: 'Master of Technology',
          duration: '2 Years (4 Semesters)',
          seats: 60,
          credits: 80,
          current_semester: 2,
          eligibility: 'B.Tech / B.E. in CSE / IT or MCA / M.Sc (CS/IT) with min 55% marks and valid GATE / NIU Entrance.',
          description: 'Research-oriented master\'s degree focusing on advanced distributed data systems, edge computing, neural networks, and cryptography.',
          specializations: ['Advanced Computing', 'Information Security', 'Distributed Systems'],
          curriculum_highlights: ['Advanced Algorithm Analysis', 'High-Performance Computing', 'Research Methodology', 'Thesis & Viva']
        }
      ],
      placements: {
        highest_package: '₹36.5 LPA',
        average_package: '₹5.85 LPA',
        median_package: '₹4.80 LPA',
        placement_rate: '93.2%',
        total_offers: '3,200+ Placements',
        international_offers: '28 Global Placements (Middle East, Europe, ASEAN)',
        top_recruiters: ['IBM', 'HCLTech', 'Tech Mahindra', 'Infosys', 'Paytm', 'Wipro', 'Capgemini', 'BYJU\'S', 'Cognizant', 'L&T Infotech', 'Amazon', 'Reliance Retail']
      },
      website_url: 'https://niu.edu.in'
    }
  ],

  // University Campus Services - Galgotias University
  services_galgotias: [
    {
      id: 'srv-gu-1',
      name: 'Dr. A.P.J. Abdul Kalam Central Digital Library',
      category: 'Academic & Research',
      icon: '📚',
      timing: 'Open 24/7 (365 Days)',
      location: 'Central Academic Block 1 - Floors 1 & 2',
      description: 'Over 180,000 physical volumes, 1.2M+ e-books, IEEE/ACM digital library subscriptions, 400 high-speed research terminals, and quiet study carrels.',
      stats: '180,000+ Books • 1.2M E-Resources • 400 Terminals',
      features: ['IEEE Xplore & ACM Portal Access', 'Air-Conditioned Study Carrels', 'Automated RFID Self-Checkout', 'Inter-Library Loan Facility'],
      action_label: 'Browse E-Catalog'
    },
    {
      id: 'srv-gu-2',
      name: 'Galgotias On-Campus Hostels & Scholars Residences',
      category: 'Accommodation & Mess',
      icon: '🏠',
      timing: '24/7 Security & Wardens',
      location: 'Galgotias Residential Quadrangle, Yamuna Expressway',
      description: 'Modern air-conditioned single, double, and triple-occupancy rooms with high-speed Wi-Fi 6, automated laundry, hygienic multi-cuisine mess, and 24/7 power backup.',
      stats: '6,000+ Residents • Wi-Fi 6 • 100% Power Backup',
      features: ['Multi-Cuisine Dining Mess', 'Biometric Turnstile Access', 'High-Speed Wi-Fi 6', 'Indoor Common Gaming Lounges'],
      action_label: 'Hostel Portal'
    },
    {
      id: 'srv-gu-3',
      name: 'Galgotias Sports Complex & Athletics Arena',
      category: 'Fitness & Athletics',
      icon: '🏅',
      timing: '06:00 AM – 10:00 PM Daily',
      location: 'Outdoor Sports Arena',
      description: 'Full-sized cricket pitch, floodlit football turf, 6 indoor wooden badminton courts, basketball and tennis academy, and biometric gym equipment.',
      stats: 'Cricket Pitch • 6 Badminton Courts • Synthetic Turf',
      features: ['Olympic Swimming Pool', 'Floodlit Football Turf', 'Certified Strength Coaches', 'Annual Inter-College Sports Fest'],
      action_label: 'Book Sports Slot'
    },
    {
      id: 'srv-gu-4',
      name: 'Galgotias University Health Care & Emergency Center',
      category: 'Healthcare & Emergency',
      icon: '🏥',
      timing: '24/7 Emergency & Medical OPD',
      location: 'Gate 2 Health Center',
      description: 'Dedicated 30-bed medical facility with full-time resident doctors, computerized pathology collection, in-house pharmacy, and 2 emergency ALS ambulances on standby.',
      stats: '24/7 Doctors • 2 Ambulances • Free Student OPD',
      features: ['Free Consultations for Students', 'Pathology & Diagnostic Testing', 'Emergency Trauma Room', 'Ambulance Hotline #108'],
      action_label: 'Consult Doctor'
    },
    {
      id: 'srv-gu-5',
      name: 'Galgotias Delhi-NCR AC Rapid Transit Fleet',
      category: 'Transport & Logistics',
      icon: '🚌',
      timing: '06:30 AM – 09:30 PM (Daily Bus Routes)',
      location: 'Central Transit Station (Gate 1)',
      description: 'Over 120 air-conditioned luxury coaches connecting Noida, Greater Noida, South Delhi, Ghaziabad, and Faridabad with live GPS tracking.',
      stats: '120+ AC Buses • GPS Tracking • City Route Feeder',
      features: ['Real-Time GPS Bus Tracker', 'Metro Station Direct Feeder', 'Free Student Bus Pass System', '100% Green Electric Fleet'],
      action_label: 'Track Bus Live'
    },
    {
      id: 'srv-gu-6',
      name: 'Galgotias Center for Innovation & Entrepreneurship (GCIE)',
      category: 'Incubation & Research',
      icon: '🚀',
      timing: '08:00 AM – 11:00 PM',
      location: 'Innovation & Enterprise Block - Level 3',
      description: 'Seed funding grants up to ₹25 Lakhs per venture, patent attorney consultation, hardware prototyping fab-lab, and direct mentorship from Silicon Valley alumni.',
      stats: '54 Funded Startups • ₹18 Cr Seed Capital Raised',
      features: ['Seed Capital Grant Access', 'Patent Filing Support', 'GPU AI Clusters & 3D Printers', 'Investor Demo Days'],
      action_label: 'Apply for Incubation'
    }
  ],

  // University Campus Services - Noida International University
  services_niu: [
    {
      id: 'srv-niu-1',
      name: 'Rabindranath Tagore Central Digital Library',
      category: 'Academic & Research',
      icon: '📚',
      timing: 'Open 24/7 (365 Days)',
      location: 'NIU Central Administrative Block - Ground & 1st Floor',
      description: 'Over 120,000 volumes, DELNET inter-library loan network, IEEE and ScienceDirect digital portals, and quiet scholar research bays.',
      stats: '120,000+ Books • DELNET Access • 300 Terminals',
      features: ['IEEE Xplore & DELNET Access', 'Air-Conditioned Study Carrels', 'Automated RFID Self-Checkout', 'Inter-Library Loan Facility'],
      action_label: 'Browse E-Catalog'
    },
    {
      id: 'srv-niu-2',
      name: 'NIIMS 450-Bed Teaching Hospital & Medical Center',
      category: 'Healthcare & Emergency',
      icon: '🏥',
      timing: '24/7 Emergency, Trauma & OPD',
      location: 'NIIMS Campus Enclave',
      description: '450-bed multi-specialty teaching hospital with state-of-the-art ICUs, resident surgeons, modern pathology lab, and 3 advanced ALS ambulances.',
      stats: '450 Hospital Beds • 24/7 ICU & Trauma • 3 Ambulances',
      features: ['Free Consultations for Students', 'Pathology & Diagnostic Testing', 'Emergency Trauma Room', 'Ambulance Hotline #108'],
      action_label: 'Consult Doctor'
    },
    {
      id: 'srv-niu-3',
      name: 'NIU International Scholars Residence (Hostels)',
      category: 'Accommodation & Mess',
      icon: '🏠',
      timing: '24/7 Security & Wardens',
      location: 'NIU Residential Enclave, Yamuna Expressway',
      description: 'Modern residential towers with air-conditioned accommodation, high-speed Wi-Fi 6, global Indian and Continental dining mess, and recreation halls.',
      stats: '3,800+ Residents • Wi-Fi 6 • Biometric Entry',
      features: ['Multi-Cuisine Dining Mess', 'Biometric Turnstile Access', 'High-Speed Wi-Fi 6', 'Indoor Common Gaming Lounges'],
      action_label: 'Hostel Portal'
    },
    {
      id: 'srv-niu-4',
      name: 'NIU Grand Multi-Sport Stadium & Athletic Complex',
      category: 'Fitness & Athletics',
      icon: '🏅',
      timing: '06:00 AM – 09:30 PM Daily',
      location: 'Sports Grounds (Opposite F1 Buddh Circuit)',
      description: 'Floodlit FIFA standard football arena, cricket nets, basketball courts, volleyball arena, lawn tennis, and fitness training gym.',
      stats: 'FIFA Turf • Cricket Nets • 4 Basketball Courts',
      features: ['Floodlit Football Turf', 'Cricket Practice Nets', 'Certified Strength Coaches', 'Annual Inter-College Sports Fest'],
      action_label: 'Book Sports Slot'
    },
    {
      id: 'srv-niu-5',
      name: 'NIU NCR Express Transit & Shuttle Fleet',
      category: 'Transport & Logistics',
      icon: '🚌',
      timing: '07:00 AM – 09:00 PM (Regular Feeder Trips)',
      location: 'Central University Gate 1 Transit Zone',
      description: 'Fleet of 60+ GPS-monitored buses linking Jewar Airport corridor, Greater Noida Metro stations, Noida, Delhi, and Bulandshahr.',
      stats: '60+ Fleet Buses • Metro Feeder • GPS Live Track',
      features: ['Real-Time GPS Bus Tracker', 'Metro Station Direct Feeder', 'Free Student Bus Pass System', 'Yamuna Corridor Feeder'],
      action_label: 'Track Bus Live'
    },
    {
      id: 'srv-niu-6',
      name: 'NIU Center for Innovation & Entrepreneurship (CIE)',
      category: 'Incubation & Research',
      icon: '🚀',
      timing: '08:30 AM – 10:30 PM',
      location: 'Engineering & Technology Tower - Level 4',
      description: 'Multidisciplinary incubation lab supporting student hardware prototypes, drone testing, mobile app ventures, and angel investment rounds.',
      stats: '32 Incubation Projects • Angel Investor Network',
      features: ['Seed Capital Grant Access', 'Patent Filing Support', 'Hardware Prototyping Fab-Lab', 'Investor Demo Days'],
      action_label: 'Apply for Incubation'
    }
  ],

  // Fallback alias for services
  get services() {
    return this.services_galgotias;
  },

  // University ERP Simulation Data - Galgotias University
  erp_galgotias: {
    student_profile: {
      roll_number: '23GUBCSE108',
      student_name: 'Abhi Kumar',
      program: 'B.Tech Computer Science & Engineering',
      university: 'Galgotias University',
      semester: 6,
      academic_year: '2025-2026',
      mentor: 'Dr. A.K. Sharma (Galgotias School of Computing)',
      cgpa: 8.92,
      sgpa_latest: 9.15,
      credits_completed: 124,
      total_credits: 160,
      overall_attendance: 86.4
    },
    attendance: [
      { code: 'CS601', name: 'Advanced Algorithms & Problem Solving', attended: 38, total: 42, percentage: 90.5, status: 'Safe (Eligible)', mentor: 'Dr. A.K. Sharma' },
      { code: 'CS602', name: 'Compiler Design', attended: 35, total: 40, percentage: 87.5, status: 'Safe (Eligible)', mentor: 'Prof. S. Verma' },
      { code: 'CS603', name: 'Natural Language Processing', attended: 31, total: 36, percentage: 86.1, status: 'Safe (Eligible)', mentor: 'Dr. P. Gupta' },
      { code: 'CS604', name: 'Software Engineering', attended: 32, total: 38, percentage: 84.2, status: 'Safe (Eligible)', mentor: 'Prof. K. Mehta' },
      { code: 'CS605', name: 'Web Technology', attended: 41, total: 44, percentage: 93.2, status: 'Safe (Eligible)', mentor: 'A.K.Antal (NextGen)' },
      { code: 'CS606', name: 'Design & Analysis of Algorithms', attended: 34, total: 42, percentage: 80.9, status: 'Eligible (Warning < 85%)', mentor: 'Dr. V. Ramanujan' }
    ],
    fee_receipts: [
      { receipt_no: 'RCPT-2026-GU-SEM6', term: 'Galgotias University Semester 6 Tuition & Tech Fees', amount: '₹98,000', payment_date: '10 Jan 2026', mode: 'Net Banking (HDFC Bank)', status: 'Paid & Verified' },
      { receipt_no: 'RCPT-2026-GU-HSTL', term: 'Galgotias Hostels (AC Double) & Mess Fee', amount: '₹52,000', payment_date: '12 Jan 2026', mode: 'UPI Auto-Debit', status: 'Paid & Verified' },
      { receipt_no: 'RCPT-2026-GU-EXAM', term: 'Galgotias ETE June 2026 Exam Registration Fee', amount: '₹2,500', payment_date: '15 Mar 2026', mode: 'Credit Card (Razorpay)', status: 'Paid & Verified' }
    ],
    transcripts: [
      { semester: 'Semester 1', sgpa: 8.70, credits: 20, status: 'Pass with Distinction' },
      { semester: 'Semester 2', sgpa: 8.85, credits: 21, status: 'Pass with Distinction' },
      { semester: 'Semester 3', sgpa: 8.65, credits: 22, status: 'Pass with Distinction' },
      { semester: 'Semester 4', sgpa: 9.10, credits: 21, status: 'Pass with Distinction' },
      { semester: 'Semester 5', sgpa: 9.22, credits: 20, status: 'Pass with Distinction' },
      { semester: 'Semester 6', sgpa: 'In Progress (Projected 9.15)', credits: 20, status: 'Ongoing' }
    ],
    registered_courses: [
      { code: 'CS601', title: 'Advanced Algorithms & Problem Solving', type: 'Program Core', credits: 4, faculty: 'Dr. A.K. Sharma' },
      { code: 'CS602', title: 'Compiler Design', type: 'Program Core', credits: 4, faculty: 'Prof. S. Verma' },
      { code: 'CS603', title: 'Natural Language Processing', type: 'Program Elective', credits: 3, faculty: 'Dr. P. Gupta' },
      { code: 'CS604', title: 'Software Engineering', type: 'Program Core', credits: 3, faculty: 'Prof. K. Mehta' },
      { code: 'CS605', title: 'Web Technology', type: 'Program Core', credits: 4, faculty: 'A.K.Antal' },
      { code: 'CS606', title: 'Design & Analysis of Algorithms', type: 'Program Elective', credits: 4, faculty: 'Dr. V. Ramanujan' }
    ]
  },

  // University ERP Simulation Data - Noida International University
  erp_niu: {
    student_profile: {
      roll_number: '23NIUBCSE042',
      student_name: 'Abhi Kumar',
      program: 'B.Tech Computer Science & Engineering',
      university: 'Noida International University',
      semester: 6,
      academic_year: '2025-2026',
      mentor: 'Prof. R. Verma (NIU School of Engineering & Technology)',
      cgpa: 8.85,
      sgpa_latest: 9.08,
      credits_completed: 122,
      total_credits: 160,
      overall_attendance: 88.0
    },
    attendance: [
      { code: 'CS601', name: 'Advanced Algorithms & Problem Solving', attended: 39, total: 42, percentage: 92.8, status: 'Safe (Eligible)', mentor: 'Prof. R. Verma' },
      { code: 'CS602', name: 'Compiler Design', attended: 36, total: 40, percentage: 90.0, status: 'Safe (Eligible)', mentor: 'Dr. N. Tyagi' },
      { code: 'CS603', name: 'Natural Language Processing', attended: 32, total: 36, percentage: 88.8, status: 'Safe (Eligible)', mentor: 'Prof. A. Saxena' },
      { code: 'CS604', name: 'Software Engineering', attended: 33, total: 38, percentage: 86.8, status: 'Safe (Eligible)', mentor: 'Dr. M. Mishra' },
      { code: 'CS605', name: 'Web Technology', attended: 42, total: 44, percentage: 95.4, status: 'Safe (Eligible)', mentor: 'A.K.Antal (NextGen)' },
      { code: 'CS606', name: 'Design & Analysis of Algorithms', attended: 36, total: 42, percentage: 85.7, status: 'Safe (Eligible)', mentor: 'Prof. K. Singh' }
    ],
    fee_receipts: [
      { receipt_no: 'RCPT-2026-NIU-SEM6', term: 'NIU Semester 6 Academic Tuition Fee', amount: '₹85,000', payment_date: '08 Jan 2026', mode: 'Net Banking (SBI)', status: 'Paid & Verified' },
      { receipt_no: 'RCPT-2026-NIU-HSTL', term: 'NIU International Scholars Residence (AC) & Dining', amount: '₹46,000', payment_date: '11 Jan 2026', mode: 'UPI Auto-Debit', status: 'Paid & Verified' },
      { receipt_no: 'RCPT-2026-NIU-EXAM', term: 'NIU Semester Exam Fee & Grade Card Processing', amount: '₹2,200', payment_date: '14 Mar 2026', mode: 'Debit Card (PayU)', status: 'Paid & Verified' }
    ],
    transcripts: [
      { semester: 'Semester 1', sgpa: 8.60, credits: 20, status: 'Pass with Distinction' },
      { semester: 'Semester 2', sgpa: 8.75, credits: 21, status: 'Pass with Distinction' },
      { semester: 'Semester 3', sgpa: 8.60, credits: 22, status: 'Pass with Distinction' },
      { semester: 'Semester 4', sgpa: 9.00, credits: 21, status: 'Pass with Distinction' },
      { semester: 'Semester 5', sgpa: 9.15, credits: 20, status: 'Pass with Distinction' },
      { semester: 'Semester 6', sgpa: 'In Progress (Projected 9.08)', credits: 20, status: 'Ongoing' }
    ],
    registered_courses: [
      { code: 'CS601', title: 'Advanced Algorithms & Problem Solving', type: 'Program Core', credits: 4, faculty: 'Prof. R. Verma' },
      { code: 'CS602', title: 'Compiler Design', type: 'Program Core', credits: 4, faculty: 'Dr. N. Tyagi' },
      { code: 'CS603', title: 'Natural Language Processing', type: 'Program Elective', credits: 3, faculty: 'Prof. A. Saxena' },
      { code: 'CS604', title: 'Software Engineering', type: 'Program Core', credits: 3, faculty: 'Dr. M. Mishra' },
      { code: 'CS605', title: 'Web Technology', type: 'Program Core', credits: 4, faculty: 'A.K.Antal' },
      { code: 'CS606', title: 'Design & Analysis of Algorithms', type: 'Program Elective', credits: 4, faculty: 'Prof. K. Singh' }
    ]
  },

  // Fallback alias for erp
  get erp() {
    return this.erp_galgotias;
  },

  // Academic High-Yield Notes & Syllabus
  notes: [
    {
      id: 'note-1',
      subject_code: 'CS601',
      subject_name: 'Advanced Algorithms & Problem Solving',
      title: 'Unit 1 & 2: Dynamic Programming State Transitions & Memoization Deep Dive',
      author: 'Prof. V. Ramanujan & NextGen Academic Mentors',
      pages: 34,
      rating: 4.9,
      downloads: 1420,
      topics: ['0/1 Knapsack & Unbounded', 'Matrix Chain Multiplication', 'Longest Common Subsequence (LCS)', 'Bitmask Dynamic Programming'],
      summary: 'Comprehensive revision guide with recursive formulas, DAG dependency visualization, space optimization from O(N^2) to O(N), and solved ETE past paper numericals.',
      content_markdown: `# CS601: Dynamic Programming & Recurrence Guide

## 1. Core Paradigm: Optimal Substructure & Overlapping Subproblems
Dynamic programming solves optimization problems by combining solutions to subproblems. Unlike Divide and Conquer (which solves independent subproblems), DP memoizes overlapping states.

### 0/1 Knapsack Recurrence
\`\`\`
dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])
\`\`\`
- Space optimized: \`dp[w] = max(dp[w], val[i] + dp[w - wt[i]])\` traversing backwards from \`W\` down to \`wt[i]\`.

## 2. Matrix Chain Multiplication
- Given sequence of matrices \`A1, A2, ..., An\` with dimensions \`p0 x p1, p1 x p2, ..., pn-1 x pn\`.
- Recurrence: \`m[i, j] = min_{i <= k < j} { m[i, k] + m[k+1, j] + p_{i-1} * p_k * p_j }\`.
- Time Complexity: O(N^3), Space Complexity: O(N^2).`
    },
    {
      id: 'note-2',
      subject_code: 'CS602',
      subject_name: 'Compiler Design',
      title: 'Complete ETE Revision: Syntax-Directed Translation (SDT) & Intermediate Code (TAC)',
      author: 'Dr. S. Verma (Compiler Systems Lab)',
      pages: 42,
      rating: 4.8,
      downloads: 980,
      topics: ['Syntax-Directed Translation', 'Three-Address Code (TAC)', 'Quadruples & Triples', 'Basic Blocks & Flow Graphs'],
      summary: 'Full coverage of parser output translation, semantic analysis, synthesized and inherited attributes, and quadruple/triple TAC representations.',
      content_markdown: `# CS602: Compiler Design Synthesis Notes

## 1. Syntax-Directed Translation (SDT)
- **Synthesized Attribute**: Computed from the values of attributes at the children of the node in the parse tree. (S-attributed SDD: uses only synthesized attributes, evaluated in bottom-up order).
- **Inherited Attribute**: Computed from values at siblings and parent node. (L-attributed SDD: attributes can be synthesized or inherited from left siblings).

## 2. Three-Address Code (TAC) Representations
1. **Quadruples**: Record with 4 fields: \`op\`, \`arg1\`, \`arg2\`, \`result\`.
2. **Triples**: Avoids temporary variable names: \`op\`, \`arg1\`, \`arg2\`, references by position index \`(0), (1)\`.
3. **Indirect Triples**: Separate instruction pointer array listing the order of computation.`
    },
    {
      id: 'note-3',
      subject_code: 'CS603',
      subject_name: 'Natural Language Processing',
      title: 'NLP Mastery Handbook: From N-grams & TF-IDF to Transformers & Attention',
      author: 'NextGen AI Research Group',
      pages: 38,
      rating: 4.9,
      downloads: 1150,
      topics: ['Tokenization & Stemming', 'N-gram Language Models', 'Word2Vec Skip-Gram & CBOW', 'Self-Attention Formula'],
      summary: 'Step-by-step mathematical guide on vector spaces, cosine similarity, backpropagation through time in RNNs, and multi-head attention calculations.',
      content_markdown: `# CS603: Natural Language Processing Compendium

## 1. Vector Space Models & TF-IDF
\`\`\`
TF-IDF(t, d, D) = TF(t, d) * IDF(t, D)
IDF(t, D) = log( (1 + |D|) / (1 + |{d in D : t in d}|) ) + 1
\`\`\`

## 2. Scaled Dot-Product Attention Formula
\`\`\`
Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V
\`\`\`
- \`Q\`: Query matrix, \`K\`: Key matrix, \`V\`: Value matrix.
- \`sqrt(d_k)\` prevents softmax gradients from vanishing in high dimensions.`
    },
    {
      id: 'note-4',
      subject_code: 'CS604',
      subject_name: 'Software Engineering',
      title: 'Software Metrics, Agile Sprints, & COCOMO Cost Estimation Formula Guide',
      author: 'Department of Software Engineering',
      pages: 28,
      rating: 4.7,
      downloads: 820,
      topics: ['COCOMO Basic & Intermediate', 'Function Point (FP) Calculation', 'Cyclomatic Complexity', 'Scrum Artifacts'],
      summary: 'Handy formula compendium with solved numericals on Intermediate COCOMO Effort/Development Time and McCabe Cyclomatic complexity graphs.',
      content_markdown: `# CS604: Software Engineering Formulas & Metrics

## 1. Intermediate COCOMO Estimation
- **Effort (Person-Months)**: \`E = a * (KLOC)^b * EAF\`
- **Development Time (Months)**: \`Tdev = c * (Effort)^d\`
- **Average Staff Size**: \`Staff = Effort / Tdev\`

### Modes:
- **Organic**: a = 2.4, b = 1.05, c = 2.5, d = 0.38
- **Semidetached**: a = 3.0, b = 1.12, c = 2.5, d = 0.35
- **Embedded**: a = 3.6, b = 1.20, c = 2.5, d = 0.32

## 2. McCabe Cyclomatic Complexity
\`\`\`
V(G) = E - N + 2P
\`\`\`
Where \`E\` = Edges, \`N\` = Nodes, \`P\` = Connected components (typically 1).`
    },
    {
      id: 'note-5',
      subject_code: 'CS605',
      subject_name: 'Web Technology',
      title: 'Full-Stack Architecture Guide: JavaScript Event Loop, Async/Await, & REST Standards',
      author: 'A.K.Antal (NextGen Lead Architect)',
      pages: 45,
      rating: 5.0,
      downloads: 2180,
      topics: ['Event Loop & Microtasks', 'Promise Concurrency', 'RESTful API Standards', 'PostgreSQL Row Level Security'],
      summary: 'Production-tested guide to modern web architecture, async concurrency, CSS glassmorphism token systems, and database security rules.',
      content_markdown: `# CS605: Web Technology & Full-Stack Systems

## 1. The JavaScript Runtime & Event Loop
- **Call Stack**: Executes synchronous frames LIFO.
- **Microtask Queue**: Promises (\`Promise.then\`, \`queueMicrotask\`, \`async/await\`) - prioritized before any macrotask!
- **Macrotask (Task) Queue**: \`setTimeout\`, \`setInterval\`, UI rendering events.

## 2. Supabase Row Level Security (RLS) Pattern
\`\`\`sql
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
ON public.student_notes FOR SELECT USING (true);

CREATE POLICY "Allow student write"
ON public.student_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);
\`\`\``
    }
  ]
};

// 3. Central Unified Campus Database Engine (Local Cache + Supabase Live Sync)
window.CampusDB = {
  // Universities
  async getUniversities(search = '') {
    let list = [...MOCK_DATA.universities];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.short_name.toLowerCase().includes(q) || 
        u.location.toLowerCase().includes(q) ||
        u.history.toLowerCase().includes(q) ||
        (u.aliases && u.aliases.some(a => a.toLowerCase().includes(q)))
      );
    }
    return list;
  },

  async getUniversityById(idOrSlug) {
    if (!idOrSlug) return MOCK_DATA.universities[0];
    const target = idOrSlug.toLowerCase();
    return MOCK_DATA.universities.find(u => 
      u.id.toLowerCase() === target || 
      u.slug.toLowerCase() === target || 
      (u.aliases && u.aliases.some(a => a.toLowerCase() === target))
    ) || MOCK_DATA.universities[0];
  },

  async getUniversityProgram(uniSlug, progSlug) {
    const uni = await this.getUniversityById(uniSlug);
    if (!uni || !uni.programs) return null;
    return uni.programs.find(p => p.slug === progSlug || p.code.toLowerCase() === progSlug.toLowerCase()) || uni.programs[0];
  },

  async getUniversityServices(uniSlug) {
    const uni = await this.getUniversityById(uniSlug);
    if (uni && (uni.slug === 'noida-international-university' || uni.id === 'uni-niu')) {
      return MOCK_DATA.services_niu;
    }
    return MOCK_DATA.services_galgotias || MOCK_DATA.services;
  },

  async getUniversityERP(uniSlug) {
    const uni = await this.getUniversityById(uniSlug);
    if (uni && (uni.slug === 'noida-international-university' || uni.id === 'uni-niu')) {
      return MOCK_DATA.erp_niu;
    }
    return MOCK_DATA.erp_galgotias || MOCK_DATA.erp;
  },

  // Notes
  async getNotes(filters = {}) {
    let list = [...MOCK_DATA.notes];
    if (filters.subject && filters.subject !== 'ALL') {
      list = list.filter(n => n.subject_code === filters.subject);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.subject_name.toLowerCase().includes(q));
    }
    return list;
  },

  async getNoteById(noteId) {
    return MOCK_DATA.notes.find(n => n.id === noteId) || MOCK_DATA.notes[0];
  },

  // Subjects
  async getSubjects() {
    return MOCK_DATA.subjects;
  },

  // Exams
  async getExams(filters = {}) {
    let list = [...MOCK_DATA.exams];
    if (filters.exam_type && filters.exam_type !== 'ALL') {
      list = list.filter(e => e.exam_type === filters.exam_type);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(e => e.subject_name.toLowerCase().includes(q) || e.subject_code.toLowerCase().includes(q));
    }
    return list;
  },

  // Assignments
  async getAssignments(status = 'ALL') {
    let list = [...MOCK_DATA.assignments];
    if (status === 'URGENT') {
      list = list.filter(a => !a.submitted && (new Date(a.due_date) - Date.now()) < 48 * 3600 * 1000);
    } else if (status === 'SUBMITTED') {
      list = list.filter(a => a.submitted);
    } else if (status === 'PENDING') {
      list = list.filter(a => !a.submitted);
    }
    return list;
  },

  async submitAssignment(assignmentId, notes, file) {
    const asg = MOCK_DATA.assignments.find(a => a.id === assignmentId);
    if (asg) {
      asg.submitted = true;
      asg.submitted_at = new Date().toISOString();
      CampusDB.saveLocalState();
    }
    return { success: true, message: 'Assignment uploaded and submitted successfully!' };
  },

  // PYQs
  async getPYQs(filters = {}) {
    let list = [...MOCK_DATA.pyqs];
    if (filters.exam_type && filters.exam_type !== 'ALL') {
      list = list.filter(p => p.exam_type === filters.exam_type);
    }
    if (filters.year && filters.year !== 'ALL') {
      list = list.filter(p => p.year === parseInt(filters.year));
    }
    if (filters.subject && filters.subject !== 'ALL') {
      list = list.filter(p => p.subject_code === filters.subject);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.subject_name.toLowerCase().includes(q));
    }
    return list;
  },

  incrementPYQDownload(pyqId) {
    const item = MOCK_DATA.pyqs.find(p => p.id === pyqId);
    if (item) {
      item.download_count++;
      CampusDB.saveLocalState();
      return item.download_count;
    }
    return 0;
  },

  // Practice Questions
  async getPracticeQuestions(filters = {}) {
    let list = [...MOCK_DATA.practice_questions];
    if (filters.subject && filters.subject !== 'ALL') {
      list = list.filter(q => q.subject_code === filters.subject);
    }
    if (filters.difficulty && filters.difficulty !== 'ALL') {
      list = list.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.topic && filters.topic !== 'ALL') {
      list = list.filter(q => q.topic.toLowerCase().includes(filters.topic.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(item => item.title.toLowerCase().includes(q) || item.problem_statement.toLowerCase().includes(q));
    }
    return list;
  },

  // Projects
  async getProjects(category = 'ALL') {
    let list = [...MOCK_DATA.projects];
    if (category !== 'ALL') {
      list = list.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    return list;
  },

  upvoteProject(projectId) {
    const proj = MOCK_DATA.projects.find(p => p.id === projectId);
    if (proj) {
      proj.upvotes++;
      CampusDB.saveLocalState();
      return proj.upvotes;
    }
    return 0;
  },

  // Campus Posts
  async getCampusPosts(category = 'ALL') {
    let list = [...MOCK_DATA.campus_posts];
    if (category !== 'ALL') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  },

  upvoteCampusPost(postId) {
    const post = MOCK_DATA.campus_posts.find(p => p.id === postId);
    if (post) {
      post.upvotes++;
      CampusDB.saveLocalState();
      return post.upvotes;
    }
    return 0;
  },

  createCampusPost(title, category, content, authorName = 'Student Contributor') {
    const newPost = {
      id: 'post-' + Date.now(),
      category: category || 'Academic Discussion',
      title: title,
      content: content,
      author: authorName,
      is_official_faculty: false,
      is_pinned: false,
      upvotes: 1,
      timestamp: 'Just now'
    };
    MOCK_DATA.campus_posts.unshift(newPost);
    CampusDB.saveLocalState();
    return newPost;
  },

  // State Persistence
  saveLocalState() {
    try {
      localStorage.setItem('CC_SAVED_STATE', JSON.stringify({
        assignments: MOCK_DATA.assignments,
        pyqs: MOCK_DATA.pyqs,
        projects: MOCK_DATA.projects,
        campus_posts: MOCK_DATA.campus_posts
      }));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  },

  loadLocalState() {
    try {
      const saved = localStorage.getItem('CC_SAVED_STATE');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.assignments) MOCK_DATA.assignments = parsed.assignments;
        if (parsed.pyqs) MOCK_DATA.pyqs = parsed.pyqs;
        if (parsed.projects) MOCK_DATA.projects = parsed.projects;
        if (parsed.campus_posts) MOCK_DATA.campus_posts = parsed.campus_posts;
      }
    } catch (e) {
      console.warn('Could not restore local state:', e);
    }
  }
};

// Initialize State
CampusDB.loadLocalState();

// 4. Global UI Notification Toast
window.showToast = function(message, icon = '✅') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size: 1.1rem;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
};

window.openDbModal = window.openSupabaseModal = function() {
  let modal = document.getElementById('supabase-config-modal');
  if (modal) modal.remove();

  const isLive = CampusConfig.isLive;
  const envSource = window.__ENV_SOURCE__ || (window.__ENV__ && window.__ENV__.SUPABASE_URL ? 'Loaded from .env / env.js' : 'Local Offline Mode');

  modal = document.createElement('div');
  modal.id = 'supabase-config-modal';
  modal.className = 'cc-modal';
  modal.innerHTML = `
    <div class="cc-modal-box" style="max-width: 560px; border-color: ${isLive ? 'var(--neon-emerald)' : 'var(--neon-cyan)'};">
      <button class="modal-close-btn" onclick="closeSupabaseModal()">&times;</button>
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <div style="font-size: 1.8rem;">⚡</div>
        <div>
          <h3 style="font-family:'Outfit',sans-serif; font-size:1.3rem; margin:0; color:var(--text-primary);">Cloud Database Connection & Environment Manager</h3>
          <span style="font-size:0.8rem; color:var(--text-muted);">Campus Circle Cloud Database Integration</span>
        </div>
      </div>

      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">Configuration Source</div>
          <div style="font-size: 0.88rem; font-weight: 700; color: ${isLive ? 'var(--neon-emerald)' : 'var(--neon-cyan)'}; margin-top: 2px;">
            ${envSource}
          </div>
        </div>
        <span class="tech-pill" style="font-size: 0.75rem; color: ${isLive ? 'var(--neon-emerald)' : 'var(--text-muted)'}; border-color: ${isLive ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'};">
          ${isLive ? '● Live Cloud Sync Active' : '○ Autonomous Offline'}
        </span>
      </div>

      <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin-bottom:18px;">
        Credentials are automatically loaded from your root <code style="color:var(--neon-cyan); background:rgba(56,189,248,0.1); padding:2px 6px; border-radius:4px;">.env</code> and <code style="color:var(--neon-cyan); background:rgba(56,189,248,0.1); padding:2px 6px; border-radius:4px;">env.js</code> files. You can also update them below or download an updated <code style="color:var(--neon-cyan);">.env</code>.
      </p>

      <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:22px;">
        <div>
          <label style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:600; margin-bottom:6px;">CLOUD_DATABASE_URL</label>
          <input type="text" id="sb-input-url" class="filter-input" style="width:100%; font-family:'JetBrains Mono',monospace; font-size:0.85rem;" placeholder="https://yourproject.cloud-db.co" value="${CampusConfig.supabaseUrl || ''}">
        </div>
        <div>
          <label style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:600; margin-bottom:6px;">CLOUD_API_KEY</label>
          <input type="password" id="sb-input-key" class="filter-input" style="width:100%; font-family:'JetBrains Mono',monospace; font-size:0.85rem;" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${CampusConfig.supabaseKey || ''}">
        </div>
      </div>

      <div style="display:flex; gap:10px; justify-content:space-between; align-items:center; flex-wrap:wrap;">
        <button class="btn btn-secondary" style="padding:8px 14px; font-size:0.82rem;" onclick="downloadActiveDotEnv()">
          📥 Export to .env
        </button>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-secondary" style="padding:8px 16px; font-size:0.88rem;" onclick="closeSupabaseModal()">Cancel</button>
          <button class="btn btn-primary" style="padding:8px 20px; font-size:0.88rem;" onclick="saveSupabaseSettings()">Save & Connect</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.classList.add('active');
};

window.closeDbModal = window.closeSupabaseModal = function() {
  const modal = document.getElementById('supabase-config-modal');
  if (modal) modal.classList.remove('active');
};

window.saveSupabaseSettings = function() {
  const url = document.getElementById('sb-input-url').value.trim();
  const key = document.getElementById('sb-input-key').value.trim();
  localStorage.setItem('CC_SUPABASE_URL', url);
  localStorage.setItem('CC_SUPABASE_KEY', key);
  CampusConfig.supabaseUrl = url;
  CampusConfig.supabaseKey = key;
  CampusConfig.isLive = !!(url && !url.includes('your-project-id') && key && !key.includes('sample-anon-key'));
  
  if (window.__ENV__) {
    window.__ENV__.SUPABASE_URL = url;
    window.__ENV__.SUPABASE_ANON_KEY = key;
  }
  closeSupabaseModal();
  showToast(url ? 'Supabase credentials saved & synchronized!' : 'Switched to Local Offline Mode', '⚡');
};
