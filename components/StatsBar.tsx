const STATS = [
  { value: '2800+', label: 'Families Helped' },
  { value: '5★',    label: 'Average Rating' },
  { value: '20+',   label: 'Years of Experience' },
  { value: '100+',  label: 'Dedicated Agents' },
]

export default function StatsBar() {
  return (
    <section className="stats-bar" aria-label="Client success metrics">
      <div className="stats-inner">
        {STATS.map(({ value, label }) => (
          <div key={label} className="stat-item">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
