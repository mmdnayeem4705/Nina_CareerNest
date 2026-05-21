-- =============================================================================
-- Nina Organization — Internships Page: seed ALL internships (40 roles)
-- Run in MySQL Workbench after users exist (hr@nina.com).
--
-- Prerequisites:
--   USE nina_db;
--   Internships table with ecosystem columns (see full-setup-mysql-workbench.sql)
--
-- Optional — clear existing internships:
--   SET FOREIGN_KEY_CHECKS = 0;
--   UPDATE applications SET internship_id = NULL WHERE internship_id IS NOT NULL;
--   -- or: DELETE FROM applications WHERE internship_id IS NOT NULL;
--   TRUNCATE TABLE internships;
--   SET FOREIGN_KEY_CHECKS = 1;
-- =============================================================================

USE nina_db;

SET @hr_id := (SELECT id FROM users WHERE email = 'hr@nina.com' LIMIT 1);

INSERT INTO internships (
    title, description, domain, category, location, duration,
    stipend, stipend_label, is_virtual, certificate_provided, small_project,
    featured, live_project, ppo_available, skill_based,
    work_mode, level, required_skills, tasks,
    mentor_name, mentor_role, mentor_experience, mentor_linked_in, progress_weeks,
    openings, applied_count, deadline, posted_by_id, active
) VALUES

