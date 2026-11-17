import Logo from '../Logo.jsx'
/* El nombre va partido en dos renglones a mano y no desde MARCA: aquí es una
   composición tipográfica del logo, no un dato. */
import { DORADO, LEMA } from '../config.js'

const S = {
  nav: { flex: '1 1 232px', background: '#3A4523', color: '#FFFFFF', padding: '24px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 },
  /* El logo es un bloque vertical: isotipo, "CASA", "LOS OLIVOS" y el lema.
     Puesto en fila no cabe en los 232 px de la barra y el nombre se parte;
     apilado entra entero y además se parece al original. */
  marca: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '4px 8px 0', textAlign: 'center' },
  casa: { fontSize: 11, fontWeight: 500, letterSpacing: '.34em', textIndent: '.34em', color: '#E8E6DA' },
  olivos: { fontSize: 19, fontWeight: 600, letterSpacing: '.08em', textIndent: '.08em', lineHeight: 1.1, marginTop: 2 },
  lema: { fontSize: 9, fontWeight: 500, letterSpacing: '.13em', textIndent: '.13em', textTransform: 'uppercase', color: DORADO, marginTop: 7 },
  /* Los dos filetes que el logo pone a los lados de "CASA". */
  filete: { flex: 1, height: 1, background: DORADO, opacity: .55 },
  grupo: { display: 'flex', flexDirection: 'column', gap: 4 },
  etiqueta: { fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#A6AE86', padding: '0 12px 6px' },
  badge: { minWidth: 22, height: 22, padding: '0 6px', boxSizing: 'border-box', borderRadius: 11, background: '#F2B8B0', color: '#5C1109', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  usuario: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,.07)' },
  avatar: { width: 36, height: 36, borderRadius: 18, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }
}

const botonNav = (item, conBadge) => ({
  display: 'flex', alignItems: 'center',
  justifyContent: conBadge ? 'space-between' : undefined,
  minHeight: 44, padding: '0 12px', border: 0, borderRadius: 10,
  background: item.bg, color: '#FFFFFF', fontSize: 15, fontWeight: item.weight, textAlign: 'left'
})

/* Ya no recibe `accent`: el isotipo trae sus propios colores de marca. */
export default function Sidebar({ navMain, navMore }) {
  return (
    <nav aria-label="Menú principal" style={S.nav}>
      <div style={S.marca}>
        <Logo tamano={54} grosor={1.5} />
        <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: 'stretch' }}>
            <span style={S.filete} />
            <span style={S.casa}>CASA</span>
            <span style={S.filete} />
          </span>
          <span style={S.olivos}>LOS OLIVOS</span>
          <span style={S.lema}>{LEMA}</span>
        </div>
      </div>

      <div style={S.grupo}>
        <span style={S.etiqueta}>Operación diaria</span>
        {navMain.map((item) => (
          <button key={item.id} type="button" onClick={item.go} style={botonNav(item, true)}>
            <span>{item.label}</span>
            {item.hasCount && <span style={S.badge}>{item.count}</span>}
          </button>
        ))}
      </div>

      <div style={S.grupo}>
        <span style={S.etiqueta}>Gestión</span>
        {/* En el prototipo este grupo no llevaba insignia porque ningún módulo
            de Gestión existía todavía. Inventario sí tiene qué avisar. */}
        {navMore.map((item) => (
          <button key={item.id} type="button" onClick={item.go} style={botonNav(item, true)}>
            <span>{item.label}</span>
            {item.hasCount && <span style={S.badge}>{item.count}</span>}
          </button>
        ))}
      </div>

      <div style={S.usuario}>
        <div style={S.avatar}>LP</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Laura Pérez</span>
          <span style={{ fontSize: 12, color: '#C2C9A6' }}>Enfermera · Turno matutino</span>
        </div>
      </div>
    </nav>
  )
}
