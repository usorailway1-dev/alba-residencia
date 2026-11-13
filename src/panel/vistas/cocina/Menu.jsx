const S = {
  dias: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  dia: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 62, minHeight: 56, padding: '0 12px', borderRadius: 12, justifyContent: 'center', fontSize: 13, fontWeight: 600 },
  resumen: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: '18px 20px' },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  cabecera: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12 },
  hora: { fontWeight: 800, fontSize: 15, minWidth: 48 },
  ajuste: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'baseline', paddingTop: 10, borderTop: '1px solid #EEF1F4' },
  chip: { padding: '3px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  editar: { minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #DCE1E7', background: '#FFFFFF', color: '#1B2430', fontWeight: 600, fontSize: 13, marginLeft: 'auto' },
  alerta: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: '#FDE8E6', color: '#5C1109', fontSize: 13 },
  ok: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: '#E3F3EF', color: '#0B4F44', fontSize: 13 }
}

export default function Menu({ accent, diasMenu, tiemposDelDia, comensales, especiales, resumenComida, esHoy }) {
  return (
    <>
      <div role="group" aria-label="Día de la semana" style={S.dias}>
        {diasMenu.map((d) => (
          <button key={d.i} type="button" onClick={d.ir} aria-pressed={d.activo ? 'true' : 'false'}
            style={{
              ...S.dia,
              border: `1px solid ${d.activo ? '#12322F' : '#DCE1E7'}`,
              background: d.activo ? '#12322F' : '#FFFFFF',
              color: d.activo ? '#FFFFFF' : '#1B2430'
            }}>
            <span style={{ fontSize: 12, opacity: .8 }}>{d.corto}</span>
            <span style={{ fontSize: 17, fontWeight: 800 }}>{d.num}</span>
          </button>
        ))}
      </div>

      <section style={S.resumen}>
        <span style={{ fontWeight: 700, fontSize: 16, flex: '1 1 260px' }}>
          {comensales} comensales · {resumenComida}
        </span>
        <span style={{ fontSize: 13, color: '#5B6675' }}>
          {especiales === 0
            ? 'Hoy nadie lleva dieta especial.'
            : 'Las adaptaciones salen de la ficha de cada residente, no se escriben a mano.'}
        </span>
      </section>

      {tiemposDelDia.map((t) => (
        <section key={t.id} style={{ ...S.tarjeta, opacity: esHoy && t.servido ? .72 : 1 }}>
          <div style={S.cabecera}>
            <span style={{ ...S.hora, color: accent }}>{t.hora}</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{t.nombre}</h2>
            {esHoy && t.servido && <span style={{ ...S.chip, background: '#EEF1F4', color: '#3D4652' }}>Servido</span>}
            {t.alergenos.map((a) => (
              <span key={a} style={{ ...S.chip, background: '#FFF1D6', color: '#8A5300' }}>Contiene {a.toLowerCase()}</span>
            ))}
            <button type="button" onClick={t.editar} style={S.editar}>Editar</button>
          </div>

          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: '#1B2430' }}>{t.plato}</p>

          {t.ajustes.map((a) => (
            <div key={a.clave} style={S.ajuste}>
              <span style={{ ...S.chip, background: '#E8EEF9', color: '#2B4C8C' }}>{a.label} · {a.n}</span>
              <span style={{ flex: '1 1 300px', fontSize: 14, color: '#3D4652' }}>{a.texto}</span>
              <span style={{ fontSize: 13, color: '#5B6675' }}>{a.quienes.join(' · ')}</span>
            </div>
          ))}

          {t.conflictos.map((c) => (
            <div key={c.clave} style={c.alternativa ? S.ok : S.alerta}>
              <strong style={{ whiteSpace: 'nowrap' }}>{c.nombre}</strong>
              <span>
                {c.alternativa
                  ? `No puede tomar ${c.alergeno.toLowerCase()}: se le sirve ${c.alternativa.toLowerCase()}.`
                  : `No puede tomar ${c.alergeno.toLowerCase()} y este tiempo no tiene alternativa registrada. Edítalo antes de servir.`}
              </span>
            </div>
          ))}
        </section>
      ))}
    </>
  )
}
