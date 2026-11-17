const S = {
  seccion: { display: 'flex', flexDirection: 'column', gap: 12 },
  titulo: { margin: 0, fontSize: 18, fontWeight: 700 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 },
  chip: { padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' },
  boton: { minHeight: 44, padding: '0 18px', borderRadius: 10, border: 0, color: '#FFFFFF', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' },
  vacio: { background: '#FFFFFF', border: '1px dashed #CFCABA', borderRadius: 14, padding: '24px 20px', textAlign: 'center', color: '#6A6C5A', fontSize: 14 }
}

const Tarjeta = ({ f, detalle, accion }) => (
  <article style={S.tarjeta}>
    <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{f.nombre}</span>
        <span style={{ ...S.chip, background: f.bg, color: f.fg }}>{f.estado}</span>
      </div>
      <span style={{ fontSize: 14, color: '#6A6C5A' }}>
        {f.persona ? `${f.persona} · Hab. ${f.habitacion}` : 'Almacén general'}
      </span>
      <span style={{ fontSize: 14, color: '#474A3A' }}>{detalle}</span>
    </div>
    {accion}
  </article>
)

export default function Alertas({ accent, bajos, caducidades }) {
  const pedir = (f) => (f.solicitud
    ? (
      <span style={{ fontSize: 13, color: '#6A6C5A', flex: '0 1 240px' }}>
        Reposición {f.solicitud.estado.toLowerCase()} el {f.solicitud.fecha} · {f.solicitud.cantidad} {f.solicitud.unidad}
      </span>
      )
    : (
      <button type="button" onClick={f.solicitar} style={{ ...S.boton, background: accent }}>
        {f.rid ? 'Solicitar a la familia' : 'Pedir al proveedor'} · {f.sugerido} {f.unidad}
      </button>
      ))

  return (
    <>
      <section style={S.seccion}>
        <h2 style={S.titulo}>Stock bajo</h2>
        {bajos.length === 0 && <div style={S.vacio}>Nada por debajo del mínimo.</div>}
        {bajos.map((f) => (
          <Tarjeta key={f.id} f={f}
            detalle={`Quedan ${f.existencias} ${f.unidad} · cobertura de ${f.cobertura} · el mínimo son ${f.minimo}`}
            accion={pedir(f)} />
        ))}
      </section>

      <section style={S.seccion}>
        <h2 style={S.titulo}>Caducidades</h2>
        {caducidades.length === 0 && <div style={S.vacio}>Ningún lote caduca en los próximos 30 días.</div>}
        {caducidades.map((f) => (
          <Tarjeta key={f.id} f={f}
            detalle={`Lote ${f.lote} · caduca el ${f.caducidadTexto} · ${f.existencias} ${f.unidad} en existencia`}
            accion={f.caducado
              ? (
                <button type="button" onClick={f.retirarLote} style={{ ...S.boton, background: '#B42318' }}>
                  Retirar lote y pedir reposición
                </button>
                )
              : (
                <span style={{ fontSize: 13, color: '#6A6C5A', flex: '0 1 240px' }}>
                  Usar primero este lote. Faltan {f.dias} días.
                </span>
                )} />
        ))}
      </section>

      {caducidades.some((f) => f.caducado) && (
        <section style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: '#FBE7E3', color: '#5C1109', fontSize: 14 }}>
          <strong style={{ whiteSpace: 'nowrap' }}>Atención</strong>
          <span>
            Un lote caducado en uso es de los primeros hallazgos en una inspección. Al retirarlo
            queda el registro de quién lo hizo y cuándo, y se abre la solicitud de reposición.
          </span>
        </section>
      )}
    </>
  )
}
