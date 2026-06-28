import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const PERFIL = {
  nombre: 'Paula',
  edad: 24,
  altura: 160,
  pesoInicial: 74.5,
  pesoObjetivo: 65,
  caloriasBase: 1550,
  proteinas: 130,
  carbos: 150,
  grasas: 55,
}

const MENU_BASE = {
  lunes:     { comida: 'Ensalada de pollo con aguacate y maíz', merienda: 'Yogur griego + fresas', cena: 'Tortilla francesa + tomate natural' },
  martes:    { comida: 'Salmón a la plancha + verduras asadas', merienda: 'Melón + almendras', cena: 'Gazpacho + pavo a la plancha' },
  miercoles: { comida: 'Merluza al horno con limón + arroz integral', merienda: 'Yogur griego + arándanos', cena: 'Revuelto de gambas y champiñones' },
  jueves:    { comida: 'Poke bowl de atún, arroz y aguacate', merienda: 'Sandía', cena: 'Ensalada de queso fresco y tomate + pavo' },
  viernes:   { comida: 'Pollo al horno + ensalada fresca', merienda: 'Frambuesas + nueces', cena: 'Sepia a la plancha + verduras' },
  sabado:    { comida: 'Ensalada de pasta integral con bonito y tomate', merienda: 'Yogur griego + melocotón', cena: 'Huevos revueltos con champiñones' },
  domingo:   { comida: 'Solomillo de cerdo con patata asada', merienda: 'Fruta de temporada', cena: 'Crema fría de calabacín + queso fresco' },
}

const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
const DIAS_LABEL = { lunes:'Lun', martes:'Mar', miercoles:'Mié', jueves:'Jue', viernes:'Vie', sabado:'Sáb', domingo:'Dom' }
const DIAS_FULL = { lunes:'Lunes', martes:'Martes', miercoles:'Miércoles', jueves:'Jueves', viernes:'Viernes', sabado:'Sábado', domingo:'Domingo' }

const RECETAS = [
  { id:1, nombre:'Ensalada de pollo con aguacate', tiempo:15, proteina:'Pollo', taper:true, batch:false, ingredientes:['Pechuga de pollo','Lechuga','Aguacate','Maíz','Tomate','AOVE','Limón'], calorias:420 },
  { id:2, nombre:'Salmón a la plancha con verduras', tiempo:20, proteina:'Salmón', taper:false, batch:false, ingredientes:['Salmón','Calabacín','Pimiento','Ajo','AOVE'], calorias:480 },
  { id:3, nombre:'Merluza al horno con limón', tiempo:25, proteina:'Merluza', taper:true, batch:true, ingredientes:['Merluza','Limón','Ajo','Perejil','AOVE'], calorias:310 },
  { id:4, nombre:'Poke bowl de atún y aguacate', tiempo:10, proteina:'Atún', taper:true, batch:false, ingredientes:['Atún en lata','Arroz integral','Aguacate','Zanahoria','Soja'], calorias:520 },
  { id:5, nombre:'Tortilla francesa', tiempo:5, proteina:'Huevos', taper:false, batch:false, ingredientes:['Huevos','AOVE','Sal'], calorias:220 },
  { id:6, nombre:'Revuelto de gambas y champiñones', tiempo:10, proteina:'Gambas', taper:false, batch:false, ingredientes:['Gambas','Champiñones','Huevos','Ajo','AOVE'], calorias:350 },
  { id:7, nombre:'Solomillo de cerdo con patata asada', tiempo:35, proteina:'Solomillo', taper:true, batch:true, ingredientes:['Solomillo de cerdo','Patata','Romero','Ajo','AOVE'], calorias:560 },
  { id:8, nombre:'Sepia a la plancha', tiempo:10, proteina:'Sepia', taper:false, batch:false, ingredientes:['Sepia','Ajo','Perejil','AOVE','Limón'], calorias:280 },
  { id:9, nombre:'Ensalada de pasta integral con bonito', tiempo:15, proteina:'Bonito', taper:true, batch:false, ingredientes:['Pasta integral','Bonito en lata','Tomate','Aceitunas','AOVE'], calorias:490 },
  { id:10, nombre:'Pollo al horno', tiempo:45, proteina:'Pollo', taper:true, batch:true, ingredientes:['Pechuga de pollo','Pimiento','Tomate','Ajo','Romero','AOVE'], calorias:440 },
]

