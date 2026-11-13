import { useState } from 'react'
import Modal from './Modal.jsx'
import { Campo, Area, Selector, Rejilla } from './Campos.jsx'

/* El tipo no es decorativo: los indicadores de Reportes cuentan por separado
   las caídas y las úlceras, que es como los pide la NOM-031-SSA3-2012. */
const TIPOS = [
  ['Caída', 'Caída'],
  ['Úlcera', 'Úlcera por presión'],
  ['Lesión', 'Lesión'],
  ['Error de medicación', 'Error de medicación'],
  ['Conducta', 'Alteración de conducta'],
  ['Otro', 'Otro']
]

const TITULO = {
  'Úlcera': 'úlcera por presión',
  'Error de medicación': 'error de medicación',
  Conducta: 'alteración de conducta'
}

export default function FormIncidente({ accent, residentes, ridInicial, onCerrar, onGuardar }) {
  const [rid, setRid] = useState(ridInicial || residentes[0].id)
  const [tipo, setTipo] = useState('Caída')
  const [hora, setHora] = useState('09:41')
  const [lugar, setLugar] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const guardar = () => {
    if (!descripcion.trim()) return
    const r = residentes.find((x) => x.id === rid)
    const tipoTexto = TITULO[tipo] || tipo.toLowerCase()
    onGuardar({
      rid, tipo, hora, tipoTexto,
      titulo: `${r.name.split(' ').slice(0, 2).join(' ')} · ${tipoTexto}`,
      detalle: `${hora}${lugar.trim() ? ` en ${lugar.trim()}` : ` en ${r.room}`}. ${descripcion.trim()}`
    })
  }

  return (
    <Modal
      titulo="Reportar incidente"
      descripcion="Queda registrado en las alertas del turno. En la app real se enviaría también a la bitácora de auditoría."
      accent={accent}
      textoGuardar="Registrar incidente"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Selector etiqueta="Residente" valor={rid} alCambiar={setRid}
        opciones={residentes.map((r) => [r.id, `${r.name} · ${r.room}`])} />
      <Rejilla>
        <Selector etiqueta="Tipo de incidente" valor={tipo} alCambiar={setTipo} opciones={TIPOS} />
        <Campo etiqueta="Hora" valor={hora} alCambiar={setHora} placeholder="09:41" />
      </Rejilla>
      <Campo etiqueta="Lugar" valor={lugar} alCambiar={setLugar} placeholder="Baño de 104-A, comedor…" />
      <Area etiqueta="Descripción" valor={descripcion} alCambiar={setDescripcion} filas={4}
        placeholder="Qué pasó, estado del residente, atención brindada…" required />
    </Modal>
  )
}
