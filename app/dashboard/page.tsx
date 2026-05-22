import { fetchStats, fetchApplications, fetchDailyBatches } from '@/lib/supabase'
import StatCard from '@/components/StatCard'
import OverviewCharts from '@/components/OverviewCharts'
import type { Application } from '@/lib/types'
import { StatusBadge, ArrangementBadge } from '@/components/Badges'

function formatDate(d: string) {
  const p = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(p[2])} ${months[parseInt(p[1]) - 1]}`
}

export default async function DashboardPage() {
  const [stats, apps, batches] = await Promise.all([
    fetchStats(),
    fetchApplications(),
    fetchDailyBatches(7),
  ])

  const recent = (apps as Application[]).slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, Hao Hong 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here is where your job hunt stands today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Applied"   value={stats.total}        icon="📤" color="text-blue-600"    sub="since tracking started" />
        <StatCard label="This Week"       value={stats.thisWeek}     icon="📅" color="text-indigo-600"  sub="new applications" />
        <StatCard label="Active"          value={stats.active}       icon="🔄" color="text-violet-600"  sub="in pipeline" />
        <StatCard label="Interviews"      value={stats.interviews}   icon="📞" color="text-amber-600"   sub="scheduled or done" />
        <StatCard label="Offers"          value={stats.offers}       icon="🎉" color="text-emerald-600" sub="received" />
        <StatCard label="Prep Questions"  value={stats.prepQuestions}icon="❓" color="text-rose-600"    sub="ready to review" />
      </div>

      {/* Charts */}
      <OverviewCharts apps={apps as Application[]} />

      {/* Recent applications */}
      <div className="page-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <a href="/dashboard/applications" className="text-xs text-blue-600 hover:underline font-medium">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Company', 'Role', 'Date', 'Arrangement', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No applications yet. Run the morning routine to get started!</td></tr>
              ) : recent.map((app: Application) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-gray-900">{app.company}</td>
                  <td className="px-6 py-3.5 text-gray-600">{app.role ?? app.role_title}</td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatDate(app.application_date)}</td>
                  <td className="px-6 py-3.5">{app.work_arrangement && <ArrangementBadge arrangement={app.work_arrangement} />}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily batch history */}
      {batches.length > 0 && (
        <div className="page-card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Session History</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {batches.map((b: any) => (
              <div key={b.id} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-xs text-gray-400 mb-1">{formatDate(b.batch_date)}</div>
                <div className="text-2xl font-bold text-slate-900">{b.jobs_applied}</div>
                <div className="text-xs text-gray-400">applied</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
