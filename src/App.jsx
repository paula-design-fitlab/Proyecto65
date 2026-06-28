import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const PERFIL = {
  nombre:'Paula', edad:24, altura:160, pesoInicial:74.5, pesoObjetivo:65,
  caloriasBase:1550, proteinas:130, carbos:150, grasas:55,
}

const MENU_BASE = {
  lunes:     { comida:'Ensalada de pollo con aguacate y maíz', merienda:'Yogur griego + fresas', cena:'Tortilla francesa + tomate natural' },
  martes:    { comida:'Salmón a la plancha + verduras asadas', merienda:'Melón + almendras', cena:'Gazpacho + pavo a la plancha' },
  miercoles: { comida:'Merluza al horno con limón + arroz integral', merienda:'Yogur griego + arándanos', cena:'Revuelto de gambas y champiñones' },
  jueves:    { comida:'Poke bowl de atún, arroz y aguacate', merienda:'Sandía', cena:'Ensalada de queso fresco y tomate + pavo' },
  viernes:   { comida:'Pollo al horno + ensalada fresca', merienda:'Frambuesas + nueces', cena:'Sepia a la plancha + verduras' },
  sabado:    { comida:'Ensalada de pasta integral con bonito y tomate', merienda:'Yogur griego + melocotón', cena:'Huevos revueltos con champiñones' },
  domingo:   { comida:'Solomillo de cerdo con patata asada', merienda:'Fruta de temporada', cena:'Crema fría de calabacín + queso fresco' },
}

const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
const DIAS_LABEL = { lunes:'Lun', martes:'Mar', miercoles:'Mié', jueves:'Jue', viernes:'Vie', sabado:'Sáb', domingo:'Dom' }
const DIAS_FULL = { lunes:'Lunes', martes:'Martes', miercoles:'Miércoles', jueves:'Jueves', viernes:'Viernes', sabado:'Sábado', domingo:'Domingo' }

const CATEGORIAS = ['comida','cena','merienda','desayuno','dulce','batch cooking','exprés']
const CATEGORIAS_EMOJI = { comida:'🍽', cena:'🌙', merienda:'🍎', desayuno:'☀️', dulce:'🍫', 'batch cooking':'🍲', 'exprés':'⚡' }
const METODOS = ['sartén','horno','freidora de aire','vaporera','microondas','sin cocinar']
const ESTADOS = ['pendiente','probada','favorita','descartada']
const ESTADO_COLOR = { pendiente:'#9B9B9B', probada:'#4A7A9B', favorita:'#B5643A', descartada:'#C05050' }
const ESTADO_EMOJI = { pendiente:'📋', probada:'✅', favorita:'⭐', descartada:'❌' }

const ETIQUETAS_SUGERIDAS = [
  'alto en proteína','baja preparación','post gimnasio','dulce para café',
  'económica','ligera','sin gluten','vegetariana','menos de 20 min',
  'sin cocinar','ideal táper','congelable'
]

