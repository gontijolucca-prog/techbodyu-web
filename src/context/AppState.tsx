import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'
import * as DB from '../lib/db'
import { treinos as mockTreinos, colecoes as mockColecoes, categorias as mockCategorias } from '../data/mock'

export type User = { nome: string; email: string; avatar: string; role?: string; createdAt?: string }
export type UiTreino = { id: string; titulo: string; cal: number; nivel: string; cat: string; pts: number; dur: string; thumb: string }
export type UiCategoria = { slug: string; titulo: string; thumb: string }
export type UiColecao = { id: string; titulo: string; qtd: string; thumb: string }

type State = {
  ready: boolean
  online: boolean
  user: User | null
  setUser: (u: User | null) => void
  logout: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (nome: string, email: string, password: string) => Promise<{ error?: string }>
  points: number
  addPoints: (n: number) => void
  completed: string[]
  completions: DB.DbCompletion[]
  completeWorkout: (id: string, pts?: number) => Promise<void>
  toggleComplete: (id: string, pts: number) => Promise<void>
  treinos: UiTreino[]
  categorias: UiCategoria[]
  colecoes: UiColecao[]
  treinoById: (id: string | undefined) => DB.DbWorkout | undefined
  groupBySlug: (slug: string | undefined) => DB.DbGroup | undefined
  planById: (id: string | undefined) => DB.DbGroup | undefined
  groupWorkouts: (slug: string | undefined) => UiTreino[]
  planWorkouts: (id: string | undefined) => UiTreino[]
  fetchEms: (workoutId: number) => Promise<any | null>
  notifications: DB.DbNotification[]
  unread: number
  markNotificationsSeen: () => Promise<void>
  profileTier: string
  memberSince: string | null
  calibracoes: Record<string, number>
  suitVals: Record<string, number>
  setCalib: (k: string, v: number) => void
  setSuit: (k: string, v: number) => void
  bleDevice: any
  bleServer: any
  bleName: string
  bleBattery: number | undefined
  bleConnected: boolean
  setBleConnection: (device: any, server: any, name: string, battery?: number) => void
  clearBle: () => void
  demoMode: boolean
  setDemoMode: (v: boolean) => void
}

const Ctx = createContext<State>(null as any)
const CONTENT_KEY = 'tbu:content:v2'
const cacheLoad = <T,>(k: string): T | null => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null } catch { return null } }
const cacheSave = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

