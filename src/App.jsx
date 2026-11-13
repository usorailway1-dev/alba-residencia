import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Panel from './panel/Panel.jsx'
import PortalFamiliar from './familiar/PortalFamiliar.jsx'
import Switcher from './Switcher.jsx'

/* El portal familiar monta su propio Switcher en flujo (ver Switcher.jsx),
   así que aquí solo se añade el flotante a las rutas de escritorio. */
const conSwitcher = (pantalla) => (
  <>
    {pantalla}
    <Switcher modo="fijo" />
  </>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={conSwitcher(<Panel />)} />
        <Route path="/familiar" element={<PortalFamiliar />} />
        <Route path="*" element={conSwitcher(<Panel />)} />
      </Routes>
    </BrowserRouter>
  )
}
