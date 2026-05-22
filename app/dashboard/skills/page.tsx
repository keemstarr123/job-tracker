'use client'
import { useEffect, useState } from 'react'
import { fetchSkills, addSkill, deleteSkill, updateSkill } from '@/lib/supabase'
import { ProficiencyBadge } from '@/components/Badges'
import type { Skill, SkillCategory, SkillProficiency } from '@/lib/types'

const CATEGORIES: { value: SkillCategory; label: string; icon: string }[] = [
  { value: 'programming',      label: 'Programming Languages', icon: '💻' },
  { value: 'ai_ml',            label: 'AI and Machine Learning', icon: '🤖' },
  { value: 'web_cloud',        label: 'Web and Cloud', icon: '☁️' },
  { value: 'data_science',     label: 'Data Science and Analytics', icon: '📊' },
  { value: 'tools_platforms',  label: 'Tools and Platforms', icon: '🔧' },
  { value: 'digital_marketing',label: 'Digital Marketing', icon: '📣' },
  { value: 'soft_skills',      label: 'Soft Skills', icon: '🤝' },
]

const PROFICIENCY_ORDER: SkillProficiency[] = ['learning', 'familiar', 'proficient', 'expert']

const PROFICIENCY_COLORS: Record<SkillProficiency, string> = {
  learning:   'bg-gray-100',
  familiar:   'bg-blue-50 border-blue-200',
  proficient: 'bg-indigo-50 border-indigo-200',
  expert:     'bg-purple-50 border-purple-200',
}

