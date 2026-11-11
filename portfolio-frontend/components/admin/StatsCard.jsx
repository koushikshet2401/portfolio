import Link from 'next/link'

export default function StatsCard({ title, value, subtitle, icon, color, badge, href }) {
  const content = (
    <>
      <div className="stats-icon">
        <i className={icon}></i>
      </div>
      <div className="stats-info">
        <div className="stats-top-row">
          <h3>{value ?? 0}</h3>
          {badge && <span className="stats-badge">{badge}</span>}
          {href && <i className="fas fa-arrow-up-right-from-square stats-card-arrow" title="View details"></i>}
        </div>
        <p className="stats-title">{title}</p>
        {subtitle && <p className="stats-subtitle">{subtitle}</p>}
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`stats-card is-clickable ${color || 'blue'}`}>
        {content}
      </Link>
    )
  }

  return (
    <div className={`stats-card ${color || 'blue'}`}>
      {content}
    </div>
  )
}
