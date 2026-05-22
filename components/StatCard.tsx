interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  color?: string
  icon?: string
}

export default function StatCard({ label, value, sub, color = 'text-blue-600', icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className={`text-4xl font-extrabold leading-none mb-1 ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}
