'use client'
import { useEffect, useState } from 'react'
import { fetchCompanies } from '@/lib/supabase'
import type { Company } from '@/lib/types'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCompanies().then(data => { setCompanies(data as Company[]); setLoading(false) })
  }, [])

  const filtered = companies.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Research</h1>
        <p className="text-sm text-gray-500 mt-1">
          Briefings on every company you have applied to. Read these before a call — 30 seconds is all you need.
        </p>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search company or industry..."
        className="input max-w-sm"
      />

      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading company research...</div>
      ) : filtered.length === 0 ? (
        <div className="page-card p-12 text-center text-gray-400 text-sm">
          No company research yet. The skill will populate this when you apply.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(company => (
            <div key={company.id} className="page-card overflow-hidden">
              {/* Header row — always visible */}
              <button
                onClick={() => setExpanded(expanded === company.id ? null : company.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{company.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {[company.industry, company.company_size, company.headquarters].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {company.glassdoor_rating && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-lg font-semibold">
                      ⭐ {company.glassdoor_rating}
                    </span>
                  )}
                  <span className="text-gray-400 text-sm">{expanded === company.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded content */}
              {expanded === company.id && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {company.about && (
                      <Section title="About" content={company.about} />
                    )}
                    {company.culture_notes && (
                      <Section title="Culture" content={company.culture_notes} />
                    )}
                    {company.recent_news && (
                      <Section title="Recent News" content={company.recent_news} />
                    )}
                    {company.why_interesting && (
                      <Section title="Why Apply Here" content={company.why_interesting} />
                    )}
                  </div>
                  {company.linkedin_url && (
                    <a
                      href={company.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs text-blue-600 hover:underline"
                    >
                      View on LinkedIn →
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</div>
      <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
    </div>
  )
}
