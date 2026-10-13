import { supabase, supabaseReady } from './supabase'

export type DbWorkout = {
  id: number
  title: string
  description: string | null
  difficulty: string | null
  duration_min: number | null
  calories: number | null
  points: number
  video_url: string | null
  thumbnail_url: string | null
  videoless: boolean
  exercises: string[] | null
  trainer_id: number | null
  views: number | null
  rating: number | null
}

export type DbGroup = {
  id: number
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  is_workout_plan: boolean
  order: number
}

export type DbLink = { workout_id: number; group_id: number }

export type DbNotification = {
  id: number
  title: string
  body: string | null
  target: string
  user_id: string | null
  created_at: string
}

export type DbCompletion = {
  id: number
  workout_id: number
  points_awarded: number
  completed_at: string
  duration_min: number | null
  calories: number | null
  title?: string
}

export type DbProfile = {
  id: string
  name: string | null
  email: string | null
  role: string
  status: string
  total_points: number
  subscription_tier: string | null
  notifications_seen_at: string | null
  created_at: string
}

export type Content = { workouts: DbWorkout[]; groups: DbGroup[]; links: DbLink[] }

const need = () => {
  if (!supabaseReady || !supabase) throw new Error('Serviço indisponível — modo offline')
  return supabase
}

export async function fetchContent(): Promise<Content> {
  const sb = need()
  const [w, g, l] = await Promise.all([
    sb.from('workouts').select('id,title,description,difficulty,duration_min,calories,points,video_url,thumbnail_url,videoless,exercises,trainer_id,views,rating').eq('disabled', false).order('id'),
    sb.from('workout_groups').select('id,name,slug,description,thumbnail_url,is_workout_plan,order').order('order'),
    sb.from('workout_group_items').select('workout_id,group_id'),
  ])
  if (w.error) throw w.error
  if (g.error) throw g.error
  if (l.error) throw l.error
  return { workouts: w.data ?? [], groups: g.data ?? [], links: (l.data ?? []) as DbLink[] }
}

export async function fetchProfile(uid: string): Promise<DbProfile | null> {
  const sb = need()
  const { data, error } = await sb.from('profiles').select('id,name,email,role,status,total_points,subscription_tier,notifications_seen_at,created_at').eq('id', uid).maybeSingle()
  if (error) throw error
  return data as DbProfile | null
}

export async function fetchCompletions(uid: string): Promise<DbCompletion[]> {
  const sb = need()
  const { data, error } = await sb.from('completions').select('id,workout_id,points_awarded,completed_at,duration_min,calories,workouts(title)').eq('user_id', uid).order('completed_at', { ascending: false }).limit(200)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ ...r, title: r.workouts?.title ?? '' })) as DbCompletion[]
}

export async function fetchNotifications(): Promise<DbNotification[]> {
  const sb = need()
  const { data, error } = await sb.from('notifications').select('id,title,body,target,user_id,created_at').order('created_at', { ascending: false }).limit(50)
  if (error) throw error
  return (data ?? []) as DbNotification[]
}

export async function createCompletion(uid: string, workoutId: number): Promise<void> {
  const sb = need()
  const { error } = await sb.from('completions').insert({ user_id: uid, workout_id: workoutId })
  if (error) throw error
}

export async function fetchEmsProfile(workoutId: number): Promise<any | null> {
  const sb = need()
  const { data, error } = await sb.from('ems_profiles').select('data').eq('workout_id', workoutId).maybeSingle()
  if (error) return null
  return data?.data ?? null
}

export async function markSeen(uid: string): Promise<void> {
  const sb = need()
  await sb.from('profiles').update({ notifications_seen_at: new Date().toISOString() }).eq('id', uid)
}

export function mapAuthError(msg: string | undefined): string {
  const m = (msg || '').toLowerCase()
  if (m.includes('invalid login credentials')) return 'Email ou password inválidos.'
  if (m.includes('already registered')) return 'Esse email já está registado — entra em vez de criar.'
  if (m.includes('at least 6')) return 'Password demasiado curta (mínimo 6 caracteres).'
  if (m.includes('email not confirmed')) return 'Confirma o email primeiro.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Demasiadas tentativas — espera um pouco.'
  if (m.includes('valid email')) return 'Email inválido.'
  return msg || 'Erro inesperado — tenta outra vez.'
}
