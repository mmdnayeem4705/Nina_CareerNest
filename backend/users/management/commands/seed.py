from django.core.management.base import BaseCommand

from applications.models import Application
from companies.models import Company
from jobs.models import Job
from notifications.models import Notification
from resumes.matching import score_candidate
from users.models import CandidateProfile, Education, Experience, User


class Command(BaseCommand):
    help = "Seed demo users, companies, jobs, and applications."

    def handle(self, *args, **options):
        admin, _ = User.objects.get_or_create(
            email="admin@nina.org",
            defaults={
                "first_name": "Nina",
                "last_name": "Admin",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin.role = User.Role.ADMIN
        admin.is_staff = True
        admin.is_superuser = True
        admin.set_password("Admin1234!")
        admin.save()

        recruiter, _ = User.objects.get_or_create(
            email="recruiter@nina.org",
            defaults={"first_name": "Rhea", "last_name": "Kapoor", "role": User.Role.RECRUITER, "phone": "+65 8123 4567"},
        )
        recruiter.role = User.Role.RECRUITER
        recruiter.set_password("Recruiter1234!")
        recruiter.save()

        candidate, _ = User.objects.get_or_create(
            email="candidate@nina.org",
            defaults={"first_name": "Arjun", "last_name": "Mehta", "role": User.Role.CANDIDATE, "phone": "+91 98765 43210"},
        )
        candidate.role = User.Role.CANDIDATE
        candidate.set_password("Candidate1234!")
        candidate.save()

        profile, _ = CandidateProfile.objects.get_or_create(user=candidate)
        profile.headline = "Python developer who ships reliable APIs"
        profile.bio = "Backend engineer with Django, PostgreSQL, and test automation experience. Comfortable owning features from schema to deploy."
        profile.location = "Bengaluru, India"
        profile.skills = ["Python", "Django", "PostgreSQL", "Selenium", "REST", "Git"]
        profile.years_experience = 4
        profile.linkedin = "https://linkedin.com"
        profile.save()
        profile.education.all().delete()
        Education.objects.create(profile=profile, school="NIT Karnataka", degree="B.Tech", field="Computer Science", start_year=2018, end_year=2022)
        profile.experience.all().delete()
        Experience.objects.create(
            profile=profile,
            company="Harbor Labs",
            title="Software Engineer",
            start_date="2022",
            end_date="Present",
            description="Built REST APIs with Django and automated regression suites.",
        )

        company, _ = Company.objects.get_or_create(
            owner=recruiter,
            defaults={
                "name": "LumenForge",
                "description": "Product studio building hiring and operations software for growing teams.",
                "website": "https://lumenforge.example",
                "industry": "Software",
                "location": "Singapore",
            },
        )
        company.name = "LumenForge"
        company.description = "Product studio building hiring and operations software for growing teams."
        company.website = "https://lumenforge.example"
        company.industry = "Software"
        company.location = "Singapore"
        company.save()

        jobs_spec = [
            {
                "title": "Python Developer",
                "location": "Singapore / Remote",
                "job_type": Job.JobType.FULL_TIME,
                "salary_min": 90000,
                "salary_max": 130000,
                "required_skills": ["Python", "Django", "PostgreSQL", "Docker"],
                "description": "Own backend services for our hiring marketplace. You will design APIs, shape data models, and work closely with product.",
                "requirements": "3+ years Python. Strong Django REST experience. Comfortable with PostgreSQL and Docker.",
            },
            {
                "title": "QA Automation Engineer",
                "location": "Bengaluru",
                "job_type": Job.JobType.FULL_TIME,
                "salary_min": 70000,
                "salary_max": 100000,
                "required_skills": ["Python", "Selenium", "Pytest", "Playwright"],
                "description": "Build a durable automation layer across web flows for candidates, recruiters, and admins.",
                "requirements": "Hands-on Selenium or Playwright. Pytest fixtures and reporting. CI familiarity is a plus.",
            },
            {
                "title": "Full-Stack Engineer",
                "location": "Remote",
                "job_type": Job.JobType.REMOTE,
                "salary_min": 100000,
                "salary_max": 145000,
                "required_skills": ["Python", "Django", "React", "PostgreSQL"],
                "description": "Ship candidate and recruiter experiences end to end, from REST contracts to polished UI.",
                "requirements": "Django + React. Care about UX details. Experience with JWT auth is helpful.",
            },
        ]

        created_jobs = []
        for spec in jobs_spec:
            job, _ = Job.objects.get_or_create(company=company, title=spec["title"], defaults={**spec, "posted_by": recruiter})
            for key, value in spec.items():
                setattr(job, key, value)
            job.posted_by = recruiter
            job.is_active = True
            job.save()
            created_jobs.append(job)

        python_job = created_jobs[0]
        result = score_candidate(python_job.required_skills, profile.skills)
        app, made = Application.objects.get_or_create(
            job=python_job,
            candidate=candidate,
            defaults={
                "cover_letter": "I have shipped Django APIs in production and automated the critical paths with Selenium.",
                "match_score": result["score"],
                "matched_skills": result["matched"],
                "missing_skills": result["missing"],
            },
        )
        if not made:
            app.match_score = result["score"]
            app.matched_skills = result["matched"]
            app.missing_skills = result["missing"]
            app.save()

        Notification.objects.get_or_create(
            user=candidate,
            title="Welcome to NINA",
            defaults={"body": "Your candidate workspace is ready. Complete your profile and start matching.", "link": "/profile"},
        )
        Notification.objects.get_or_create(
            user=recruiter,
            title="Welcome, recruiter",
            defaults={"body": "Your company profile is live. Post a role or review incoming applicants.", "link": "/recruiter"},
        )

        self.stdout.write(self.style.SUCCESS("Seeded demo data."))
        self.stdout.write("Admin     admin@nina.org / Admin1234!")
        self.stdout.write("Recruiter recruiter@nina.org / Recruiter1234!")
        self.stdout.write("Candidate candidate@nina.org / Candidate1234!")
