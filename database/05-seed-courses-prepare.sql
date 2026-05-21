-- =============================================================================
-- Nina Organization — Prepare Page: seed ALL courses
-- Run in MySQL Workbench after courses table exists.
--
-- Optional clear:
--   TRUNCATE TABLE course_progress;
--   TRUNCATE TABLE courses;
-- =============================================================================

USE nina_db;

INSERT INTO courses (title, description, category, duration_minutes, total_lessons) VALUES

('Java Full Stack Roadmap', 'From Java basics to Spring Boot + React deployment.', 'FULL_STACK', 600, 45),
('Frontend Developer Roadmap', 'HTML, CSS, JavaScript, React, and portfolio projects.', 'FULL_STACK', 480, 38),
('Backend Developer Roadmap', 'REST, databases, auth, and microservices.', 'FULL_STACK', 520, 40),
('DevOps Engineer Track', 'Linux, Docker, Kubernetes, CI/CD, and AWS.', 'DEVOPS', 400, 32),
('AI/ML Foundations', 'Python, ML, deep learning, and Gen AI basics.', 'AI_ML', 450, 36),
('Data Science Bootcamp', 'Statistics, Pandas, visualization, and ML projects.', 'DATA_SCIENCE', 500, 42),
('Cybersecurity Essentials', 'Networking, OWASP, pentesting, and SOC basics.', 'CYBERSECURITY', 360, 28),
('TCS Digital Preparation', 'Aptitude, coding, and TCS-specific interview prep.', 'COMPANY_PREP', 240, 20),
('Infosys SP DSA Track', 'Infosys pattern DSA and verbal ability.', 'COMPANY_PREP', 200, 18),
('Product Company DSA 150', 'Curated 150 problems for FAANG-style interviews.', 'DSA', 300, 150),
('Arrays & Strings Mastery', 'Easy to hard problems with video solutions.', 'DSA', 180, 60),
('Trees, Graphs & DP', 'Advanced DSA for coding rounds.', 'DSA', 220, 55),
('Mock HR Interview', 'Common HR questions with sample answers.', 'MOCK_INTERVIEW', 60, 12),
('Technical Mock Interview', 'Java, Spring, React, and system design Q&A.', 'MOCK_INTERVIEW', 90, 25),
('System Design Mock', 'Scalability, caching, and architecture patterns.', 'MOCK_INTERVIEW', 120, 15),
('Spring Boot Masterclass Video', 'Recorded enterprise Spring Boot tutorials.', 'VIDEO_TUTORIAL', 180, 24),
('React 19 Deep Dive', 'Hooks, server components, and performance.', 'VIDEO_TUTORIAL', 150, 18),
('Company Seminar: Hiring 2026', 'Nina HR panel on what we look for in candidates.', 'VIDEO_TUTORIAL', 45, 6),
('Aptitude for Placements', 'Quant, logical reasoning, and verbal.', 'APTITUDE', 120, 30),
('SQL for Interviews', 'Joins, indexes, and query optimization.', 'DSA', 90, 22);

SELECT id, title, category, duration_minutes, total_lessons FROM courses ORDER BY category, title;
