const S = {
  barra: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  rejilla: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 },
  caja: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 },
  grupo: { padding: '3px 9px', borderRadius: 999, background: '#EFE7F7', color: '#5B3A8E', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  saldo: { fontSize: 30, fontWeight: 800, lineHeight: 1 },
  dato: { display: 'flex', gap: 8, fontSize: 13, color: '#5B6675' },
  descuadre: { display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 14px', borderRadius: 10, background: '#FDE8E6', color: '#5C1109', fontSize: 13 },
  ajustar: { alignSelf: 'flex-start', minHeight: 40, padding: '0 14px', borderRadius: 9, border: 0, background: '#B42318', color: '#FFFFFF', fontWeight: 600, fontSize: 13 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }
}

export default function Controlados({ accent, tarjetas, libro, descuadres, onMovimiento }) {
  return (
    <>
      <div style={S.barra}>
        <span style={{ fontSize: 14, color: '#5B6675', flex: '1 1 420px' }}>
          Grupos I a III de la Ley General de Salud: receta especial, resguardo bajo llave y libro
          de control. Ningún movimiento se registra con una sola firma.
        </span>
        <button type="button" onClick={onMovimiento}
          style={{ minHeight: 44, padding: '0 18px', borderRadius: 10, border: 0, background: accent, color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>
          + Registrar movimiento
        </button>
      </div>

      {descuadres > 0 && (
        <section style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: '#FDE8E6', color: '#5C1109', fontSize: 14 }}>
          <strong style={{ whiteSpace: 'nowrap' }}>Descuadre</strong>
          <span>
            El conteo físico no coincide con el libro en {descuadres} medicamento
            {descuadres > 1 ? 's' : ''}. En la app real esto bloquearía nuevas salidas hasta
            levantar el acta.
          </span>
        </section>
      )}

      <section style={S.rejilla}>
        {tarjetas.map((k) => (
          <article key={k.id} style={S.caja}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{k.nombre}</span>
              <span style={S.grupo}>{k.grupo}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ ...S.saldo, color: k.descuadre ? '#B42318' : '#1B2430' }}>{k.saldo}</span>
              <span style={{ fontSize: 14, color: '#5B6675' }}>{k.unidad} según el libro</span>
            </div>
            <div style={S.dato}>
              <span style={{ fontWeight: 600, color: '#3D4652' }}>Para</span>
              <span>{k.persona}{k.habitacion ? ` · Hab. ${k.habitacion}` : ''}</span>
            </div>
            <div style={S.dato}>
              <span style={{ fontWeight: 600, color: '#3D4652' }}>Indicación</span>
              <span>{k.indicacion}</span>
            </div>
            <div style={S.dato}>
              <span style={{ fontWeight: 600, color: '#3D4652' }}>Resguardo</span>
              <span>{k.resguardo}</span>
            </div>
            <div style={S.dato}>
              <span style={{ fontWeight: 600, color: '#3D4652' }}>Último conteo</span>
              <span>{k.conteo}</span>
            </div>

            {k.descuadre !== 0 && (
              <div style={S.descuadre}>
                <span>
                  El conteo físico dio {k.fisico} {k.unidad} y el libro marca {k.saldo}:
                  {k.descuadre === 1 ? ' falta 1.' : ` faltan ${k.descuadre}.`}
                </span>
                <button type="button" onClick={k.ajustar} style={S.ajustar}>Levantar acta y ajustar</button>
              </div>
            )}
          </article>
        ))}
      </section>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Libro de control</h2>
          <span style={{ fontSize: 13, color: '#5B6675' }}>Del más reciente al más antiguo · no se puede editar</span>
        </div>
        <table style={{ minWidth: 1040 }}>
          <thead>
            <tr>
              <th>Fecha</th><th>Medicamento</th><th>Movimiento</th><th>Saldo</th><th>Residente</th><th>Firmas</th><th>Receta</th>
            </tr>
          </thead>
          <tbody>
            {libro.map((m) => (
              <tr key={m.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{m.fechaTexto}</span>
                    <span style={{ fontSize: 13, color: '#5B6675' }}>{m.hora}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{m.articulo}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <span style={{ fontWeight: 700, color: m.deltaFg }}>{m.deltaTexto}</span>
                  <span style={{ fontSize: 13, color: '#5B6675' }}> {m.tipo.toLowerCase()}</span>
                </td>
                <td style={{ fontWeight: 700 }}>{m.saldo}</td>
                <td>{m.persona}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{m.responsable}</span>
                    <span style={{ fontSize: 13, color: '#5B6675' }}>Testigo: {m.testigo}</span>
                  </div>
                </td>
                <td style={{ color: '#3D4652' }}>{m.folio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
