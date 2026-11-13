const S = {
  aviso: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 14, background: '#FFF1D6', color: '#5E3A00' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#5B6675' },
  kpiValue: { fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  h2: { margin: 0, fontSize: 18, fontWeight: 700 },
  chip: { padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' },
  barras: { display: 'flex', alignItems: 'flex-end', gap: 4, height: 90 },
  par: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }
}

export default function Financieros({
  accent, cuentas, finanzas, facturado, cobrado, porCobrar, carteraVencida,
  pctCobranza, nVencidas, timbradas, totalCuentas, ocupadas, camas
}) {
  return (
    <>
      <section style={S.aviso}>
        <strong style={{ whiteSpace: 'nowrap' }}>Ojo con el total</strong>
        <span style={{ flex: '1 1 420px' }}>
          El prototipo trae {totalCuentas} cuentas de muestra aunque la ocupación sea de {ocupadas} de
          las {camas} camas. Todo lo de esta pestaña son esas {totalCuentas} cuentas, no la residencia
          entera: con la cartera completa los importes serían unas siete veces mayores.
        </span>
      </section>

      <section style={S.kpiGrid}>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Facturado en noviembre</span>
          <span style={S.kpiValue}>{facturado}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>{totalCuentas} cuentas emitidas</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Cobrado</span>
          <span style={{ ...S.kpiValue, color: '#0B6B5C' }}>{cobrado}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>{pctCobranza} % de lo facturado, al día 9</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Por cobrar</span>
          <span style={{ ...S.kpiValue, color: '#B4541A' }}>{porCobrar}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>incluye lo que aún no vence</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Cartera vencida</span>
          <span style={{ ...S.kpiValue, color: nVencidas ? '#B42318' : '#1B2430' }}>{carteraVencida}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>
            {nVencidas === 0 ? 'Sin cuentas vencidas' : `${nVencidas} cuenta${nVencidas > 1 ? 's' : ''} fuera de plazo`}
          </span>
        </div>
      </section>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={S.h2}>Cuentas de noviembre</h2>
          <span style={{ fontSize: 13, color: '#5B6675' }}>
            CFDI 4.0 timbrados: {timbradas} de {totalCuentas}
          </span>
        </div>
        <table style={{ minWidth: 880 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 230 }}>Residente</th>
              <th>Mensualidad</th><th>Pagado</th><th>Saldo</th><th>Estado</th><th>CFDI</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{c.nombre}</span>
                    <span style={{ fontSize: 13, color: '#5B6675' }}>Hab. {c.habitacion}</span>
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{c.montoTexto}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{c.pagadoTexto}</td>
                <td style={{ whiteSpace: 'nowrap', fontWeight: c.saldo > 0 ? 700 : 400, color: c.saldo > 0 ? '#B4541A' : '#1B2430' }}>
                  {c.saldoTexto}
                </td>
                <td><span style={{ ...S.chip, background: c.bg, color: c.fg }}>{c.estado}</span></td>
                <td style={{ fontSize: 13, color: c.cfdi ? '#0B6B5C' : '#8A5300', fontWeight: 600 }}>
                  {c.cfdi ? 'Timbrado' : 'Pendiente'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ ...S.tarjeta, padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h2 style={S.h2}>Facturado y cobrado por mes</h2>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#5B6675' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#D8E0E6' }} /> Facturado
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: accent }} /> Cobrado
            </span>
          </div>
        </div>

        <div style={S.barras} role="img"
          aria-label={`Cobranza por mes: ${finanzas.map((m) => `${m.nombre} ${m.pct} por ciento`).join(', ')}`}>
          {finanzas.map((m) => (
            <div key={m.id} style={S.par} title={`${m.nombre}: ${m.cobradoTexto} de ${m.facturadoTexto}`}>
              <span style={{ fontSize: 11, fontWeight: 700, color: m.pct === 100 ? '#0B6B5C' : '#5B6675' }}>{m.pct} %</span>
              <div style={{ width: '100%', height: m.altoFacturado, background: '#D8E0E6', borderRadius: '5px 5px 0 0', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, bottom: 0, width: '100%',
                  height: `${Math.round((m.cobrado / m.facturado) * 100)}%`,
                  background: accent, borderRadius: m.pct === 100 ? '5px 5px 0 0' : 0,
                  border: m.enCurso ? '1px dashed #FFFFFF' : 0, boxSizing: 'border-box'
                }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#5B6675' }}>{m.mes}</span>
            </div>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: 13, color: '#5B6675' }}>
          Noviembre va por el día 9 y dos mensualidades todavía no vencen, así que ese {pctCobranza} %
          no es comparable con los meses cerrados: se queda abajo hasta el día 15.
        </p>
      </section>
    </>
  )
}
