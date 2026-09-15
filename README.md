# NINA Organization — Job Portal

Recruitment product with a React frontend and Django REST backend. Candidates build profiles, upload resumes, and apply. Recruiters post jobs, rank applicants by skill match, and schedule interviews. Admins oversee users, companies, and hiring stats.



# If you want to run it again later
Open PowerShell and run:
$env:Path += ";C:\Program Files\PostgreSQL\17\bin"

(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (& c:\Users\SINGAPORE\OneDrive\Desktop\Nina_organization\.venv\Scripts\Activate.ps1)
cd backend
python manage.py runserver 0.0.0.0:8000


Then in another terminal:
cd "C:\Users\SINGAPORE\OneDrive\Desktop\Nina_organization\frontend"
npm run dev -- --host 0.0.0.0


What to do next
1) Open the app
Use:

Frontend: http://localhost:5174/
Backend API: http://localhost:8000/api/jobs/
2) Log in with demo accounts
Admin: admin@nina.org / Admin1234!
Recruiter: recruiter@nina.org / Recruiter1234!
Candidate: candidate@nina.org / Candidate1234!



# Stack

- Frontend: React (Vite)
- Backend: Python, Django REST Framework, JWT
- Database: PostgreSQL 17 for local development
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

## View the database

By default, local development uses SQLite at `backend/db.sqlite3`. You can inspect it with **DB Browser for SQLite** by opening that file, or query it from the backend shell:

```powershell
cd backend
..\.venv\Scripts\python.exe manage.py dbshell
```

For a visual view of users, companies, jobs, and applications, open `http://localhost:8000/admin/` after creating a superuser with `python manage.py createsuperuser`.

When `DATABASE_URL` is set to PostgreSQL, the live database is PostgreSQL instead of `backend/db.sqlite3`. Use a PostgreSQL client such as pgAdmin or the `psql` command with the connection details from `DATABASE_URL`.

## API sketch

- `POST /api/auth/register/`
- `POST /api/auth/login/` (body: `{ "email": "candidate@nina.org", "password": "..." }`)
- `GET/PATCH /api/auth/me/`
- `GET/PATCH /api/auth/profile/`
- `GET /api/jobs/`
- `POST /api/applications/jobs/:id/apply/`
- `POST /api/resumes/` (multipart file)
- Recruiter and admin routes under `/api/jobs/mine/`, `/api/applications/`, `/api/admin/`
