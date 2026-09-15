NINA Organization — Job Portal 🚀

A full-stack recruitment and job portal built with React and Django REST
Framework.

✨ FEATURES

👤 Candidate - Register and log in using JWT authentication - Create and
update profile - Upload resumes - Search jobs and internships - Apply
for jobs - Track applications - View skill-match information

🏢 Recruiter - Create and manage job postings - View applicants - Check
skill-match scores - Manage applications - Schedule interviews

🛠️ Admin - Manage users and companies - Manage jobs and applications -
View hiring information

🧰 TECHNOLOGY STACK

Frontend: - React.js - Vite - HTML, CSS, JavaScript

Backend: - Python - Django - Django REST Framework - JWT Authentication

Database: - PostgreSQL

Other: - Resume parsing for PDF, DOCX and TXT - REST APIs - Docker
support - Git and GitHub - Render deployment

📁 PROJECT STRUCTURE

Nina_CareerNest/ ├── backend/ # Django REST API ├── frontend/ # React +
Vite application ├── docker-compose.yml ├── .env.example └── README.txt

▶️ RUN LOCALLY

Requirements: - Python 3.13 - Node.js - PostgreSQL - Git

Backend:

    cd C:\Users\SINGAPORE\Nina_organization
    .\.venv\Scripts\Activate.ps1
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py seed
    python manage.py runserver

Backend: http://localhost:8000

Frontend (open another terminal):

    cd C:\Users\SINGAPORE\Nina_organization\frontend
    npm install
    npm run dev

Frontend: http://localhost:5173

🔗 API ENDPOINTS

Authentication: - POST /api/auth/register/ - POST /api/auth/login/ -
GET/PATCH /api/auth/me/ - GET/PATCH /api/auth/profile/

Jobs: - GET /api/jobs/ - /api/jobs/mine/

Applications: - POST /api/applications/jobs//apply/ - /api/applications/

Resumes: - POST /api/resumes/

Admin: - /api/admin/

🗄️ DATABASE

The application uses PostgreSQL.

When DATABASE_URL is configured, Django connects to the PostgreSQL
database specified by that variable.

🔐 DEMO ACCOUNTS

The seed command creates demo accounts for development:

Candidate: candidate@nina.org

Recruiter: recruiter@nina.org

Admin: admin@nina.org

⚠️ Do not use demo passwords for a real production environment. Change
or remove demo accounts before using the application with real users.

🌐 DEPLOYMENT

The project is deployed on Render.

Frontend: https://nina-careernest-frontend.onrender.com

Backend: https://nina-careernest-backend.onrender.com

Architecture:

    React Frontend
          |
          | REST API
          v
    Django REST Backend
          |
          v
    PostgreSQL Database

Frontend API configuration: VITE_API_URL

Backend CORS configuration: CORS_ALLOWED_ORIGINS

🔄 UPDATE THE DEPLOYED PROJECT

After making code changes:

    git add .
    git commit -m "Update project"
    git push origin main

Render can automatically deploy the latest changes from the main branch.

You do NOT need to create a new Render service every time you update
your code.

📄 RESUME PARSING

Candidates can upload: - PDF - DOCX - TXT

The backend extracts skills from resumes and can calculate a job
skill-match score.

🧪 TESTING

Automated testing is not included yet.

Future improvements: - Unit testing - API testing - Frontend testing -
End-to-end testing - CI/CD automation

👨‍💻 PROJECT

NINA Organization — Job Portal

A full-stack recruitment platform built with React, Django REST
Framework, JWT authentication, and PostgreSQL.