const P = {
  blanco:'#FFFFFF', fondo:'#FDF8F5', fondoCard:'#FFFFFF',
  melocoton:'#FFCBA4', melocotonSuave:'#FFF0E6',
  sage:'#B5C9B7', sageSuave:'#EDF3EE',
  lavanda:'#C5B8D8', lavandaSuave:'#F0EBF8',
  crema:'#F5EDD6', cremaSuave:'#FDFAF2',
  rosa:'#F2B8C6', rosaSuave:'#FDF0F4',
  texto:'#2D2D2D', textoSuave:'#9B9B9B', textoMedio:'#6B6B6B', borde:'#EEE8E2',
  acento:'#E8956D',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${P.fondo}; color: ${P.texto}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: ${P.borde}; border-radius: 2px; }
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: ${P.fondo}; position: relative; }
  .header { padding: 52px 24px 0; }
  .header-greeting { font-size: 13px; color: ${P.textoSuave}; letter-spacing: 0.5px; margin-bottom: 4px; }
  .header-titulo { font-family: 'Playfair Display', serif; font-size: 28px; color: ${P.texto}; font-weight: 400; }
  .header-titulo span { font-style: italic; color: ${P.acento}; }
  .content { padding: 20px 20px 100px; }
  .nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: ${P.blanco}; border-top: 1px solid ${P.borde}; display: flex; padding: 10px 0 24px; z-index: 100; box-shadow: 0 -8px 24px rgba(0,0,0,0.04); }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 4px 0; cursor: pointer; }
  .nav-icon { font-size: 20px; }
  .nav-label { font-size: 10px; color: ${P.textoSuave}; font-weight: 400; transition: color 0.2s; }
  .nav-item.active .nav-label { color: ${P.texto}; font-weight: 600; }
  .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: ${P.acento}; margin-top: 2px; opacity: 0; }
  .nav-item.active .nav-dot { opacity: 1; }
  .seccion { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: ${P.textoSuave}; margin: 24px 0 12px; font-weight: 500; }
  .seccion:first-child { margin-top: 0; }
  .card { background: ${P.fondoCard}; border-radius: 20px; padding: 18px; margin-bottom: 12px; border: 1px solid ${P.borde}; }
  .card-melocoton { background: ${P.melocotonSuave}; border-color: ${P.melocoton}66; }
  .card-sage { background: ${P.sageSuave}; border-color: ${P.sage}66; }
  .card-lavanda { background: ${P.lavandaSuave}; border-color: ${P.lavanda}66; }
  .card-crema { background: ${P.cremaSuave}; border-color: #E8D9B066; }

  .comida-card { background: ${P.fondoCard}; border-radius: 18px; border: 1px solid ${P.borde}; padding: 14px 16px; margin-bottom: 10px; transition: box-shadow 0.2s; }
  .comida-card.hecha { background: ${P.sageSuave}; border-color: ${P.sage}66; }
  .comida-card.proxima { border-color: ${P.melocoton}; background: ${P.melocotonSuave}; }
  .comida-top { display: flex; align-items: flex-start; gap: 12px; }
  .comida-emoji { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 19px; flex-shrink: 0; }
  .comida-emoji-comida { background: ${P.melocotonSuave}; }
  .comida-emoji-merienda { background: ${P.sageSuave}; }
  .comida-emoji-cena { background: ${P.lavandaSuave}; }
  .comida-hora { font-size: 11px; color: ${P.textoSuave}; margin-bottom: 2px; font-weight: 500; }
  .comida-texto { font-size: 14px; color: ${P.texto}; line-height: 1.3; }
  .comida-acciones { display: flex; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid ${P.borde}; align-items: center; }
  .check-btn { flex: 1; padding: 8px; border-radius: 10px; border: 1px solid ${P.borde}; background: transparent; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: ${P.textoMedio}; transition: all 0.2s; text-align: center; }
  .check-btn.activo { background: ${P.sageSuave}; border-color: ${P.sage}; color: #3A6B3E; font-weight: 500; }
  .nota-input { width: 100%; margin-top: 8px; background: ${P.fondo}; border: 1px solid ${P.borde}; border-radius: 10px; padding: 8px 12px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: ${P.texto}; outline: none; resize: none; }
  .estrella { font-size: 20px; cursor: pointer; opacity: 0.3; transition: opacity 0.15s; }
  .estrella.on { opacity: 1; }

  .progreso-bar { height: 6px; background: ${P.borde}; border-radius: 3px; overflow: hidden; }
  .progreso-fill { height: 100%; background: linear-gradient(90deg, ${P.melocoton}, ${P.rosa}); border-radius: 3px; transition: width 0.6s ease; }
  .progreso-nums { display: flex; justify-content: space-between; font-size: 11px; color: ${P.textoSuave}; margin-top: 6px; }
  .stat-row { display: flex; gap: 10px; margin-bottom: 10px; }
  .stat-box { flex: 1; background: ${P.fondoCard}; border: 1px solid ${P.borde}; border-radius: 16px; padding: 14px; text-align: center; }
  .stat-num { font-size: 22px; font-weight: 600; }
  .stat-unit { font-size: 12px; font-weight: 400; color: ${P.textoSuave}; }
  .stat-label { font-size: 11px; color: ${P.textoSuave}; margin-top: 2px; }

  .dias-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 16px; scrollbar-width: none; }
  .dias-scroll::-webkit-scrollbar { display: none; }
  .dia-pill { flex-shrink: 0; padding: 8px 16px; border-radius: 20px; border: 1px solid ${P.borde}; background: ${P.fondoCard}; color: ${P.textoMedio}; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .dia-pill.active { background: ${P.texto}; border-color: ${P.texto}; color: white; font-weight: 500; }

  .btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; border-radius: 14px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; transition: all 0.2s; width: 100%; }
  .btn-primario { background: ${P.texto}; color: white; }
  .btn-primario:hover { opacity: 0.88; } .btn-primario:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-secundario { background: ${P.fondoCard}; color: ${P.texto}; border: 1px solid ${P.borde}; }
  .btn-sm { padding: 8px 14px; font-size: 13px; border-radius: 10px; width: auto; }

  .input { width: 100%; background: ${P.fondo}; border: 1px solid ${P.borde}; border-radius: 12px; padding: 13px 16px; color: ${P.texto}; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; }
  .input:focus { border-color: ${P.texto}; }
  .input-sm { padding: 10px 14px; font-size: 14px; border-radius: 10px; }
  .input-label { font-size: 12px; color: ${P.textoSuave}; margin-bottom: 6px; font-weight: 500; }
  .input-grupo { margin-bottom: 16px; }
  .select { width: 100%; background: ${P.fondo}; border: 1px solid ${P.borde}; border-radius: 12px; padding: 13px 16px; color: ${P.texto}; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; appearance: none; }

  .chip-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
  .chip { padding: 7px 14px; border-radius: 20px; border: 1px solid ${P.borde}; background: ${P.fondoCard}; color: ${P.textoMedio}; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .chip.sel { background: ${P.melocotonSuave}; border-color: ${P.melocoton}; color: ${P.texto}; font-weight: 500; }
  .chip-cat { padding: 6px 12px; font-size: 12px; }

  .ia-burbuja { background: ${P.fondoCard}; border: 1px solid ${P.borde}; border-radius: 18px; border-top-left-radius: 4px; padding: 16px 18px; }
  .ia-dots { display: flex; gap: 6px; padding: 16px 18px; }
  .ia-dot { width: 7px; height: 7px; border-radius: 50%; background: ${P.melocoton}; animation: bounce 1.2s ease-in-out infinite; }
  .ia-dot:nth-child(2) { animation-delay: 0.15s; } .ia-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4}40%{transform:scale(1);opacity:1} }

  /* RECETARIO */
  .receta-card { background: ${P.fondoCard}; border: 1px solid ${P.borde}; border-radius: 18px; padding: 16px; margin-bottom: 10px; cursor: pointer; transition: box-shadow 0.2s; }
  .receta-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .receta-card.sel { border-color: ${P.sage}; background: ${P.sageSuave}; }
  .receta-foto { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 12px; background: ${P.fondo}; display: flex; align-items: center; justify-content: center; font-size: 40px; }
  .receta-nombre { font-size: 16px; font-weight: 600; margin-bottom: 6px; line-height: 1.3; }
  .receta-desc { font-size: 13px; color: ${P.textoMedio}; margin-bottom: 10px; line-height: 1.4; }
  .receta-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .rtag { font-size: 11px; padding: 3px 10px; border-radius: 10px; font-weight: 500; }
  .rtag-cat { background: ${P.melocotonSuave}; color: #B5643A; }
  .rtag-tiempo { background: ${P.cremaSuave}; color: #8B7355; }
  .rtag-taper { background: ${P.sageSuave}; color: #4A7A4E; }
  .rtag-batch { background: ${P.lavandaSuave}; color: #6B5B8A; }
  .rtag-estado-favorita { background: #FFF9E6; color: #B5863A; }
  .rtag-estado-probada { background: ${P.sageSuave}; color: #4A7A4E; }
  .rtag-estado-pendiente { background: ${P.fondo}; color: ${P.textoSuave}; }
  .rtag-estado-descartada { background: #FFF0F0; color: #C05050; }

  .macro-mini { display: flex; gap: 8px; margin-top: 8px; }
  .macro-mini-box { flex: 1; background: ${P.fondo}; border-radius: 8px; padding: 6px; text-align: center; }
  .macro-mini-num { font-size: 14px; font-weight: 600; }
  .macro-mini-lbl { font-size: 10px; color: ${P.textoSuave}; }

  /* DETALLE RECETA */
  .pantalla-full { position: fixed; inset: 0; background: ${P.fondo}; z-index: 300; overflow-y: auto; max-width: 430px; margin: 0 auto; }
  .detalle-header { padding: 52px 20px 16px; display: flex; align-items: center; gap: 12px; background: white; border-bottom: 1px solid ${P.borde}; }
  .back-btn { width: 36px; height: 36px; border-radius: 50%; background: ${P.fondo}; border: 1px solid ${P.borde}; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; flex-shrink: 0; }
  .detalle-content { padding: 20px 20px 60px; }
  .paso-item { display: flex; gap: 12px; margin-bottom: 14px; }
  .paso-num { width: 28px; height: 28px; border-radius: 50%; background: ${P.melocotonSuave}; color: #B5643A; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .ing-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid ${P.borde}; font-size: 14px; }
  .ing-dot { width: 6px; height: 6px; border-radius: 50%; background: ${P.melocoton}; flex-shrink: 0; }

  /* FORMULARIO */
  .form-section { font-size: 13px; font-weight: 600; color: ${P.texto}; margin: 20px 0 10px; padding-bottom: 6px; border-bottom: 1px solid ${P.borde}; }
  .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid ${P.borde}; }
  .toggle-label { font-size: 14px; }
  .toggle { width: 44px; height: 24px; border-radius: 12px; background: ${P.borde}; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .toggle.on { background: ${P.sage}; }
  .toggle-knob { width: 20px; height: 20px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .toggle.on .toggle-knob { left: 22px; }
  .stars-input { display: flex; gap: 8px; }
  .star-inp { font-size: 28px; cursor: pointer; opacity: 0.25; transition: opacity 0.15s; }
  .star-inp.on { opacity: 1; }

  /* FILTROS */
  .filtros-bar { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; margin-bottom: 12px; }
  .filtros-bar::-webkit-scrollbar { display: none; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.25); z-index: 200; display: flex; align-items: flex-end; backdrop-filter: blur(2px); }
  .modal { background: white; border-radius: 24px 24px 0 0; padding: 20px 20px 40px; width: 100%; max-width: 430px; margin: 0 auto; max-height: 85vh; overflow-y: auto; }
  .modal-handle { width: 36px; height: 4px; background: ${P.borde}; border-radius: 2px; margin: 0 auto 18px; }
  .modal-titulo { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
  .modal-sub { font-size: 13px; color: ${P.textoSuave}; margin-bottom: 16px; }

  .peso-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid ${P.borde}; }
  .peso-item:last-child { border-bottom: none; }
  .peso-val { font-size: 17px; font-weight: 600; }
  .peso-fecha { font-size: 12px; color: ${P.textoSuave}; }
  .tag-verde { color: #4A7A4E; } .tag-rojo { color: #C05050; }

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
`

// ─── HELPERS ───────────────────────────────────────────────────────────────
function RenderMD({ texto }) {
  return (
    <div>
      {texto.split('\n').map((l, i) => {
        if (!l.trim()) return <div key={i} style={{ height:8 }} />
        if (l.startsWith('## ')) return <div key={i} style={{ fontSize:15, fontWeight:600, marginTop:14, marginBottom:4 }}>{l.replace('## ','').replace(/\*\*/g,'')}</div>
        if (l.startsWith('# '))  return <div key={i} style={{ fontSize:16, fontWeight:700, marginTop:14, marginBottom:4 }}>{l.replace('# ','').replace(/\*\*/g,'')}</div>
        if (l.match(/^[-–•] /))  return <div key={i} style={{ display:'flex', gap:8, marginBottom:3 }}><span style={{ color:P.acento, flexShrink:0 }}>·</span><span style={{ fontSize:14, lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: l.replace(/^[-–•] /,'').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>') }} /></div>
        if (l.startsWith('---')) return <div key={i} style={{ height:1, background:P.borde, margin:'10px 0' }} />
        return <p key={i} style={{ fontSize:14, lineHeight:1.7, marginBottom:2 }} dangerouslySetInnerHTML={{ __html: l.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>') }} />
      })}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <div className={`toggle ${value?'on':''}`} onClick={() => onChange(!value)}>
      <div className="toggle-knob" />
    </div>
  )
}

// ─── DETALLE RECETA ────────────────────────────────────────────────────────
function DetalleReceta({ receta, onClose, onEdit, onDelete }) {
  const ings = receta.ingredientes || []
  const pasos = receta.elaboracion || []

  return (
    <div className="pantalla-full">
      <div className="detalle-header">
        <div className="back-btn" onClick={onClose}>←</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:P.textoSuave, marginBottom:2 }}>{CATEGORIAS_EMOJI[receta.categoria]} {receta.categoria}</div>
          <div style={{ fontSize:17, fontWeight:600, lineHeight:1.3 }}>{receta.nombre}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-secundario btn-sm" onClick={onEdit}>Editar</button>
        </div>
      </div>

      <div className="detalle-content">
        {receta.foto_url
          ? <img src={receta.foto_url} alt={receta.nombre} style={{ width:'100%', height:200, objectFit:'cover', borderRadius:16, marginBottom:16 }} />
          : <div style={{ width:'100%', height:160, background:P.melocotonSuave, borderRadius:16, marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:56 }}>{CATEGORIAS_EMOJI[receta.categoria]||'🍽'}</div>
        }

        {receta.descripcion && <p style={{ fontSize:14, color:P.textoMedio, lineHeight:1.6, marginBottom:16 }}>{receta.descripcion}</p>}

        <div className="receta-tags" style={{ marginBottom:16 }}>
          {receta.tiempo && <span className="rtag rtag-tiempo">⏱ {receta.tiempo} min</span>}
          {receta.dificultad && <span className="rtag rtag-cat">{receta.dificultad}</span>}
          {receta.raciones && <span className="rtag rtag-tiempo">👤 {receta.raciones} ración{receta.raciones>1?'es':''}</span>}
          {receta.taper && <span className="rtag rtag-taper">🥡 Táper</span>}
          {receta.batch && <span className="rtag rtag-batch">🍲 Batch</span>}
          {receta.congelable && <span className="rtag rtag-batch">❄️ Congelable</span>}
          {receta.estado && <span className={`rtag rtag-estado-${receta.estado}`}>{ESTADO_EMOJI[receta.estado]} {receta.estado}</span>}
        </div>

        {(receta.calorias || receta.proteina || receta.carbos || receta.grasas) && (
          <>
            <p className="seccion">Nutrición por ración</p>
            <div className="macro-mini">
              {receta.calorias && <div className="macro-mini-box"><div className="macro-mini-num" style={{ color:P.acento }}>{receta.calorias}</div><div className="macro-mini-lbl">kcal</div></div>}
              {receta.proteina && <div className="macro-mini-box"><div className="macro-mini-num" style={{ color:'#B5643A' }}>{receta.proteina}g</div><div className="macro-mini-lbl">proteína</div></div>}
              {receta.carbos && <div className="macro-mini-box"><div className="macro-mini-num" style={{ color:'#4A7A4E' }}>{receta.carbos}g</div><div className="macro-mini-lbl">carbos</div></div>}
              {receta.grasas && <div className="macro-mini-box"><div className="macro-mini-num" style={{ color:'#6B5B8A' }}>{receta.grasas}g</div><div className="macro-mini-lbl">grasas</div></div>}
              {receta.fibra && <div className="macro-mini-box"><div className="macro-mini-num" style={{ color:'#4A7A9B' }}>{receta.fibra}g</div><div className="macro-mini-lbl">fibra</div></div>}
            </div>
          </>
        )}

        {ings.length > 0 && (
          <>
            <p className="seccion">Ingredientes</p>
            {ings.map((ing, i) => (
              <div key={i} className="ing-item">
                <div className="ing-dot" />
                <span>{typeof ing === 'object' ? `${ing.cantidad || ''} ${ing.nombre || ing}`.trim() : ing}</span>
              </div>
            ))}
          </>
        )}

        {pasos.length > 0 && (
          <>
            <p className="seccion">Elaboración</p>
            {pasos.map((paso, i) => (
              <div key={i} className="paso-item">
                <div className="paso-num">{i+1}</div>
                <div style={{ fontSize:14, lineHeight:1.6, paddingTop:4 }}>{typeof paso === 'object' ? paso.texto || paso.descripcion : paso}</div>
              </div>
            ))}
          </>
        )}

        {(receta.metodo?.length > 0 || receta.conservacion_nevera) && (
          <>
            <p className="seccion">Conservación y método</p>
            <div className="card">
              {receta.metodo?.length > 0 && (
                <div className="fila-dato"><span className="fila-label">Método</span><span className="fila-valor">{receta.metodo.join(', ')}</span></div>
              )}
              {receta.conservacion_nevera && (
                <div className="fila-dato"><span className="fila-label">Nevera</span><span className="fila-valor">{receta.conservacion_nevera}</span></div>
              )}
            </div>
          </>
        )}

        {receta.etiquetas?.length > 0 && (
          <>
            <p className="seccion">Etiquetas</p>
            <div className="chip-wrap">
              {receta.etiquetas.map(e => <span key={e} className="chip" style={{ cursor:'default' }}>{e}</span>)}
            </div>
          </>
        )}

        {(receta.valoracion || receta.observaciones) && (
          <>
            <p className="seccion">Mi valoración</p>
            <div className="card">
              {receta.valoracion && <div style={{ fontSize:22, marginBottom:receta.observaciones?8:0 }}>{'⭐'.repeat(receta.valoracion)}</div>}
              {receta.observaciones && <p style={{ fontSize:14, color:P.textoMedio, fontStyle:'italic', lineHeight:1.5 }}>"{receta.observaciones}"</p>}
            </div>
          </>
        )}

        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <button className="btn btn-secundario" onClick={onEdit}>✏️ Editar receta</button>
          <button className="btn btn-secundario" style={{ color:'#C05050', borderColor:'#C0505044' }} onClick={onDelete}>🗑 Eliminar</button>
        </div>
      </div>
    </div>
  )
}


// ─── IMPORTAR CON IA ───────────────────────────────────────────────────────
function ImportarConIA({ onImportada, onCancelar }) {
  const [descripcion, setDescripcion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const generar = async () => {
    if (!descripcion.trim()) return
    setCargando(true); setError('')
    const prompt = `Eres el asistente de recetas de Proyecto 65. El usuario describe una receta y tú generas la ficha completa.

Descripción: "${descripcion}"

Responde SOLO con un JSON válido, sin texto adicional, sin markdown:
{"nombre":"...","descripcion":"...","categoria":"comida","raciones":1,"tiempo":20,"dificultad":"fácil","ingredientes":["200g pollo"],"elaboracion":["Paso 1"],"calorias":400,"proteina":35,"carbos":20,"grasas":12,"fibra":3,"metodo":["sartén"],"taper":true,"batch":false,"congelable":false,"conservacion_nevera":"3 días","etiquetas":["alto en proteína"],"estado":"pendiente"}

Categorías válidas: comida, cena, merienda, desayuno, dulce, batch cooking, exprés
Métodos válidos: sartén, horno, freidora de aire, vaporera, microondas, sin cocinar
Adapta al perfil: Paula 24a, objetivo perder grasa, le gustan pollo/salmón/merluza/atún/bonito/gambas/sepia/huevos/solomillo, no pepino ni espinacas.`

    try {
      const res = await fetch('/.netlify/functions/claude', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages:[{ role:'user', content:prompt }] })
      })
      const data = await res.json()
      const texto = data.content?.[0]?.text || ''
      const jsonMatch = texto.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('no json')
      const receta = JSON.parse(jsonMatch[0])
      onImportada(receta)
    } catch {
      setError('No pude generar la receta. Inténtalo de nuevo con más detalle.')
    }
    setCargando(false)
  }

  const ejemplos = [
    'Pollo al limón con arroz, 20 minutos, para táper',
    'Salmón al horno con patatas, fácil, batch cooking',
    'Yogur griego con fresas y granola, merienda rápida',
    'Tortilla de champiñones y pimiento, cena ligera',
  ]

  return (
    <div className="pantalla-full">
      <div className="detalle-header">
        <div className="back-btn" onClick={onCancelar}>←</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:P.textoSuave, marginBottom:2 }}>Recetario</div>
          <div style={{ fontSize:17, fontWeight:600 }}>Importar con IA ✨</div>
        </div>
      </div>
      <div className="detalle-content">
        <div className="card card-melocoton" style={{ marginBottom:20, textAlign:'center', padding:20 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>✨</div>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>Describe la receta</div>
          <div style={{ fontSize:13, color:P.textoMedio }}>La IA rellena todos los campos. Tú solo revisas y guardas.</div>
        </div>
        <div className="input-grupo">
          <div className="input-label">Describe la receta en tus palabras</div>
          <textarea className="input" rows={4} style={{ resize:'none' }}
            placeholder="Ej: Pollo al limón con arroz, 20 min, sirve para táper, alta proteína..."
            value={descripcion} onChange={e => setDescripcion(e.target.value)} autoFocus />
        </div>
        {error && <div style={{ background:'#FFF0F0', border:'1px solid #F2B8B8', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#C05050', marginBottom:12 }}>{error}</div>}
        <button className="btn btn-primario" onClick={generar} disabled={cargando||!descripcion.trim()} style={{ marginBottom:16 }}>
          {cargando ? 'Generando receta...' : '✨ Generar receta'}
        </button>
        <p className="seccion">Ejemplos — toca para usar</p>
        {ejemplos.map((e,i) => (
          <div key={i} style={{ background:P.fondoCard, border:`1px solid ${P.borde}`, borderRadius:12, padding:'10px 14px', marginBottom:8, cursor:'pointer', fontSize:13, color:P.textoMedio }} onClick={() => setDescripcion(e)}>
            "{e}"
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── FORMULARIO RECETA ─────────────────────────────────────────────────────
function FormReceta({ recetaInicial, onGuardar, onCancelar }) {
  const vacio = {
    nombre:'', descripcion:'', categoria:'comida', raciones:1, tiempo:'', dificultad:'fácil',
    ingredientes:[''], elaboracion:[''], calorias:'', proteina:'', carbos:'', grasas:'', fibra:'',
    metodo:[], taper:false, batch:false, congelable:false, conservacion_nevera:'',
    etiquetas:[], valoracion:0, observaciones:'', estado:'pendiente', foto_url:''
  }
  const [form, setForm] = useState(recetaInicial ? {
    ...vacio, ...recetaInicial,
    ingredientes: recetaInicial.ingredientes?.length > 0
      ? recetaInicial.ingredientes.map(i => typeof i === 'object' ? `${i.cantidad||''} ${i.nombre||''}`.trim() : i)
      : [''],
    elaboracion: recetaInicial.elaboracion?.length > 0
      ? recetaInicial.elaboracion.map(p => typeof p === 'object' ? p.texto||p.descripcion||'' : p)
      : [''],
    metodo: recetaInicial.metodo || [],
    etiquetas: recetaInicial.etiquetas || [],
    tiempo: recetaInicial.tiempo || '',
    calorias: recetaInicial.calorias || '',
    proteina: recetaInicial.proteina || '',
    carbos: recetaInicial.carbos || '',
    grasas: recetaInicial.grasas || '',
    fibra: recetaInicial.fibra || '',
  } : vacio)

  const [guardando, setGuardando] = useState(false)
  const [etiquetaInput, setEtiquetaInput] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addIng = () => set('ingredientes', [...form.ingredientes, ''])
  const setIng = (i, v) => set('ingredientes', form.ingredientes.map((x,j) => j===i?v:x))
  const removeIng = (i) => set('ingredientes', form.ingredientes.filter((_,j) => j!==i))

  const addPaso = () => set('elaboracion', [...form.elaboracion, ''])
  const setPaso = (i, v) => set('elaboracion', form.elaboracion.map((x,j) => j===i?v:x))
  const removePaso = (i) => set('elaboracion', form.elaboracion.filter((_,j) => j!==i))

  const toggleMetodo = (m) => set('metodo', form.metodo.includes(m) ? form.metodo.filter(x=>x!==m) : [...form.metodo, m])
  const toggleEtiqueta = (e) => set('etiquetas', form.etiquetas.includes(e) ? form.etiquetas.filter(x=>x!==e) : [...form.etiquetas, e])
  const addEtiquetaCustom = () => {
    if (etiquetaInput.trim() && !form.etiquetas.includes(etiquetaInput.trim())) {
      set('etiquetas', [...form.etiquetas, etiquetaInput.trim()])
      setEtiquetaInput('')
    }
  }

  const guardar = async () => {
    if (!form.nombre.trim()) return
    setGuardando(true)
    const payload = {
      ...form,
      usuario: 'paula',
      ingredientes: form.ingredientes.filter(i => i.trim()),
      elaboracion: form.elaboracion.filter(p => p.trim()),
      tiempo: form.tiempo ? parseInt(form.tiempo) : null,
      calorias: form.calorias ? parseInt(form.calorias) : null,
      proteina: form.proteina ? parseFloat(form.proteina) : null,
      carbos: form.carbos ? parseFloat(form.carbos) : null,
      grasas: form.grasas ? parseFloat(form.grasas) : null,
      fibra: form.fibra ? parseFloat(form.fibra) : null,
      raciones: parseInt(form.raciones) || 1,
      updated_at: new Date().toISOString(),
    }
    let data, error
    if (recetaInicial?.id) {
      ({ data, error } = await supabase.from('p65_recetas').update(payload).eq('id', recetaInicial.id).select().single())
    } else {
      ({ data, error } = await supabase.from('p65_recetas').insert(payload).select().single())
    }
    setGuardando(false)
    if (!error && data) onGuardar(data)
  }

  return (
    <div className="pantalla-full">
      <div className="detalle-header">
        <div className="back-btn" onClick={onCancelar}>←</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:P.textoSuave, marginBottom:2 }}>Recetario</div>
          <div style={{ fontSize:17, fontWeight:600 }}>{recetaInicial?.id ? 'Editar receta' : 'Nueva receta'}</div>
        </div>
        <button className="btn btn-primario btn-sm" onClick={guardar} disabled={guardando||!form.nombre.trim()}>
          {guardando ? '...' : 'Guardar'}
        </button>
      </div>

      <div className="detalle-content">
        <div className="form-section">Información básica</div>
        <div className="input-grupo">
          <div className="input-label">Nombre *</div>
          <input className="input" placeholder="Pollo con arroz y brócoli" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>
        <div className="input-grupo">
          <div className="input-label">Descripción breve</div>
          <textarea className="input" rows={2} style={{ resize:'none' }} placeholder="Un plato completo, fácil de preparar..." value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
        </div>
        <div className="input-grupo">
          <div className="input-label">URL foto (opcional)</div>
          <input className="input" placeholder="https://..." value={form.foto_url} onChange={e => set('foto_url', e.target.value)} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div className="input-grupo">
            <div className="input-label">Categoría</div>
            <select className="select" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{CATEGORIAS_EMOJI[c]} {c}</option>)}
            </select>
          </div>
          <div className="input-grupo">
            <div className="input-label">Dificultad</div>
            <select className="select" value={form.dificultad} onChange={e => set('dificultad', e.target.value)}>
              <option value="fácil">Fácil</option>
              <option value="media">Media</option>
            </select>
          </div>
          <div className="input-grupo">
            <div className="input-label">Tiempo (min)</div>
            <input className="input" type="number" placeholder="20" value={form.tiempo} onChange={e => set('tiempo', e.target.value)} />
          </div>
          <div className="input-grupo">
            <div className="input-label">Raciones</div>
            <input className="input" type="number" min="1" placeholder="1" value={form.raciones} onChange={e => set('raciones', e.target.value)} />
          </div>
        </div>

        <div className="form-section">Ingredientes</div>
        {form.ingredientes.map((ing, i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
            <input className="input input-sm" style={{ flex:1 }} placeholder={`Ingrediente ${i+1}`} value={ing} onChange={e => setIng(i, e.target.value)} />
            {form.ingredientes.length > 1 && <button className="btn btn-secundario btn-sm" style={{ width:'auto', padding:'8px 12px' }} onClick={() => removeIng(i)}>✕</button>}
          </div>
        ))}
        <button className="btn btn-secundario btn-sm" style={{ marginBottom:8 }} onClick={addIng}>+ Añadir ingrediente</button>

        <div className="form-section">Elaboración paso a paso</div>
        {form.elaboracion.map((paso, i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
            <div className="paso-num" style={{ marginTop:6 }}>{i+1}</div>
            <textarea className="input input-sm" style={{ flex:1, resize:'none', minHeight:64 }} placeholder={`Paso ${i+1}...`} value={paso} onChange={e => setPaso(i, e.target.value)} />
            {form.elaboracion.length > 1 && <button className="btn btn-secundario btn-sm" style={{ width:'auto', padding:'8px 12px', marginTop:2 }} onClick={() => removePaso(i)}>✕</button>}
          </div>
        ))}
        <button className="btn btn-secundario btn-sm" style={{ marginBottom:8 }} onClick={addPaso}>+ Añadir paso</button>

        <div className="form-section">Nutrición por ración</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[['calorias','Calorías (kcal)'],['proteina','Proteína (g)'],['carbos','Carbos (g)'],['grasas','Grasas (g)'],['fibra','Fibra (g)']].map(([k,lbl]) => (
            <div key={k} className="input-grupo">
              <div className="input-label">{lbl}</div>
              <input className="input" type="number" step="0.1" placeholder="0" value={form[k]} onChange={e => set(k, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="form-section">Método de cocinado</div>
        <div className="chip-wrap">
          {METODOS.map(m => <button key={m} className={`chip ${form.metodo.includes(m)?'sel':''}`} onClick={() => toggleMetodo(m)}>{m}</button>)}
        </div>

        <div className="form-section">Organización</div>
        <div className="card" style={{ padding:'4px 16px' }}>
          {[['taper','🥡 Sirve para táper'],['batch','🍲 Sirve para batch cooking'],['congelable','❄️ Se puede congelar']].map(([k,lbl]) => (
            <div key={k} className="toggle-row">
              <span className="toggle-label">{lbl}</span>
              <Toggle value={form[k]} onChange={v => set(k, v)} />
            </div>
          ))}
        </div>
        <div className="input-grupo" style={{ marginTop:12 }}>
          <div className="input-label">Conservación en nevera</div>
          <input className="input" placeholder="Ej: 3-4 días bien tapado" value={form.conservacion_nevera} onChange={e => set('conservacion_nevera', e.target.value)} />
        </div>

        <div className="form-section">Etiquetas</div>
        <div className="chip-wrap">
          {ETIQUETAS_SUGERIDAS.map(e => <button key={e} className={`chip ${form.etiquetas.includes(e)?'sel':''}`} onClick={() => toggleEtiqueta(e)}>{e}</button>)}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          <input className="input input-sm" style={{ flex:1 }} placeholder="Etiqueta personalizada..." value={etiquetaInput} onChange={e => setEtiquetaInput(e.target.value)} onKeyDown={e => e.key==='Enter' && addEtiquetaCustom()} />
          <button className="btn btn-secundario btn-sm" style={{ width:'auto' }} onClick={addEtiquetaCustom}>+</button>
        </div>

        <div className="form-section">Estado y valoración</div>
        <div className="input-grupo">
          <div className="input-label">Estado</div>
          <select className="select" value={form.estado} onChange={e => set('estado', e.target.value)}>
            {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_EMOJI[e]} {e}</option>)}
          </select>
        </div>
        <div className="input-grupo">
          <div className="input-label">Valoración personal</div>
          <div className="stars-input">
            {[1,2,3,4,5].map(n => (
              <span key={n} className={`star-inp ${form.valoracion >= n ? 'on' : ''}`} onClick={() => set('valoracion', form.valoracion === n ? 0 : n)}>⭐</span>
            ))}
          </div>
        </div>
        <div className="input-grupo">
          <div className="input-label">Observaciones personales</div>
          <textarea className="input" rows={3} style={{ resize:'none' }} placeholder="La próxima vez añadir más especias..." value={form.observaciones} onChange={e => set('observaciones', e.target.value)} />
        </div>

        <div style={{ display:'flex', gap:10, marginTop:8 }}>
          <button className="btn btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button className="btn btn-primario" onClick={guardar} disabled={guardando||!form.nombre.trim()}>{guardando?'Guardando...':'Guardar receta'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── RECETARIO ─────────────────────────────────────────────────────────────
function Recetario() {
  const [recetas, setRecetas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [vista, setVista] = useState('lista') // lista | detalle | form | importar
  const [recetaActiva, setRecetaActiva] = useState(null)
  const [filtros, setFiltros] = useState({ categoria:'', busqueda:'', etiqueta:'', taper:false, batch:false, congelable:false })

  useEffect(() => { cargarRecetas() }, [])

  const cargarRecetas = async () => {
    setCargando(true)
    const { data } = await supabase.from('p65_recetas').select('*').eq('usuario','paula').order('created_at', { ascending: false })
    if (data) setRecetas(data)
    setCargando(false)
  }

  const onGuardar = (receta) => {
    setRecetas(prev => {
      const existe = prev.find(r => r.id === receta.id)
      return existe ? prev.map(r => r.id === receta.id ? receta : r) : [receta, ...prev]
    })
    setRecetaActiva(receta)
    setVista('detalle')
  }

  const onEliminar = async () => {
    if (!recetaActiva) return
    await supabase.from('p65_recetas').delete().eq('id', recetaActiva.id)
    setRecetas(prev => prev.filter(r => r.id !== recetaActiva.id))
    setVista('lista')
    setRecetaActiva(null)
  }

  const onImportarIA = (datosIA) => {
    setRecetaActiva(datosIA)
    setVista('form')
  }

  const filtradas = recetas.filter(r => {
    if (filtros.categoria && r.categoria !== filtros.categoria) return false
    if (filtros.busqueda && !r.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false
    if (filtros.etiqueta && !r.etiquetas?.includes(filtros.etiqueta)) return false
    if (filtros.taper && !r.taper) return false
    if (filtros.batch && !r.batch) return false
    if (filtros.congelable && !r.congelable) return false
    return true
  })

  if (vista === 'importar') return (
    <ImportarConIA
      onImportada={onImportarIA}
      onCancelar={() => setVista('lista')}
    />
  )

  if (vista === 'form') return (
    <FormReceta
      recetaInicial={recetaActiva}
      onGuardar={onGuardar}
      onCancelar={() => { setVista(recetaActiva?.id ? 'detalle' : 'lista') }}
    />
  )

  if (vista === 'detalle' && recetaActiva) return (
    <DetalleReceta
      receta={recetaActiva}
      onClose={() => { setVista('lista'); setRecetaActiva(null) }}
      onEdit={() => setVista('form')}
      onDelete={onEliminar}
    />
  )

  return (
    <>
      <div className="header">
        <div className="header-greeting">Tu biblioteca inteligente</div>
        <div className="header-titulo">Recetario <span>personal</span></div>
      </div>
      <div className="content">
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          <input className="input" placeholder="Buscar receta..." value={filtros.busqueda} onChange={e => setFiltros(f => ({ ...f, busqueda:e.target.value }))} style={{ flex:1 }} />
          <button className="btn btn-secundario btn-sm" style={{ width:'auto', padding:'12px 14px' }} onClick={() => setVista('importar')}>✨ IA</button>
          <button className="btn btn-primario btn-sm" style={{ width:'auto', padding:'12px 14px' }} onClick={() => { setRecetaActiva(null); setVista('form') }}>+</button>
        </div>

        <div className="filtros-bar">
          <button className={`chip chip-cat ${!filtros.categoria?'sel':''}`} onClick={() => setFiltros(f => ({ ...f, categoria:'' }))}>Todas</button>
          {CATEGORIAS.map(c => (
            <button key={c} className={`chip chip-cat ${filtros.categoria===c?'sel':''}`} onClick={() => setFiltros(f => ({ ...f, categoria: f.categoria===c?'':c }))}>
              {CATEGORIAS_EMOJI[c]} {c}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {[['taper','🥡 Táper'],['batch','🍲 Batch'],['congelable','❄️ Congelable']].map(([k,lbl]) => (
            <button key={k} className={`chip ${filtros[k]?'sel':''}`} onClick={() => setFiltros(f => ({ ...f, [k]:!f[k] }))}>{lbl}</button>
          ))}
        </div>

        {cargando ? (
          <div className="card" style={{ textAlign:'center', padding:32 }}>
            <div className="ia-dots" style={{ justifyContent:'center' }}><div className="ia-dot"/><div className="ia-dot"/><div className="ia-dot"/></div>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:32 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📖</div>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>{recetas.length === 0 ? 'Tu recetario está vacío' : 'Sin resultados'}</div>
            <div style={{ fontSize:13, color:P.textoSuave, marginBottom:16 }}>{recetas.length === 0 ? 'Añade tu primera receta para empezar tu biblioteca personal' : 'Prueba con otros filtros'}</div>
            {recetas.length === 0 && <button className="btn btn-primario" onClick={() => { setRecetaActiva(null); setVista('form') }}>+ Añadir primera receta</button>}
          </div>
        ) : (
          <>
            <p className="seccion">{filtradas.length} receta{filtradas.length!==1?'s':''}</p>
            {filtradas.map(r => (
              <div key={r.id} className="receta-card" onClick={() => { setRecetaActiva(r); setVista('detalle') }}>
                {r.foto_url && <img src={r.foto_url} alt={r.nombre} className="receta-foto" onError={e => e.target.style.display='none'} />}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                  <div className="receta-nombre" style={{ flex:1 }}>{r.nombre}</div>
                  <span className={`rtag rtag-estado-${r.estado}`} style={{ marginLeft:8, flexShrink:0 }}>{ESTADO_EMOJI[r.estado]}</span>
                </div>
                {r.descripcion && <div className="receta-desc">{r.descripcion}</div>}
                <div className="receta-tags">
                  <span className="rtag rtag-cat">{CATEGORIAS_EMOJI[r.categoria]} {r.categoria}</span>
                  {r.tiempo && <span className="rtag rtag-tiempo">⏱ {r.tiempo} min</span>}
                  {r.calorias && <span className="rtag rtag-tiempo">🔥 {r.calorias} kcal</span>}
                  {r.taper && <span className="rtag rtag-taper">🥡 Táper</span>}
                  {r.batch && <span className="rtag rtag-batch">🍲 Batch</span>}
                  {r.valoracion > 0 && <span className="rtag rtag-estado-favorita">{'⭐'.repeat(r.valoracion)}</span>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}

// ─── HOY ───────────────────────────────────────────────────────────────────
function Hoy({ menuSemanal, pesoRegistros, registroHoy, setRegistroHoy, seguimientoHoy, setSeguimientoHoy }) {
  const hoy = new Date()
  const diasJS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
  const diaHoy = diasJS[hoy.getDay()]
  const fechaStr = hoy.toISOString().split('T')[0]
  const menuHoy = menuSemanal[diaHoy] || MENU_BASE[diaHoy]
  const hora = hoy.getHours()
  const proxima = hora < 13 ? 'comida' : hora < 18 ? 'merienda' : 'cena'
  const saludos = hora < 14 ? 'Buenos días' : hora < 21 ? 'Buenas tardes' : 'Buenas noches'
  const [notaAbierta, setNotaAbierta] = useState(null)
  const [notaTexto, setNotaTexto] = useState('')
  const [seguimientoAbierto, setSeguimientoAbierto] = useState(false)

  const getReg = (tipo) => registroHoy.find(r => r.tipo === tipo)

  const upsertReg = async (tipo, cambios) => {
    const reg = getReg(tipo)
    const payload = { usuario:'paula', fecha:fechaStr, tipo, comido:reg?.comido||false, nota:reg?.nota||null, puntuacion:reg?.puntuacion||null, ...cambios }
    const { data } = await supabase.from('p65_registro_diario').upsert(payload, { onConflict:'usuario,fecha,tipo' }).select()
    if (data) setRegistroHoy(prev => [...prev.filter(r => r.tipo!==tipo), data[0]])
  }

  const upsertSeguimiento = async (cambios) => {
    const payload = { usuario:'paula', fecha:fechaStr, ...seguimientoHoy, ...cambios }
    const { data } = await supabase.from('p65_seguimiento').upsert(payload, { onConflict:'usuario,fecha' }).select()
    if (data) setSeguimientoHoy(data[0])
  }

  const comidas = [
    { tipo:'comida',   emoji:'🍽', hora:'12:30', cls:'comida-emoji-comida',   label:'Comida principal' },
    { tipo:'merienda', emoji:'🍎', hora:'17:00', cls:'comida-emoji-merienda', label:'Merienda' },
    { tipo:'cena',     emoji:'🌙', hora:'00:00', cls:'comida-emoji-cena',      label:'Cena' },
  ]

  const comidas_hechas = registroHoy.filter(r => r.comido).length
  const seg = seguimientoHoy || {}

  const nivelLabel = (v) => v === 1 ? 'Muy bajo' : v === 2 ? 'Bajo' : v === 3 ? 'Normal' : v === 4 ? 'Bueno' : v === 5 ? 'Excelente' : '—'
  const hambreLabel = (v) => v === 1 ? 'Sin hambre' : v === 2 ? 'Poca' : v === 3 ? 'Normal' : v === 4 ? 'Bastante' : v === 5 ? 'Mucha' : '—'

  const seguimientoCompleto = seg.energia || seg.hambre || seg.entrenamiento !== undefined

  return (
    <>
      <div className="header">
        <div className="header-greeting">{saludos}, Paula 🌸</div>
        <div className="header-titulo">Hoy es <span>{DIAS_FULL[diaHoy]}</span></div>
      </div>
      <div className="content">

        {/* SEGUIMIENTO DEL DÍA — siempre visible, colapsable */}
        <div className="card" style={{ marginBottom:12, padding:0, overflow:'hidden' }}>
          <div
            style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', cursor:'pointer' }}
            onClick={() => setSeguimientoAbierto(!seguimientoAbierto)}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>📊</span>
              <div>
                <div style={{ fontSize:14, fontWeight:500 }}>Cómo estoy hoy</div>
                {!seguimientoAbierto && seguimientoCompleto && (
                  <div style={{ fontSize:11, color:P.textoSuave, marginTop:1 }}>
                    {seg.energia ? `Energía ${seg.energia}/5` : ''}{seg.hambre ? ` · Hambre ${seg.hambre}/5` : ''}{seg.entrenamiento ? ' · 💪 Entrenamiento' : ''}
                  </div>
                )}
                {!seguimientoAbierto && !seguimientoCompleto && (
                  <div style={{ fontSize:11, color:P.textoSuave, marginTop:1 }}>Toca para registrar</div>
                )}
              </div>
            </div>
            <span style={{ fontSize:14, color:P.textoSuave, transition:'transform 0.2s', display:'inline-block', transform:seguimientoAbierto?'rotate(180deg)':'none' }}>▾</span>
          </div>

          {seguimientoAbierto && (
            <div style={{ padding:'0 16px 16px', borderTop:`1px solid ${P.borde}` }}>
              {/* Energía */}
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:12, color:P.textoSuave, marginBottom:8, fontWeight:500 }}>ENERGÍA · {nivelLabel(seg.energia)}</div>
                <div style={{ display:'flex', gap:8 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => upsertSeguimiento({ energia: seg.energia===n ? null : n })}
                      style={{ flex:1, height:36, borderRadius:10, border:`1px solid ${seg.energia>=n ? P.melocoton : P.borde}`, background: seg.energia>=n ? P.melocotonSuave : 'transparent', cursor:'pointer', fontSize:16 }}>
                      {n <= (seg.energia||0) ? '⚡' : '○'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hambre */}
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:12, color:P.textoSuave, marginBottom:8, fontWeight:500 }}>HAMBRE · {hambreLabel(seg.hambre)}</div>
                <div style={{ display:'flex', gap:8 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => upsertSeguimiento({ hambre: seg.hambre===n ? null : n })}
                      style={{ flex:1, height:36, borderRadius:10, border:`1px solid ${seg.hambre>=n ? P.lavanda : P.borde}`, background: seg.hambre>=n ? P.lavandaSuave : 'transparent', cursor:'pointer', fontSize:16 }}>
                      {n <= (seg.hambre||0) ? '🍽' : '○'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entrenamiento */}
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:12, color:P.textoSuave, marginBottom:8, fontWeight:500 }}>ENTRENAMIENTO</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => upsertSeguimiento({ entrenamiento: true })}
                    style={{ flex:1, padding:'10px', borderRadius:10, border:`1px solid ${seg.entrenamiento===true ? P.sage : P.borde}`, background: seg.entrenamiento===true ? P.sageSuave : 'transparent', cursor:'pointer', fontSize:13, fontWeight: seg.entrenamiento===true ? 600 : 400, color: seg.entrenamiento===true ? '#3A6B3E' : P.textoMedio }}>
                    💪 Sí, he entrenado
                  </button>
                  <button onClick={() => upsertSeguimiento({ entrenamiento: false })}
                    style={{ flex:1, padding:'10px', borderRadius:10, border:`1px solid ${seg.entrenamiento===false ? P.borde : P.borde}`, background: seg.entrenamiento===false ? P.fondo : 'transparent', cursor:'pointer', fontSize:13, color: P.textoMedio }}>
                    😴 Día de descanso
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {comidas_hechas > 0 && (
          <div style={{ background:P.sageSuave, borderRadius:14, padding:'10px 14px', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:16 }}>✅</span>
            <span style={{ fontSize:13, color:'#3A6B3E' }}>{comidas_hechas} de 3 comidas registradas hoy</span>
          </div>
        )}

        <p className="seccion">Tus comidas de hoy</p>
        {comidas.map(({ tipo, emoji, hora, cls, label }) => {
          const reg = getReg(tipo)
          const hecha = reg?.comido
          return (
            <div key={tipo} className={`comida-card ${hecha?'hecha':proxima===tipo&&!hecha?'proxima':''}`}>
              <div className="comida-top">
                <div className={`comida-emoji ${cls}`}>{hecha?'✅':emoji}</div>
                <div style={{ flex:1 }}>
                  <div className="comida-hora">{label} · {hora}</div>
                  <div className="comida-texto">{menuHoy[tipo]}</div>
                  {reg?.nota && <div style={{ fontSize:12, color:P.textoSuave, marginTop:4, fontStyle:'italic' }}>"{reg.nota}"</div>}
                  {reg?.puntuacion > 0 && <div style={{ fontSize:12, marginTop:2 }}>{"⭐".repeat(reg.puntuacion)}</div>}
                </div>
              </div>
              <div className="comida-acciones">
                <button className={`check-btn ${hecha?'activo':''}`} onClick={() => upsertReg(tipo, { comido:!hecha })}>
                  {hecha?'✓ Comido':'Marcar'}
                </button>
                <div style={{ display:'flex', gap:3 }}>
                  {[1,2,3,4,5].map(n => (
                    <span key={n} className={`estrella ${(reg?.puntuacion||0)>=n?'on':''}`} onClick={() => upsertReg(tipo, { puntuacion:n })}>⭐</span>
                  ))}
                </div>
                <button className="check-btn" style={{ flex:'0 0 auto', padding:'8px 10px' }} onClick={() => { setNotaTexto(reg?.nota||''); setNotaAbierta(notaAbierta===tipo?null:tipo) }}>
                  {reg?.nota?'📝':'+ Nota'}
                </button>
              </div>
              {notaAbierta === tipo && (
                <div style={{ marginTop:10 }}>
                  <textarea className="nota-input" rows={2} placeholder="¿Cambié algo? ¿Cómo me sentó?..." value={notaTexto} onChange={e => setNotaTexto(e.target.value)} autoFocus />
                  <div style={{ display:'flex', gap:8, marginTop:6 }}>
                    <button className="btn btn-secundario btn-sm" onClick={() => setNotaAbierta(null)}>Cancelar</button>
                    <button className="btn btn-primario btn-sm" onClick={() => { upsertReg(tipo, { nota:notaTexto }); setNotaAbierta(null) }}>Guardar</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        <div className="stat-row" style={{ marginTop:8 }}>
          <div className="stat-box"><div className="stat-num">1550 <span className="stat-unit">kcal</span></div><div className="stat-label">Objetivo diario</div></div>
          <div className="stat-box"><div className="stat-num">130 <span className="stat-unit">g</span></div><div className="stat-label">Proteína</div></div>
        </div>
      </div>
    </>
  )
}

// ─── MENÚ ──────────────────────────────────────────────────────────────────
function Menu({ menuSemanal, setMenuSemanal, guardarMenu, recetas }) {
  const diasJS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
  const diaHoy = diasJS[new Date().getDay()]
  const [diaActivo, setDiaActivo] = useState(diaHoy)
  const [editando, setEditando] = useState(null)
  const [recetaSel, setRecetaSel] = useState(null)
  const [filtroRapido, setFiltroRapido] = useState('')
  const menuDia = menuSemanal[diaActivo] || MENU_BASE[diaActivo]

  const confirmar = async () => {
    if (!recetaSel) return
    const nuevo = { ...menuSemanal, [diaActivo]: { ...(menuSemanal[diaActivo]||MENU_BASE[diaActivo]), [editando]: recetaSel.nombre } }
    setMenuSemanal(nuevo); await guardarMenu(nuevo); setEditando(null)
  }

  const recetasDisp = recetas.length > 0 ? recetas : []
  const filtradas = recetasDisp.filter(r => !filtroRapido || r.nombre.toLowerCase().includes(filtroRapido.toLowerCase()))

  const comidas = [
    { tipo:'comida',   emoji:'🍽', hora:'12:30', cls:'comida-emoji-comida',   label:'Comida principal' },
    { tipo:'merienda', emoji:'🍎', hora:'17:00', cls:'comida-emoji-merienda', label:'Merienda' },
    { tipo:'cena',     emoji:'🌙', hora:'00:00', cls:'comida-emoji-cena',      label:'Cena' },
  ]

  return (
    <>
      <div className="header">
        <div className="header-greeting">Planificación semanal</div>
        <div className="header-titulo">Menú <span>semanal</span></div>
      </div>
      <div className="content">
        <div className="dias-scroll">
          {DIAS.map(d => <button key={d} className={`dia-pill ${diaActivo===d?'active':''}`} onClick={() => setDiaActivo(d)}>{DIAS_LABEL[d]}</button>)}
        </div>
        <p className="seccion">{DIAS_FULL[diaActivo]}</p>
        {comidas.map(({ tipo, emoji, hora, cls, label }) => (
          <div key={tipo} className="comida-card" style={{ cursor:'pointer' }} onClick={() => { setEditando(tipo); setRecetaSel(null); setFiltroRapido('') }}>
            <div className="comida-top">
              <div className={`comida-emoji ${cls}`}>{emoji}</div>
              <div style={{ flex:1 }}>
                <div className="comida-hora">{label} · {hora}</div>
                <div className="comida-texto">{menuDia[tipo]}</div>
              </div>
              <div style={{ fontSize:12, color:P.textoSuave }}>Cambiar →</div>
            </div>
          </div>
        ))}
      </div>

      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-titulo">Cambiar {editando==='comida'?'comida principal':editando}</div>
            <div className="modal-sub">Ahora: {menuDia[editando]}</div>
            <input className="input input-sm" placeholder="Buscar en recetario..." value={filtroRapido} onChange={e => setFiltroRapido(e.target.value)} style={{ marginBottom:12 }} />
            <div style={{ maxHeight:320, overflowY:'auto' }}>
              {filtradas.length > 0 ? filtradas.map(r => (
                <div key={r.id} className={`receta-card ${recetaSel?.id===r.id?'sel':''}`} onClick={() => setRecetaSel(r)}>
                  <div className="receta-nombre">{r.nombre}</div>
                  <div className="receta-tags">
                    {r.tiempo && <span className="rtag rtag-tiempo">⏱ {r.tiempo} min</span>}
                    <span className="rtag rtag-cat">{r.categoria}</span>
                    {r.taper && <span className="rtag rtag-taper">🥡 Táper</span>}
                  </div>
                </div>
              )) : (
                <div style={{ textAlign:'center', padding:'24px 0', color:P.textoSuave, fontSize:14 }}>
                  {recetas.length===0 ? 'Añade recetas al recetario para poder elegir' : 'Sin resultados'}
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10, marginTop:12 }}>
              <button className="btn btn-secundario" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn btn-primario" onClick={confirmar} disabled={!recetaSel}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── ¿QUÉ COMO? ────────────────────────────────────────────────────────────
function QueComoHoy({ menuSemanal }) {
  const [filtros, setFiltros] = useState({ tiempo:'', proteina:'', cond:'' })
  const [modo, setModo] = useState('filtros')
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)
  const toggle = (k, v) => setFiltros(f => ({ ...f, [k]:f[k]===v?'':v }))

  const buscar = async () => {
    setCargando(true); setModo('resultado'); setRespuesta('')
    const menuTexto = DIAS.map(d => { const m=menuSemanal[d]||MENU_BASE[d]; return `${DIAS_FULL[d]}: ${m.comida}/${m.merienda}/${m.cena}` }).join('\n')
    const prompt = `Eres el asistente nutricional de Proyecto 65 para Paula (24a, 160cm, 74.5kg→65kg, fuerza 3-4días/semana). Horario: comida 12:30, merienda 17:00 táper, cena 00:00. Le gustan: pollo, solomillo, salmón, merluza, atún, bonito, gambas, sepia, huevos. No: pepino, espinacas. Objetivo: ~1550kcal/día, ~130g proteína.
Menú semanal: ${menuTexto}
Filtros: ${filtros.tiempo||'cualquier tiempo'}, ${filtros.proteina||'cualquier proteína'}, ${filtros.cond||'sin condición especial'}.
Sugiere 2-3 opciones con: nombre, ingredientes principales, tiempo, si sirve para táper. Directo y práctico. En español.`
    try {
      const res = await fetch('/.netlify/functions/claude', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ messages:[{ role:'user', content:prompt }] }) })
      const data = await res.json()
      setRespuesta(data.content?.[0]?.text||'No pude generar sugerencias.')
    } catch { setRespuesta('Error al conectar. Inténtalo de nuevo.') }
    setCargando(false)
  }

  return (
    <>
      <div className="header">
        <div className="header-greeting">Asistente inteligente</div>
        <div className="header-titulo">¿Qué como <span>hoy?</span></div>
      </div>
      <div className="content">
        {modo==='resultado' ? (
          <>
            <button className="btn btn-secundario" style={{ marginBottom:16 }} onClick={() => { setModo('filtros'); setRespuesta('') }}>← Volver</button>
            <p className="seccion">Sugerencias para ti</p>
            {cargando ? <div className="card"><div className="ia-dots"><div className="ia-dot"/><div className="ia-dot"/><div className="ia-dot"/></div></div>
              : <div className="ia-burbuja"><RenderMD texto={respuesta} /></div>}
            {!cargando && <button className="btn btn-secundario" style={{ marginTop:10 }} onClick={buscar}>🔄 Otras opciones</button>}
          </>
        ) : (
          <>
            <div className="card card-melocoton" style={{ marginBottom:20, padding:'20px', textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>✨</div>
              <div style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>Cuéntame qué necesitas</div>
              <div style={{ fontSize:13, color:P.textoMedio }}>Filtra y la IA te sugiere opciones perfectas para ti</div>
            </div>
            <p className="seccion">Tiempo disponible</p>
            <div className="chip-wrap">{['5 min','10 min','20 min','30 min+'].map(v => <button key={v} className={`chip ${filtros.tiempo===v?'sel':''}`} onClick={() => toggle('tiempo',v)}>{v}</button>)}</div>
            <p className="seccion">Proteína principal</p>
            <div className="chip-wrap">{['Pollo','Salmón','Merluza','Atún','Gambas','Sepia','Solomillo','Huevos','Bonito'].map(v => <button key={v} className={`chip ${filtros.proteina===v?'sel':''}`} onClick={() => toggle('proteina',v)}>{v}</button>)}</div>
            <p className="seccion">Condiciones</p>
            <div className="chip-wrap">{['Para táper','Batch cooking','Sin cocinar','Plato único','Post gimnasio'].map(v => <button key={v} className={`chip ${filtros.cond===v?'sel':''}`} onClick={() => toggle('cond',v)}>{v}</button>)}</div>
            <button className="btn btn-primario" onClick={buscar}>Ver sugerencias</button>
          </>
        )}
      </div>
    </>
  )
}

// ─── BATCH COOKING ─────────────────────────────────────────────────────────
function BatchCooking({ recetas }) {
  const [seleccionadas, setSeleccionadas] = useState([])
  const [modo, setModo] = useState('elegir')
  const [plan, setPlan] = useState('')
  const [cargando, setCargando] = useState(false)
  const toggle = (r) => setSeleccionadas(prev => prev.find(x=>x.id===r.id)?prev.filter(x=>x.id!==r.id):[...prev,r])

  const recetasBatch = recetas.filter(r => r.batch)

  const generarPlan = async () => {
    setCargando(true); setModo('plan'); setPlan('')
    const lista = seleccionadas.map(r => `- ${r.nombre} (${r.tiempo||'?'} min, ingredientes: ${(r.ingredientes||[]).map(i=>typeof i==='object'?i.nombre||i:i).join(', ')})`).join('\n')
    const prompt = `Eres el asistente de batch cooking de Proyecto 65 para Paula. Va a preparar este domingo:\n${lista}\nCrea un plan optimizado: organiza en orden inteligente (primero el horno, mientras tanto lo demás). Para cada paso: número, qué hacer, tiempo estimado, consejo práctico. Al final: tiempo total y conservación de cada preparación. Práctico y concreto. En español.`
    try {
      const res = await fetch('/.netlify/functions/claude', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ messages:[{ role:'user', content:prompt }] }) })
      const data = await res.json()
      setPlan(data.content?.[0]?.text||'No pude generar el plan.')
    } catch { setPlan('Error al conectar.') }
    setCargando(false)
  }

  return (
    <>
      <div className="header">
        <div className="header-greeting">Organiza tu domingo</div>
        <div className="header-titulo">Batch <span>cooking</span></div>
      </div>
      <div className="content">
        {modo==='plan' ? (
          <>
            <button className="btn btn-secundario" style={{ marginBottom:16 }} onClick={() => { setModo('elegir'); setPlan('') }}>← Cambiar selección</button>
            <div className="card card-melocoton" style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, color:'#B5643A', fontWeight:500, marginBottom:4 }}>Preparando este domingo</div>
              {seleccionadas.map(r => <div key={r.id} style={{ fontSize:14, padding:'2px 0' }}>· {r.nombre}</div>)}
            </div>
            <p className="seccion">Tu plan de cocina</p>
            {cargando ? <div className="card"><div className="ia-dots"><div className="ia-dot"/><div className="ia-dot"/><div className="ia-dot"/></div></div>
              : <div className="ia-burbuja"><RenderMD texto={plan} /></div>}
            {!cargando && <button className="btn btn-secundario" style={{ marginTop:10 }} onClick={generarPlan}>🔄 Regenerar plan</button>}
          </>
        ) : (
          <>
            <div className="card card-lavanda" style={{ marginBottom:20, padding:'18px', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:6 }}>🍳</div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>¿Qué cocinas este domingo?</div>
              <div style={{ fontSize:13, color:P.textoMedio }}>Elige del recetario y la IA organiza el orden perfecto</div>
            </div>
            {recetasBatch.length === 0 ? (
              <div className="card" style={{ textAlign:'center', padding:24 }}>
                <div style={{ fontSize:13, color:P.textoSuave }}>Aún no tienes recetas marcadas para batch cooking en tu recetario</div>
              </div>
            ) : (
              <>
                <p className="seccion">Tus recetas de batch cooking</p>
                {recetasBatch.map(r => (
                  <div key={r.id} className={`receta-card ${seleccionadas.find(x=>x.id===r.id)?'sel':''}`} onClick={() => toggle(r)}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div className="receta-nombre" style={{ flex:1 }}>{r.nombre}</div>
                      <div style={{ fontSize:18, marginLeft:8 }}>{seleccionadas.find(x=>x.id===r.id)?'✅':'⬜'}</div>
                    </div>
                    <div className="receta-tags">
                      {r.tiempo && <span className="rtag rtag-tiempo">⏱ {r.tiempo} min</span>}
                      <span className="rtag rtag-cat">{r.categoria}</span>
                      {r.calorias && <span className="rtag rtag-tiempo">🔥 {r.calorias} kcal</span>}
                    </div>
                  </div>
                ))}
              </>
            )}
            {seleccionadas.length > 0 && (
              <div style={{ position:'sticky', bottom:80, paddingTop:12 }}>
                <button className="btn btn-primario" onClick={generarPlan}>
                  🍳 Generar plan para {seleccionadas.length} receta{seleccionadas.length!==1?'s':''}
                </button>
              </div>
            )}
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
  const ultimoPeso = pesoRegistros.length>0?pesoRegistros[pesoRegistros.length-1].peso:PERFIL.pesoInicial
  const perdido = +(PERFIL.pesoInicial-ultimoPeso).toFixed(1)
  const progreso = Math.max(0,Math.min(100,(perdido/(PERFIL.pesoInicial-PERFIL.pesoObjetivo))*100))
  const handle = async () => { if(!nuevoPeso||isNaN(nuevoPeso))return; setGuardando(true); await guardarPeso(parseFloat(nuevoPeso)); setNuevoPeso(''); setGuardando(false) }
  return (
    <>
      <div className="header" style={{ paddingBottom:0 }}>
        <div className="header-greeting">Tu información</div>
        <div className="header-titulo">Mi <span>perfil</span></div>
      </div>
      <div className="content">
        <div style={{ textAlign:'center', padding:'12px 0 24px' }}>
          <div style={{ width:76, height:76, borderRadius:'50%', background:P.melocotonSuave, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, margin:'0 auto 12px', border:`2px solid ${P.melocoton}66` }}>🌸</div>
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:26 }}>Paula</div>
          <div style={{ fontSize:13, color:P.textoSuave, marginTop:2 }}>Objetivo: {PERFIL.pesoObjetivo} kg · Proyecto 65</div>
        </div>
        <p className="seccion">Registrar peso</p>
        <div className="card">
          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <div style={{ flex:1 }}><div className="input-label">Peso de hoy (kg)</div><input type="number" step="0.1" className="input" placeholder="74.5" value={nuevoPeso} onChange={e=>setNuevoPeso(e.target.value)} /></div>
            <button className="btn btn-primario" style={{ width:'auto', padding:'13px 20px' }} onClick={handle} disabled={guardando||!nuevoPeso}>{guardando?'...':'+ Añadir'}</button>
          </div>
        </div>
        <p className="seccion">Evolución</p>
        <div className="card card-crema">
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
            <div><div style={{ fontSize:12, color:P.textoSuave }}>Ahora</div><div style={{ fontSize:28, fontWeight:600 }}>{ultimoPeso} <span style={{ fontSize:14, color:P.textoSuave, fontWeight:400 }}>kg</span></div></div>
            <div style={{ textAlign:'right' }}><div style={{ fontSize:12, color:P.textoSuave }}>Perdidos</div><div style={{ fontSize:28, fontWeight:600, color:'#4A7A4E' }}>{perdido>0?'-'+perdido:'0'} <span style={{ fontSize:14, color:P.textoSuave, fontWeight:400 }}>kg</span></div></div>
          </div>
          <div className="progreso-bar"><div className="progreso-fill" style={{ width:`${progreso}%` }} /></div>
          <div className="progreso-nums"><span>{PERFIL.pesoInicial} kg</span><span>{PERFIL.pesoObjetivo} kg</span></div>
        </div>
        {pesoRegistros.length>0&&(<>
          <p className="seccion">Historial</p>
          <div className="card">
            {[...pesoRegistros].reverse().slice(0,8).map((r,i,arr)=>{const prev=arr[i+1];const diff=prev?+(r.peso-prev.peso).toFixed(1):null;return(<div key={r.id} className="peso-item"><div><div className="peso-val">{r.peso} kg</div><div className="peso-fecha">{new Date(r.fecha).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})}</div></div>{diff!==null&&<div className={`${diff<0?'tag-verde':diff>0?'tag-rojo':''}`} style={{ fontSize:12, fontWeight:500 }}>{diff<0?'↓':diff>0?'↑':'–'} {Math.abs(diff)} kg</div>}</div>)})}
          </div>
        </>)}
        <p className="seccion">Datos personales</p>
        <div className="card">
          {[['Edad','24 años'],['Altura','160 cm'],['Peso inicial',`${PERFIL.pesoInicial} kg`],['Objetivo',`${PERFIL.pesoObjetivo} kg`],['Actividad','Fuerza 3-4 días/semana']].map(([l,v])=>(<div key={l} className="fila-dato"><span className="fila-label">{l}</span><span className="fila-valor">{v}</span></div>))}
        </div>
        <p className="seccion">Objetivos nutricionales</p>
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}><span style={{ fontSize:14, color:P.textoMedio }}>Calorías diarias</span><span style={{ fontSize:20, fontWeight:600 }}>{PERFIL.caloriasBase} <span style={{ fontSize:12, color:P.textoSuave, fontWeight:400 }}>kcal</span></span></div>
          <div className="macro-row">
            <div className="macro-box" style={{ background:P.melocotonSuave }}><div className="macro-num" style={{ color:'#B5643A' }}>{PERFIL.proteinas}g</div><div className="macro-lbl" style={{ color:'#B5643A' }}>Proteína</div></div>
            <div className="macro-box" style={{ background:P.sageSuave }}><div className="macro-num" style={{ color:'#4A7A4E' }}>{PERFIL.carbos}g</div><div className="macro-lbl" style={{ color:'#4A7A4E' }}>Carbos</div></div>
            <div className="macro-box" style={{ background:P.lavandaSuave }}><div className="macro-num" style={{ color:'#6B5B8A' }}>{PERFIL.grasas}g</div><div className="macro-lbl" style={{ color:'#6B5B8A' }}>Grasas</div></div>
          </div>
        </div>
        <p className="seccion">Filosofía</p>
        <div className="card">
          {['Nunca pasar hambre','No prohibir alimentos','Mínima cocina entre semana','Batch cooking dominical','Sostenible durante años'].map(f=>(<div key={f} className="pill-filosofia"><div className="filosofia-check">✓</div><span style={{ fontSize:14 }}>{f}</span></div>))}
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
  const [registroHoy, setRegistroHoy] = useState([])
  const [recetas, setRecetas] = useState([])
  const [seguimientoHoy, setSeguimientoHoy] = useState(null)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const { data:m } = await supabase.from('p65_menu_semanal').select('*').eq('usuario','paula').single()
    if (m?.menu) setMenuSemanal(m.menu)
    const { data:p } = await supabase.from('p65_peso').select('*').eq('usuario','paula').order('fecha',{ascending:true})
    if (p) setPesoRegistros(p)
    const fechaHoy = new Date().toISOString().split('T')[0]
    const { data:r } = await supabase.from('p65_registro_diario').select('*').eq('usuario','paula').eq('fecha',fechaHoy)
    if (r) setRegistroHoy(r)
    const { data:rec } = await supabase.from('p65_recetas').select('*').eq('usuario','paula').order('created_at',{ascending:false})
    if (rec) setRecetas(rec)
    const { data:seg } = await supabase.from('p65_seguimiento').select('*').eq('usuario','paula').eq('fecha',fechaHoy).single()
    if (seg) setSeguimientoHoy(seg)
  }

  const guardarMenu = async (menu) => {
    await supabase.from('p65_menu_semanal').upsert({ usuario:'paula', menu, actualizado:new Date().toISOString() }, { onConflict:'usuario' })
  }

  const guardarPeso = async (peso) => {
    const { data } = await supabase.from('p65_peso').insert({ usuario:'paula', peso, fecha:new Date().toISOString() }).select()
    if (data) setPesoRegistros(p => [...p, data[0]])
  }

  const nav = [
    { id:'hoy',        icon:'☀️', label:'Hoy' },
    { id:'menu',       icon:'📅', label:'Menú' },
    { id:'recetario',  icon:'📖', label:'Recetas' },
    { id:'batch',      icon:'🍲', label:'Batch' },
    { id:'quecomohoy', icon:'✨', label:'¿Qué como?' },
    { id:'perfil',     icon:'🌸', label:'Perfil' },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {pantalla==='hoy'        && <Hoy menuSemanal={menuSemanal} pesoRegistros={pesoRegistros} registroHoy={registroHoy} setRegistroHoy={setRegistroHoy} seguimientoHoy={seguimientoHoy} setSeguimientoHoy={setSeguimientoHoy} />}
        {pantalla==='menu'       && <Menu menuSemanal={menuSemanal} setMenuSemanal={setMenuSemanal} guardarMenu={guardarMenu} recetas={recetas} />}
        {pantalla==='recetario'  && <Recetario />}
        {pantalla==='batch'      && <BatchCooking recetas={recetas} />}
        {pantalla==='quecomohoy' && <QueComoHoy menuSemanal={menuSemanal} />}
        {pantalla==='perfil'     && <Perfil pesoRegistros={pesoRegistros} guardarPeso={guardarPeso} />}
        <nav className="nav">
          {nav.map(n => (
            <div key={n.id} className={`nav-item ${pantalla===n.id?'active':''}`} onClick={() => setPantalla(n.id)}>
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
