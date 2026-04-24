'use client'

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Who I Am</span>
          <h2 className="section-title">About Me</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <p>
              I&apos;m a dedicated web developer committed to creating intuitive, scalable digital solutions. 
              With expertise in the MERN stack, I design seamless user experiences, write efficient code, 
              and thrive in collaborative, fast-paced environments. Driven by problem-solving and continuous 
              learning, I stay ahead of industry trends to build impactful applications.
            </p>
            <p>
              Currently focused on building accessible, human-centered products that make a difference. 
              I believe in writing clean, maintainable code and creating solutions that not only work 
              well but also provide exceptional user experiences.
            </p>
            
            <div className="about-cards">
              <div className="about-card">
                <i className="fas fa-code"></i>
                <h3>Clean Code</h3>
                <p>Writing maintainable, scalable code following best practices</p>
              </div>
              <div className="about-card">
                <i className="fas fa-laptop-code"></i>
                <h3>Full Stack</h3>
                <p>From database to UI, building complete web applications</p>
              </div>
              <div className="about-card">
                <i className="fas fa-rocket"></i>
                <h3>Fast Learner</h3>
                <p>Quickly adapting to new technologies and frameworks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