const P = {
  blanco: '#FFFFFF',
  fondo: '#FDF8F5',
  fondoCard: '#FFFFFF',
  melocoton: '#FFCBA4',
  melocotonSuave: '#FFF0E6',
  sage: '#B5C9B7',
  sageSuave: '#EDF3EE',
  lavanda: '#C5B8D8',
  lavandaSuave: '#F0EBF8',
  crema: '#F5EDD6',
  cremaSuave: '#FDFAF2',
  rosa: '#F2B8C6',
  rosaSuave: '#FDF0F4',
  texto: '#2D2D2D',
  textoSuave: '#9B9B9B',
  textoMedio: '#6B6B6B',
  borde: '#EEE8E2',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${P.fondo}; color: ${P.texto}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: ${P.borde}; border-radius: 2px; }

  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: ${P.fondo}; position: relative; }

  .header { padding: 52px 24px 0; }
  .header-greeting { font-size: 13px; color: ${P.textoSuave}; letter-spacing: 0.5px; margin-bottom: 4px; }
  .header-titulo { font-family: 'Playfair Display', serif; font-size: 28px; color: ${P.texto}; font-weight: 400; }
  .header-titulo span { font-style: italic; color: ${P.melocoton}; filter: brightness(0.85); }

  .content { padding: 20px 20px 100px; }

  .nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: ${P.blanco}; border-top: 1px solid ${P.borde}; display: flex; padding: 10px 0 24px; z-index: 100; box-shadow: 0 -8px 24px rgba(0,0,0,0.04); }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 4px 0; cursor: pointer; }
  .nav-icon { font-size: 22px; }
  .nav-label { font-size: 10px; color: ${P.textoSuave}; font-weight: 400; transition: color 0.2s; }
  .nav-item.active .nav-label { color: ${P.texto}; font-weight: 600; }
  .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: ${P.melocoton}; filter: brightness(0.85); margin-top: 2px; opacity: 0; }
  .nav-item.active .nav-dot { opacity: 1; }

  .seccion { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: ${P.textoSuave}; margin: 24px 0 12px; font-weight: 500; }

  .card { background: ${P.fondoCard}; border-radius: 20px; padding: 18px; margin-bottom: 12px; border: 1px solid ${P.borde}; }
  .card-melocoton { background: ${P.melocotonSuave}; border-color: ${P.melocoton}44; }
  .card-sage { background: ${P.sageSuave}; border-color: ${P.sage}44; }
  .card-lavanda { background: ${P.lavandaSuave}; border-color: ${P.lavanda}44; }
  .card-rosa { background: ${P.rosaSuave}; border-color: ${P.rosa}44; }
  .card-crema { background: ${P.cremaSuave}; border-color: #E8D9B044; }

  .comida-card { background: ${P.fondoCard}; border-radius: 18px; border: 1px solid ${P.borde}; padding: 16px 18px; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 14px; cursor: pointer; transition: box-shadow 0.2s; }
  .comida-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .comida-card.proxima { border-color: ${P.melocoton}88; background: ${P.melocotonSuave}; }
  .comida-emoji { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .comida-emoji-comida { background: ${P.melocotonSuave}; }
  .comida-emoji-merienda { background: ${P.sageSuave}; }
  .comida-emoji-cena { background: ${P.lavandaSuave}; }
  .comida-hora { font-size: 11px; color: ${P.textoSuave}; margin-bottom: 3px; font-weight: 500; letter-spacing: 0.3px; }
  .comida-texto { font-size: 15px; color: ${P.texto}; line-height: 1.35; font-weight: 400; }
  .comida-edit { font-size: 14px; opacity: 0.3; margin-left: auto; flex-shrink: 0; padding-top: 2px; }

  .progreso-wrap { margin-top: 14px; }
  .progreso-bar { height: 6px; background: ${P.borde}; border-radius: 3px; overflow: hidden; }
  .progreso-fill { height: 100%; background: linear-gradient(90deg, ${P.melocoton}, ${P.rosa}); border-radius: 3px; transition: width 0.6s ease; }
  .progreso-nums { display: flex; justify-content: space-between; font-size: 11px; color: ${P.textoSuave}; margin-top: 6px; }

  .stat-row { display: flex; gap: 10px; margin-bottom: 10px; }
  .stat-box { flex: 1; background: ${P.fondoCard}; border: 1px solid ${P.borde}; border-radius: 16px; padding: 14px; text-align: center; }
  .stat-num { font-size: 22px; font-weight: 600; color: ${P.texto}; }
  .stat-unit { font-size: 12px; font-weight: 400; color: ${P.textoSuave}; }
  .stat-label { font-size: 11px; color: ${P.textoSuave}; margin-top: 2px; }

  .dias-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 16px; scrollbar-width: none; }
  .dias-scroll::-webkit-scrollbar { display: none; }
  .dia-pill { flex-shrink: 0; padding: 8px 16px; border-radius: 20px; border: 1px solid ${P.borde}; background: ${P.fondoCard}; color: ${P.textoMedio}; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-weight: 400; }
  .dia-pill.active { background: ${P.texto}; border-color: ${P.texto}; color: white; font-weight: 500; }

  .btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 15px 20px; border-radius: 14px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; transition: all 0.2s; width: 100%; }
  .btn-primario { background: ${P.texto}; color: white; }
  .btn-primario:hover { opacity: 0.88; }
  .btn-primario:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-secundario { background: ${P.fondoCard}; color: ${P.texto}; border: 1px solid ${P.borde}; }

  .input { width: 100%; background: ${P.fondo}; border: 1px solid ${P.borde}; border-radius: 12px; padding: 13px 16px; color: ${P.texto}; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; }
  .input:focus { border-color: ${P.texto}; }
  .input-label { font-size: 12px; color: ${P.textoSuave}; margin-bottom: 6px; font-weight: 500; }
  .input-grupo { margin-bottom: 14px; }

  .chip-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .chip { padding: 8px 16px; border-radius: 20px; border: 1px solid ${P.borde}; background: ${P.fondoCard}; color: ${P.textoMedio}; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .chip.sel { background: ${P.melocotonSuave}; border-color: ${P.melocoton}; color: ${P.texto}; font-weight: 500; }

  .ia-burbuja { background: ${P.fondoCard}; border: 1px solid ${P.borde}; border-radius: 18px; border-top-left-radius: 4px; padding: 16px 18px; font-size: 14px; line-height: 1.7; color: ${P.texto}; white-space: pre-wrap; }
  .ia-dots { display: flex; gap: 6px; padding: 16px 18px; }
  .ia-dot { width: 7px; height: 7px; border-radius: 50%; background: ${P.melocoton}; animation: bounce 1.2s ease-in-out infinite; }
  .ia-dot:nth-child(2) { animation-delay: 0.15s; }
  .ia-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce { 0%,80%,100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

  .receta-card { background: ${P.fondoCard}; border: 1px solid ${P.borde}; border-radius: 18px; padding: 16px 18px; margin-bottom: 10px; cursor: pointer; transition: box-shadow 0.2s; }
  .receta-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .receta-nombre { font-size: 15px; font-weight: 500; margin-bottom: 8px; }
  .receta-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .receta-tag { font-size: 11px; padding: 3px 10px; border-radius: 10px; font-weight: 500; }
  .tag-tiempo { background: ${P.cremaSuave}; color: #8B7355; }
  .tag-proteina { background: ${P.melocotonSuave}; color: #B5643A; }
  .tag-taper { background: ${P.sageSuave}; color: #4A7A4E; }
  .tag-batch { background: ${P.lavandaSuave}; color: #6B5B8A; }
  .tag-cal { background: ${P.rosaSuave}; color: #9B4D6A; }

  .receta-detalle { position: fixed; inset: 0; background: white; z-index: 300; overflow-y: auto; max-width: 430px; margin: 0 auto; }
  .receta-detalle-header { padding: 52px 24px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid ${P.borde}; }
  .back-btn { width: 36px; height: 36px; border-radius: 50%; background: ${P.fondo}; border: 1px solid ${P.borde}; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; flex-shrink: 0; }
  .receta-detalle-content { padding: 20px 24px 40px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.25); z-index: 200; display: flex; align-items: flex-end; backdrop-filter: blur(2px); }
  .modal { background: white; border-radius: 24px 24px 0 0; padding: 20px 20px 40px; width: 100%; max-width: 430px; margin: 0 auto; }
  .modal-handle { width: 36px; height: 4px; background: ${P.borde}; border-radius: 2px; margin: 0 auto 18px; }
  .modal-titulo { font-size: 17px; font-weight: 600; margin-bottom: 16px; }

  .peso-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid ${P.borde}; }
  .peso-item:last-child { border-bottom: none; }
  .peso-val { font-size: 17px; font-weight: 600; }
  .peso-fecha { font-size: 12px; color: ${P.textoSuave}; }
  .peso-diff { font-size: 12px; font-weight: 500; }

  .tag-verde { color: #4A7A4E; }
  .tag-rojo { color: #C05050; }

  .perfil-top { text-align: center; padding: 12px 0 24px; }
  .perfil-avatar { width: 76px; height: 76px; border-radius: 50%; background: ${P.melocotonSuave}; display: flex; align-items: center; justify-content: center; font-size: 34px; margin: 0 auto 12px; border: 2px solid ${P.melocoton}66; }
  .perfil-nombre { font-family: 'Playfair Display', serif; font-size: 26px; }
  .perfil-sub { font-size: 13px; color: ${P.textoSuave}; margin-top: 2px; }

  .fila-dato { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid ${P.borde}; }
  .fila-dato:last-child { border-bottom: none; }
  .fila-label { font-size: 14px; color: ${P.textoMedio}; }
  .fila-valor { font-size: 14px; font-weight: 500; }

  .macro-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 12px; }
  .macro-box { border-radius: 14px; padding: 12px; text-align: center; }
  .macro-num { font-size: 20px; font-weight: 600; }
  .macro-lbl { font-size: 11px; margin-top: 2px; opacity: 0.7; }

  .pill-filosofia { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid ${P.borde}; font-size: 14px; }
  .pill-filosofia:last-child { border-bottom: none; }
  .filosofia-check { width: 22px; height: 22px; border-radius: 50%; background: ${P.sageSuave}; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }

  .hoy-chip { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
`

// ─── HOY ───────────────────────────────────────────────────────────────────

function Hoy({ menuSemanal, pesoRegistros }) {
  const hoy = new Date()
  const diasJS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
  const diaHoy = diasJS[hoy.getDay()]
  const menuHoy = menuSemanal[diaHoy] || MENU_BASE[diaHoy]
  const hora = hoy.getHours()
  const proxima = hora < 13 ? 'comida' : hora < 18 ? 'merienda' : 'cena'

  const ultimoPeso = pesoRegistros.length > 0 ? pesoRegistros[pesoRegistros.length - 1].peso : PERFIL.pesoInicial
  const perdido = +(PERFIL.pesoInicial - ultimoPeso).toFixed(1)
  const totalPerder = PERFIL.pesoInicial - PERFIL.pesoObjetivo
  const progreso = Math.max(0, Math.min(100, (perdido / totalPerder) * 100))

  const saludos = hora < 14 ? 'Buenos días' : hora < 21 ? 'Buenas tardes' : 'Buenas noches'

  const comidas = [
    { tipo: 'comida',    emoji: '🍽', hora: '12:30', cls: 'comida-emoji-comida',    color: P.melocoton },
    { tipo: 'merienda',  emoji: '🍎', hora: '17:00', cls: 'comida-emoji-merienda',  color: P.sage },
    { tipo: 'cena',      emoji: '🌙', hora: '00:00', cls: 'comida-emoji-cena',       color: P.lavanda },
  ]

  return (
    <div>
      <div className="header">
        <div className="header-greeting">{saludos}, Paula 🌸</div>
        <div className="header-titulo">Hoy es <span>{DIAS_FULL[diaHoy]}</span></div>
      </div>
      <div className="content">

        <p className="seccion">Tus comidas de hoy</p>
        {comidas.map(({ tipo, emoji, hora, cls }) => (
          <div key={tipo} className={`comida-card ${proxima === tipo ? 'proxima' : ''}`}>
            <div className={`comida-emoji ${cls}`}>{emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="comida-hora">{tipo === 'comida' ? 'Comida principal' : tipo === 'merienda' ? 'Merienda' : 'Cena'} · {hora}</div>
              <div className="comida-texto">{menuHoy[tipo]}</div>
            </div>
            {proxima === tipo && (
              <div className="hoy-chip" style={{ background: P.melocotonSuave, color: '#B5643A' }}>Próxima</div>
            )}
          </div>
        ))}

        <p className="seccion">Tu progreso</p>
        <div className="card card-crema">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 13, color: P.textoSuave, marginBottom: 2 }}>Peso actual</div>
              <div style={{ fontSize: 32, fontWeight: 600 }}>{ultimoPeso} <span style={{ fontSize: 16, fontWeight: 400, color: P.textoSuave }}>kg</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {perdido > 0 && <div style={{ fontSize: 13, color: '#4A7A4E', fontWeight: 500 }}>−{perdido} kg perdidos 🎉</div>}
              <div style={{ fontSize: 13, color: P.textoSuave }}>{(ultimoPeso - PERFIL.pesoObjetivo).toFixed(1)} kg hasta el objetivo</div>
            </div>
          </div>
          <div className="progreso-wrap">
            <div className="progreso-bar">
              <div className="progreso-fill" style={{ width: `${progreso}%` }} />
            </div>
            <div className="progreso-nums">
              <span>{PERFIL.pesoInicial} kg</span>
              <span style={{ color: '#B5643A', fontWeight: 500 }}>{progreso.toFixed(0)}%</span>
              <span>{PERFIL.pesoObjetivo} kg</span>
            </div>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-box">
            <div className="stat-num">1550 <span className="stat-unit">kcal</span></div>
            <div className="stat-label">Objetivo diario</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">130 <span className="stat-unit">g</span></div>
            <div className="stat-label">Proteína</div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── MENÚ ──────────────────────────────────────────────────────────────────

function Menu({ menuSemanal, setMenuSemanal, guardarMenu }) {
  const diasJS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
  const diaHoy = diasJS[new Date().getDay()]
  const [diaActivo, setDiaActivo] = useState(diaHoy)
  const [editando, setEditando] = useState(null)
  const [textoEdit, setTextoEdit] = useState('')

  const menuDia = menuSemanal[diaActivo] || MENU_BASE[diaActivo]

  const abrirEdit = (tipo) => {
    setEditando(tipo)
    setTextoEdit(menuDia[tipo])
  }

  const guardar = async () => {
    const nuevo = { ...menuSemanal, [diaActivo]: { ...(menuSemanal[diaActivo] || MENU_BASE[diaActivo]), [editando]: textoEdit } }
    setMenuSemanal(nuevo)
    await guardarMenu(nuevo)
    setEditando(null)
  }

  const comidas = [
    { tipo:'comida',   emoji:'🍽', hora:'12:30', cls:'comida-emoji-comida' },
    { tipo:'merienda', emoji:'🍎', hora:'17:00', cls:'comida-emoji-merienda' },
    { tipo:'cena',     emoji:'🌙', hora:'00:00', cls:'comida-emoji-cena' },
  ]

  return (
    <>
      <div className="header">
        <div className="header-greeting">Planificación semanal</div>
        <div className="header-titulo">Menú <span>semanal</span></div>
      </div>
      <div className="content">
        <div className="dias-scroll">
          {DIAS.map(d => (
            <button key={d} className={`dia-pill ${diaActivo === d ? 'active' : ''}`} onClick={() => setDiaActivo(d)}>
              {DIAS_LABEL[d]}
            </button>
          ))}
        </div>

        <p className="seccion">{DIAS_FULL[diaActivo]}</p>
        {comidas.map(({ tipo, emoji, hora, cls }) => (
          <div key={tipo} className="comida-card" onClick={() => abrirEdit(tipo)}>
            <div className={`comida-emoji ${cls}`}>{emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="comida-hora">{tipo === 'comida' ? 'Comida principal' : tipo === 'merienda' ? 'Merienda' : 'Cena'} · {hora}</div>
              <div className="comida-texto">{menuDia[tipo]}</div>
            </div>
            <div className="comida-edit">✏️</div>
          </div>
        ))}
      </div>

      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-titulo">Editar {editando === 'comida' ? 'comida principal' : editando}</div>
            <div className="input-grupo">
              <textarea className="input" style={{ minHeight: 80, resize: 'none' }} value={textoEdit} onChange={e => setTextoEdit(e.target.value)} autoFocus />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secundario" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn btn-primario" onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── RECETAS ───────────────────────────────────────────────────────────────

function Recetas() {
  const [filtroP, setFiltroP] = useState('')
  const [filtroT, setFiltroT] = useState('')
  const [filtroCond, setFiltroCond] = useState('')
  const [detalle, setDetalle] = useState(null)

  const proteinas = [...new Set(RECETAS.map(r => r.proteina))]
  const tiempos = ['≤10 min', '≤20 min', '≤30 min', 'Cualquiera']
  const condiciones = ['Para táper', 'Batch cooking']

  const filtradas = RECETAS.filter(r => {
    if (filtroP && r.proteina !== filtroP) return false
    if (filtroT === '≤10 min' && r.tiempo > 10) return false
    if (filtroT === '≤20 min' && r.tiempo > 20) return false
    if (filtroT === '≤30 min' && r.tiempo > 30) return false
    if (filtroCond === 'Para táper' && !r.taper) return false
    if (filtroCond === 'Batch cooking' && !r.batch) return false
    return true
  })

  if (detalle) return (
    <div className="receta-detalle">
      <div className="receta-detalle-header">
        <div className="back-btn" onClick={() => setDetalle(null)}>←</div>
        <div>
          <div style={{ fontSize: 11, color: P.textoSuave, marginBottom: 2 }}>Receta</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{detalle.nombre}</div>
        </div>
      </div>
      <div className="receta-detalle-content">
        <div className="receta-tags" style={{ marginBottom: 20 }}>
          <span className="receta-tag tag-tiempo">⏱ {detalle.tiempo} min</span>
          <span className="receta-tag tag-cal">🔥 {detalle.calorias} kcal</span>
          <span className="receta-tag tag-proteina">{detalle.proteina}</span>
          {detalle.taper && <span className="receta-tag tag-taper">🥡 Táper</span>}
          {detalle.batch && <span className="receta-tag tag-batch">🍳 Batch</span>}
        </div>
        <p className="seccion">Ingredientes</p>
        {detalle.ingredientes.map((ing, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${P.borde}` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: P.melocoton, flexShrink: 0 }} />
            <span style={{ fontSize: 15 }}>{ing}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="header">
        <div className="header-greeting">Tu biblioteca de cocina</div>
        <div className="header-titulo">Recetas <span>& alimentos</span></div>
      </div>
      <div className="content">
        <p className="seccion">Proteína</p>
        <div className="chip-wrap">
          {proteinas.map(p => (
            <button key={p} className={`chip ${filtroP === p ? 'sel' : ''}`} onClick={() => setFiltroP(filtroP === p ? '' : p)}>{p}</button>
          ))}
        </div>

        <p className="seccion">Tiempo</p>
        <div className="chip-wrap">
          {tiempos.map(t => (
            <button key={t} className={`chip ${filtroT === t ? 'sel' : ''}`} onClick={() => setFiltroT(filtroT === t ? '' : t)}>{t}</button>
          ))}
        </div>

        <p className="seccion">Condiciones</p>
        <div className="chip-wrap">
          {condiciones.map(c => (
            <button key={c} className={`chip ${filtroCond === c ? 'sel' : ''}`} onClick={() => setFiltroCond(filtroCond === c ? '' : c)}>{c}</button>
          ))}
        </div>

        <p className="seccion">{filtradas.length} receta{filtradas.length !== 1 ? 's' : ''}</p>
        {filtradas.map(r => (
          <div key={r.id} className="receta-card" onClick={() => setDetalle(r)}>
            <div className="receta-nombre">{r.nombre}</div>
            <div className="receta-tags">
              <span className="receta-tag tag-tiempo">⏱ {r.tiempo} min</span>
              <span className="receta-tag tag-proteina">{r.proteina}</span>
              <span className="receta-tag tag-cal">🔥 {r.calorias} kcal</span>
              {r.taper && <span className="receta-tag tag-taper">🥡 Táper</span>}
              {r.batch && <span className="receta-tag tag-batch">🍳 Batch</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ─── ¿QUÉ COMO? ────────────────────────────────────────────────────────────

function RenderMD({ texto }) {
  const lineas = texto.split("\n")
  const elementos = []
  let i = 0
  while (i < lineas.length) {
    const l = lineas[i]
    if (!l.trim()) { elementos.push(React.createElement("div", { key: i, style: { height: 8 } })); i++; continue }
    if (l.startsWith("## ")) {
      elementos.push(React.createElement("div", { key: i, style: { fontSize: 15, fontWeight: 600, color: "#2D2D2D", marginTop: 14, marginBottom: 4 } }, l.replace("## ","").replace(/\*\*/g,"")))
    } else if (l.startsWith("- ") || l.startsWith("\u2013 ")) {
      const txt = l.replace(/^[-\u2013] /,"")
      elementos.push(React.createElement("div", { key: i, style: { display:"flex", gap:8, marginBottom:3 } }, React.createElement("span", { style: { color:"#FFCBA4", flexShrink:0 } }, "·"), React.createElement("span", { style: { fontSize:14, lineHeight:1.6 }, dangerouslySetInnerHTML: { __html: txt.replace(/\*\*(.+?)\*\*/g,"<strong>$1<\/strong>") } })))
    } else if (l.startsWith("---")) {
      elementos.push(React.createElement("div", { key: i, style: { height:1, background:"#EEE8E2", margin:"10px 0" } }))
    } else {
      elementos.push(React.createElement("p", { key: i, style: { fontSize:14, lineHeight:1.7, marginBottom:4 }, dangerouslySetInnerHTML: { __html: l.replace(/\*\*(.+?)\*\*/g,"<strong>$1<\/strong>") } }))
    }
    i++
  }
  return React.createElement("div", null, ...elementos)
}

function QueComoHoy({ menuSemanal }) {
  const [filtros, setFiltros] = useState({ tiempo: '', proteina: '', cond: '' })
  const [modo, setModo] = useState('filtros')
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)

  const toggle = (k, v) => setFiltros(f => ({ ...f, [k]: f[k] === v ? '' : v }))

  const buscar = async () => {
    setCargando(true)
    setModo('resultado')
    setRespuesta('')
    const menuTexto = DIAS.map(d => {
      const m = menuSemanal[d] || MENU_BASE[d]
      return `${DIAS_FULL[d]}: ${m.comida} / ${m.merienda} / ${m.cena}`
    }).join('\n')
    const prompt = `Eres el asistente nutricional de Proyecto 65, app personalizada para Paula (24 años, 160cm, 74.5kg → objetivo 65kg, entrena fuerza 3-4 días/semana).
Horario: comida 12:30, merienda 17:00 (en táper), cena 00:00.
Le gustan: pollo, solomillo cerdo, salmón, merluza, atún, bonito, gambas, sepia, huevos. No le gustan: pepino, espinacas.
Objetivo: ~1550 kcal/día, ~130g proteína. Filosofía: nunca pasar hambre, comida normal, mínima preparación.

Menú semanal actual:
${menuTexto}

Filtros de Paula:
${filtros.tiempo ? `Tiempo: ${filtros.tiempo}` : ''}
${filtros.proteina ? `Proteína: ${filtros.proteina}` : ''}
${filtros.cond ? `Condición: ${filtros.cond}` : ''}
${!filtros.tiempo && !filtros.proteina && !filtros.cond ? 'Sin filtros — sorpréndela con algo rico y práctico' : ''}

Sugiere 2-3 opciones concretas. Para cada una: nombre, ingredientes principales, tiempo, si es apta para táper. Directo y práctico. Responde en español.`

    try {
      const res = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      })
      const data = await res.json()
      setRespuesta(data.content?.[0]?.text || 'No pude generar sugerencias.')
    } catch {
      setRespuesta('Error al conectar. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <>
      <div className="header">
        <div className="header-greeting">Asistente inteligente</div>
        <div className="header-titulo">¿Qué como <span>hoy?</span></div>
      </div>
      <div className="content">
        {modo === 'resultado' ? (
          <>
            <button className="btn btn-secundario" style={{ marginBottom: 16 }} onClick={() => { setModo('filtros'); setRespuesta('') }}>← Volver</button>
            <p className="seccion">Sugerencias para ti</p>
            {cargando
              ? <div className="card"><div className="ia-dots"><div className="ia-dot"/><div className="ia-dot"/><div className="ia-dot"/></div></div>
              : <div className="ia-burbuja"><RenderMD texto={respuesta} /></div>
            }
            {!cargando && <button className="btn btn-secundario" style={{ marginTop: 10 }} onClick={buscar}>🔄 Otras opciones</button>}
          </>
        ) : (
          <>
            <div className="card card-melocoton" style={{ marginBottom: 20, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Cuéntame qué necesitas</div>
              <div style={{ fontSize: 13, color: P.textoMedio }}>Filtra y la IA te sugiere recetas perfectas para ti</div>
            </div>

            <p className="seccion">Tiempo disponible</p>
            <div className="chip-wrap">
              {['5 min','10 min','20 min','30 min+'].map(v => (
                <button key={v} className={`chip ${filtros.tiempo === v ? 'sel' : ''}`} onClick={() => toggle('tiempo', v)}>{v}</button>
              ))}
            </div>

            <p className="seccion">Proteína principal</p>
            <div className="chip-wrap">
              {['Pollo','Salmón','Merluza','Atún','Gambas','Sepia','Solomillo','Huevos','Bonito'].map(v => (
                <button key={v} className={`chip ${filtros.proteina === v ? 'sel' : ''}`} onClick={() => toggle('proteina', v)}>{v}</button>
              ))}
            </div>

            <p className="seccion">Condiciones</p>
            <div className="chip-wrap">
              {['Para táper','Batch cooking','Sin cocinar','Plato único'].map(v => (
                <button key={v} className={`chip ${filtros.cond === v ? 'sel' : ''}`} onClick={() => toggle('cond', v)}>{v}</button>
              ))}
            </div>

            <button className="btn btn-primario" onClick={buscar}>Ver sugerencias</button>
          </>
        )}
      </div>
    </>
  )
}

// ─── PERFIL ────────────────────────────────────────────────────────────────

function Perfil({ pesoRegistros, guardarPeso }) {
  const [nuevoPeso, setNuevoPeso] = useState('')
  const [guardando, setGuardando] = useState(false)

  const ultimoPeso = pesoRegistros.length > 0 ? pesoRegistros[pesoRegistros.length - 1].peso : PERFIL.pesoInicial
  const perdido = +(PERFIL.pesoInicial - ultimoPeso).toFixed(1)
  const falta = +(ultimoPeso - PERFIL.pesoObjetivo).toFixed(1)
  const progreso = Math.max(0, Math.min(100, (perdido / (PERFIL.pesoInicial - PERFIL.pesoObjetivo)) * 100))

  const handle = async () => {
    if (!nuevoPeso || isNaN(nuevoPeso)) return
    setGuardando(true)
    await guardarPeso(parseFloat(nuevoPeso))
    setNuevoPeso('')
    setGuardando(false)
  }

  return (
    <>
      <div className="header" style={{ paddingBottom: 0 }}>
        <div className="header-greeting">Tu información</div>
        <div className="header-titulo">Mi <span>perfil</span></div>
      </div>
      <div className="content">
        <div className="perfil-top">
          <div className="perfil-avatar">🌸</div>
          <div className="perfil-nombre">Paula</div>
          <div className="perfil-sub">Objetivo: {PERFIL.pesoObjetivo} kg · Proyecto 65</div>
        </div>

        <p className="seccion">Registrar peso</p>
        <div className="card">
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <div className="input-label">Peso de hoy (kg)</div>
              <input type="number" step="0.1" className="input" placeholder="74.5" value={nuevoPeso} onChange={e => setNuevoPeso(e.target.value)} />
            </div>
            <button className="btn btn-primario" style={{ width: 'auto', padding: '13px 20px' }} onClick={handle} disabled={guardando || !nuevoPeso}>
              {guardando ? '...' : '+ Añadir'}
            </button>
          </div>
        </div>

        <p className="seccion">Evolución</p>
        <div className="card card-crema">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: P.textoSuave }}>Ahora</div>
              <div style={{ fontSize: 28, fontWeight: 600 }}>{ultimoPeso} <span style={{ fontSize: 14, color: P.textoSuave, fontWeight: 400 }}>kg</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: P.textoSuave }}>Perdidos</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: '#4A7A4E' }}>{perdido > 0 ? '-' + perdido : '0'} <span style={{ fontSize: 14, color: P.textoSuave, fontWeight: 400 }}>kg</span></div>
            </div>
          </div>
          <div className="progreso-bar">
            <div className="progreso-fill" style={{ width: `${progreso}%` }} />
          </div>
          <div className="progreso-nums"><span>{PERFIL.pesoInicial} kg</span><span>{PERFIL.pesoObjetivo} kg</span></div>
        </div>

        {pesoRegistros.length > 0 && (
          <>
            <p className="seccion">Historial</p>
            <div className="card">
              {[...pesoRegistros].reverse().slice(0, 8).map((r, i, arr) => {
                const prev = arr[i + 1]
                const diff = prev ? +(r.peso - prev.peso).toFixed(1) : null
                return (
                  <div key={r.id} className="peso-item">
                    <div>
                      <div className="peso-val">{r.peso} kg</div>
                      <div className="peso-fecha">{new Date(r.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                    </div>
                    {diff !== null && (
                      <div className={`peso-diff ${diff < 0 ? 'tag-verde' : diff > 0 ? 'tag-rojo' : ''}`}>
                        {diff < 0 ? '↓' : diff > 0 ? '↑' : '–'} {Math.abs(diff)} kg
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        <p className="seccion">Datos personales</p>
        <div className="card">
          {[['Edad','24 años'],['Altura','160 cm'],['Peso inicial',`${PERFIL.pesoInicial} kg`],['Objetivo',`${PERFIL.pesoObjetivo} kg`],['Actividad','Fuerza 3-4 días/semana']].map(([l,v]) => (
            <div key={l} className="fila-dato"><span className="fila-label">{l}</span><span className="fila-valor">{v}</span></div>
          ))}
        </div>

        <p className="seccion">Objetivos nutricionales</p>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 14, color: P.textoMedio }}>Calorías diarias</span>
            <span style={{ fontSize: 20, fontWeight: 600 }}>{PERFIL.caloriasBase} <span style={{ fontSize: 12, color: P.textoSuave, fontWeight: 400 }}>kcal</span></span>
          </div>
          <div className="macro-row">
            <div className="macro-box" style={{ background: P.melocotonSuave }}>
              <div className="macro-num" style={{ color: '#B5643A' }}>{PERFIL.proteinas}g</div>
              <div className="macro-lbl" style={{ color: '#B5643A' }}>Proteína</div>
            </div>
            <div className="macro-box" style={{ background: P.sageSuave }}>
              <div className="macro-num" style={{ color: '#4A7A4E' }}>{PERFIL.carbos}g</div>
              <div className="macro-lbl" style={{ color: '#4A7A4E' }}>Carbos</div>
            </div>
            <div className="macro-box" style={{ background: P.lavandaSuave }}>
              <div className="macro-num" style={{ color: '#6B5B8A' }}>{PERFIL.grasas}g</div>
              <div className="macro-lbl" style={{ color: '#6B5B8A' }}>Grasas</div>
            </div>
          </div>
        </div>

        <p className="seccion">Filosofía</p>
        <div className="card">
          {['Nunca pasar hambre','No prohibir alimentos','Mínima cocina entre semana','Batch cooking dominical','Sostenible durante años'].map(f => (
            <div key={f} className="pill-filosofia">
              <div className="filosofia-check">✓</div>
              <span style={{ fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── APP ───────────────────────────────────────────────────────────────────

export default function App() {
  const [pantalla, setPantalla] = useState('hoy')
  const [menuSemanal, setMenuSemanal] = useState({ ...MENU_BASE })
  const [pesoRegistros, setPesoRegistros] = useState([])

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const { data: m } = await supabase.from('p65_menu_semanal').select('*').eq('usuario','paula').single()
    if (m?.menu) setMenuSemanal(m.menu)
    const { data: p } = await supabase.from('p65_peso').select('*').eq('usuario','paula').order('fecha', { ascending: true })
    if (p) setPesoRegistros(p)
  }

  const guardarMenu = async (menu) => {
    await supabase.from('p65_menu_semanal').upsert({ usuario:'paula', menu, actualizado: new Date().toISOString() }, { onConflict:'usuario' })
  }

  const guardarPeso = async (peso) => {
    const { data } = await supabase.from('p65_peso').insert({ usuario:'paula', peso, fecha: new Date().toISOString() }).select()
    if (data) setPesoRegistros(p => [...p, data[0]])
  }

  const nav = [
    { id:'hoy',        icon:'☀️',  label:'Hoy' },
    { id:'menu',       icon:'📅',  label:'Menú' },
    { id:'recetas',    icon:'🍳',  label:'Recetas' },
    { id:'quecomohoy', icon:'✨',  label:'¿Qué como?' },
    { id:'perfil',     icon:'🌸',  label:'Perfil' },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {pantalla === 'hoy'        && <Hoy menuSemanal={menuSemanal} pesoRegistros={pesoRegistros} />}
        {pantalla === 'menu'       && <Menu menuSemanal={menuSemanal} setMenuSemanal={setMenuSemanal} guardarMenu={guardarMenu} />}
        {pantalla === 'recetas'    && <Recetas />}
        {pantalla === 'quecomohoy' && <QueComoHoy menuSemanal={menuSemanal} />}
        {pantalla === 'perfil'     && <Perfil pesoRegistros={pesoRegistros} guardarPeso={guardarPeso} />}

        <nav className="nav">
          {nav.map(n => (
            <div key={n.id} className={`nav-item ${pantalla === n.id ? 'active' : ''}`} onClick={() => setPantalla(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
              <div className="nav-dot" />
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
