const S = {
  nav: { flex: '1 1 232px', background: '#12322F', color: '#FFFFFF', padding: '24px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 },
  marca: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' },
  grupo: { display: 'flex', flexDirection: 'column', gap: 4 },
  etiqueta: { fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9FB8B3', padding: '0 12px 6px' },
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

export default function Sidebar({ accent, navMain, navMore }) {
  return (
    <nav aria-label="Menú principal" style={S.nav}>
      <div style={S.marca}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
            <path d="M12 17s-3-1.8-3-4a1.7 1.7 0 0 1 3-1 1.7 1.7 0 0 1 3 1c0 2.2-3 4-3 4z" />
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>Alba</span>
          <span style={{ fontSize: 12, color: '#B7CBC7' }}>Residencia Los Álamos</span>
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
          <span style={{ fontSize: 12, color: '#B7CBC7' }}>Enfermera · Turno matutino</span>
        </div>
      </div>
    </nav>
  )
}
