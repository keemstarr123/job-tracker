import type { ApplicationStatus, WorkArrangement, Difficulty, QuestionCategory, SkillProficiency } from '@/lib/types'

const STATUS_MAP: Record<ApplicationStatus, { label: string; classes: string }> = {
  applied:              { label: 'Applied',       classes: 'bg-blue-100 text-blue-700' },
  viewed:               { label: 'Viewed',        classes: 'bg-indigo-100 text-indigo-700' },
  phone_screen:         { label: 'Phone Screen',  classes: 'bg-amber-100 text-amber-700' },
  technical_interview:  { label: 'Technical',     classes: 'bg-orange-100 text-orange-700' },
  final_round:          { label: 'Final Round',   classes: 'bg-emerald-100 text-emerald-700' },
  offer:                { label: '🎉 Offer',       classes: 'bg-green-100 text-green-800' },
  rejected:             { label: 'Rejected',      classes: 'bg-red-100 text-red-700' },
  ghosted:              { label: 'Ghosted',       classes: 'bg-gray-100 text-gray-500' },
  withdrawn:            { label: 'Withdrawn',     classes: 'bg-gray-100 text-gray-400' },
}

const ARRANGEMENT_MAP: Record<WorkArrangement, { label: string; classes: string }> = {
  remote:  { label: 'Remote',  classes: 'bg-emerald-100 text-emerald-700' },
  hybrid:  { label: 'Hybrid',  classes: 'bg-blue-100 text-blue-700' },
  onsite:  { label: 'Onsite',  classes: 'bg-pink-100 text-pink-700' },
}

const DIFFICULTY_MAP: Record<Difficulty, { label: string; classes: string }> = {
  easy:   { label: 'Easy',   classes: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium', classes: 'bg-amber-100 text-amber-700' },
  hard:   { label: 'Hard',   classes: 'bg-red-100 text-red-700' },
}

const PROFICIENCY_MAP: Record<SkillProficiency, { label: string; classes: string }> = {
  learning:   { label: 'Learning',   classes: 'bg-gray-100 text-gray-500' },
  familiar:   { label: 'Familiar',   classes: 'bg-blue-100 text-blue-600' },
  proficient: { label: 'Proficient', classes: 'bg-indigo-100 text-indigo-700' },
  expert:     { label: 'Expert',     classes: 'bg-purple-100 text-purple-700' },
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, classes } = STATUS_MAP[status] ?? { label: status, classes: 'bg-gray-100 text-gray-500' }
  return <span className={`badge ${classes}`}>{label}</span>
}

export function ArrangementBadge({ arrangement }: { arrangement: WorkArrangement }) {
  const { label, classes } = ARRANGEMENT_MAP[arrangement] ?? { label: arrangement, classes: 'bg-gray-100 text-gray-500' }
  return <span className={`badge ${classes}`}>{label}</span>
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, classes } = DIFFICULTY_MAP[difficulty] ?? { label: difficulty, classes: 'bg-gray-100 text-gray-500' }
  return <span className={`badge ${classes}`}>{label}</span>
}

export function ProficiencyBadge({ proficiency }: { proficiency: SkillProficiency }) {
  const { label, classes } = PROFICIENCY_MAP[proficiency] ?? { label: proficiency, classes: 'bg-gray-100 text-gray-500' }
  return <span className={`badge ${classes}`}>{label}</span>
}

export function CategoryBadge({ category }: { category: string }) {
  return <span className="badge bg-slate-100 text-slate-600">{category.replace('_', ' ')}</span>
}
