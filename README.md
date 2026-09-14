# NINA Organization — Job Portal

Recruitment product with a React frontend and Django REST backend. Candidates build profiles, upload resumes, and apply. Recruiters post jobs, rank applicants by skill match, and schedule interviews. Admins oversee users, companies, and hiring stats.

## Stack

- Frontend: React (Vite)
- Backend: Python, Django REST Framework, JWT
- Database: SQLite for local first run, PostgreSQL via Docker Compose
- Resume parse: PDF / DOCX / TXT skill extraction and match score

Testing is intentionally not included yet.

## Local run (recommended)

You need Python 3.13 (`py` on Windows), Node.js, and Git.

```powershell
cd C:\Users\SINGAPORE\Nina_organization
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
cd backend
python manage.py migrate
python manage.py seed
python manage.py runserver
```

In a second terminal:

```powershell
cd C:\Users\SINGAPORE\Nina_organization\frontend
npm install
npm run dev
```

Open http://localhost:5173

Vite proxies `/api` and `/media` to Django on port 8000.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Candidate | candidate@nina.org | Candidate1234! |
| Recruiter | recruiter@nina.org | Recruiter1234! |
| Admin | admin@nina.org | Admin1234! |

The seeded Python Developer application should show a **75%** match (Python, Django, PostgreSQL present; Docker missing).

## PostgreSQL with Docker

```powershell
docker compose up --build
```

Set `DATABASE_URL=postgres://nina:nina@localhost:5432/nina` if you run Django on the host against the Compose database.

## API sketch

- `POST /api/auth/register/`
- `POST /api/auth/login/` (body: `{ "username": "email", "password": "..." }`)
- `GET/PATCH /api/auth/me/`
- `GET/PATCH /api/auth/profile/`
- `GET /api/jobs/`
- `POST /api/applications/jobs/:id/apply/`
- `POST /api/resumes/` (multipart file)
- Recruiter and admin routes under `/api/jobs/mine/`, `/api/applications/`, `/api/admin/`
