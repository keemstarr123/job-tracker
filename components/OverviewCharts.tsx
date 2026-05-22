'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import type { Application, ApplicationStatus } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  applied: '#3b82f6', viewed: '#8b5cf6', phone_screen: '#f59e0b',
  technical_interview: '#f97316', final_round: '#10b981',
  offer: '#059669', rejected: '#ef4444', ghosted: '#9ca3af', withdrawn: '#d1d5db',
}

const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied', viewed: 'Viewed', phone_screen: 'Phone Screen',
  technical_interview: 'Technical', final_round: 'Final Round',
  offer: 'Offer', rejected: 'Rejected', ghosted: 'Ghosted', withdrawn: 'Withdrawn',
}

interface Props { apps: Application[] }

export default function OverviewCharts({ apps }: Props) {
  // Build cumulative line data
  const byDate: Record<string, number> = {}
  apps.forEach(a => { byDate[a.application_date] = (byDate[a.application_date] || 0) + 1 })
  const sortedDates = Object.keys(byDate).sort()
  let cum = 0
  const lineData = sortedDates.map(date => {
    cum += byDate[date]
    const [, m, d] = date.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return { date: `${parseInt(d)} ${months[parseInt(m)-1]}`, total: cum, daily: byDate[date] }
  })

  // Status breakdown pie
  const statusCounts: Record<string, number> = {}
  apps.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1 })
  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || '#9ca3af',
  }))

  if (apps.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line chart — takes 2/3 */}
      <div className="page-card p-6 lg:col-span-2">
        <h2 className="font-semibold text-gray-900 mb-4">Applications Over Time</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              cursor={{ stroke: '#e5e7eb' }}
            />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} name="Total" />
            <Line type="monotone" dataKey="daily" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Per day" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart — takes 1/3 */}
      <div className="page-card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Status Breakdown</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
