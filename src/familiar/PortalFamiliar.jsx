import { useEffect, useRef, useState } from 'react'
import {
  diaFamiliar, mensajesFamiliar, pagosFamiliar, horariosVisita, visitaInicial, datosSpei
} from '../data/alba.js'
import Switcher from '../Switcher.jsx'
import Logo from '../Logo.jsx'
import { MARCA } from '../config.js'
import HojaPago from './HojaPago.jsx'

const S = {
  // En el prototipo el lienzo es fijo de 390×844. En la web real se centra en pantallas
  // grandes y ocupa toda la ventana en un teléfono.
  fondo: { minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 0', boxSizing: 'border-box', background: '#EBE7DB' },
  telefono: { position: 'relative', width: 390, maxWidth: '100vw', height: 844, maxHeight: 'calc(100dvh - 72px)', boxSizing: 'border-box', background: '#F4F2EA', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Figtree', system-ui, sans-serif" },
  header: { background: '#3A4523', color: '#FFFFFF', padding: '28px 20px 22px', display: 'flex', flexDirection: 'column', gap: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, background: '#F4D9B8', color: '#5A3410', fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cuerpo: { flex: 1, overflowY: 'auto', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14 },
  card: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  h2: { margin: 0, fontSize: 16, fontWeight: 700 },
  nav: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', background: '#FFFFFF', borderTop: '1px solid #E5E1D5', padding: '6px 8px 14px' },
  foto: { aspectRatio: '1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#474A3A', textAlign: 'center', padding: 6 },
  btnPrim: { minHeight: 48, borderRadius: 12, border: 0, background: '#5A6B32', color: '#FFFFFF', fontWeight: 700, fontSize: 15 }
}

const TABS = [['hoy', 'Hoy'], ['msj', 'Mensajes'], ['pagos', 'Pagos'], ['visitas', 'Visitas']]

/* "Ahora" en el prototipo son las 09:41, igual que en el panel. Cada mensaje
   enviado avanza un minuto para que la conversación se lea natural. */
const hora = (i) => {
  const m = 9 * 60 + 41 + i
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

export default function PortalFamiliar() {
  const [tab, setTab] = useState('hoy')
  const [slot, setSlot] = useState('12:00')

  const [mensajes, setMensajes] = useState(mensajesFamiliar)
  const [borrador, setBorrador] = useState('')
  const [visita, setVisita] = useState(visitaInicial)
  const [avisoVisita, setAvisoVisita] = useState('')
  const [pago, setPago] = useState('pendiente')   // pendiente | validacion
  const [verHoja, setVerHoja] = useState(false)

  const finChat = useRef(null)
  useEffect(() => {
    if (tab === 'msj') finChat.current?.scrollIntoView({ block: 'end' })
  }, [mensajes, tab])

  const enviar = () => {
    const texto = borrador.trim()
    if (!texto) return
    setMensajes((prev) => [...prev, {
      who: 'Tú', time: hora(prev.length - mensajesFamiliar.length),
      text: texto, align: 'flex-end', bg: '#3A4523', fg: '#FFFFFF'
    }])
    setBorrador('')
  }

  const confirmarVisita = () => {
    setVisita(`Mar 10 nov, ${slot} · Patricia y Daniel Ruiz`)
    setAvisoVisita(`Visita confirmada para el martes 10 de noviembre a las ${slot}.`)
  }

  const enValidacion = pago === 'validacion'

  return (
    <div style={S.fondo}>
      <Switcher modo="flujo" />
      <div style={S.telefono}>
        <header style={S.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#C2C9A6' }}>Hola, Patricia</span>
            {/* La marca va compacta: en 390 px no cabe el lema del logo. */}
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Logo tamano={22} grosor={2} />
              <span style={{ fontWeight: 600, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase' }}>{MARCA}</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={S.avatar}>CR</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 800 }}>Carmen Ruiz</span>
              <span style={{ fontSize: 13, color: '#C2C9A6' }}>Habitación 103-A</span>
            </div>
          </div>
        </header>

        <div style={S.cuerpo}>
          {tab === 'hoy' && (
            <>
              <section style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={S.h2}>Su día de hoy</h2>
                  <span style={{ fontSize: 12, color: '#6A6C5A' }}>Lun 9 nov</span>
                </div>
                {diaFamiliar.map((d) => (
                  <div key={d.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 5, marginTop: 6, background: d.dot, flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{d.title}</span>
                      <span style={{ fontSize: 13, color: '#6A6C5A' }}>{d.detail}</span>
                    </div>
                  </div>
                ))}
              </section>

              <section style={{ background: '#FBF0D5', borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#5E3A00' }}>Aviso del equipo de enfermería</span>
                <span style={{ fontSize: 14, color: '#5E3A00', lineHeight: 1.5 }}>
                  Su presión arterial salió un poco alta esta mañana. La estamos vigilando y la doctora la revisará a las 11:30.
                </span>
              </section>

              <section style={S.card}>
                <h2 style={S.h2}>Fotos de la semana</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                  <div style={{ ...S.foto, background: '#E2E9D2' }}>[Foto taller de pintura]</div>
                  <div style={{ ...S.foto, background: '#F4E3CF' }}>[Foto jardín]</div>
                  <div style={{ ...S.foto, background: '#E9ECF2' }}>[Foto cumpleaños]</div>
                </div>
              </section>
            </>
          )}

          {tab === 'msj' && (
            <>
              {mensajes.map((m, i) => (
                <div key={i} style={{ alignSelf: m.align, maxWidth: '82%', background: m.bg, color: m.fg, borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, opacity: .85 }}>{m.who} · {m.time}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.45 }}>{m.text}</span>
                </div>
              ))}
              <div ref={finChat} />
              <form
                onSubmit={(e) => { e.preventDefault(); enviar() }}
                style={{ marginTop: 'auto', position: 'sticky', bottom: 0, display: 'flex', gap: 8, alignItems: 'center', background: '#FFFFFF', border: '1px solid #DCD6C6', borderRadius: 14, padding: '6px 6px 6px 14px' }}
              >
                <span className="sr-only">Mensaje</span>
                <input
                  type="text" value={borrador} onChange={(e) => setBorrador(e.target.value)}
                  placeholder="Escribe un mensaje al equipo…"
                  style={{ flex: 1, border: 0, outline: 'none', fontFamily: 'inherit', fontSize: 15, background: 'transparent' }}
                />
                <button
                  type="submit" disabled={!borrador.trim()}
                  style={{ minHeight: 44, padding: '0 16px', borderRadius: 10, border: 0, background: borrador.trim() ? '#5A6B32' : '#C6C9B2', color: '#FFFFFF', fontWeight: 700, cursor: borrador.trim() ? 'pointer' : 'not-allowed' }}
                >
                  Enviar
                </button>
              </form>
            </>
          )}

          {tab === 'pagos' && (
            <>
              <section style={{ ...S.card, padding: 18, gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6A6C5A' }}>Saldo de noviembre</span>
                <span style={{ fontSize: 32, fontWeight: 800 }}>$31,500 MXN</span>
                {enValidacion ? (
                  <>
                    <span style={{ fontSize: 14, color: '#4C6B27', fontWeight: 600 }}>
                      Pago en validación · referencia {datosSpei.referencia}
                    </span>
                    <span style={{ marginTop: 8, minHeight: 48, borderRadius: 12, background: '#E8EEDB', color: '#4C6B27', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 12px' }}>
                      Te avisamos en cuanto se confirme
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 14, color: '#8A5300', fontWeight: 600 }}>Vence el 10 de noviembre</span>
                    <button type="button" onClick={() => setVerHoja(true)} style={{ ...S.btnPrim, marginTop: 8 }}>
                      Pagar con transferencia SPEI
                    </button>
                  </>
                )}
              </section>

              <section style={{ ...S.card, gap: 4 }}>
                <h2 style={{ ...S.h2, margin: '0 0 6px' }}>Historial y facturas</h2>
                {enValidacion && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #EEEBE0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>Noviembre 2026</span>
                      <span style={{ fontSize: 13, color: '#8A5300', fontWeight: 600 }}>En validación · CFDI al confirmar</span>
                    </div>
                    <span style={{ fontWeight: 700 }}>$31,500</span>
                  </div>
                )}
                {pagosFamiliar.map((p) => (
                  <div key={p.mes} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #EEEBE0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{p.mes}</span>
                      <span style={{ fontSize: 13, color: '#4C6B27', fontWeight: 600 }}>Pagado · CFDI PDF y XML</span>
                    </div>
                    <span style={{ fontWeight: 700 }}>{p.monto}</span>
                  </div>
                ))}
              </section>
            </>
          )}

          {tab === 'visitas' && (
            <>
              <section style={S.card}>
                <h2 style={S.h2}>Agendar visita</h2>
                <span style={{ fontSize: 14, color: '#6A6C5A' }}>Elige un horario disponible para el martes 10 de noviembre</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                  {horariosVisita.map((h) => (
                    <button key={h} type="button" onClick={() => { setSlot(h); setAvisoVisita('') }} aria-pressed={slot === h ? 'true' : 'false'}
                      style={{ minHeight: 44, borderRadius: 10, border: `1px solid ${slot === h ? '#3A4523' : '#DCD6C6'}`, background: slot === h ? '#3A4523' : '#FFFFFF', color: slot === h ? '#FFFFFF' : '#262A1B', fontWeight: 700, fontSize: 14 }}>
                      {h}
                    </button>
                  ))}
                </div>
                {avisoVisita && (
                  <span role="status" style={{ padding: '10px 12px', borderRadius: 10, background: '#E8EEDB', color: '#4C6B27', fontSize: 13, fontWeight: 600, lineHeight: 1.45 }}>
                    {avisoVisita}
                  </span>
                )}
                <button type="button" onClick={confirmarVisita} style={S.btnPrim}>Confirmar visita a las {slot}</button>
              </section>
              <section style={{ ...S.card, gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Próxima visita confirmada</span>
                <span style={{ fontSize: 14, color: '#6A6C5A' }}>{visita}</span>
              </section>
            </>
          )}
        </div>

        <nav aria-label="Secciones" style={S.nav}>
          {TABS.map(([id, label]) => {
            const activo = tab === id
            return (
              <button key={id} type="button" onClick={() => setTab(id)} aria-current={activo ? 'page' : 'false'}
                style={{ minHeight: 52, border: 0, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: activo ? '#4C6B27' : '#6A6C5A', fontSize: 13, fontWeight: activo ? 700 : 500 }}>
                <span style={{ width: 28, height: 4, borderRadius: 2, background: activo ? '#5A6B32' : 'transparent' }} />
                {label}
              </button>
            )
          })}
        </nav>

        {verHoja && (
          <HojaPago
            onCerrar={() => setVerHoja(false)}
            onTransferido={() => { setPago('validacion'); setVerHoja(false) }}
          />
        )}
      </div>
    </div>
  )
}
