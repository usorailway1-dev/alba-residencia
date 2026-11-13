import { useState } from 'react'
import Modal from './Modal.jsx'
import { Campo, Area, Selector, Casillas } from './Campos.jsx'
import { CONSISTENCIAS, DIETAS, ALERGENOS } from '../../data/cocina.js'

const OPCIONES_DIETA = Object.values(DIETAS).map((d) => [d.clave, d.label])
const OPCIONES_ALERGENO = Object.values(ALERGENOS).map((a) => [a.clave, a.label])

export default function FormDieta({ accent, dieta, nombre, onCerrar, onGuardar }) {
  const [etiqueta, setEtiqueta] = useState(dieta.etiqueta)
  const [flags, setFlags] = useState(dieta.flags)
  const [consistencia, setConsistencia] = useState(dieta.consistencia)
  const [evitar, setEvitar] = useState(dieta.evitar)
  const [nota, setNota] = useState(dieta.nota)

  const guardar = () => {
    if (!etiqueta.trim()) return
    onGuardar({ etiqueta: etiqueta.trim(), flags, consistencia, evitar, nota: nota.trim() })
  }

  return (
    <Modal
      titulo={`Dieta de ${nombre}`}
      descripcion="Lo que cambies aquí se refleja en el menú de la semana: las adaptaciones y el conteo de porciones se recalculan solos."
      accent={accent}
      textoGuardar="Guardar dieta"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Campo etiqueta="Cómo aparece en la ficha" valor={etiqueta} alCambiar={setEtiqueta} required />
      <Casillas etiqueta="Restricciones" opciones={OPCIONES_DIETA} valores={flags} alCambiar={setFlags} />
      <Selector etiqueta="Consistencia" valor={consistencia} alCambiar={setConsistencia}
        opciones={CONSISTENCIAS.map((c) => [c, c])} />
      <Casillas etiqueta="Alergias alimentarias" opciones={OPCIONES_ALERGENO} valores={evitar} alCambiar={setEvitar} />
      <Area etiqueta="Indicaciones para cocina" valor={nota} alCambiar={setNota} filas={3}
        placeholder="Cómo se le sirve, qué vigilar, preferencias…" />
    </Modal>
  )
}
