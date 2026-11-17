const S = {
  aviso: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 14, background: '#E9ECF2', color: '#2D4260' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 },
  titulo: { fontSize: 13, fontWeight: 600, color: '#6A6C5A' },
  valor: { fontSize: 30, fontWeight: 800, letterSpacing: '-.02em' },
  chip: { alignSelf: 'flex-start', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 },
  barras: { display: 'flex', alignItems: 'flex-end', gap: 6, height: 76 },
  columna: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' },
  mes: { fontSize: 11, fontWeight: 600, color: '#6A6C5A' },
  pie: { fontSize: 13, color: '#6A6C5A' },
  seccion: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  h2: { margin: 0, fontSize: 18, fontWeight: 700 },
  senal: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 },
  boton: { alignSelf: 'flex-start', minHeight: 36, padding: '0 12px', borderRadius: 9, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 13 }
}

export default function Indicadores({ accent, tarjetas, senales, meses, transcurridos, diasMes }) {
  return (
    <>
      <section style={S.aviso}>
        <strong style={{ whiteSpace: 'nowrap' }}>Mes en curso</strong>
        <span style={{ flex: '1 1 420px' }}>
          Noviembre lleva {transcurridos} de {diasMes} días, así que sus conteos van a quedar por
          debajo de los meses cerrados hagas lo que hagas. Lo que sí se puede comparar es la tasa
          por 1 000 días-residente, y es la que lleva la flecha.
        </span>
      </section>

      <section style={S.grid}>
        {tarjetas.map((t) => (
          <div key={t.clave} style={S.tarjeta}>
            <span style={S.titulo}>{t.titulo}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={S.valor}>{t.valorTexto}</span>
              <span style={{ fontSize: 13, color: '#6A6C5A' }}>{t.tasaTexto}</span>
            </div>
            <span style={{ ...S.chip, background: t.tendenciaBg, color: t.tendenciaFg }}>{t.tendencia}</span>

            <div style={S.barras} role="img"
              aria-label={`${t.titulo} por mes: ${t.barras.map((b) => `${b.nombre} ${b.valor}`).join(', ')}`}>
              {t.barras.map((b) => (
                <div key={b.id} style={S.columna} title={`${b.nombre}: ${b.valor}`}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: b.enCurso ? accent : '#6A6C5A' }}>{b.valor}</span>
                  <div style={{
                    width: '100%', height: b.alto, borderRadius: '5px 5px 0 0',
                    background: b.enCurso ? accent : '#D9D3C2',
                    border: b.enCurso ? `1px dashed ${accent}` : 0
                  }} />
                  <span style={S.mes}>{b.mes}</span>
                </div>
              ))}
            </div>

            <span style={S.pie}>{t.pie}</span>
          </div>
        ))}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={S.h2}>Señales de los otros módulos</h2>
        <p style={{ margin: 0, fontSize: 14, color: '#6A6C5A' }}>
          Esto no se captura aquí: son los números que Personal, Inventario y Cocina ya tienen, y que
          en una inspección se preguntan uno detrás de otro.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {senales.map((s) => (
            <div key={s.clave} style={S.senal}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...S.chip, background: s.bg, color: s.fg, fontSize: 15, minWidth: 28, textAlign: 'center' }}>{s.valor}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{s.label}</span>
              </div>
              <span style={S.pie}>{s.sub}</span>
              <button type="button" onClick={s.ir} style={S.boton}>{s.cta}</button>
            </div>
          ))}
        </div>
      </section>

      <section style={S.seccion}>
        <div style={S.cabecera}>
          <h2 style={S.h2}>Detalle por mes</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>
            Las caídas y las úlceras van contadas dentro de los incidentes
          </span>
        </div>
        <table style={{ minWidth: 760 }}>
          <thead>
            <tr>
              <th>Mes</th><th>Días</th><th>Ocupación media</th><th>Caídas</th><th>Úlceras</th><th>Incidentes</th>
            </tr>
          </thead>
          <tbody>
            {[...meses].reverse().map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>
                  {m.nombre}
                  {m.enCurso && <span style={{ fontSize: 13, color: '#6A6C5A', fontWeight: 400 }}> · en curso</span>}
                </td>
                <td>{m.enCurso ? `${m.transcurridos} de ${m.dias}` : m.dias}</td>
                <td>{m.ocupadas} camas</td>
                <td>{m.caidas}</td>
                <td>{m.ulceras}</td>
                <td>{m.incidentes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
