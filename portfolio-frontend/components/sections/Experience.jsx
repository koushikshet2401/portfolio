'use client'

export default function Experience() {
  const experiences = [
    {
      role: 'Full Stack Web Developer Intern',
      company: 'Next Gen Invent',
      duration: 'Nov 2024 - Jan 2025',
      description: 'Developed and deployed responsive web applications using the MERN stack, focusing on scalability and performance optimization.',
      achievements: [
        'Built full-stack web applications with React and Node.js',
        'Implemented RESTful APIs and database management',
        'Collaborated with cross-functional teams in Agile environment'
      ]
    },
    {
      role: 'Web Development Intern',
      company: 'CodSoft',
      duration: 'Aug 2024 - Sep 2024',
      description: 'Created dynamic, user-friendly web applications and strengthened front-end development skills through hands-on projects.',
      achievements: [
        'Developed responsive UI components using React',
        'Implemented modern CSS frameworks for styling',
        'Delivered projects within tight deadlines'
      ]
    }
  ]

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Career Journey</span>
          <h2 className="section-title">Work Experience</h2>
        </div>
        
        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{exp.role}</h3>
                  <span className="company">{exp.company}</span>
                  <span className="duration">{exp.duration}</span>
                </div>
                <p className="description">{exp.description}</p>
                <ul className="achievements">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
