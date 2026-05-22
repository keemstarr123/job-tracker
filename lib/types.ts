export type ApplicationStatus =
  | 'applied'
  | 'viewed'
  | 'phone_screen'
  | 'technical_interview'
  | 'final_round'
  | 'offer'
  | 'rejected'
  | 'ghosted'
  | 'withdrawn'

export type WorkArrangement = 'remote' | 'hybrid' | 'onsite'

export type QuestionCategory =
  | 'technical'
  | 'behavioural'
  | 'company_knowledge'
  | 'role_specific'
  | 'culture_fit'
  | 'situational'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Company {
  id: string
  name: string
  website?: string
  industry?: string
  headquarters?: string
  company_size?: string
  founded_year?: number
  about?: string
  culture_notes?: string
  recent_news?: string
  why_interesting?: string
  linkedin_url?: string
  glassdoor_rating?: number
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  company_id?: string
  company?: string          // from the view join
  role?: string             // alias for role_title in view
  role_title?: string
  job_url?: string
  job_description?: string
  application_date: string
  applied_via?: string
  status: ApplicationStatus
  cover_letter_used?: string
  cv_highlights?: string
  notes?: string
  salary_range?: string
  location?: string
  work_arrangement?: WorkArrangement
  glassdoor_rating?: number
  prep_questions_ready?: number
  created_at: string
  updated_at: string
}

export interface InterviewPrep {
  id: string
  application_id?: string
  company_id?: string
  company_name?: string     // joined
  question: string
  question_category: QuestionCategory
  suggested_answer?: string
  difficulty?: Difficulty
  created_at: string
}

export interface DailyBatch {
  id: string
  batch_date: string
  jobs_reviewed: number
  jobs_applied: number
  search_keywords?: string[]
  search_location: string
  notes?: string
  created_at: string
}

export interface DashboardStats {
  total: number
  active: number
  interviews: number
  offers: number
  prepQuestions: number
  thisWeek: number
}

export type SkillCategory =
  | 'programming'
  | 'ai_ml'
  | 'web_cloud'
  | 'data_science'
  | 'tools_platforms'
  | 'digital_marketing'
  | 'soft_skills'

export type SkillProficiency = 'learning' | 'familiar' | 'proficient' | 'expert'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  proficiency: SkillProficiency
  notes?: string
  used_in_projects?: string[]
  certified?: boolean
  created_at: string
}
