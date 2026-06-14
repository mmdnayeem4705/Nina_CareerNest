# 🚀 Nina Organization – Enterprise Job Application & Recruitment Portal

## 📌 Project Overview

**Nina Organization** is a full-stack enterprise-level recruitment management platform designed for hiring employees, interns, and conducting company events such as hackathons, coding contests, seminars, and workshops.

The platform supports three different user roles:

* 👨‍💻 Job Seeker
* 🧑‍💼 HR
* 🛡️ Admin

Each role has its own authentication, authorization, dashboard, UI, and functionalities.

The project is built using modern enterprise technologies with scalable architecture, secure authentication, real-time workflows, analytics, monitoring, and production-ready deployment.

---

# 🌟 Main Features

## 👨‍💻 Job Seeker Portal

### Features

* 🔐 Register/Login
* 📄 Resume Upload
* 💼 Apply for Jobs
* 🎯 Recommended Jobs
* 🧠 Skill-based Recommendations
* 📌 Save Jobs
* 📊 Track Application Status
* 🎓 Internship Applications
* 📚 Learning & Preparation Section
* 🏆 Participate in Hackathons & Coding Contests
* 🔔 Real-Time Notifications

### Pages

* 🏠 Home
* 💼 Jobs
* 🎓 Internships
* 📚 Prepare
* 🏆 Participate
* 📊 Application Tracker
* 👤 Profile
* 🔔 Notifications

---

## 🧑‍💼 HR Portal

### Features

* ➕ Create/Edit/Delete Jobs
* 📅 Manage Hiring Deadlines
* 🎓 Create Internship Programs
* 📂 Resume Screening
* ✅ Accept/Reject Candidates
* 🔄 Move Candidates Between Hiring Rounds
* 📧 Send Interview Emails
* 🏆 Organize Hackathons & Contests
* 📢 Conduct Seminars/Webinars
* 📊 Analytics Dashboard

### HR Workflow

```text
Applied → Screening → Assessment → Interview → Offer
```

---

## 🛡️ Admin Portal

### Features

* 👥 Manage Users & HRs
* 🚫 Ban/Unban Accounts
* 📈 Platform Analytics
* 🧾 System Monitoring
* ⚙️ Platform Configuration
* 📊 Reports & Statistics
* 🐞 Error Monitoring
* 🔍 Activity Logs

---

# 🏗️ Tech Stack

## 🎨 Frontend

* ⚛️ React.js
* 🔷 TypeScript
* 🎨 TailwindCSS
* 🧩 Shadcn UI
* 🔄 React Query / TanStack Query
* 🧠 Zustand / Redux Toolkit
* ✨ Framer Motion
* 🌐 Axios
* 🛣️ React Router DOM

---

## ⚙️ Backend

* ☕ Java
* 🍃 Spring Boot
* 🔐 Spring Security
* 🪪 JWT Authentication
* 🗄️ Hibernate / JPA
* 📦 Maven
* 🌐 REST APIs

---

## 🗃️ Database

* 🐬 MySQL

---

## ☁️ Cloud & Services

* 📧 Resend (Emails)
* 🐞 Sentry (Error Tracking)
* 📊 PostHog (Analytics)
* 🔄 Supabase Realtime (Optional)

---

## 🧪 Testing & API Tools

* 📬 Postman (API Testing)
* 🎭 Playwright (Frontend Testing & Automation)

---

# 🔐 Authentication & Authorization

Implemented using:

* Spring Security
* JWT Authentication
* Role-Based Access Control (RBAC)

## Roles

```text
ROLE_JOBSEEKER
ROLE_HR
ROLE_ADMIN
```


---

# 🗄️ Database Tables

## Core Tables

* users
* roles
* jobs
* internships
* applications
* resumes
* interviews
* notifications
* events
* hackathons
* contests
* webinars
* seminars
* saved_jobs
* courses
* activity_logs

---

# 🔥 Real-Time Features

Implemented using:

* Supabase Realtime OR WebSockets

## Real-Time Updates

* 📊 Application Status
* 🔔 Notifications
* 📅 Event Updates
* 🎤 Seminar Alerts
* 🏆 Contest Announcements

---

# 📧 Email System

Integrated with:

* 📮 Resend

## Email Features

* ✅ Email Verification
* 🔑 Password Reset
* 💼 Job Application Confirmation
* 📅 Interview Scheduling
* 🎉 Selection Emails
* ❌ Rejection Emails
* 🔔 Event Reminders

---




---

Demo logins (after backend starts)
Email	          Password
seeker@nina.com   seeker123
hr@nina.com       hr123456
admin@nina.com    admin123
---



---

---

# 🛠️ Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/nina-organization.git
```

---

# 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 3️⃣ Backend Setup

```bash
Option A — recommended (stops old process first):

cd "c:\Users\SINGAPORE\Downloads\Nina Organization\backend"
.\start.ps1
Option B — manual:


cd "c:\Users\SINGAPORE\Downloads\Nina Organization\backend"
.\stop.ps1
.\run.ps1 spring-boot:run
---

# 4️⃣ Database Setup

Create MySQL database:

```sql
CREATE DATABASE nina_db;
```

Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nina_db
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# 🔐 Environment Variables

## Frontend `.env`

```env
VITE_API_URL=http://localhost:8080
```

---

## Backend `.env`

```env
JWT_SECRET=your_secret_key
RESEND_API_KEY=your_resend_key
SENTRY_DSN=your_sentry_dsn
POSTHOG_API_KEY=your_posthog_key
```

-

---

# 🎯 Project Goals

✅ Enterprise-Level Architecture
✅ Real-Time Recruitment Workflow
✅ Secure Authentication & Authorization
✅ Scalable Backend APIs
✅ Modern Frontend UI
✅ Analytics & Monitoring
✅ Full Hiring Ecosystem
✅ Portfolio-Ready Production Project

---


