const S = {
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#5B6675' },
  kpiValue: { fontSize: 28, fontWeight: 800 },
  tabla: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, overflowX: 'auto' }
}

export default function Facturacion({ accent, bills, billTotal, billPaid, billDue }) {
  return (
    <>
      <section style={S.kpiGrid}>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Facturado noviembre</span>
          <span style={S.kpiValue}>{billTotal}</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Cobrado</span>
          <span style={{ ...S.kpiValue, color: '#0B6B5C' }}>{billPaid}</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Por cobrar</span>
          <span style={{ ...S.kpiValue, color: '#B42318' }}>{billDue}</span>
        </div>
      </section>

      <section style={S.tabla}>
        <table style={{ minWidth: 860 }}>
          <thead>
            <tr><th>Residente</th><th>Concepto</th><th>Importe</th><th>Saldo</th><th>Estado de pago</th><th>CFDI 4.0</th></tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600 }}>{b.name}</td>
                <td>Mensualidad nov 2026</td>
                <td>{b.amount}</td>
                <td style={{ fontWeight: 700 }}>{b.saldo}</td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: b.bg, color: b.fg, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{b.estado}</span>
                </td>
                <td>
                  {b.hasCfdi
                    ? <span style={{ fontSize: 13, color: '#0B6B5C', fontWeight: 600 }}>Timbrado · PDF y XML</span>
                    : <button type="button" onClick={b.emit} style={{ minHeight: 40, padding: '0 14px', borderRadius: 9, border: `1px solid ${accent}`, background: '#FFFFFF', color: accent, fontWeight: 600, fontSize: 13 }}>Emitir CFDI</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
