-- =============================================================================
-- Nina Organization — Participate Page: seed ALL events
-- Run in MySQL Workbench after users exist (hr@nina.com from app seed / setup).
--
-- Prerequisites:
--   USE nina_db;
--   Events table must have: prize_pool, team_size, topic, featured columns
--   (see full-setup-mysql-workbench.sql or 03-alter-events-participate.sql)
--
-- Optional: clear existing events first (also clears contest_registrations FK rows)
--   SET FOREIGN_KEY_CHECKS = 0;
--   TRUNCATE TABLE contest_registrations;
--   TRUNCATE TABLE events;
--   SET FOREIGN_KEY_CHECKS = 1;
-- =============================================================================

USE nina_db;

SET @hr_id := (SELECT id FROM users WHERE email = 'hr@nina.com' LIMIT 1);

-- If HR user missing, create demo users first via backend startup or full-setup script.

INSERT INTO events (
    title, description, type, start_date, end_date, location,
    prize_pool, team_size, topic, featured,
    max_participants, registered_count, created_by_id, active
) VALUES

-- ========== HACKATHONS ==========
(
    'AI Innovation Hackathon 2026',
    'Build AI-powered solutions for real business problems. Teams present to Nina judges.',
    'HACKATHON',
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    DATE_ADD(NOW(), INTERVAL 32 DAY),
    'Online',
    '₹50,000', '2-4', 'AI', 1,
    500, 142, @hr_id, 1
),
(
    'Nina Code Sprint 2026',
    '48-hour hackathon. Full-stack or mobile. Prizes up to ₹1L.',
    'HACKATHON',
    DATE_ADD(NOW(), INTERVAL 45 DAY),
    DATE_ADD(NOW(), INTERVAL 47 DAY),
    'Online',
    '₹1,00,000', '2-4', 'Full Stack', 1,
    800, 256, @hr_id, 1
),
(
    'Web3 Builders Hackathon',
    'Smart contracts and dApps on EVM chains.',
    'HACKATHON',
    DATE_ADD(NOW(), INTERVAL 60 DAY),
    DATE_ADD(NOW(), INTERVAL 62 DAY),
    'Online',
    '₹75,000', '2-3', 'Web3', 0,
    300, 88, @hr_id, 1
),
(
    'Blockchain Innovation Challenge',
    'Solve real-world supply chain problems on-chain.',
    'HACKATHON',
    DATE_ADD(NOW(), INTERVAL 50 DAY),
    DATE_ADD(NOW(), INTERVAL 52 DAY),
    'Online',
    '₹35,000', '2-4', 'Blockchain', 0,
    250, 67, @hr_id, 1
),

-- ========== CODING CONTESTS ==========
(
    'Weekly Coding Contest #42',
    'Timed 90-minute contest. Live rankings and leaderboard updates.',
    'CONTEST',
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 7 DAY), INTERVAL 3 HOUR),
    'Online',
    '₹10,000', 'Solo', 'DSA', 1,
    1000, 412, @hr_id, 1
),
(
    'Monthly Grand Contest',
    'Hard problems. Top 10 get swag plus interview fast-track with Nina HR.',
    'CONTEST',
    DATE_ADD(NOW(), INTERVAL 28 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 28 DAY), INTERVAL 4 HOUR),
    'Online',
    '₹25,000', 'Solo', 'Algorithms', 1,
    2000, 890, @hr_id, 1
),
(
    'Project Showcase Competition',
    'Submit GitHub projects and presentations. Judges from Nina HR.',
    'CONTEST',
    DATE_ADD(NOW(), INTERVAL 35 DAY),
    DATE_ADD(NOW(), INTERVAL 40 DAY),
    'Online',
    '₹30,000', '1-3', 'Innovation', 1,
    400, 156, @hr_id, 1
),

-- ========== WORKSHOPS ==========
(
    'Spring Boot Live Workshop',
    'Hands-on REST APIs, JPA, and Security with live coding.',
    'WORKSHOP',
    DATE_ADD(NOW(), INTERVAL 14 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 14 DAY), INTERVAL 4 HOUR),
    'Virtual',
    'Certificate', 'Solo', 'Backend', 1,
    200, 78, @hr_id, 1
),
(
    'React 19 Workshop',
    'Server components, hooks, and deployment to production.',
    'WORKSHOP',
    DATE_ADD(NOW(), INTERVAL 21 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 21 DAY), INTERVAL 5 HOUR),
    'Virtual',
    'Certificate', 'Solo', 'Frontend', 0,
    250, 95, @hr_id, 1
),
(
    'Docker & Kubernetes Workshop',
    'Containerize and deploy microservices on Kubernetes.',
    'WORKSHOP',
    DATE_ADD(NOW(), INTERVAL 18 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 18 DAY), INTERVAL 6 HOUR),
    'Hybrid',
    'Certificate', 'Solo', 'DevOps', 0,
    150, 54, @hr_id, 1
),
(
    'Generative AI Workshop',
    'LLMs, RAG pipelines, and prompt engineering labs.',
    'WORKSHOP',
    DATE_ADD(NOW(), INTERVAL 25 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 25 DAY), INTERVAL 4 HOUR),
    'Online',
    'Certificate', 'Solo', 'AI', 1,
    180, 72, @hr_id, 1
),

-- ========== SEMINARS ==========
(
    'Cloud Architecture Seminar',
    'AWS services, scaling patterns, and cost optimization.',
    'SEMINAR',
    DATE_ADD(NOW(), INTERVAL 10 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 10 DAY), INTERVAL 2 HOUR),
    'Online',
    NULL, NULL, 'Cloud', 0,
    500, 201, @hr_id, 1
),
(
    'Cybersecurity Threat Landscape',
    'SOC operations, OWASP Top 10, and incident response playbooks.',
    'SEMINAR',
    DATE_ADD(NOW(), INTERVAL 12 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 12 DAY), INTERVAL 2 HOUR),
    'Online',
    NULL, NULL, 'Cybersecurity', 0,
    400, 167, @hr_id, 1
),
(
    'Web3 & Blockchain Tech Talk',
    'DeFi trends, smart contract security, and Web3 careers.',
    'SEMINAR',
    DATE_ADD(NOW(), INTERVAL 20 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 20 DAY), INTERVAL 1 HOUR),
    'Online',
    NULL, NULL, 'Web3', 0,
    350, 128, @hr_id, 1
),

-- ========== WEBINARS ==========
(
    'Career Webinar: Product vs Service',
    'Panel discussion with Nina engineers and HR on career paths.',
    'WEBINAR',
    DATE_ADD(NOW(), INTERVAL 5 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 5 DAY), INTERVAL 1 HOUR),
    'Online',
    NULL, NULL, 'Career', 1,
    1000, 445, @hr_id, 1
),
(
    'DevOps Live Stream Day',
    'Live CI/CD pipeline build and Q&A on stream.',
    'WEBINAR',
    DATE_ADD(NOW(), INTERVAL 8 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL 8 DAY), INTERVAL 3 HOUR),
    'Online',
    NULL, NULL, 'DevOps', 0,
    600, 234, @hr_id, 1
);

-- Verify
SELECT id, title, type, prize_pool, team_size, topic, featured, start_date, registered_count
FROM events
ORDER BY type, start_date;
