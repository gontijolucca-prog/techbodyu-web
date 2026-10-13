import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import BottomNav from './components/BottomNav'
import TopNav from './components/TopNav'
import { AppStateProvider, useAppState } from './context/AppState'
import Home from './pages/Home'
import Categoria from './pages/Categoria'
import Colecao from './pages/Colecao'
import Treino from './pages/Treino'
import Estatisticas from './pages/Estatisticas'
import Conquistas from './pages/Conquistas'
import EMSControl from './pages/EMSControl'
import Perfil from './pages/Perfil'
import Objetivo from './pages/Objetivo'
import Sucesso from './pages/Sucesso'
import Auth from './pages/Auth'
import Download from './pages/Download'
import Avisos from './pages/Avisos'

function AnimatedRoutes(){
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={loc.pathname} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} transition={{duration:0.22, ease:[0.2,0,0,1]}} className="flex-1 flex flex-col min-h-0 overflow-visible">
        <Routes location={loc}>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/download" element={<Download/>} />
          <Route path="/avisos" element={<RequireAuth><Avisos/></RequireAuth>} />
          <Route path="/login" element={<Navigate to="/auth" replace/>} />
          <Route path="/signup" element={<Navigate to="/auth" replace/>} />
          <Route path="/" element={<RequireAuth><Home/></RequireAuth>} />
          <Route path="/categoria/:slug" element={<RequireAuth><Categoria/></RequireAuth>} />
          <Route path="/colecao/:id" element={<RequireAuth><Colecao/></RequireAuth>} />
          <Route path="/treino/:id" element={<RequireAuth><Treino/></RequireAuth>} />
          <Route path="/estatisticas" element={<RequireAuth><Estatisticas/></RequireAuth>} />
          <Route path="/conquistas" element={<RequireAuth><Conquistas/></RequireAuth>} />
          <Route path="/ems" element={<RequireAuth><EMSControl/></RequireAuth>} />
          <Route path="/perfil" element={<RequireAuth><Perfil/></RequireAuth>} />
          <Route path="/objetivo" element={<RequireAuth><Objetivo/></RequireAuth>} />
          <Route path="/sucesso" element={<RequireAuth><Sucesso/></RequireAuth>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
function RequireAuth({children}:{children:React.ReactNode}){
  const { user, ready } = useAppState()
  const loc = useLocation()
  if(!ready) return null
  if(!user && loc.pathname !== '/auth' && loc.pathname !== '/download') return <Navigate to="/auth" replace />
  return <>{children}</>
}
function Shell(){
  const loc = useLocation()
  const hideNav = loc.pathname==='/sucesso' || loc.pathname==='/objetivo' || loc.pathname==='/auth' || loc.pathname==='/login' || loc.pathname==='/signup'
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col" style={{minHeight:'100dvh'}}>
      {!hideNav && <TopNav />}
      <div className="w-full max-w-[1280px] mx-auto px-0 md:px-6 lg:px-8 py-0 md:py-6 flex-1 flex flex-col min-h-0">
        <div className="bg-white md:rounded-[20px] md:border md:border-zinc-200 md:shadow-[0_8px_32px_rgba(0,0,0,0.06)] min-h-[640px] flex-1 flex flex-col relative overflow-visible">
          <AnimatedRoutes/>
        </div>
      </div>
      {!hideNav && <BottomNav/>}
      {!hideNav && <div className="h-[72px] md:hidden shrink-0" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}/>}
    </div>
  )
}
export default function App(){
  return (
    <HashRouter>
      <AppStateProvider>
        <Shell/>
      </AppStateProvider>
    </HashRouter>
  )
}
