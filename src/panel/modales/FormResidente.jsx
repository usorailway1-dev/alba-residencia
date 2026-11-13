import { useState } from 'react'
import Modal from './Modal.jsx'
import { Campo, Area, Selector, Rejilla } from './Campos.jsx'

const ESTADOS = [['ok', 'Estable'], ['warn', 'Vigilancia'], ['bad', 'Atención']]

export default function FormResidente({ accent, onCerrar, onGuardar }) {
  const [f, setF] = useState({
    name: '', age: '', room: '', t: 'ok',
    alergias: 'Ninguna conocida', dx: '', contacto: '', tel: '',
    dieta: 'Normal', barthel: '70', norton: '17', tinetti: '21'
  })
  const set = (k) => (v) => setF((prev) => ({ ...prev, [k]: v }))

  const guardar = () => {
    if (!f.name.trim() || !f.age || !f.room.trim()) return
    onGuardar({
      ...f,
      name: f.name.trim(),
      age: Number(f.age),
      room: f.room.trim(),
      dx: f.dx.trim() || 'Sin diagnósticos registrados',
      contacto: f.contacto.trim() || 'Pendiente de registrar',
      tel: f.tel.trim() || '0000',
      barthel: Number(f.barthel), norton: Number(f.norton), tinetti: Number(f.tinetti)
    })
  }

  return (
    <Modal
      titulo="Nuevo ingreso"
      descripcion="Alta de residente. Las escalas pueden ajustarse después, en la primera valoración."
      accent={accent}
      textoGuardar="Dar de alta"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Campo etiqueta="Nombre completo" valor={f.name} alCambiar={set('name')}
        placeholder="Nombre y apellidos" required />
      <Rejilla columnas={3}>
        <Campo etiqueta="Edad" valor={f.age} alCambiar={set('age')} type="number" min="0" max="120" placeholder="80" required />
        <Campo etiqueta="Habitación" valor={f.room} alCambiar={set('room')} placeholder="107-A" required />
        <Selector etiqueta="Estado" valor={f.t} alCambiar={set('t')} opciones={ESTADOS} />
      </Rejilla>
      <Rejilla>
        <Campo etiqueta="Responsable" valor={f.contacto} alCambiar={set('contacto')} placeholder="Nombre (parentesco)" />
        <Campo etiqueta="Teléfono (4 últimos)" valor={f.tel} alCambiar={set('tel')} maxLength="4" placeholder="1234" />
      </Rejilla>
      <Rejilla>
        <Campo etiqueta="Alergias" valor={f.alergias} alCambiar={set('alergias')} />
        <Campo etiqueta="Dieta" valor={f.dieta} alCambiar={set('dieta')} />
      </Rejilla>
      <Area etiqueta="Diagnósticos activos" valor={f.dx} alCambiar={set('dx')} filas={2}
        placeholder="Separados por ·" />
      <Rejilla columnas={3}>
        <Campo etiqueta="Barthel" valor={f.barthel} alCambiar={set('barthel')} type="number" min="0" max="100" />
        <Campo etiqueta="Norton" valor={f.norton} alCambiar={set('norton')} type="number" min="5" max="20" />
        <Campo etiqueta="Tinetti" valor={f.tinetti} alCambiar={set('tinetti')} type="number" min="0" max="28" />
      </Rejilla>
    </Modal>
  )
}
