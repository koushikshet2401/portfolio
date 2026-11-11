'use client'

export default function Skills() {
  const skillCategories = [
    {
      title: 'Backend Development',
      skills: ['Node.js', 'Express.js', 'Socket.IO', 'REST APIs'],
    },
    {
      title: 'Architecture & Messaging',
      skills: ['Redis', 'BullMQ', 'Apache Kafka', 'Webhooks'],
    },
    {
      title: 'AI / ML',
      skills: ['RAG Pipelines', 'OpenAI API', 'pgvector', 'Prompt Engineering'],
    },
    {
      title: 'Frontend Development',
      skills: ['React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript (ES6+)'],
    },
    {
      title: 'Database Management',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL'],
    },
    {
      title: 'Languages',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Java'],
    },
    {
      title: 'DevOps & Tools',
      skills: ['Docker', 'Git', 'GitHub', 'Postman', 'Cloudinary'],
    },
    {
      title: 'Cloud',
      skills: ['Microsoft Azure', 'Vercel', 'Render'],
    },
  ]

  return (
    <section id="stack" className="section" style={{ background: 'transparent' }}>
      <div className="container">
        <div className="section-ribbon">
          <span className="section-tag">04 // STACK</span>
          <span className="section-line"></span>
        </div>
        <h2 className="section-title">Technical Stack</h2>
        <p className="section-subtitle">The tools and technologies I build with.</p>

        <div className="skills-grid">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="skill-cat reveal visible">
              <div className="skill-cat-title">{cat.title}</div>
              <div className="skill-tags">
                {cat.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
