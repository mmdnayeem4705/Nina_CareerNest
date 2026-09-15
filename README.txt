NINA Organization — Job Portal 🚀
===================================

A full-stack recruitment and job portal built with React and Django REST Framework.


✨ FEATURES
==========

👤 CANDIDATE
------------
• Register and log in using JWT authentication
• Create and update profile
• Upload resumes
• Search jobs and internships
• Apply for jobs
• Track applications
• View skill-match information


🏢 RECRUITER
------------
• Create and manage job postings
• View applicants
• Check skill-match scores
• Manage applications
• Schedule interviews


🛠️ ADMIN
---------
• Manage users and companies
• Manage jobs and applications
• View hiring information


🧰 TECHNOLOGY STACK
===================

Frontend
--------
• React.js
• Vite
• HTML, CSS, JavaScript

Backend
-------
• Python
• Django
• Django REST Framework
• JWT Authentication

Database
--------
• PostgreSQL

Other Technologies
------------------
• Resume parsing for PDF, DOCX and TXT
• REST APIs
• Docker support
• Git and GitHub
• Render deployment


📁 PROJECT STRUCTURE
====================

Nina_CareerNest/
│
├── backend/              → Django REST API
├── frontend/             → React + Vite application
├── docker-compose.yml
├── .env.example
└── README.txt


▶️ RUN THE PROJECT LOCALLY
==========================

Requirements
------------
• Python 3.13
• Node.js
• PostgreSQL
• Git


1. Start the Backend
--------------------

Open PowerShell:

    cd C:\Users\SINGAPORE\Nina_organization
    .\.venv\Scripts\Activate.ps1
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py seed
    python manage.py runserver

Backend URL:

    http://localhost:8000


2. Start the Frontend
---------------------

Open another terminal:

    cd C:\Users\SINGAPORE\Nina_organization\frontend
    npm install
    npm run dev

Frontend URL:

    http://localhost:5173


🔗 API ENDPOINTS
================

Authentication
--------------
• POST   /api/auth/register/
• POST   /api/auth/login/
• GET    /api/auth/me/
• PATCH  /api/auth/me/
• GET    /api/auth/profile/
• PATCH  /api/auth/profile/

Jobs
----
• GET    /api/jobs/
• GET    /api/jobs/mine/

Applications
------------
• POST   /api/applications/jobs/<id>/apply/
• GET    /api/applications/

Resumes
-------
• POST   /api/resumes/

Admin
-----
• /api/admin/


🗄️ DATABASE
===========

The application uses PostgreSQL.

When DATABASE_URL is configured, Django connects to the PostgreSQL
database specified by that variable.


🔐 DEMO ACCOUNTS
================

The seed command creates demo accounts for development.

Candidate
---------
Email: candidate@nina.org

Recruiter
---------
Email: recruiter@nina.org

Admin
-----
Email: admin@nina.org

⚠️ Demo passwords are intentionally not included in this public README.
Do not use demo credentials for a real production environment.


🌐 DEPLOYMENT
=============

The project is deployed on Render.

Frontend
--------
https://nina-careernest-frontend.onrender.com

Backend
-------
https://nina-careernest-backend.onrender.com


Production Architecture
-----------------------

    React Frontend
          │
          │ REST API
          ▼
    Django REST Backend
          │
          ▼
    PostgreSQL Database


Frontend Environment Variable
-----------------------------

    VITE_API_URL


Backend Environment Variable
----------------------------

    CORS_ALLOWED_ORIGINS


🔄 UPDATE THE DEPLOYED PROJECT
==============================

After making code changes:

    git add .
    git commit -m "Update project"
    git push origin main

Render can automatically deploy the latest changes from the main branch.

You do NOT need to create a new Render service every time you update
your code.


📄 RESUME PARSING
=================

Candidates can upload resumes in:

• PDF
• DOCX
• TXT

The backend extracts skills from uploaded resumes and can calculate
a job skill-match score.


🧪 TESTING
==========

Automated testing is not included yet.

Future improvements:

• Unit testing
• API testing
• Frontend testing
• End-to-end testing
• CI/CD automation


👨‍💻 PROJECT
============

NINA Organization — Job Portal

A full-stack recruitment platform built with:

• React
• Django REST Framework
• JWT Authentication
• PostgreSQL

Built for managing candidates, recruiters, jobs, applications,
resumes, skill matching, and interviews.
