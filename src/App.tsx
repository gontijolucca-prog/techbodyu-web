import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
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

function Shell(){
  const loc = useLocation()
  const hideNav = loc.pathname.startsWith('/treino') || loc.pathname==='/sucesso' || loc.pathname==='/objetivo'
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <TopNav />
      <div className="flex-1 w-full max-w-[1280px] mx-auto px-0 md:px-6 lg:px-8 py-0 md:py-6 flex flex-col">
        <div className="flex-1 bg-white md:rounded-2xl md:border md:border-zinc-200 md:shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex-1 overflow-y-auto">
            <Routes>
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
          </div>
        </div>
      </div>
      {!hideNav && <BottomNav/>}
      <div className="h-[64px] md:hidden shrink-0" style={{display: hideNav ? 'none' : 'block'}}/>
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
