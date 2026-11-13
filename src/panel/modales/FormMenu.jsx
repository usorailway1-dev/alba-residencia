import { useState } from 'react'
import Modal from './Modal.jsx'
import { Campo, Area, Casillas } from './Campos.jsx'
import { ALERGENOS } from '../../data/cocina.js'

const OPCIONES = Object.values(ALERGENOS).map((a) => [a.clave, a.label])

export default function FormMenu({ accent, tiempo, dia, comida, onCerrar, onGuardar }) {
  const [plato, setPlato] = useState(comida.plato)
  const [alergenos, setAlergenos] = useState(comida.alergenos)
  const [alternativas, setAlternativas] = useState(comida.alternativas)
  const [error, setError] = useState('')

  const guardar = () => {
    if (!plato.trim()) return setError('Escribe qué se sirve.')
    // Solo se guardan las alternativas de los alérgenos que siguen marcados.
    const limpias = Object.fromEntries(alergenos
      .filter((a) => alternativas[a]?.trim())
      .map((a) => [a, alternativas[a].trim()]))
    onGuardar({ dia, tiempo: tiempo.id, plato: plato.trim(), alergenos, alternativas: limpias })
  }

  return (
    <Modal
      titulo={`${tiempo.nombre} · ${tiempo.hora}`}
      descripcion="Marca lo que contiene el plato: quien no pueda comerlo aparecerá señalado hasta que registres su alternativa."
      accent={accent}
      textoGuardar="Guardar tiempo"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Area etiqueta="Qué se sirve" valor={plato} alCambiar={(v) => { setPlato(v); setError('') }} filas={3} required />
      <Casillas etiqueta="Contiene" opciones={OPCIONES} valores={alergenos} alCambiar={setAlergenos} />

      {alergenos.map((a) => (
        <Campo key={a} etiqueta={`Alternativa sin ${ALERGENOS[a].label.toLowerCase()}`}
          valor={alternativas[a] || ''}
          alCambiar={(v) => setAlternativas((prev) => ({ ...prev, [a]: v }))}
          placeholder="Qué se sirve en su lugar" />
      ))}

      {error && <span style={{ fontSize: 13, fontWeight: 600, color: '#B42318' }}>{error}</span>}
    </Modal>
  )
}
