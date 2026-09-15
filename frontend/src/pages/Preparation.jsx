const courses = [
  {
    title: "Web Development",
    description: "Build a strong foundation in modern web development and start creating real projects.",
    video: "https://www.youtube.com/embed/tVzUXW6siu0?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w",
    accent: "copper",
  },
  {
    title: "DevOps",
    description: "Learn the tools and practices behind reliable delivery, automation, and cloud operations.",
    video: "https://www.youtube.com/embed/Ou9j73aWgyE?list=PLdpzxOOAlwvIc1TjTwopNSjRJkzES2ZXk",
    accent: "forest",
  },
  {
    title: "Machine Learning",
    description: "Work through the core concepts that turn data, features, and models into useful predictions.",
    video: "https://www.youtube.com/embed/fmxmNwAB0_Y?list=PLxCzCOWd7aiEXg5BV10k9THtjnS48yI-T",
    accent: "gold",
  },
  {
    title: "Python Full Course",
    description: "Strengthen your Python fundamentals for scripting, automation, data, and backend work.",
    video: "https://www.youtube.com/embed/QXeEoD0pB3E?list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3",
    accent: "ink",
  },
  {
    title: "Django",
    description: "Learn how to create structured, database-backed web applications with Django.",
    video: "https://www.youtube.com/embed/rHux0gMZ3Eg?start=160",
    accent: "forest",
  },
  {
    title: "DBMS",
    description: "Understand databases, relational thinking, queries, and the foundations of data systems.",
    video: "https://www.youtube.com/embed/hlGoQC332VM",
    accent: "copper",
  },
];

export default function Preparation() {
  return (
    <div className="preparation-page">
      <header className="preparation-heading">
        <div>
          <div className="kicker">Candidate learning studio</div>
          <h1>Prepare for the role you want next.</h1>
          <p className="lede">
            Focused courses for building practical skills before you apply, interview, and grow into your next opportunity.
          </p>
        </div>
        <div className="preparation-count">
          <strong>{courses.length}</strong>
          <span>learning paths</span>
        </div>
      </header>

      <section className="course-grid" aria-label="Preparation courses">
        {courses.map((course, index) => (
          <article className={`course-card course-card-${course.accent}`} key={course.title}>
            <div className="course-card-top">
              <span className="course-number">0{index + 1}</span>
              <span className="course-label">Learning path</span>
            </div>
            <div className="course-copy">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
            </div>
            <div className="video-frame">
              <iframe
                src={course.video}
                title={`${course.title} preparation course`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}