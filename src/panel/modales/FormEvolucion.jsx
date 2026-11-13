import { useState } from 'react'
import Modal from './Modal.jsx'
import { Area, Selector } from './Campos.jsx'

const FIRMANTES = [
  ['Dra. Ana Morales', 'Dra. Ana Morales'],
  ['Dr. Luis Pineda', 'Dr. Luis Pineda'],
  ['Enf. Laura Pérez', 'Enf. Laura Pérez']
]

export default function FormEvolucion({ accent, residente, onCerrar, onGuardar }) {
  const [nota, setNota] = useState('')
  const [firmante, setFirmante] = useState('Dra. Ana Morales')

  const guardar = () => {
    if (!nota.trim()) return
    onGuardar({
      nota: nota.trim(),
      firma: `Firmada por ${firmante} · Céd. Prof. ••••••• · 9 nov 2026, 09:41 · Registro inmutable`
    })
  }

  return (
    <Modal
      titulo="Nueva evolución médica"
      descripcion={`Sustituye la última evolución de ${residente.name}. En la app real cada nota se guardaría encadenada y sin poder editarse.`}
      accent={accent}
      textoGuardar="Firmar y guardar"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Area etiqueta="Nota clínica" valor={nota} alCambiar={setNota} filas={6}
        placeholder="Evolución, hallazgos, indicaciones…" required />
      <Selector etiqueta="Firma" valor={firmante} alCambiar={setFirmante} opciones={FIRMANTES} />
    </Modal>
  )
}
