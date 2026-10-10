import { Link as RouterLink } from 'react-router-dom'
import { ChevronLeft, DownloadIcon, Apple, Smartphone, Bluetooth, Zap, RefreshCw } from 'lucide-react'
import InstallPWA from '../components/InstallPWA'

export default function Download(){
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3 flex items-center gap-3">
        <RouterLink to="/" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600"><ChevronLeft size={18}/></RouterLink>
        <h1 className="flex-1 text-center md:text-left text-sm md:text-base font-bold text-[#FF7A1A]">Instalar TechBody U</h1>
        <span className="w-8"/>
      </div>
      <div className="p-4 md:p-6 max-w-[720px] mx-auto space-y-4">
        <div className="bg-white rounded-[20px] border border-zinc-200 p-5 md:p-6 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2"><DownloadIcon size={18} className="text-[#FF7A1A]"/> Download — sem App Store</h2>
          <p className="text-sm text-zinc-600 mt-2">Instala como app nativa em 1 toque. Updates rolam sozinhos sem passar na loja.</p>
          <div className="mt-4">
            <InstallPWA/>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-zinc-50 rounded-xl p-3"><div className="text-lg">⚡</div><div className="font-bold mt-1">Instantâneo</div><div className="text-zinc-500">Sem download pesado</div></div>
            <div className="bg-zinc-50 rounded-xl p-3"><div className="text-lg">🔄</div><div className="font-bold mt-1">Auto-update</div><div className="text-zinc-500">Via Cloudflare+Capgo</div></div>
            <div className="bg-zinc-50 rounded-xl p-3"><div className="text-lg">📱</div><div className="font-bold mt-1">Offline</div><div className="text-zinc-500">PWA tbu-v2</div></div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-zinc-200 p-5 md:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2"><Apple size={16}/> iPhone — como ficar 100% (inclui Bluetooth)</h3>
          <div className="mt-3 space-y-3 text-sm text-zinc-700">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white grid place-items-center text-xs font-bold shrink-0">1</span>
              <div><span className="font-semibold">Instala PWA:</span> Safari → Partilhar ↑ → Adicionar ao Ecrã Principal (fica com ícone, funciona offline).</div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white grid place-items-center text-xs font-bold shrink-0">2</span>
              <div><span className="font-semibold">Para EMS Bluetooth 100%:</span> Safari no iPhone bloqueia BLE. Usa <span className="font-semibold">Bluefy browser</span> (grátis, 1 download) e abre o mesmo link — o botão <span className="font-semibold">Ligar Fato</span> já funciona nativo, ou instala a versão nativa via TestFlight/Web Distribution (mesmo site dentro de app).</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5 text-xs">
              <span className="font-bold flex items-center gap-1"><Bluetooth size={12}/> Nota Apple:</span> Sem envolver Apple de todo é impossível ter BLE nativo em iPhone stock (mesmo download direto exige assinatura mínima). O PWA zero-Apple já é 100% para treino; BLE 100% requer 1 assinatura Developer (sem review App Store) + Live Update depois sem loja.
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="https://apps.apple.com/app/bluefy/id1492822055" target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#007AFF] text-white text-sm font-bold">Abrir no Bluefy</a>
            <span className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-500 text-sm font-semibold">TestFlight em breve → link aqui</span>
            <span className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-500 text-sm font-semibold">.ipa direto UE em breve</span>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-zinc-200 p-5 md:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2"><Smartphone size={16}/> Android — 100% já</h3>
          <p className="text-sm text-zinc-600 mt-2">Chrome → menu → <span className="font-semibold">Instalar app</span>. Bluetooth <span className="font-semibold flex inline-flex items-center gap-1"><Bluetooth size={12}/> EMS</span> liga direto ao fato sem app de loja.</p>
        </div>

        <div className="bg-white rounded-[20px] border border-zinc-200 p-5 md:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2"><RefreshCw size={16} className="text-[#FF7A1A]"/> Como fazes updates</h3>
          <p className="text-sm text-zinc-600 mt-2">Fazes <code className="bg-zinc-100 px-1 rounded">npm run build && npx wrangler pages deploy</code> para web + <code className="bg-zinc-100 px-1 rounded">npx @capgo/cli bundle upload</code> para a app nativa. O user abre a app e recebe o novo JS instantaneamente — sem App Store, sem reinstalar.</p>
          <div className="mt-3 bg-zinc-50 rounded-xl p-3 text-xs text-zinc-600"><span className="font-bold">O que atualiza sem loja:</span> vídeos, treinos, design, textos, lógica. Só precisas de novo binário se mudares permissões Bluetooth nativas.</div>
        </div>

        <div className="bg-zinc-900 rounded-[20px] p-5 md:p-6 text-white">
          <div className="text-sm font-bold flex items-center gap-2"><Zap size={16} className="text-[#FF7A1A]"/> Estado atual</div>
          <p className="text-xs text-zinc-300 mt-2">Web/PWA live em <span className="text-white font-semibold">techbodyu-web.pages.dev</span> (tbu-v2) + Capacitor config pronta (`pt.techbodyu.web`). Quando quiseres o `.ipa`, é `npx cap add ios && npx cap open ios` → build → TestFlight/Web Distribution.</p>
          <RouterLink to="/" className="inline-block mt-3 px-4 py-2 rounded-full bg-[#FF7A1A] text-white text-sm font-bold">Voltar à Home → testar instalar</RouterLink>
        </div>
      </div>
    </div>
  )
}
