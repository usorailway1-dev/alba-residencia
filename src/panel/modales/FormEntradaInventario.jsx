import { useState } from 'react'
import Modal from './Modal.jsx'
import { Campo, Selector, Rejilla } from './Campos.jsx'

const S = {
  error: { fontSize: 13, fontWeight: 600, color: '#B42318' },
  pista: { fontSize: 13, color: '#5B6675', lineHeight: 1.5 }
}

export default function FormEntradaInventario({ accent, articulos, onCerrar, onGuardar }) {
  const [articuloId, setArticuloId] = useState(articulos[0].id)
  const [cantidad, setCantidad] = useState('')
  const [lote, setLote] = useState('')
  const [caducidad, setCaducidad] = useState('')
  const [error, setError] = useState('')

  const a = articulos.find((x) => x.id === articuloId)

  const guardar = () => {
    if (!Number(cantidad) || Number(cantidad) < 1) {
      return setError('Escribe cuántas unidades entran.')
    }
    onGuardar({ articuloId, cantidad: Number(cantidad), lote: lote.trim(), caducidad })
  }

  return (
    <Modal
      titulo="Registrar entrada de inventario"
      descripcion="Para lo que llega de la familia o del proveedor. Si el lote es nuevo, sustituye al anterior."
      accent={accent}
      textoGuardar="Registrar entrada"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Selector etiqueta="Artículo" valor={articuloId} alCambiar={(v) => { setArticuloId(v); setError('') }}
        opciones={articulos.map((x) => [x.id, x.persona ? `${x.nombre} · ${x.persona}` : `${x.nombre} · almacén general`])} />

      <span style={S.pista}>
        Ahora hay {a.existencias} {a.unidad}
        {a.lote ? ` del lote ${a.lote}` : ' sin lote registrado'}
        {a.caducidad ? `, que caduca el ${a.caducidadTexto}.` : '.'}
      </span>

      <Rejilla>
        <Campo etiqueta={`Cantidad que entra (${a.unidad})`} valor={cantidad}
          alCambiar={(v) => { setCantidad(v); setError('') }}
          type="number" min="1" inputMode="numeric" placeholder={String(a.sugerido)} required />
        <Campo etiqueta="Lote (opcional)" valor={lote} alCambiar={setLote} placeholder={a.lote || 'Sin lote'} />
      </Rejilla>

      <Campo etiqueta="Caducidad (opcional)" valor={caducidad} alCambiar={setCaducidad} type="date" />

      {error && <span style={S.error}>{error}</span>}
    </Modal>
  )
}
