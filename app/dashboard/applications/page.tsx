'use client'
import { useEffect, useState } from 'react'
import { fetchApplications, updateApplicationStatus } from '@/lib/supabase'
import { StatusBadge, ArrangementBadge } from '@/components/Badges'
import type { Application, ApplicationStatus } from '@/lib/types'

const STATUSES: ApplicationStatus[] = [
  'applied','viewed','phone_screen','technical_interview','final_round','offer','rejected','ghosted','withdrawn'
]

function formatDate(d: string) {
  const p = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(p[2])} ${months[parseInt(p[1])-1]} ${p[0]}`
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications().then(data => { setApps(data as Application[]); setLoading(false) })
  }, [])

  const filtered = apps.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter
    const matchSearch = !search ||
      (a.company ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (a.role ?? a.role_title ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdating(id)
    await updateApplicationStatus(id, status)
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    setUpdating(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">{apps.length} total applications tracked</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search company or role..."
          className="input max-w-xs"
        />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input w-auto">
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <span className="text-sm text-gray-400">{filtered.length} results</span>
      </div>

      <div className="page-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Company', 'Role', 'Date Applied', 'Location', 'Arrangement', 'Status', 'Update Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No applications found.</td></tr>
              ) : filtered.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{app.company}</td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{app.role ?? app.role_title}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatDate(app.application_date)}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{app.location}</td>
                  <td className="px-5 py-3.5">{app.work_arrangement && <ArrangementBadge arrangement={app.work_arrangement} />}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                  <td className="px-5 py-3.5">
                    <select
                      value={app.status}
                      disabled={updating === app.id}
                      onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
