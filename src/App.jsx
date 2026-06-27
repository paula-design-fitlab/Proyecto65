import React, { useState, useEffect, useCallback } from 'react'
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
  pesoObjetivoIntermedio: 68,
  actividad: 'moderada',
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

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const DIAS_LABEL = { lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom' }
const DIAS_FULL = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' }

const COLORES = {
  fondo: '#0F0F0F',
  superficie: '#1A1A1A',
  superficieAlta: '#222222',
  borde: '#2A2A2A',
  bordeActivo: '#C8A96E',
  acento: '#C8A96E',
  acentoSuave: '#C8A96E22',
  texto: '#F0EDE8',
  textoSuave: '#888888',
  textoMedio: '#BBBBBB',
  verde: '#4CAF7D',
  verdeSuave: '#4CAF7D22',
  rojo: '#E57373',
  rojoSuave: '#E5737322',
}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORES.fondo}; color: ${COLORES.texto}; font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${COLORES.borde}; border-radius: 2px; }

  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 430px; margin: 0 auto; position: relative; }

  .header { padding: 20px 20px 0; display: flex; justify-content: space-between; align-items: center; }
  .header-logo { font-family: 'Playfair Display', serif; font-size: 22px; color: ${COLORES.acento}; letter-spacing: 0.5px; }
  .header-sub { font-size: 11px; color: ${COLORES.textoSuave}; letter-spacing: 2px; text-transform: uppercase; margin-top: 1px; }
  .header-fecha { text-align: right; font-size: 12px; color: ${COLORES.textoSuave}; }

  .content { flex: 1; padding: 20px 20px 100px; overflow-y: auto; }

  .nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: ${COLORES.superficie}; border-top: 1px solid ${COLORES.borde}; display: flex; padding: 8px 0 20px; z-index: 100; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 0; cursor: pointer; transition: all 0.2s; }
  .nav-icon { font-size: 20px; }
  .nav-label { font-size: 10px; letter-spacing: 0.5px; color: ${COLORES.textoSuave}; transition: color 0.2s; }
  .nav-item.active .nav-label { color: ${COLORES.acento}; }
  .nav-item.active .nav-icon { filter: none; }

  .seccion-titulo { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: ${COLORES.textoSuave}; margin-bottom: 12px; margin-top: 24px; }
  .seccion-titulo:first-child { margin-top: 0; }

  .card { background: ${COLORES.superficie}; border: 1px solid ${COLORES.borde}; border-radius: 16px; padding: 16px; margin-bottom: 12px; }
  .card-acento { border-color: ${COLORES.bordeActivo}; }

  .row { display: flex; justify-content: space-between; align-items: center; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }

  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .badge-verde { background: ${COLORES.verdeSuave}; color: ${COLORES.verde}; }
  .badge-dorado { background: ${COLORES.acentoSuave}; color: ${COLORES.acento}; }
  .badge-rojo { background: ${COLORES.rojoSuave}; color: ${COLORES.rojo}; }

  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-box { background: ${COLORES.superficieAlta}; border-radius: 12px; padding: 14px; }
  .stat-valor { font-size: 24px; font-weight: 600; color: ${COLORES.texto}; }
  .stat-label { font-size: 11px; color: ${COLORES.textoSuave}; margin-top: 2px; }
  .stat-unidad { font-size: 13px; font-weight: 400; color: ${COLORES.textoSuave}; }

  .progreso-wrap { margin: 8px 0; }
  .progreso-bar { height: 4px; background: ${COLORES.borde}; border-radius: 2px; overflow: hidden; }
  .progreso-fill { height: 100%; background: ${COLORES.acento}; border-radius: 2px; transition: width 0.5s ease; }
  .progreso-fill-verde { background: ${COLORES.verde}; }
  .progreso-labels { display: flex; justify-content: space-between; font-size: 10px; color: ${COLORES.textoSuave}; margin-top: 4px; }

  .comida-slot { background: ${COLORES.superficieAlta}; border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
  .comida-slot:hover { border-color: ${COLORES.borde}; }
  .comida-slot-label { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: ${COLORES.textoSuave}; margin-bottom: 4px; }
  .comida-slot-texto { font-size: 14px; color: ${COLORES.texto}; line-height: 1.3; }
  .comida-edit { font-size: 16px; opacity: 0.4; flex-shrink: 0; margin-left: 8px; }

  .dias-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
  .dias-scroll::-webkit-scrollbar { display: none; }
  .dia-btn { flex-shrink: 0; padding: 8px 14px; border-radius: 10px; border: 1px solid ${COLORES.borde}; background: transparent; color: ${COLORES.textoMedio}; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
  .dia-btn.active { background: ${COLORES.acento}; border-color: ${COLORES.acento}; color: #000; font-weight: 600; }

  .btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.2s; width: 100%; }
  .btn-primario { background: ${COLORES.acento}; color: #000; }
  .btn-primario:hover { opacity: 0.9; }
  .btn-primario:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secundario { background: ${COLORES.superficieAlta}; color: ${COLORES.texto}; border: 1px solid ${COLORES.borde}; }
  .btn-secundario:hover { border-color: ${COLORES.acento}; }

  .input { width: 100%; background: ${COLORES.superficieAlta}; border: 1px solid ${COLORES.borde}; border-radius: 10px; padding: 12px 14px; color: ${COLORES.texto}; font-family: 'Inter', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .input:focus { border-color: ${COLORES.acento}; }
  .input-label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${COLORES.textoSuave}; margin-bottom: 6px; }
  .input-grupo { margin-bottom: 14px; }

  .ia-burbuja { background: ${COLORES.superficieAlta}; border-radius: 16px; border-bottom-left-radius: 4px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: ${COLORES.texto}; border: 1px solid ${COLORES.borde}; }
  .ia-cargando { display: flex; gap: 6px; align-items: center; padding: 14px 16px; }
  .ia-dot { width: 6px; height: 6px; border-radius: 50%; background: ${COLORES.acento}; animation: pulso 1.2s ease-in-out infinite; }
  .ia-dot:nth-child(2) { animation-delay: 0.2s; }
  .ia-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulso { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }

  .chip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { padding: 8px 14px; border-radius: 20px; border: 1px solid ${COLORES.borde}; background: transparent; color: ${COLORES.textoMedio}; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
  .chip.selected { background: ${COLORES.acentoSuave}; border-color: ${COLORES.acento}; color: ${COLORES.acento}; }

  .divider { height: 1px; background: ${COLORES.borde}; margin: 16px 0; }

  .peso-lista { display: flex; flex-direction: column; gap: 8px; }
  .peso-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid ${COLORES.borde}; }
  .peso-item:last-child { border-bottom: none; }
  .peso-valor { font-size: 18px; font-weight: 600; }
  .peso-fecha { font-size: 12px; color: ${COLORES.textoSuave}; }
  .peso-diff-pos { font-size: 12px; color: ${COLORES.verde}; }
  .peso-diff-neg { font-size: 12px; color: ${COLORES.rojo}; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: flex-end; }
  .modal { background: ${COLORES.superficie}; border-radius: 24px 24px 0 0; padding: 24px 20px 40px; width: 100%; max-width: 430px; margin: 0 auto; border-top: 1px solid ${COLORES.borde}; }
  .modal-titulo { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
  .modal-handle { width: 40px; height: 4px; background: ${COLORES.borde}; border-radius: 2px; margin: 0 auto 20px; }

  .perfil-header { text-align: center; padding: 20px 0; }
  .perfil-avatar { width: 72px; height: 72px; border-radius: 50%; background: ${COLORES.acentoSuave}; border: 2px solid ${COLORES.acento}; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 12px; }
  .perfil-nombre { font-family: 'Playfair Display', serif; font-size: 24px; color: ${COLORES.texto}; }
  .perfil-objetivo { font-size: 13px; color: ${COLORES.textoSuave}; margin-top: 4px; }

  .macro-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .macro-box { background: ${COLORES.superficieAlta}; border-radius: 10px; padding: 10px; text-align: center; }
  .macro-valor { font-size: 18px; font-weight: 600; color: ${COLORES.acento}; }
  .macro-label { font-size: 10px; color: ${COLORES.textoSuave}; margin-top: 2px; }

  .tag-proteina { color: #FF8A65; }
  .tag-carbo { color: #64B5F6; }
  .tag-grasa { color: #FFD54F; }
`

// ===================== COMPONENTES =====================

function Dashboard({ menuSemanal, pesoRegistros, fitlabData }) {
  const hoy = new Date()
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  const diaHoy = diasSemana[hoy.getDay()]
  const menuHoy = menuSemanal[diaHoy] || MENU_BASE[diaHoy]

  const ultimoPeso = pesoRegistros.length > 0 ? pesoRegistros[pesoRegistros.length - 1].peso : PERFIL.pesoInicial
  const perdido = PERFIL.pesoInicial - ultimoPeso
  const totalPerder = PERFIL.pesoInicial - PERFIL.pesoObjetivo
  const progreso = Math.max(0, Math.min(100, (perdido / totalPerder) * 100))

  const fechaStr = hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const horaActual = hoy.getHours()
  let proximaComida = ''
  if (horaActual < 12) proximaComida = 'comida'
  else if (horaActual < 17) proximaComida = 'merienda'
  else proximaComida = 'cena'

  return (
    <div>
      <div className="card card-acento" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: COLORES.textoSuave, marginBottom: 2 }}>Hoy</div>
            <div style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{fechaStr}</div>
          </div>
          <span className="badge badge-dorado">Semana activa</span>
        </div>
        <div className="progreso-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: COLORES.textoSuave }}>Progreso hacia {PERFIL.pesoObjetivo} kg</span>
            <span style={{ fontSize: 12, color: COLORES.acento }}>{progreso.toFixed(0)}%</span>
          </div>
          <div className="progreso-bar">
            <div className="progreso-fill" style={{ width: `${progreso}%` }} />
          </div>
          <div className="progreso-labels">
            <span>{PERFIL.pesoInicial} kg</span>
            <span>{ultimoPeso} kg ahora</span>
            <span>{PERFIL.pesoObjetivo} kg</span>
          </div>
        </div>
      </div>

      <p className="seccion-titulo">Hoy comes</p>
      {['comida', 'merienda', 'cena'].map(tipo => (
        <div key={tipo} className="comida-slot" style={proximaComida === tipo ? { borderColor: COLORES.bordeActivo } : {}}>
          <div style={{ flex: 1 }}>
            <div className="comida-slot-label">{tipo === 'comida' ? '🍽 Comida principal · 12:30' : tipo === 'merienda' ? '🍎 Merienda · 17:00' : '🌙 Cena · 00:00'}</div>
            <div className="comida-slot-texto">{menuHoy[tipo]}</div>
          </div>
          {proximaComida === tipo && <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORES.acento, flexShrink: 0, marginTop: 6 }} />}
        </div>
      ))}

      <p className="seccion-titulo">Tu semana</p>
      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-valor">{PERFIL.caloriasBase}<span className="stat-unidad"> kcal</span></div>
          <div className="stat-label">Objetivo diario</div>
        </div>
        <div className="stat-box">
          <div className="stat-valor">{PERFIL.proteinas}<span className="stat-unidad"> g</span></div>
          <div className="stat-label">Proteína objetivo</div>
        </div>
        <div className="stat-box">
          <div className="stat-valor" style={{ color: COLORES.verde }}>{perdido > 0 ? '-' + perdido.toFixed(1) : '0'}<span className="stat-unidad"> kg</span></div>
          <div className="stat-label">Perdidos</div>
        </div>
        <div className="stat-box">
          <div className="stat-valor">{(totalPerder - perdido).toFixed(1)}<span className="stat-unidad"> kg</span></div>
          <div className="stat-label">Hasta el objetivo</div>
        </div>
      </div>

      {fitlabData && fitlabData.caloriasQuemadas > 0 && (
        <>
          <p className="seccion-titulo">Hoy en el gimnasio</p>
          <div className="card">
            <div className="row">
              <div>
                <div style={{ fontSize: 13, color: COLORES.textoSuave }}>Calorías quemadas</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: COLORES.verde, marginTop: 2 }}>~{fitlabData.caloriasQuemadas} kcal</div>
              </div>
              <div style={{ fontSize: 32 }}>🔥</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: COLORES.textoSuave }}>
              Objetivo ajustado hoy: {PERFIL.caloriasBase + fitlabData.caloriasQuemadas} kcal
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MenuSemanal({ menuSemanal, setMenuSemanal, guardarMenu }) {
  const [diaActivo, setDiaActivo] = useState('lunes')
  const [editando, setEditando] = useState(null)
  const [textoEdit, setTextoEdit] = useState('')

  const abrirEdicion = (tipo) => {
    setEditando(tipo)
    setTextoEdit(menuSemanal[diaActivo]?.[tipo] || MENU_BASE[diaActivo][tipo])
  }

  const guardarEdicion = async () => {
    const nuevoMenu = {
      ...menuSemanal,
      [diaActivo]: {
        ...(menuSemanal[diaActivo] || MENU_BASE[diaActivo]),
        [editando]: textoEdit,
      }
    }
    setMenuSemanal(nuevoMenu)
    await guardarMenu(nuevoMenu)
    setEditando(null)
  }

  const menuDia = menuSemanal[diaActivo] || MENU_BASE[diaActivo]

  return (
    <div>
      <div className="dias-scroll" style={{ marginBottom: 16 }}>
        {DIAS.map(d => (
          <button key={d} className={`dia-btn ${diaActivo === d ? 'active' : ''}`} onClick={() => setDiaActivo(d)}>
            {DIAS_LABEL[d]}
          </button>
        ))}
      </div>

      <p className="seccion-titulo">{DIAS_FULL[diaActivo]}</p>

      {['comida', 'merienda', 'cena'].map(tipo => (
        <div key={tipo} className="comida-slot" onClick={() => abrirEdicion(tipo)}>
          <div style={{ flex: 1 }}>
            <div className="comida-slot-label">
              {tipo === 'comida' ? '🍽 Comida principal' : tipo === 'merienda' ? '🍎 Merienda' : '🌙 Cena'}
            </div>
            <div className="comida-slot-texto">{menuDia[tipo]}</div>
          </div>
          <div className="comida-edit">✏️</div>
        </div>
      ))}

      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-titulo">Editar {editando}</div>
            <div className="input-grupo">
              <textarea
                className="input"
                style={{ minHeight: 80, resize: 'none' }}
                value={textoEdit}
                onChange={e => setTextoEdit(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secundario" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn btn-primario" onClick={guardarEdicion}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QueComoHoy({ menuSemanal }) {
  const [modo, setModo] = useState('inicio')
  const [filtros, setFiltros] = useState({ tiempo: '', proteina: '', tipo: '' })
  const [respuestaIA, setRespuestaIA] = useState('')
  const [cargando, setCargando] = useState(false)

  const opcionesTiempo = ['5 min', '10 min', '20 min', '30 min+']
  const opcionesProteina = ['Pollo', 'Salmón', 'Merluza', 'Atún', 'Gambas', 'Sepia', 'Solomillo', 'Huevos', 'Bonito']
  const opcionesTipo = ['Para táper', 'Batch cooking', 'Sin cocinar', 'Plato único']

  const toggleFiltro = (clave, valor) => {
    setFiltros(f => ({ ...f, [clave]: f[clave] === valor ? '' : valor }))
  }

  const buscarConIA = async () => {
    setCargando(true)
    setModo('resultado')
    setRespuestaIA('')

    const menuTexto = DIAS.map(d => {
      const m = menuSemanal[d] || MENU_BASE[d]
      return `${DIAS_FULL[d]}: ${m.comida} / ${m.merienda} / ${m.cena}`
    }).join('\n')

    const prompt = `Eres el asistente nutricional de Proyecto 65, una app personalizada para Paula.

PERFIL DE PAULA:
- 24 años, 160 cm, 74.5 kg → objetivo 65 kg
- Entrena fuerza 3-4 días/semana, trabaja activa
- Come a las 12:30, merienda a las 17:00, cena a las 00:00
- Le gustan: pollo, solomillo de cerdo, salmón, merluza, atún, bonito, gambas, sepia, huevos
- No le gustan: pepino, espinacas
- Objetivo calórico: ~1550 kcal/día, ~130g proteína

MENÚ SEMANAL ACTUAL:
${menuTexto}

FILTROS DE PAULA HOY:
${filtros.tiempo ? `- Tiempo disponible: ${filtros.tiempo}` : ''}
${filtros.proteina ? `- Quiere: ${filtros.proteina}` : ''}
${filtros.tipo ? `- Condición: ${filtros.tipo}` : ''}
${!filtros.tiempo && !filtros.proteina && !filtros.tipo ? '- Sin filtros especiales, sorpréndela' : ''}

Sugiere 2-3 opciones de comida concretas y prácticas. Para cada una indica: nombre, ingredientes principales, tiempo aproximado, y si es apta para táper. Sé directo y práctico. Responde en español.`

    try {
      const res = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      })
      const data = await res.json()
      setRespuestaIA(data.content?.[0]?.text || 'No pude generar sugerencias.')
    } catch {
      setRespuestaIA('Error al conectar con la IA. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  if (modo === 'resultado') {
    return (
      <div>
        <button className="btn btn-secundario" style={{ marginBottom: 16 }} onClick={() => { setModo('inicio'); setRespuestaIA('') }}>
          ← Volver
        </button>
        <p className="seccion-titulo">Sugerencias para hoy</p>
        {cargando ? (
          <div className="card">
            <div className="ia-cargando">
              <div className="ia-dot" /><div className="ia-dot" /><div className="ia-dot" />
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="ia-burbuja" style={{ whiteSpace: 'pre-wrap' }}>{respuestaIA}</div>
          </div>
        )}
        {!cargando && (
          <button className="btn btn-secundario" style={{ marginTop: 8 }} onClick={buscarConIA}>
            🔄 Generar otras opciones
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 16, textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🤔</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>¿Qué como hoy?</div>
        <div style={{ fontSize: 13, color: COLORES.textoSuave }}>Filtra por lo que tienes o quieres y la IA te sugiere opciones perfectas para ti</div>
      </div>

      <p className="seccion-titulo">Tiempo disponible</p>
      <div className="chip-grid" style={{ marginBottom: 16 }}>
        {opcionesTiempo.map(o => (
          <button key={o} className={`chip ${filtros.tiempo === o ? 'selected' : ''}`} onClick={() => toggleFiltro('tiempo', o)}>{o}</button>
        ))}
      </div>

      <p className="seccion-titulo">Proteína principal</p>
      <div className="chip-grid" style={{ marginBottom: 16 }}>
        {opcionesProteina.map(o => (
          <button key={o} className={`chip ${filtros.proteina === o ? 'selected' : ''}`} onClick={() => toggleFiltro('proteina', o)}>{o}</button>
        ))}
      </div>

      <p className="seccion-titulo">Condiciones</p>
      <div className="chip-grid" style={{ marginBottom: 20 }}>
        {opcionesTipo.map(o => (
          <button key={o} className={`chip ${filtros.tipo === o ? 'selected' : ''}`} onClick={() => toggleFiltro('tipo', o)}>{o}</button>
        ))}
      </div>

      <button className="btn btn-primario" onClick={buscarConIA}>
        ✨ Ver sugerencias
      </button>
    </div>
  )
}

function Seguimiento({ pesoRegistros, guardarPeso }) {
  const [nuevoPeso, setNuevoPeso] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleGuardar = async () => {
    if (!nuevoPeso || isNaN(nuevoPeso)) return
    setGuardando(true)
    await guardarPeso(parseFloat(nuevoPeso))
    setNuevoPeso('')
    setGuardando(false)
  }

  const ultimoPeso = pesoRegistros.length > 0 ? pesoRegistros[pesoRegistros.length - 1].peso : PERFIL.pesoInicial
  const perdido = PERFIL.pesoInicial - ultimoPeso
  const falta = ultimoPeso - PERFIL.pesoObjetivo
  const progreso = Math.max(0, Math.min(100, (perdido / (PERFIL.pesoInicial - PERFIL.pesoObjetivo)) * 100))

  return (
    <div>
      <div className="card card-acento" style={{ textAlign: 'center', padding: '24px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: COLORES.textoSuave, marginBottom: 8 }}>Peso actual</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: COLORES.acento, lineHeight: 1 }}>{ultimoPeso}</div>
        <div style={{ fontSize: 18, color: COLORES.textoSuave, marginTop: 4 }}>kg</div>
        <div className="progreso-wrap" style={{ marginTop: 16 }}>
          <div className="progreso-bar" style={{ height: 6 }}>
            <div className="progreso-fill" style={{ width: `${progreso}%` }} />
          </div>
          <div className="progreso-labels">
            <span>{PERFIL.pesoInicial} kg</span>
            <span style={{ color: COLORES.acento }}>{progreso.toFixed(0)}%</span>
            <span>{PERFIL.pesoObjetivo} kg</span>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat-box" style={{ textAlign: 'center' }}>
          <div className="stat-valor" style={{ color: COLORES.verde }}>-{perdido > 0 ? perdido.toFixed(1) : '0'}<span className="stat-unidad">kg</span></div>
          <div className="stat-label">Perdidos</div>
        </div>
        <div className="stat-box" style={{ textAlign: 'center' }}>
          <div className="stat-valor">{falta > 0 ? falta.toFixed(1) : '✓'}<span className="stat-unidad">{falta > 0 ? 'kg' : ''}</span></div>
          <div className="stat-label">Hasta el objetivo</div>
        </div>
      </div>

      <p className="seccion-titulo">Registrar peso</p>
      <div className="card">
        <div className="input-grupo">
          <div className="input-label">Peso de hoy (kg)</div>
          <input
            type="number"
            step="0.1"
            className="input"
            placeholder="74.5"
            value={nuevoPeso}
            onChange={e => setNuevoPeso(e.target.value)}
          />
        </div>
        <button className="btn btn-primario" onClick={handleGuardar} disabled={guardando || !nuevoPeso}>
          {guardando ? 'Guardando...' : '+ Registrar'}
        </button>
      </div>

      {pesoRegistros.length > 0 && (
        <>
          <p className="seccion-titulo">Historial</p>
          <div className="card">
            <div className="peso-lista">
              {[...pesoRegistros].reverse().slice(0, 10).map((r, i, arr) => {
                const anterior = arr[i + 1]
                const diff = anterior ? r.peso - anterior.peso : 0
                return (
                  <div key={r.id} className="peso-item">
                    <div>
                      <div className="peso-valor">{r.peso} kg</div>
                      <div className="peso-fecha">{new Date(r.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                    </div>
                    {anterior && (
                      <div className={diff < 0 ? 'peso-diff-pos' : diff > 0 ? 'peso-diff-neg' : ''}>
                        {diff < 0 ? '↓' : diff > 0 ? '↑' : '–'} {Math.abs(diff).toFixed(1)} kg
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Perfil() {
  const ultimoPeso = PERFIL.pesoInicial
  const imc = (ultimoPeso / ((PERFIL.altura / 100) ** 2)).toFixed(1)

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="perfil-header">
          <div className="perfil-avatar">👩</div>
          <div className="perfil-nombre">{PERFIL.nombre}</div>
          <div className="perfil-objetivo">Objetivo: {PERFIL.pesoObjetivo} kg · Proyecto 65</div>
        </div>
      </div>

      <p className="seccion-titulo">Datos personales</p>
      <div className="card">
        {[
          ['Edad', '24 años'],
          ['Altura', '160 cm'],
          ['Peso inicial', `${PERFIL.pesoInicial} kg`],
          ['IMC actual', imc],
          ['Actividad', 'Moderada · 3-4 días gym'],
        ].map(([label, valor]) => (
          <div key={label} className="row" style={{ padding: '10px 0', borderBottom: `1px solid ${COLORES.borde}` }}>
            <span style={{ fontSize: 13, color: COLORES.textoSuave }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{valor}</span>
          </div>
        ))}
        <div className="row" style={{ padding: '10px 0' }}>
          <span style={{ fontSize: 13, color: COLORES.textoSuave }}>Objetivo</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: COLORES.acento }}>{PERFIL.pesoObjetivo} kg</span>
        </div>
      </div>

      <p className="seccion-titulo">Objetivos nutricionales diarios</p>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: COLORES.textoSuave }}>Calorías</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: COLORES.acento }}>{PERFIL.caloriasBase} kcal</span>
        </div>
        <div className="macro-grid">
          <div className="macro-box">
            <div className="macro-valor tag-proteina">{PERFIL.proteinas}g</div>
            <div className="macro-label">Proteína</div>
          </div>
          <div className="macro-box">
            <div className="macro-valor tag-carbo">{PERFIL.carbos}g</div>
            <div className="macro-label">Carbos</div>
          </div>
          <div className="macro-box">
            <div className="macro-valor tag-grasa">{PERFIL.grasas}g</div>
            <div className="macro-label">Grasas</div>
          </div>
        </div>
      </div>

      <p className="seccion-titulo">Filosofía</p>
      <div className="card">
        {['Nunca pasar hambre', 'No prohibir alimentos', 'Poco tiempo de cocina', 'Batch cooking dominical', 'Sostenible durante años'].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${COLORES.borde}` }}>
            <span style={{ color: COLORES.acento }}>✓</span>
            <span style={{ fontSize: 13 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===================== APP PRINCIPAL =====================

export default function App() {
  const [pantalla, setPantalla] = useState('dashboard')
  const [menuSemanal, setMenuSemanal] = useState({ ...MENU_BASE })
  const [pesoRegistros, setPesoRegistros] = useState([])
  const [fitlabData] = useState({ caloriasQuemadas: 0 })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const { data: menuData } = await supabase
      .from('p65_menu_semanal')
      .select('*')
      .eq('usuario', 'paula')
      .single()
    if (menuData?.menu) setMenuSemanal(menuData.menu)

    const { data: pesoData } = await supabase
      .from('p65_peso')
      .select('*')
      .eq('usuario', 'paula')
      .order('fecha', { ascending: true })
    if (pesoData) setPesoRegistros(pesoData)
  }

  const guardarMenu = async (nuevoMenu) => {
    await supabase
      .from('p65_menu_semanal')
      .upsert({ usuario: 'paula', menu: nuevoMenu, actualizado: new Date().toISOString() }, { onConflict: 'usuario' })
  }

  const guardarPeso = async (peso) => {
    const { data } = await supabase
      .from('p65_peso')
      .insert({ usuario: 'paula', peso, fecha: new Date().toISOString() })
      .select()
    if (data) setPesoRegistros(prev => [...prev, data[0]])
  }

  const nav = [
    { id: 'dashboard', icon: '🏠', label: 'Inicio' },
    { id: 'menu', icon: '📅', label: 'Menú' },
    { id: 'quecomohoy', icon: '✨', label: '¿Qué como?' },
    { id: 'seguimiento', icon: '📊', label: 'Peso' },
    { id: 'perfil', icon: '👤', label: 'Perfil' },
  ]

  const headers = {
    dashboard: { titulo: 'Proyecto 65', sub: 'Tu sistema de alimentación' },
    menu: { titulo: 'Menú semanal', sub: 'Toca cualquier comida para editar' },
    quecomohoy: { titulo: '¿Qué como hoy?', sub: 'Filtros inteligentes con IA' },
    seguimiento: { titulo: 'Seguimiento', sub: 'Tu evolución hacia los 65 kg' },
    perfil: { titulo: 'Mi perfil', sub: 'Datos y objetivos' },
  }

  const h = headers[pantalla]

  const hoy = new Date()
  const fechaCorta = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div>
            <div className="header-logo">{h.titulo}</div>
            <div className="header-sub">{h.sub}</div>
          </div>
          <div className="header-fecha">{fechaCorta}</div>
        </div>

        <div className="content">
          {pantalla === 'dashboard' && <Dashboard menuSemanal={menuSemanal} pesoRegistros={pesoRegistros} fitlabData={fitlabData} />}
          {pantalla === 'menu' && <MenuSemanal menuSemanal={menuSemanal} setMenuSemanal={setMenuSemanal} guardarMenu={guardarMenu} />}
          {pantalla === 'quecomohoy' && <QueComoHoy menuSemanal={menuSemanal} />}
          {pantalla === 'seguimiento' && <Seguimiento pesoRegistros={pesoRegistros} guardarPeso={guardarPeso} />}
          {pantalla === 'perfil' && <Perfil />}
        </div>

        <nav className="nav">
          {nav.map(n => (
            <div key={n.id} className={`nav-item ${pantalla === n.id ? 'active' : ''}`} onClick={() => setPantalla(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
