export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`stats-card ${color}`}>
      <div className="stats-icon">
        <i className={icon}></i>
      </div>
      <div className="stats-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  )
}
