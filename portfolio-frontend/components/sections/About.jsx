'use client'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-ribbon">
          <span className="section-tag">01 // ABOUT</span>
          <span className="section-line"></span>
        </div>
        <h2 className="section-title">A little about how I build.</h2>

        <div className="about-grid">
          {/* Left Column */}
          <div>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--on-surface)',
                lineHeight: 1.8,
                marginBottom: '1rem',
              }}
            >
              I am a full-stack engineer who thrives in the engine room of modern software applications. From architecting distributed background queues to tuning vector retrieval pipelines and engineering crisp UI components, I focus on building reliable systems that survive production.
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--secondary-text)',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
              }}
            >
              I gravitate toward projects with real technical depth: multi-tenant SaaS with row-level data isolation, live socket mesh networks, resilient webhook dispatch layers, and RAG-powered AI chatbots that process institutional knowledge at scale.
            </p>

            <div className="principles">
              <div className="principle-card reveal visible">
                <div className="principle-num">01 / Build with purpose</div>
                <div className="principle-title">
                  Pragmatic engineering over resume-driven complexity
                </div>
                <div className="principle-desc">
                  Every technology choice must defend its presence in the repository against operational overhead and latency budget constraints.
                </div>
              </div>
              <div className="principle-card reveal visible">
                <div className="principle-num">02 / Engineer for reliability</div>
                <div className="principle-title">
                  Idempotent APIs, exponential backoffs, and dead letters
                </div>
                <div className="principle-desc">
                  Systems will fail. I design distributed tasks so they can retry gracefully, preserve causal order, and never duplicate transactions.
                </div>
              </div>
              <div className="principle-card reveal visible">
                <div className="principle-num">03 / Keep learning through shipping</div>
                <div className="principle-title">
                  Mastery comes from deploying real code to real users
                </div>
                <div className="principle-desc">
                  Theoretical architecture means nothing until it experiences genuine load, atypical user edge cases, and unexpected network partitions.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — GitHub Profile Card */}
          <div>
            <div className="profile-card reveal visible">
              <div className="profile-header">
                <div className="profile-avatar">KS</div>
                <div className="profile-meta">
                  <h3>Koushik D Shet</h3>
                  <a
                    href="https://github.com/koushikshet2401"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @koushikshet2401
                  </a>
                  <p>Full-Stack Engineer &amp; Systems Builder</p>
                </div>
              </div>

              <div className="profile-quick-stats">
                <div className="pqs-item">
                  <span className="pqs-num">18+</span>
                  <span className="pqs-label">Public Repos</span>
                </div>
                <div className="pqs-item">
                  <span className="pqs-num">500+</span>
                  <span className="pqs-label">Commits &apos;24-25</span>
                </div>
                <div className="pqs-item">
                  <span className="pqs-num" style={{ color: 'var(--crimson)' }}>
                    100%
                  </span>
                  <span className="pqs-label">OSS Clean</span>
                </div>
              </div>

              <div className="profile-code">
                <span className="kw">const</span> <span className="var"> developer</span> = &#123;<br />
                &nbsp;&nbsp;name: <span className="str">&apos;Koushik D Shet&apos;</span>,<br />
                &nbsp;&nbsp;domain: [<span className="str">&apos;RAG / LLMs&apos;</span>, <span className="str">&apos;Distributed Systems&apos;</span>],<br />
                &nbsp;&nbsp;currentFocus: <span className="str">&apos;AI-powered SaaS&apos;</span>,<br />
                &nbsp;&nbsp;status: <span className="val">&apos;Open to Opportunities&apos;</span><br />
                &#125;;
              </div>

              <a
                className="profile-btn"
                href="https://github.com/koushikshet2401"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  open_in_new
                </span>
                <span>Inspect Profile on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
