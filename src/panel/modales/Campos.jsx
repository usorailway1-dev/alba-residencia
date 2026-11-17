/* Campos de formulario con el mismo aspecto que los de la vista Enfermería
   del prototipo original (alto 44, radio 9, borde #DCD6C6). */

const S = {
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: '#474A3A' },
  input: { height: 44, border: '1px solid #DCD6C6', borderRadius: 9, padding: '0 10px', boxSizing: 'border-box', width: '100%' },
  area: { border: '1px solid #DCD6C6', borderRadius: 9, padding: 10, resize: 'vertical', width: '100%', boxSizing: 'border-box', lineHeight: 1.5 },
  select: { height: 44, border: '1px solid #DCD6C6', borderRadius: 9, padding: '0 10px', background: '#FFFFFF', color: '#262A1B', width: '100%' }
}

export const Rejilla = ({ columnas = 2, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))`, gap: 12 }}>{children}</div>
)

export function Campo({ etiqueta, valor, alCambiar, ...resto }) {
  return (
    <label style={S.label}>{etiqueta}
      <input value={valor} onChange={(e) => alCambiar(e.target.value)} style={S.input} {...resto} />
    </label>
  )
}

export function Area({ etiqueta, valor, alCambiar, filas = 3, ...resto }) {
  return (
    <label style={S.label}>{etiqueta}
      <textarea value={valor} onChange={(e) => alCambiar(e.target.value)} rows={filas} style={S.area} {...resto} />
    </label>
  )
}

/** Varias opciones a la vez (banderas de dieta, alérgenos de un plato). */
export function Casillas({ etiqueta, opciones, valores, alCambiar }) {
  const alternar = (v) => alCambiar(valores.includes(v) ? valores.filter((x) => x !== v) : [...valores, v])
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <legend style={{ fontSize: 13, fontWeight: 600, color: '#474A3A', padding: 0 }}>{etiqueta}</legend>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {opciones.map(([v, t]) => {
          const puesta = valores.includes(v)
          return (
            <label key={v} style={{
              display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 12px',
              borderRadius: 999, fontSize: 13, fontWeight: 600,
              border: `1px solid ${puesta ? '#3A4523' : '#DCD6C6'}`,
              background: puesta ? '#E8EEDB' : '#FFFFFF',
              color: '#262A1B'
            }}>
              <input type="checkbox" checked={puesta} onChange={() => alternar(v)} style={{ width: 16, height: 16 }} />
              {t}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Selector({ etiqueta, valor, alCambiar, opciones }) {
  return (
    <label style={S.label}>{etiqueta}
      <select value={valor} onChange={(e) => alCambiar(e.target.value)} style={S.select}>
        {opciones.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </label>
  )
}
