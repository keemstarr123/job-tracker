import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Applications ──────────────────────────────────────────────
export async function fetchApplications() {
  const { data, error } = await supabase
    .from('application_summary')
    .select('*')
    .order('application_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchApplicationById(id: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, companies(name, industry, about, culture_notes, recent_news, why_interesting)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateApplicationStatus(id: string, status: string) {
  const { error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// ── Companies ────────────────────────────────────────────────
export async function fetchCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

// ── Interview Prep ───────────────────────────────────────────
export async function fetchInterviewPrep(applicationId?: string) {
  let query = supabase
    .from('interview_prep')
    .select('*, companies(name)')
    .order('created_at', { ascending: false })

  if (applicationId) {
    query = query.eq('application_id', applicationId)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((p: any) => ({
    ...p,
    company_name: p.companies?.name,
  }))
}

// ── Daily Batches ─────────────────────────────────────────────
export async function fetchDailyBatches(limit = 30) {
  const { data, error } = await supabase
    .from('daily_batches')
    .select('*')
    .order('batch_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

// ── Stats ─────────────────────────────────────────────────────
export async function fetchStats() {
  const apps = await fetchApplications()
  const prep = await fetchInterviewPrep()

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const weekStr = oneWeekAgo.toISOString().split('T')[0]

  return {
    total: apps.length,
    active: apps.filter((a: any) => !['rejected', 'withdrawn', 'ghosted'].includes(a.status)).length,
    interviews: apps.filter((a: any) => ['phone_screen', 'technical_interview', 'final_round'].includes(a.status)).length,
    offers: apps.filter((a: any) => a.status === 'offer').length,
    prepQuestions: prep.length,
    thisWeek: apps.filter((a: any) => a.application_date >= weekStr).length,
  }
}

// ── Skills ────────────────────────────────────────────────────
export async function fetchSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category')
  if (error) throw error
  return data ?? []
}

export async function addSkill(skill: {
  name: string
  category: string
  proficiency: string
  notes?: string
  used_in_projects?: string[]
  certified?: boolean
}) {
  const { data, error } = await supabase
    .from('skills')
    .insert([{ ...skill, created_at: new Date().toISOString() }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
}

export async function updateSkill(id: string, updates: Partial<{ proficiency: string; notes: string; certified: boolean }>) {
  const { error } = await supabase.from('skills').update(updates).eq('id', id)
  if (error) throw error
}
