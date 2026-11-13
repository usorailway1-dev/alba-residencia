import { useState } from 'react'
import Modal from './Modal.jsx'
import { Area, Selector, Rejilla } from './Campos.jsx'
import { TURNOS } from '../../data/personal.js'

const OPCIONES_TURNO = ['M', 'V', 'N'].map((c) => [c, TURNOS[c].nombre])

export default function FormEntrega({ accent, personal, onCerrar, onGuardar }) {
  const [pid, setPid] = useState('p1')
  const [de, setDe] = useState('M')
  const [a, setA] = useState('V')
  const [texto, setTexto] = useState('')

  const guardar = () => {
    if (!texto.trim()) return
    onGuardar({ pid, de, a, texto: texto.trim() })
  }

  return (
    <Modal
      titulo="Nueva entrega de turno"
      descripcion="Queda firmada con tu nombre y la hora. En la app real no se podría editar después."
      accent={accent}
      textoGuardar="Firmar entrega"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Selector etiqueta="Quién entrega" valor={pid} alCambiar={setPid}
        opciones={personal.map((p) => [p.id, `${p.name} · ${p.rol}`])} />
      <Rejilla>
        <Selector etiqueta="Turno que sale" valor={de} alCambiar={setDe} opciones={OPCIONES_TURNO} />
        <Selector etiqueta="Turno que entra" valor={a} alCambiar={setA} opciones={OPCIONES_TURNO} />
      </Rejilla>
      <Area etiqueta="Novedades del turno" valor={texto} alCambiar={setTexto} filas={6}
        placeholder="Estado de los residentes, pendientes, medicación, incidencias…" required />
    </Modal>
  )
}
