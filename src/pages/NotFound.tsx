import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="min-h-[520px] grid place-items-center p-6 text-center bg-[#FAFAF8]">
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 max-w-[420px] w-full shadow-sm">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF7A1A] grid place-items-center mx-auto text-xl">!</div>
        <h1 className="text-lg font-extrabold mt-4 text-zinc-900">Página não encontrada</h1>
        <p className="text-sm text-zinc-500 mt-2">O treino ou coleção que procuras não existe. Volta ao início.</p>
        <Link to="/" className="inline-block mt-6 bg-[#FF7A1A] text-white rounded-full px-6 py-3 text-sm font-bold hover:bg-orange-600">Voltar ao Home</Link>
      </div>
    </div>
  )
}
