'use client'
import { useEffect, useState } from 'react'
import { fetchInterviewPrep } from '@/lib/supabase'
import { DifficultyBadge, CategoryBadge } from '@/components/Badges'
import type { InterviewPrep, Difficulty, QuestionCategory } from '@/lib/types'

const CATEGORIES: QuestionCategory[] = ['technical','behavioural','company_knowledge','role_specific','culture_fit','situational']

export default function PrepPage() {
  const [prep, setPrep] = useState<InterviewPrep[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<string | null>(null)
  const [filterCompany, setFilterCompany] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterDiff, setFilterDiff] = useState('')

  useEffect(() => {
    fetchInterviewPrep().then(data => { setPrep(data as InterviewPrep[]); setLoading(false) })
  }, [])

  const companies = [...new Set(prep.map(p => p.company_name).filter(Boolean))]

  const filtered = prep.filter(p => {
    if (filterCompany && p.company_name !== filterCompany) return false
    if (filterCat && p.question_category !== filterCat) return false
    if (filterDiff && p.difficulty !== filterDiff) return false
    return true
  })

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(p => p.question_category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {} as Record<string, InterviewPrep[]>)

  const catLabels: Record<string, string> = {
    technical: '🛠 Technical',
    behavioural: '🧠 Behavioural',
    company_knowledge: '🏢 Company Knowledge',
    role_specific: '🎯 Role Specific',
    culture_fit: '🤝 Culture Fit',
    situational: '💡 Situational',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interview Preparation</h1>
        <p className="text-sm text-gray-500 mt-1">
          {prep.length} questions ready across {companies.length} companies. Click any question to reveal a suggested answer.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} className="input w-auto">
          <option value="">All Companies</option>
          {companies.map(c => <option key={c} value={c!}>{c}</option>)}
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input w-auto">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
        </select>
        <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="input w-auto">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {(filterCompany || filterCat || filterDiff) && (
          <button onClick={() => { setFilterCompany(''); setFilterCat(''); setFilterDiff('') }} className="btn-secondary text-xs">
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading questions...</div>
      ) : filtered.length === 0 ? (
        <div className="page-card p-12 text-center text-gray-400 text-sm">
          No prep questions yet. They will appear here after each application is processed.
        </div>
      ) : (
        Object.entries(grouped).map(([cat, questions]) => (
          <div key={cat} className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">
              {catLabels[cat] ?? cat} <span className="text-gray-300 ml-1">({questions.length})</span>
            </h2>
            {questions.map(q => (
              <div key={q.id} className="page-card overflow-hidden">
                <button
                  onClick={() => setOpen(open === q.id ? null : q.id)}
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-gray-900 leading-relaxed">{q.question}</span>
                  <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                    {q.company_name && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">{q.company_name}</span>
                    )}
                    {q.difficulty && <DifficultyBadge difficulty={q.difficulty} />}
                    <span className="text-gray-400 text-xs ml-1">{open === q.id ? '▲' : '▼'}</span>
                  </div>
                </button>
                {open === q.id && q.suggested_answer && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-50">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Suggested Answer</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{q.suggested_answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
