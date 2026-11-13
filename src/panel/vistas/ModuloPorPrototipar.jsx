const S = {
  card: { background: '#FFFFFF', border: '1px dashed #B9C3CE', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 },
  insignia: { alignSelf: 'flex-start', padding: '4px 10px', borderRadius: 999, background: '#E8EEF9', color: '#2B4C8C', fontSize: 12, fontWeight: 700 },
  lista: { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, color: '#2A333F' }
}

export default function ModuloPorPrototipar({ modulo }) {
  return (
    <section style={S.card}>
      <span style={S.insignia}>Módulo por prototipar</span>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#2A333F' }}>{modulo.desc}</p>
      <ul style={S.lista}>
        {modulo.items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </section>
  )
}
