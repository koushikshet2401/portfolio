'use client'

export default function Skills() {
  const skills = {
    frontend: [
      { name: 'HTML5', icon: 'fab fa-html5' },
      { name: 'CSS3', icon: 'fab fa-css3-alt' },
      { name: 'JavaScript', icon: 'fab fa-js' },
      { name: 'React', icon: 'fab fa-react' },
      { name: 'Tailwind CSS', icon: 'fas fa-wind' },
      { name: 'Bootstrap', icon: 'fab fa-bootstrap' },
    ],
    backend: [
      { name: 'Node.js', icon: 'fab fa-node' },
      { name: 'Express.js', icon: 'fas fa-server' },
      { name: 'MongoDB', icon: 'fas fa-database' },
      { name: 'SQL', icon: 'fas fa-database' },
      { name: 'REST APIs', icon: 'fas fa-code' },
    ],
    tools: [
      { name: 'Python', icon: 'fab fa-python' },
      { name: 'Java', icon: 'fab fa-java' },
      { name: 'Git/GitHub', icon: 'fab fa-git-alt' },
      { name: 'VS Code', icon: 'fas fa-code' },
      { name: 'Postman', icon: 'fas fa-paper-plane' },
    ]
  }

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">What I Do</span>
          <h2 className="section-title">Skills & Technologies</h2>
        </div>
        
        <div className="skills-grid">
          <div className="skill-category">
            <h3><i className="fas fa-palette"></i> Frontend</h3>
            <div className="skill-badges">
              {skills.frontend.map((skill, index) => (
                <span key={index} className="skill-badge">
                  <i className={skill.icon}></i> {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className="skill-category">
            <h3><i className="fas fa-server"></i> Backend</h3>
            <div className="skill-badges">
              {skills.backend.map((skill, index) => (
                <span key={index} className="skill-badge">
                  <i className={skill.icon}></i> {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className="skill-category">
            <h3><i className="fas fa-tools"></i> Tools & Languages</h3>
            <div className="skill-badges">
              {skills.tools.map((skill, index) => (
                <span key={index} className="skill-badge">
                  <i className={skill.icon}></i> {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