-- ========== SOFTWARE DEVELOPMENT — FULL STACK ==========
(
    'Java Full Stack Intern',
    'Build REST APIs with Spring Boot and React dashboards. Weekly code reviews.',
    'Software Development', 'Full Stack', 'Remote', '3 Months',
    10000.00, '₹10,000/month', 1, 1, 1, 1, 1, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Java","Spring Boot","React","SQL"]',
    '["Build APIs","Fix bugs","Create dashboards","Sprint meetings"]',
    'Priya Sharma', 'Senior Full Stack Engineer', '6+ Years', NULL,
    '["Week 1: Onboarding","Week 2: Minor tasks","Week 3: Team project","Week 4: Evaluation"]',
    15, 28, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'MERN Stack Intern',
    'MongoDB, Express, React, Node end-to-end product internship.',
    'Software Development', 'Full Stack', 'Remote', '3 Months',
    15000.00, '₹15,000/month', 1, 1, 1, 1, 1, 1, 1,
    'REMOTE', 'ADVANCED',
    '["MongoDB","Express","React","Node.js"]',
    '["Product module","Cloud deploy","Code reviews"]',
    'Neha Kapoor', 'Engineering Manager', '7+ Years', NULL,
    '["Week 1-4: Sprints","Week 5-8: Fixes","Week 9-12: Launch"]',
    15, 35, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'MEAN Stack Intern',
    'Angular + Node + MongoDB product internship.',
    'Software Development', 'Full Stack', 'Hybrid', '3 Months',
    13000.00, '₹13,000/month', 0, 1, 0, 0, 0, 1, 1,
    'HYBRID', 'INTERMEDIATE',
    '["Angular","Node.js","MongoDB"]',
    '["Full stack features","CI setup"]',
    'Neha Kapoor', 'Full Stack Lead', '6+ Years', NULL,
    '["12-week plan"]',
    15, 22, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== FRONTEND ==========
(
    'React Developer Intern',
    'Component-driven UI with React 19 and Tailwind.',
    'Software Development', 'Frontend', 'Remote', '2 Months',
    8000.00, '₹8,000/month', 1, 1, 0, 1, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["React","TypeScript","CSS","Git"]',
    '["UI components","Responsive layouts","API integration"]',
    'Arjun Mehta', 'Frontend Lead', '5+ Years', NULL,
    '["Week 1: Learning","Week 2: UI tasks","Week 3: Feature ship","Week 4: Demo"]',
    15, 19, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Angular Developer Intern',
    'Enterprise Angular with RxJS and NgRx patterns.',
    'Software Development', 'Frontend', 'Hybrid', '3 Months',
    10000.00, '₹10,000/month', 0, 1, 0, 0, 0, 1, 1,
    'HYBRID', 'INTERMEDIATE',
    '["Angular","TypeScript","RxJS"]',
    '["Modules","Services","E2E tests"]',
    'Mark Thompson', 'Angular Lead', '7+ Years', NULL,
    '["Week 1-12: Agile delivery"]',
    15, 14, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Next.js Developer Intern',
    'SSR and App Router with Next.js 15.',
    'Software Development', 'Frontend', 'Remote', '2 Months',
    9000.00, '₹9,000/month', 1, 1, 0, 1, 0, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Next.js","React","Tailwind"]',
    '["Pages","API routes","Deploy on Vercel"]',
    'Arjun Mehta', 'Frontend Lead', '5+ Years', NULL,
    '["4-week sprint plan"]',
    15, 17, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'UI/UX Developer Intern',
    'Figma prototypes and accessible UI implementation.',
    'Software Development', 'Frontend', 'Remote', '2 Months',
    6000.00, '₹6,000/month', 1, 1, 0, 1, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["Figma","HTML","CSS","Accessibility"]',
    '["Wireframes","Design system","Dev handoff"]',
    'Emma Wilson', 'UX Lead', '5+ Years', NULL,
    '["Design sprint model"]',
    15, 11, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== BACKEND ==========
(
    'Java Spring Boot Intern',
    'Enterprise backend with JPA, Security, and REST.',
    'Software Development', 'Backend', 'Hybrid', '3 Months',
    12000.00, '₹12,000/month', 0, 1, 0, 1, 1, 1, 1,
    'HYBRID', 'INTERMEDIATE',
    '["Java","Spring Boot","MySQL","REST"]',
    '["API design","Unit tests","Database migrations"]',
    'Vikram Singh', 'Backend Architect', '8+ Years', NULL,
    '["Week 1: Setup","Week 2: CRUD","Week 3: Auth","Week 4: Review"]',
    15, 31, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Node.js Developer Intern',
    'Express.js APIs and microservices.',
    'Software Development', 'Backend', 'Remote', '2 Months',
    9000.00, '₹9,000/month', 1, 1, 0, 0, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["Node.js","Express","MongoDB"]',
    '["REST endpoints","Auth middleware","Docs"]',
    'Lisa Chen', 'Node.js Developer', '4+ Years', NULL,
    '["Week 1-2: APIs","Week 3-4: Polish"]',
    15, 16, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Python Backend Intern',
    'FastAPI services and async data pipelines.',
    'Software Development', 'Backend', 'Remote', '3 Months',
    11000.00, '₹11,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Python","FastAPI","PostgreSQL"]',
    '["APIs","Background jobs","Testing"]',
    'Rahul Verma', 'Python Lead', '6+ Years', NULL,
    '["Monthly milestones"]',
    15, 24, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'REST API Developer Intern',
    'Design and document production REST APIs.',
    'Software Development', 'Backend', 'Remote', '2 Months',
    8500.00, '₹8,500/month', 1, 1, 0, 0, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["REST","OpenAPI","Postman"]',
    '["API specs","Integration tests","Swagger"]',
    'Vikram Singh', 'API Architect', '7+ Years', NULL,
    '["2-month delivery"]',
    15, 13, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== LIVE PROJECTS ==========
(
    'Live Project: E-Commerce Module',
    'Build cart, checkout API, deploy frontend to Vercel.',
    'Software Development', 'Live Projects', 'Remote', '1 Month',
    5000.00, '₹5,000/month', 1, 1, 1, 1, 1, 0, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Java","React","MySQL"]',
    '["Cart API","Payment mock","Vercel deploy"]',
    'Priya Sharma', 'Product Engineer', '6+ Years', NULL,
    '["Intensive 4-week delivery"]',
    15, 38, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Live Project: HR Analytics Dashboard',
    'Real Power BI dashboard on recruitment data.',
    'Data', 'Live Projects', 'Remote', '1 Month',
    0.00, 'Performance-Based', 1, 1, 1, 1, 1, 0, 1,
    'REMOTE', 'BEGINNER',
    '["Power BI","SQL"]',
    '["Data model","KPIs","Stakeholder demo"]',
    'Pooja Nair', 'BI Lead', '5+ Years', NULL,
    '["4-week intensive"]',
    15, 21, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== AI/ML ==========
(
    'AI Engineer Intern',
    'Ship AI features into production apps.',
    'AI/ML', 'AI/ML', 'Remote', '3 Months',
    18000.00, '₹18,000/month', 1, 1, 0, 1, 1, 1, 1,
    'REMOTE', 'ADVANCED',
    '["Python","TensorFlow","LLMs"]',
    '["Model APIs","Evaluation","Monitoring"]',
    'Dr. Ananya Rao', 'AI Research Lead', '10+ Years', NULL,
    '["Research + ship"]',
    15, 33, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Generative AI Intern',
    'LLM integration and prompt engineering.',
    'AI/ML', 'AI/ML', 'Remote', '3 Months',
    18000.00, '₹18,000/month', 1, 1, 0, 1, 1, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Python","LangChain","OpenAI API"]',
    '["RAG pipeline","Fine-tuning","Metrics"]',
    'Dr. Ananya Rao', 'AI Lead', '8+ Years', NULL,
    '["Week 1-4 plan"]',
    15, 29, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Machine Learning Intern',
    'Classical ML for recommendations.',
    'AI/ML', 'AI/ML', 'Hybrid', '6 Months',
    20000.00, '₹20,000/month', 0, 1, 0, 0, 1, 1, 1,
    'HYBRID', 'ADVANCED',
    '["Python","Scikit-learn","Pandas"]',
    '["Data prep","Training","A/B tests"]',
    'Rahul Verma', 'ML Engineer', '6+ Years', NULL,
    '["Bi-weekly demos"]',
    15, 18, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Deep Learning Intern',
    'Neural networks for vision and NLP.',
    'AI/ML', 'AI/ML', 'Remote', '4 Months',
    17000.00, '₹17,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'ADVANCED',
    '["PyTorch","CNN","Transformers"]',
    '["Model design","GPU training","Papers"]',
    'Dr. Ananya Rao', 'DL Scientist', '9+ Years', NULL,
    '["Monthly reviews"]',
    15, 15, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Computer Vision Intern',
    'Image classification and object detection.',
    'AI/ML', 'AI/ML', 'Remote', '3 Months',
    16000.00, '₹16,000/month', 1, 1, 0, 0, 1, 0, 1,
    'REMOTE', 'ADVANCED',
    '["OpenCV","YOLO","Python"]',
    '["Dataset","Training","Demo app"]',
    'Rahul Verma', 'CV Engineer', '5+ Years', NULL,
    '["Project-based"]',
    15, 12, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'NLP Intern',
    'Text classification and sentiment pipelines.',
    'AI/ML', 'AI/ML', 'Remote', '3 Months',
    16000.00, '₹16,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'ADVANCED',
    '["Python","NLP","Transformers"]',
    '["Labeling","Training","API deploy"]',
    'Dr. Ananya Rao', 'NLP Scientist', '8+ Years', NULL,
    '["Sprint delivery"]',
    15, 20, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== CLOUD & DEVOPS ==========
(
    'DevOps Intern',
    'CI/CD, Docker, and Kubernetes automation.',
    'Cloud & DevOps', 'DevOps', 'Remote', '3 Months',
    14000.00, '₹14,000/month', 1, 1, 0, 1, 0, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Docker","Kubernetes","Jenkins","AWS"]',
    '["Pipelines","Monitoring","IaC"]',
    'Karan Joshi', 'DevOps Lead', '9+ Years', NULL,
    '["Week 1: Docker","Week 2: K8s","Week 3: CI/CD","Week 4: Deploy"]',
    15, 26, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'AWS Cloud Intern',
    'AWS Lambda, S3, RDS for scalable apps.',
    'Cloud & DevOps', 'Cloud', 'Remote', '2 Months',
    10000.00, '₹10,000/month', 1, 1, 0, 0, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["AWS","EC2","S3","CloudWatch"]',
    '["Cloud labs","Cost optimization","Security"]',
    'Sneha Iyer', 'Cloud Consultant', '5+ Years', NULL,
    '["Week 1-2: Core","Week 3-4: Project"]',
    15, 14, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Docker & Kubernetes Intern',
    'Container orchestration for microservices.',
    'Cloud & DevOps', 'DevOps', 'Remote', '2 Months',
    12000.00, '₹12,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Docker","Kubernetes","Helm"]',
    '["Manifests","Helm charts","Observability"]',
    'Karan Joshi', 'Platform Engineer', '7+ Years', NULL,
    '["Hands-on labs"]',
    15, 17, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'CI/CD Intern',
    'GitHub Actions and Jenkins pipelines.',
    'Cloud & DevOps', 'DevOps', 'Remote', '2 Months',
    9500.00, '₹9,500/month', 1, 1, 0, 0, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["Git","Jenkins","GitHub Actions"]',
    '["Pipeline setup","Quality gates"]',
    'Karan Joshi', 'DevOps Engineer', '5+ Years', NULL,
    '["4-week bootcamp"]',
    15, 10, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== CYBERSECURITY ==========
(
    'Ethical Hacking Intern',
    'Penetration testing and security audits.',
    'Cybersecurity', 'Security', 'Hybrid', '3 Months',
    12000.00, '₹12,000/month', 0, 1, 0, 1, 0, 1, 1,
    'HYBRID', 'INTERMEDIATE',
    '["Networking","Linux","OWASP","Burp Suite"]',
    '["Vuln scans","Reports","Remediation"]',
    'Amit Desai', 'Security Analyst', '7+ Years', NULL,
    '["Week 1: Recon","Week 2: Scan","Week 3: Lab","Week 4: Report"]',
    15, 23, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'SOC Analyst Intern',
    'Monitor alerts and incident response.',
    'Cybersecurity', 'Security', 'Onsite', '3 Months',
    10000.00, '₹10,000/month', 0, 1, 0, 0, 0, 1, 1,
    'ONSITE', 'BEGINNER',
    '["SIEM","Log analysis","Networking"]',
    '["Alert triage","Playbooks","Documentation"]',
    'Amit Desai', 'SOC Lead', '6+ Years', NULL,
    '["Shift rotations + training"]',
    15, 9, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Penetration Testing Intern',
    'Web and network penetration tests.',
    'Cybersecurity', 'Security', 'Hybrid', '3 Months',
    13000.00, '₹13,000/month', 0, 1, 0, 0, 1, 1, 1,
    'HYBRID', 'ADVANCED',
    '["Kali","Metasploit","OWASP"]',
    '["Scoped tests","Executive reports"]',
    'Amit Desai', 'Pen Tester', '8+ Years', NULL,
    '["Engagement-based"]',
    15, 16, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== DATA ==========
(
    'Data Analyst Intern',
    'SQL analytics and business dashboards.',
    'Data', 'Data', 'Remote', '3 Months',
    9000.00, '₹9,000/month', 1, 1, 0, 1, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["SQL","Excel","Power BI","Python"]',
    '["Reports","Dashboards","Presentations"]',
    'Pooja Nair', 'Data Analyst Lead', '5+ Years', NULL,
    '["Week 1: Clean","Week 2: Analyze","Week 3: Viz","Week 4: Insights"]',
    15, 27, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Data Science Intern',
    'Predictive models for HR analytics.',
    'Data', 'Data', 'Remote', '6 Months',
    15000.00, '₹15,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Python","Pandas","ML","SQL"]',
    '["EDA","Modeling","Storytelling"]',
    'Pooja Nair', 'Data Scientist', '6+ Years', NULL,
    '["Monthly deliverables"]',
    15, 19, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Power BI Intern',
    'BI dashboards for recruitment metrics.',
    'Data', 'Data', 'Remote', '2 Months',
    0.00, 'Unpaid (Certificate)', 1, 1, 0, 0, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["Power BI","SQL","DAX"]',
    '["Dashboard design","Data modeling"]',
    'Pooja Nair', 'BI Analyst', '4+ Years', NULL,
    '["4-week project"]',
    15, 32, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'SQL Analyst Intern',
    'Complex queries and data warehousing.',
    'Data', 'Data', 'Remote', '2 Months',
    7000.00, '₹7,000/month', 1, 1, 0, 0, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["SQL","MySQL","ETL"]',
    '["Query optimization","Reports"]',
    'Pooja Nair', 'Analytics Engineer', '5+ Years', NULL,
    '["Query mastery track"]',
    15, 11, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== MOBILE ==========
(
    'Android Intern',
    'Native Android with Kotlin and Jetpack.',
    'Mobile', 'Mobile', 'Hybrid', '3 Months',
    10000.00, '₹10,000/month', 0, 1, 0, 0, 0, 1, 1,
    'HYBRID', 'INTERMEDIATE',
    '["Kotlin","Android","REST"]',
    '["Screens","APIs","Play Store prep"]',
    'Rohit Malhotra', 'Android Lead', '6+ Years', NULL,
    '["12-week roadmap"]',
    15, 15, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Flutter Developer Intern',
    'Cross-platform apps with Flutter.',
    'Mobile', 'Mobile', 'Remote', '3 Months',
    11000.00, '₹11,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["Flutter","Dart","Firebase"]',
    '["UI","State mgmt","Release"]',
    'Rohit Malhotra', 'Mobile Lead', '6+ Years', NULL,
    '["Week 1-4 delivery"]',
    15, 22, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'React Native Intern',
    'Mobile apps with React Native and Expo.',
    'Mobile', 'Mobile', 'Remote', '2 Months',
    9500.00, '₹9,500/month', 1, 1, 0, 1, 0, 0, 1,
    'REMOTE', 'BEGINNER',
    '["React Native","Expo","TypeScript"]',
    '["Screens","Navigation","OTA updates"]',
    'Rohit Malhotra', 'RN Developer', '4+ Years', NULL,
    '["Sprint plan"]',
    15, 13, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== BLOCKCHAIN ==========
(
    'Blockchain Developer Intern',
    'Smart contracts and Web3 dApps on EVM.',
    'Blockchain', 'Blockchain', 'Remote', '3 Months',
    20000.00, '₹20,000/month', 1, 1, 0, 1, 1, 1, 1,
    'REMOTE', 'ADVANCED',
    '["Solidity","Web3.js","Hardhat","Ethereum"]',
    '["Contract audit","dApp UI","Testnet deploy"]',
    'Dev Patel', 'Blockchain Architect', '5+ Years', NULL,
    '["Week 1: Solidity","Week 2: Contracts","Week 3: dApp","Week 4: Demo"]',
    15, 36, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Smart Contract Intern',
    'Solidity contracts for DeFi modules.',
    'Blockchain', 'Blockchain', 'Remote', '2 Months',
    15000.00, '₹15,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'ADVANCED',
    '["Solidity","OpenZeppelin","Foundry"]',
    '["Contracts","Tests","Gas optimization"]',
    'Dev Patel', 'Smart Contract Engineer', '4+ Years', NULL,
    '["Sprint delivery"]',
    15, 18, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Web3 Intern',
    'Wallet integration and dApp frontends.',
    'Blockchain', 'Blockchain', 'Remote', '2 Months',
    14000.00, '₹14,000/month', 1, 1, 0, 0, 1, 1, 1,
    'REMOTE', 'INTERMEDIATE',
    '["ethers.js","React","IPFS"]',
    '["Wallet connect","NFT UI","Testing"]',
    'Dev Patel', 'Web3 Developer', '3+ Years', NULL,
    '["Product sprint"]',
    15, 14, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),

-- ========== GAMING / IOT / OTHER ==========
(
    'Game Developer Intern',
    'Unity 2D mechanics and multiplayer basics.',
    'Gaming', 'Other', 'Remote', '3 Months',
    8000.00, '₹8,000/month', 1, 1, 0, 0, 1, 0, 1,
    'REMOTE', 'BEGINNER',
    '["Unity","C#","Game design"]',
    '["Gameplay","Level design","Bug fixes"]',
    'Alex Kim', 'Game Developer', '5+ Years', NULL,
    '["Prototype to beta"]',
    15, 12, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'AR/VR Intern',
    'Immersive experiences with Unity XR.',
    'Gaming', 'Other', 'Hybrid', '3 Months',
    12000.00, '₹12,000/month', 0, 1, 0, 0, 1, 0, 1,
    'HYBRID', 'INTERMEDIATE',
    '["Unity","XR Toolkit","C#"]',
    '["Scenes","Interactions","Performance"]',
    'Alex Kim', 'XR Developer', '4+ Years', NULL,
    '["Milestone demos"]',
    15, 8, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'IoT Intern',
    'Sensors, MQTT, and cloud dashboards.',
    'IoT', 'Other', 'Onsite', '3 Months',
    7000.00, '₹7,000/month', 0, 1, 0, 0, 0, 0, 1,
    'ONSITE', 'INTERMEDIATE',
    '["Arduino","Raspberry Pi","MQTT"]',
    '["Hardware","Firmware","Dashboard"]',
    'Sanjay Reddy', 'IoT Engineer', '6+ Years', NULL,
    '["Lab + field tests"]',
    15, 7, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
),
(
    'Embedded Systems Intern',
    'Firmware on ARM microcontrollers.',
    'IoT', 'Other', 'Onsite', '6 Months',
    9000.00, '₹9,000/month', 0, 1, 0, 0, 0, 1, 1,
    'ONSITE', 'ADVANCED',
    '["C","RTOS","Embedded Linux"]',
    '["Drivers","Debugging","Documentation"]',
    'Sanjay Reddy', 'Embedded Lead', '8+ Years', NULL,
    '["Long-term project"]',
    15, 6, DATE_ADD(CURDATE(), INTERVAL 2 MONTH), @hr_id, 1
);

-- Verify: expect 40 rows
SELECT COUNT(*) AS total_internships FROM internships;

SELECT id, title, domain, category, work_mode, level, stipend_label, featured, live_project, ppo_available
FROM internships
ORDER BY domain, category, title;
