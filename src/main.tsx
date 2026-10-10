import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// ponytail: global img fallback, add once
if(typeof window!=='undefined'){
  window.addEventListener('error', (e)=>{
    const t=e.target as HTMLImageElement
    if(t && t.tagName==='IMG' && !t.dataset.fallback){
      t.dataset.fallback='1'
      t.style.opacity='0.3'
    }
  }, true)
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
