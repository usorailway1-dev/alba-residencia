import { Link, useLocation } from 'react-router-dom'

/**
 * Navegación entre los dos lienzos del prototipo. No forma parte del diseño original:
 * existe solo para demostrar las dos pantallas desde una misma web. Para quitarlo,
 * borra este archivo y sus usos en App.jsx y familiar/PortalFamiliar.jsx.
 *
 * modo="fijo"  → pastilla flotante (panel de escritorio, donde sobra espacio).
 * modo="flujo" → barra normal encima del teléfono. En 390 px cualquier elemento
 *                flotante acaba tapando algo (las pestañas o el botón "Enviar"),
 *                así que ahí ocupa su propio espacio.
 */
const BASE = { display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'rgba(18,50,47,.92)' }
const LINK = { padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: 'none' }

export default function Switcher({ modo = 'fijo' }) {
  const { pathname } = useLocation()

  const estilo = modo === 'flujo'
    ? { ...BASE, alignSelf: 'center', flexShrink: 0 }
    : { ...BASE, position: 'fixed', right: 16, bottom: 16, zIndex: 50, boxShadow: '0 6px 20px rgba(0,0,0,.18)' }

  const item = (to, label) => (
    <Link to={to} style={{ ...LINK, background: pathname === to ? '#5A6B32' : 'transparent', color: '#FFFFFF' }}>
      {label}
    </Link>
  )

  return (
    <div style={estilo} aria-label="Cambiar de prototipo">
      {item('/', 'Panel')}
      {item('/familiar', 'Portal familiar')}
    </div>
  )
}
