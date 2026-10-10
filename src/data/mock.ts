export type Treino = {
  id: string
  titulo: string
  subtitulo?: string
  cal: number
  nivel: 'Beginner' | 'Intermediate' | 'Advanced'
  cat: string
  pts: number
  dur: string
  thumb: string
  completed?: boolean
  progresso?: number
  bloqueado?: boolean
  fullBody?: boolean
}
export const treinos: Treino[] = [
  { id:'techpower1', titulo:'TechPower I', cal:35, nivel:'Intermediate', cat:'Strength', pts:75, dur:'29 min', thumb:'/assets/images/b1.png', completed:true },
  { id:'recuperacao', titulo:'Recuperação / Regeneração', cal:10, nivel:'Beginner', cat:'Recovery', pts:50, dur:'10 min', thumb:'/assets/images/tr2.png' },
  { id:'massagem', titulo:'Massagem Desportiva', cal:20, nivel:'Beginner', cat:'Recovery', pts:50, dur:'20 min', thumb:'/assets/images/c2.png' },
  { id:'core1', titulo:'CORE I', cal:30, nivel:'Intermediate', cat:'Core', pts:60, dur:'25 min', thumb:'/assets/images/c3.png' },
  { id:'circuito1', titulo:'Treino em Circuito I', cal:50, nivel:'Beginner', cat:'Cardio', pts:50, dur:'30 min', thumb:'/assets/images/tr1.png' },
  { id:'hiit', titulo:'HIIT (Treino Intervalado de Alta Intensidade)', cal:45, nivel:'Advanced', cat:'Cardio', pts:75, dur:'29 min', thumb:'/assets/images/tr3.png' },
  { id:'perda-peso', titulo:'Perda de Peso Intensivo', cal:60, nivel:'Intermediate', cat:'Weight', pts:75, dur:'35 min', thumb:'/assets/images/tr4.png' },
]

export type Colecao = { id:string; titulo:string; qtd:string; thumb:string }
export const colecoes: Colecao[] = [
  { id:'primeiros', titulo:'Primeiros Passos: Movimento, Força e C...', qtd:'8 treinos', thumb:'/assets/images/home1.png' },
  { id:'queimar', titulo:'Queimar Calorias e Secar em 6 semanas ...', qtd:'12 treinos', thumb:'/assets/images/home2.png' },
  { id:'gluteos', titulo:'Glúteos Redondos e Abdominais Fortes +', qtd:'10 treinos', thumb:'/assets/images/tr5.png' },
  { id:'posparto', titulo:'Pós-Parto: em Equilíbrio, Força, Core ...', qtd:'10 treinos', thumb:'/assets/images/c4.png' },
  { id:'costas', titulo:'Costas Fortes, Corpo Sem Dor em 30 dias', qtd:'12 treinos', thumb:'/assets/images/c5.png' },
]

export type Categoria = { slug:string; titulo:string; thumb:string }
export const categorias: Categoria[] = [
  { slug:'perda-de-peso', titulo:'Perda de Peso', thumb:'/assets/images/fitness-profile.jpg' },
  { slug:'forca', titulo:'Força e Tonificação', thumb:'/assets/images/fullbody.png' },
  { slug:'saude', titulo:'Saúde e Bem Estar', thumb:'/assets/images/lowbodddy.png' },
  { slug:'livres', titulo:'Treinos Livres', thumb:'/assets/images/workoutplanp1.png' },
  { slug:'tematicas', titulo:'Aulas Temáticas (Glúteos, Dança, ...)', thumb:'/assets/images/trainerdeatils.png' },
]

export const user = { nome:'LUIZ SANTANA', pontos:275, pontosTotal:350, conquistasPts:500, kcal:1328, membroDesde:'Março 2026' }

export type EstatTreino = { nome:string; data:string; hora:string; concluido:boolean; dur:string; cal:string }
export const estatisticasMes: EstatTreino[] = [
  { nome:'Recuperação / Regeneração', data:'9 de mar', hora:'Concluído às 20:36', concluido:true, dur:'30 min', cal:'-' },
  { nome:'TechPower I', data:'9 de mar', hora:'Concluído às 20:33', concluido:true, dur:'10 min', cal:'244 Cal' },
  { nome:'HIIT (Treino Intervalado de Alta Intensidade)', data:'11 de mar', hora:'Concluído às 11:17', concluido:true, dur:'29 min', cal:'245 Cal' },
  { nome:'Treino em Circuito I', data:'11 de mar', hora:'Concluído às 10:53', concluido:true, dur:'29 min', cal:'150 Cal' },
  { nome:'CORE I', data:'11 de mar', hora:'Concluído às 10:59', concluido:true, dur:'29 min', cal:'230 Cal' },
]

export const conquistas = [
  { titulo:'Treino concluído: Treino em Circuito I', data:'Concluído às 10:53', pts:'+50' },
  { titulo:'Treino concluído: HIIT (Treino Intervalado de Alta Intensidade)', data:'Concluído às 11:17', pts:'+50' },
  { titulo:'Treino concluído: CORE I', data:'Concluído às 10:59', pts:'+50' },
  { titulo:'Treino concluído: TechPower I', data:'Concluído às 11:17', pts:'+75' },
  { titulo:'Treino concluído: Recuperação / Regeneração', data:'08:56', pts:'+50' },
  { titulo:'Treino concluído: TechPower I', data:'08:56', pts:'+75' },
  { titulo:'Treino concluído: Massagem Desportiva', data:'08:56', pts:'+50' },
]

export const objetivos = ['Perder Peso','Ganhar Massa Muscular','Tonificar Corpo','Melhorar Resistência','Recuperação Muscular','Fortalecer Core','Aumentar Força','Reduzir Gordura Localizada','Melhorar Postura','Condicionamento Físico Geral']

export const colecaoPrimeiros = [
  { n:1, titulo:'Pilates', leg:'8:00 • Beginner', thumb:'/assets/images/start1.jpg', unlocked:true },
  { n:2, titulo:'Adaptação Anatómica I', leg:'8:00 • Beginner • Strength', thumb:'/assets/images/start2.jpg', unlocked:true },
  { n:3, titulo:'Adaptação Funcional', leg:'12:00 • Beginner • Mobility', thumb:'/assets/images/start3.jpg', unlocked:true },
  { n:4, titulo:'Adaptação Anatómica II', leg:'8:00 • Beginner • Strength', thumb:'/assets/images/b1.png', unlocked:true },
  { n:5, titulo:'Core Estável', leg:'15:00 • Beginner • Core', thumb:'/assets/images/tr2.png', unlocked:true },
  { n:6, titulo:'Treino de Força: Core', leg:'18:00 • Intermediate', thumb:'/assets/images/tr3.png', unlocked:true },
  { n:7, titulo:'Reforço Postura', leg:'14:00 • Beginner', thumb:'/assets/images/tr4.png', unlocked:true },
  { n:8, titulo:'Treino de Força', leg:'Core intensivo II', thumb:'/assets/images/tr5.png', unlocked:true },
]