function loadLocalUser(): User | null {
  try { const s = localStorage.getItem('tbu:user'); return s ? JSON.parse(s) : null } catch { return null }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const online = supabaseReady
  const [ready, setReady] = useState(!online)
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<DB.DbProfile | null>(null)
  const [content, setContent] = useState<DB.Content | null>(() => cacheLoad<DB.Content>(CONTENT_KEY))
  const [completions, setCompletions] = useState<DB.DbCompletion[]>([])
  const [notifications, setNotifications] = useState<DB.DbNotification[]>([])
  const [seenAt, setSeenAt] = useState<string | null>(null)

  const [localUser, setLocalUser] = useState<User | null>(() => loadLocalUser())
  const [localPoints, setLocalPoints] = useState<number>(() => {
    const s = localStorage.getItem('tbu:points'); return s ? parseInt(s) : 0
  })
  const [localCompleted, setLocalCompleted] = useState<string[]>(() => {
    const s = localStorage.getItem('tbu:completed'); return s ? JSON.parse(s) : []
  })

  const loadContent = useCallback(async () => {
    try { const c = await DB.fetchContent(); setContent(c); cacheSave(CONTENT_KEY, c) }
    catch { const cached = cacheLoad<DB.Content>(CONTENT_KEY); if (cached) setContent(cached) }
  }, [])

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const [p, comps, notifs] = await Promise.all([DB.fetchProfile(uid), DB.fetchCompletions(uid), DB.fetchNotifications()])
      if (p) { setProfile(p); setSeenAt(p.notifications_seen_at) }
      setCompletions(comps)
      setNotifications(notifs)
    } catch { /* offline — mantém cache */ }
  }, [])

  useEffect(() => {
    if (!online || !supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) { loadUserData(data.session.user.id); loadContent() }
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s?.user) { loadUserData(s.user.id); loadContent() }
      else { setProfile(null); setCompletions([]); setNotifications([]) }
    })
    return () => sub.subscription.unsubscribe()
  }, [online, loadContent, loadUserData])

  const user: User | null = useMemo(() => {
    if (!online) return localUser
    if (!session?.user) return null
    const email = profile?.email || session.user.email || ''
    return { nome: profile?.name || session.user.user_metadata?.name || email.split('@')[0] || 'Utilizador', email, avatar: '/assets/images/fitness-profile.jpg', role: profile?.role, createdAt: profile?.created_at }
  }, [online, localUser, session, profile])

  const setUser = (u: User | null) => { setLocalUser(u); if (u) localStorage.setItem('tbu:user', JSON.stringify(u)); else localStorage.removeItem('tbu:user') }

  const signIn = async (email: string, password: string) => {
    if (!online || !supabase) return { error: 'Serviço indisponível — modo offline' }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    return { error: error ? DB.mapAuthError(error.message) : undefined }
  }
  const signUp = async (nome: string, email: string, password: string) => {
    if (!online || !supabase) return { error: 'Serviço indisponível — modo offline' }
    const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password, options: { data: { name: nome.trim() } } })
    if (error) return { error: DB.mapAuthError(error.message) }
    if (!data.session) return { error: 'Conta criada — falta confirmar o email.' }
    return {}
  }
  const logout = async () => {
    if (online && supabase) { await supabase.auth.signOut().catch(() => {}) }
    setUser(null)
  }

  const derive = useMemo(() => {
    const groupsById = new Map<number, DB.DbGroup>()
    for (const g of content?.groups ?? []) groupsById.set(g.id, g)
    const namesOf = (wid: number) => (content?.links ?? []).filter(l => l.workout_id === wid).map(l => groupsById.get(l.group_id)?.name?.trim()).filter(Boolean) as string[]
    const mapTreino = (w: DB.DbWorkout): UiTreino => ({
      id: String(w.id), titulo: w.title.trim(), cal: w.calories ?? 0, nivel: w.difficulty ?? 'Beginner',
      cat: namesOf(w.id)[0] || 'Treino', pts: w.points, dur: w.duration_min ? `${w.duration_min} min` : '—',
      thumb: w.thumbnail_url || '/assets/images/tr2.png',
    })
    const realTreinos = (content?.workouts ?? []).map(mapTreino)
    const categorias: UiCategoria[] = (content?.groups ?? []).filter(g => !g.is_workout_plan).map(g => ({ slug: g.slug, titulo: g.name.trim(), thumb: g.thumbnail_url || '/assets/images/fullbody.png' }))
    const colecoes: UiColecao[] = (content?.groups ?? []).filter(g => g.is_workout_plan).map(g => {
      const n = (content?.links ?? []).filter(l => l.group_id === g.id).length
      return { id: String(g.id), titulo: g.name.trim(), qtd: `${n} treinos`, thumb: g.thumbnail_url || '/assets/images/home1.png' }
    })
    const fallback = !content?.workouts?.length
    return {
      groupsById,
      treinos: fallback ? mockTreinos : realTreinos,
      categorias: fallback ? mockCategorias : categorias,
      colecoes: fallback ? mockColecoes : colecoes,
    }
  }, [content])

  const treinoById = (id?: string) => content?.workouts.find(w => String(w.id) === id)
  const groupBySlug = (slug?: string) => content?.groups.find(g => g.slug === slug)
  const planById = (id?: string) => content?.groups.find(g => String(g.id) === id && g.is_workout_plan)
  const idsOfGroup = (gid: number) => new Set((content?.links ?? []).filter(l => l.group_id === gid).map(l => l.workout_id))
  const groupWorkouts = (slug?: string) => {
    const g = groupBySlug(slug)
    if (!g) return derive.treinos
    const ids = idsOfGroup(g.id)
    return derive.treinos.filter(t => ids.has(Number(t.id)))
  }
  const planWorkouts = (id?: string) => {
    const g = planById(id)
    if (!g) return derive.treinos.slice(0, 6)
    const ids = idsOfGroup(g.id)
    return derive.treinos.filter(t => ids.has(Number(t.id)))
  }

  const completed: string[] = useMemo(() => online ? completions.map(c => String(c.workout_id)) : localCompleted, [online, completions, localCompleted])
  const points = online ? (profile?.total_points ?? 0) : localPoints

  const completeWorkout = async (id: string, pts = 0) => {
    const wid = Number(id)
    if (online && session?.user) {
      if (completed.includes(String(wid))) return
      const t = treinoById(String(wid))
      const award = t?.points ?? pts
      try { await DB.createCompletion(session.user.id, wid) } catch { /* fica local */ }
      setCompletions(prev => [{ id: Date.now(), workout_id: wid, points_awarded: award, completed_at: new Date().toISOString(), duration_min: null, calories: null, title: t?.title ?? '' }, ...prev])
      setProfile(p => p ? { ...p, total_points: p.total_points + award } : p)
    } else {
      setLocalCompleted(prev => prev.includes(id) ? prev : [...prev, id])
      setLocalPoints(p => p + pts)
    }
  }
  const toggleComplete = async (id: string, pts: number) => { await completeWorkout(id, pts) }
  const addPoints = (n: number) => {
    if (online && session?.user) setProfile(p => p ? { ...p, total_points: p.total_points + n } : p)
    else setLocalPoints(p => p + n)
  }

  const markNotificationsSeen = async () => {
    setSeenAt(new Date().toISOString())
    if (online && session?.user) { try { await DB.markSeen(session.user.id) } catch {} }
  }
  const unread = useMemo(() => notifications.filter(n => !seenAt || n.created_at > seenAt).length, [notifications, seenAt])

  const [calibracoes, setCalibracoes] = useState<Record<string, number>>(() => cacheLoad('tbu:calib') ?? {})
  const [suitVals, setSuitVals] = useState<Record<string, number>>(() => cacheLoad('tbu:suit') ?? {})
  const [bleDevice, setBleDevice] = useState<any>(null)
  const [bleServer, setBleServer] = useState<any>(null)
  const [bleName, setBleName] = useState('')
  const [bleBattery, setBleBattery] = useState<number | undefined>(undefined)
  const [bleConnected, setBleConnected] = useState(false)
  const [demoMode, setDemoModeState] = useState(() => localStorage.getItem('tbu:ems:demo') === '1')

  useEffect(() => { cacheSave('tbu:calib', calibracoes) }, [calibracoes])
  useEffect(() => { cacheSave('tbu:suit', suitVals) }, [suitVals])
  useEffect(() => { localStorage.setItem('tbu:points', String(localPoints)) }, [localPoints])
  useEffect(() => { localStorage.setItem('tbu:completed', JSON.stringify(localCompleted)) }, [localCompleted])
  useEffect(() => { localStorage.setItem('tbu:ems:demo', demoMode ? '1' : '0') }, [demoMode])

  const setBleConnection = (device: any, server: any, name: string, battery?: number) => {
    setBleDevice(device); setBleServer(server); setBleName(name); setBleBattery(battery); setBleConnected(true)
  }
  const clearBle = () => { setBleDevice(null); setBleServer(null); setBleName(''); setBleBattery(undefined); setBleConnected(false) }

  const value: State = {
    ready, online, user, setUser, logout, signIn, signUp,
    points, addPoints, completed, completions, completeWorkout, toggleComplete,
    treinos: derive.treinos, categorias: derive.categorias, colecoes: derive.colecoes,
    treinoById, groupBySlug, planById, groupWorkouts, planWorkouts,
    fetchEms: (wid: number) => DB.fetchEmsProfile(wid),
    notifications, unread, markNotificationsSeen,
    profileTier: profile?.subscription_tier || 'None',
    memberSince: profile?.created_at ?? user?.createdAt ?? null,
    calibracoes, suitVals, setCalib: (k, v) => setCalibracoes(p => ({ ...p, [k]: v })), setSuit: (k, v) => setSuitVals(p => ({ ...p, [k]: v })),
    bleDevice, bleServer, bleName, bleBattery, bleConnected, setBleConnection, clearBle,
    demoMode, setDemoMode: setDemoModeState,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppState() { return useContext(Ctx) }