// Pre-seeded skills from Hao Hong's profile
const SEED_SKILLS: Omit<Skill, 'id' | 'created_at'>[] = [
  // Programming
  { name: 'Python',       category: 'programming', proficiency: 'expert',     notes: 'Primary language for AI and data projects' },
  { name: 'JavaScript',   category: 'programming', proficiency: 'proficient', notes: 'Frontend and Node.js' },
  { name: 'TypeScript',   category: 'programming', proficiency: 'familiar',   notes: 'Used in Next.js projects' },
  { name: 'SQL',          category: 'programming', proficiency: 'proficient', notes: 'PostgreSQL, Supabase' },
  { name: 'Java',         category: 'programming', proficiency: 'familiar',   notes: 'Academic background' },
  { name: 'C++',          category: 'programming', proficiency: 'familiar',   notes: 'Academic background' },
  { name: 'Dart',         category: 'programming', proficiency: 'familiar',   notes: 'Flutter development' },
  // AI and ML
  { name: 'PyTorch',              category: 'ai_ml', proficiency: 'proficient', notes: 'CNN, LSTM models' },
  { name: 'Scikit-learn',         category: 'ai_ml', proficiency: 'proficient', notes: 'XGBoost, K-means, classification' },
  { name: 'LangChain',            category: 'ai_ml', proficiency: 'proficient', notes: 'LLM pipelines and RAG systems' },
  { name: 'Gemini API',           category: 'ai_ml', proficiency: 'expert',     notes: 'File search, RAG, agent tooling', certified: true },
  { name: 'Claude API',           category: 'ai_ml', proficiency: 'expert',     notes: 'Agent Development Kit, MCP' },
  { name: 'OpenCV',               category: 'ai_ml', proficiency: 'proficient', notes: 'Computer vision, image processing' },
  { name: 'Prompt Engineering',   category: 'ai_ml', proficiency: 'expert',     notes: 'Systematic prompting for production AI' },
  { name: 'RAG',                  category: 'ai_ml', proficiency: 'expert',     notes: 'Retrieval-augmented generation systems' },
  { name: 'Agent Development Kit',category: 'ai_ml', proficiency: 'proficient', notes: 'Multi-agent orchestration' },
  { name: 'Model Context Protocol', category: 'ai_ml', proficiency: 'familiar', notes: 'MCP server and client integration' },
  // Web and Cloud
  { name: 'Next.js',   category: 'web_cloud', proficiency: 'proficient', notes: 'App Router, SSR, ISR' },
  { name: 'React',     category: 'web_cloud', proficiency: 'proficient', notes: 'Hooks, context, component design' },
  { name: 'Node.js',   category: 'web_cloud', proficiency: 'familiar',   notes: 'REST APIs, serverless functions' },
  { name: 'FastAPI',   category: 'web_cloud', proficiency: 'proficient', notes: 'Python REST API framework' },
  { name: 'AWS',       category: 'web_cloud', proficiency: 'familiar',   notes: 'ECS, S3, RDS', certified: true },
  { name: 'Azure',     category: 'web_cloud', proficiency: 'familiar',   notes: 'Azure Fundamentals certified', certified: true },
  { name: 'Vercel',    category: 'web_cloud', proficiency: 'proficient', notes: 'Deploy and edge functions' },
  { name: 'Flutter',   category: 'web_cloud', proficiency: 'familiar',   notes: 'Cross-platform mobile apps' },
  { name: 'Three.js',  category: 'web_cloud', proficiency: 'familiar',   notes: '3D visualisation for proposals' },
  // Data Science
  { name: 'Pandas',       category: 'data_science', proficiency: 'expert',     notes: 'Data wrangling, preprocessing' },
  { name: 'NumPy',        category: 'data_science', proficiency: 'expert',     notes: 'Numerical computing' },
  { name: 'Power BI',     category: 'data_science', proficiency: 'proficient', notes: 'Dashboard and analytics reporting' },
  { name: 'Tableau',      category: 'data_science', proficiency: 'proficient', notes: 'NYC Park visualisation project' },
  { name: 'Databricks',   category: 'data_science', proficiency: 'familiar',   notes: 'Spark and data lakehouse' },
  { name: 'NLP',          category: 'data_science', proficiency: 'proficient', notes: 'Text analytics, embeddings' },
  // Tools
  { name: 'Supabase',     category: 'tools_platforms', proficiency: 'proficient', notes: 'PostgreSQL, auth, realtime' },
  { name: 'Firebase',     category: 'tools_platforms', proficiency: 'proficient', notes: 'Auth, Firestore, hosting' },
  { name: 'Git',          category: 'tools_platforms', proficiency: 'expert',     notes: 'Daily use across all projects' },
  { name: 'Figma',        category: 'tools_platforms', proficiency: 'familiar',   notes: 'Used in Scorpify UI validation' },
  { name: 'Docker',       category: 'tools_platforms', proficiency: 'familiar',   notes: 'Containerisation and ECS deploy' },
  // Digital Marketing
  { name: 'Meta Ads',              category: 'digital_marketing', proficiency: 'familiar',   notes: 'Campaign management and targeting' },
  { name: 'Canva',                 category: 'digital_marketing', proficiency: 'proficient', notes: 'Decks, social graphics, presentations' },
  { name: 'RedNote Strategy',      category: 'digital_marketing', proficiency: 'familiar',   notes: 'Content strategy for RedNote platform' },
  // Soft Skills
  { name: 'Technical Communication', category: 'soft_skills', proficiency: 'expert',     notes: 'Presenting complex AI to non-technical stakeholders' },
  { name: 'Team Leadership',         category: 'soft_skills', proficiency: 'proficient', notes: 'EY Campus Champ Team Lead, hackathon captain' },
  { name: 'Public Speaking',         category: 'soft_skills', proficiency: 'proficient', notes: 'Emcee and presenter at university events' },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  // Add form state
  const [form, setForm] = useState({ name: '', category: 'programming' as SkillCategory, proficiency: 'familiar' as SkillProficiency, notes: '', certified: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSkills().then(data => { setSkills(data as Skill[]); setLoading(false) })
  }, [])

  async function handleSeedSkills() {
    setSeeding(true)
    for (const s of SEED_SKILLS) {
      try { await addSkill(s) } catch { /* skip duplicates */ }
    }
    const fresh = await fetchSkills()
    setSkills(fresh as Skill[])
    setSeeding(false)
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const newSkill = await addSkill(form)
    setSkills(prev => [...prev, newSkill as Skill])
    setForm({ name: '', category: 'programming', proficiency: 'familiar', notes: '', certified: false })
    setShowAdd(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this skill?')) return
    await deleteSkill(id)
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  async function handleProficiencyChange(id: string, proficiency: SkillProficiency) {
    await updateSkill(id, { proficiency })
    setSkills(prev => prev.map(s => s.id === id ? { ...s, proficiency } : s))
    setEditId(null)
  }

  const filtered = skills.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(s => s.category === cat.value)
    if (items.length || activeCategory === 'all' || activeCategory === cat.value) {
      acc[cat.value] = { meta: cat, items }
    }
    return acc
  }, {} as Record<string, { meta: typeof CATEGORIES[0]; items: Skill[] }>)

  const expertCount = skills.filter(s => s.proficiency === 'expert').length
  const certCount = skills.filter(s => s.certified).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
          <p className="text-sm text-gray-500 mt-1">
            {skills.length} skills tracked &nbsp;·&nbsp; {expertCount} expert-level &nbsp;·&nbsp; {certCount} certified
          </p>
        </div>
        <div className="flex gap-2">
          {skills.length === 0 && !loading && (
            <button onClick={handleSeedSkills} disabled={seeding} className="btn-secondary text-xs">
              {seeding ? 'Seeding...' : '✨ Load from Profile'}
            </button>
          )}
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-xs">
            {showAdd ? 'Cancel' : '+ Add Skill'}
          </button>
        </div>
      </div>

      {/* Add skill form */}
      {showAdd && (
        <div className="page-card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Add a New Skill</h2>
          <form onSubmit={handleAddSkill} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="label">Skill Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. LangGraph" className="input" required />
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as SkillCategory }))} className="input">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Proficiency</label>
              <select value={form.proficiency} onChange={e => setForm(f => ({ ...f, proficiency: e.target.value as SkillProficiency }))} className="input">
                {PROFICIENCY_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="label">Notes (optional)</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Where you use this skill" className="input" />
            </div>
            <div className="col-span-2 md:col-span-4 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={form.certified} onChange={e => setForm(f => ({ ...f, certified: e.target.checked }))} className="rounded" />
                I have a certification for this skill
              </label>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Add Skill'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and category filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills..." className="input max-w-xs" />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${activeCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${activeCategory === cat.value ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="page-card p-12 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-sm text-gray-500 mb-4">No skills added yet. Click <strong>Load from Profile</strong> to seed all skills from your resume in one shot.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(grouped).map(({ meta, items }) => items.length === 0 ? null : (
            <div key={meta.value} className="page-card overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/70">
                <h2 className="text-sm font-semibold text-gray-700">{meta.icon} {meta.label} <span className="text-gray-400 font-normal ml-1">({items.length})</span></h2>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {items.sort((a, b) => PROFICIENCY_ORDER.indexOf(b.proficiency) - PROFICIENCY_ORDER.indexOf(a.proficiency)).map(skill => (
                  <div key={skill.id} className={`relative group rounded-xl border p-3 transition-all ${PROFICIENCY_COLORS[skill.proficiency]} hover:shadow-sm`}>
                    {/* Skill chip */}
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="text-sm font-semibold text-gray-900 leading-tight">{skill.name}</span>
                      {skill.certified && <span title="Certified" className="text-xs">🏆</span>}
                    </div>
                    {/* Proficiency — clickable to change */}
                    {editId === skill.id ? (
                      <select
                        autoFocus
                        defaultValue={skill.proficiency}
                        onBlur={() => setEditId(null)}
                        onChange={e => handleProficiencyChange(skill.id, e.target.value as SkillProficiency)}
                        className="text-xs border border-gray-200 rounded-lg px-1.5 py-0.5 w-full outline-none bg-white"
                      >
                        {PROFICIENCY_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    ) : (
                      <button onClick={() => setEditId(skill.id)} className="text-left">
                        <ProficiencyBadge proficiency={skill.proficiency} />
                      </button>
                    )}
                    {skill.notes && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{skill.notes}</p>}
                    {/* Delete button — shows on hover */}
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-xs"
                      title="Remove skill"
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
