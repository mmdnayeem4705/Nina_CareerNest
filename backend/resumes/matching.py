import re
from pathlib import Path

KNOWN_SKILLS = [
    "python",
    "django",
    "flask",
    "fastapi",
    "postgresql",
    "mysql",
    "sqlite",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "linux",
    "git",
    "github",
    "javascript",
    "typescript",
    "react",
    "vue",
    "angular",
    "node",
    "nodejs",
    "html",
    "css",
    "selenium",
    "playwright",
    "pytest",
    "java",
    "spring",
    "rest",
    "api",
    "graphql",
    "celery",
    "nginx",
    "ci/cd",
    "github actions",
    "machine learning",
    "nlp",
    "pandas",
    "numpy",
    "sql",
    "excel",
    "jira",
    "agile",
    "scrum",
]

DISPLAY = {
    "python": "Python",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "postgresql": "PostgreSQL",
    "mysql": "MySQL",
    "sqlite": "SQLite",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "aws": "AWS",
    "azure": "Azure",
    "gcp": "GCP",
    "linux": "Linux",
    "git": "Git",
    "github": "GitHub",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "react": "React",
    "vue": "Vue",
    "angular": "Angular",
    "node": "Node.js",
    "nodejs": "Node.js",
    "html": "HTML",
    "css": "CSS",
    "selenium": "Selenium",
    "playwright": "Playwright",
    "pytest": "Pytest",
    "java": "Java",
    "spring": "Spring",
    "rest": "REST",
    "api": "API",
    "graphql": "GraphQL",
    "celery": "Celery",
    "nginx": "Nginx",
    "ci/cd": "CI/CD",
    "github actions": "GitHub Actions",
    "machine learning": "Machine Learning",
    "nlp": "NLP",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "sql": "SQL",
    "excel": "Excel",
    "jira": "Jira",
    "agile": "Agile",
    "scrum": "Scrum",
}


def extract_text(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    if suffix in {".docx", ".doc"}:
        from docx import Document

        doc = Document(str(path))
        return "\n".join(p.text for p in doc.paragraphs)
    if suffix == ".txt":
        return path.read_text(encoding="utf-8", errors="ignore")
    return ""


def extract_skills(text: str) -> list[str]:
    blob = f" {text.lower()} "
    result = []
    seen = set()
    for skill in KNOWN_SKILLS:
        pattern = r"(?<![a-z0-9])" + re.escape(skill.lower()) + r"(?![a-z0-9])"
        if re.search(pattern, blob):
            label = DISPLAY.get(skill, skill)
            if label not in seen:
                seen.add(label)
                result.append(label)
    return result


def normalize_skill(skill: str) -> str:
    return re.sub(r"[^a-z0-9+#]+", "", (skill or "").lower())


def score_candidate(required_skills: list, candidate_skills: list) -> dict:
    required = [s for s in required_skills if str(s).strip()]
    if not required:
        return {"score": 100.0, "matched": list(candidate_skills or []), "missing": []}
    cand_norm = {normalize_skill(s) for s in candidate_skills or []}
    matched = []
    missing = []
    for skill in required:
        if normalize_skill(skill) in cand_norm:
            matched.append(skill)
        else:
            missing.append(skill)
    score = round((len(matched) / len(required)) * 100, 1)
    return {"score": score, "matched": matched, "missing": missing}
