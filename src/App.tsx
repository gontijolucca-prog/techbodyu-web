import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import BottomNav from './components/BottomNav'
import TopNav from './components/TopNav'
import { AppStateProvider } from './context/AppState'
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

function AnimatedRoutes(){
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={loc.pathname} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} transition={{duration:0.22, ease:[0.2,0,0,1]}} className="flex-1 flex flex-col">
        <Routes location={loc}>
          <Route path="/" element={<Home/>} />
          <Route path="/categoria/:slug" element={<Categoria/>} />
          <Route path="/colecao/:id" element={<Colecao/>} />
          <Route path="/treino/:id" element={<Treino/>} />
          <Route path="/estatisticas" element={<Estatisticas/>} />
          <Route path="/conquistas" element={<Conquistas/>} />
          <Route path="/ems" element={<EMSControl/>} />
          <Route path="/perfil" element={<Perfil/>} />
          <Route path="/objetivo" element={<Objetivo/>} />
          <Route path="/sucesso" element={<Sucesso/>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
function Shell(){
  const loc = useLocation()
  const hideNav = loc.pathname==='/sucesso' || loc.pathname==='/objetivo'
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <TopNav />
      <div className="w-full max-w-[1280px] mx-auto px-0 md:px-6 lg:px-8 py-0 md:py-6 flex-1">
        <div className="bg-white md:rounded-[20px] md:border md:border-zinc-200 md:shadow-[0_8px_32px_rgba(0,0,0,0.06)] min-h-[640px] relative">
          <AnimatedRoutes/>
        </div>
      </div>
      {!hideNav && <BottomNav/>}
      <div className="h-[72px] md:hidden shrink-0" style={{display: hideNav ? 'none' : 'block', paddingBottom: 'env(safe-area-inset-bottom)'}}/>
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
