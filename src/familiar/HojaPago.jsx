import { useEffect, useState } from 'react'
import { datosSpei } from '../data/alba.js'

/* Hoja inferior, el patrón habitual en móvil. Se superpone solo al teléfono
   (el contenedor tiene position:relative), no a toda la ventana. */
const S = {
  fondo: { position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(18,50,47,.45)', display: 'flex', alignItems: 'flex-end' },
  hoja: { width: '100%', maxHeight: '92%', overflowY: 'auto', background: '#FFFFFF', borderRadius: '18px 18px 0 0', padding: '14px 18px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14 },
  asa: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, background: '#DCD6C6' },
  titulo: { margin: 0, fontSize: 18, fontWeight: 800 },
  nota: { fontSize: 13, color: '#6A6C5A', lineHeight: 1.5 },
  fila: { display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 10, borderBottom: '1px solid #EEEBE0' },
  etiqueta: { fontSize: 12, fontWeight: 600, color: '#6A6C5A' },
  valor: { fontSize: 15, fontWeight: 600, wordBreak: 'break-all' },
  copiar: { alignSelf: 'flex-start', minHeight: 36, padding: '0 12px', borderRadius: 9, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 13, marginTop: 4 },
  primario: { minHeight: 48, borderRadius: 12, border: 0, background: '#5A6B32', color: '#FFFFFF', fontWeight: 700, fontSize: 15 },
  secundario: { minHeight: 44, borderRadius: 12, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 14 }
}

const FILAS = [
  ['Beneficiario', datosSpei.beneficiario],
  ['Banco', datosSpei.banco],
  ['Concepto', datosSpei.concepto],
  ['Importe', datosSpei.monto]
]

export default function HojaPago({ onCerrar, onTransferido }) {
  const [copiado, setCopiado] = useState('')

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onCerrar])

  const copiar = async (texto, nombre) => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(`${nombre} copiada`)
    } catch {
      // El portapapeles falla sin HTTPS o sin permiso; se avisa en vez de callar.
      setCopiado('No se pudo copiar, selecciónala a mano')
    }
  }

  return (
    <div style={S.fondo} onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <div style={S.hoja} role="dialog" aria-modal="true" aria-label="Pagar con transferencia SPEI">
        <span style={S.asa} />
        <h2 style={S.titulo}>Transferencia SPEI</h2>
        <span style={S.nota}>
          Haz la transferencia desde tu banca en línea con estos datos. Al recibirla te llega
          el CFDI por correo; suele tardar unos minutos en reflejarse.
        </span>

        <div style={S.fila}>
          <span style={S.etiqueta}>CLABE interbancaria</span>
          <span style={{ ...S.valor, letterSpacing: '.04em' }}>{datosSpei.clabe}</span>
          <button type="button" style={S.copiar} onClick={() => copiar(datosSpei.clabe, 'CLABE')}>Copiar CLABE</button>
        </div>
        <div style={S.fila}>
          <span style={S.etiqueta}>Referencia</span>
          <span style={S.valor}>{datosSpei.referencia}</span>
          <button type="button" style={S.copiar} onClick={() => copiar(datosSpei.referencia, 'Referencia')}>Copiar referencia</button>
        </div>
        {FILAS.map(([etiqueta, valor]) => (
          <div key={etiqueta} style={S.fila}>
            <span style={S.etiqueta}>{etiqueta}</span>
            <span style={S.valor}>{valor}</span>
          </div>
        ))}

        {copiado && (
          <span role="status" style={{ padding: '10px 12px', borderRadius: 10, background: '#E8EEDB', color: '#4C6B27', fontSize: 13, fontWeight: 600 }}>
            {copiado}
          </span>
        )}

        <button type="button" style={S.primario} onClick={onTransferido}>Ya hice la transferencia</button>
        <button type="button" style={S.secundario} onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  )
}
