import { Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Registration from './pages/Registration'
import Test from './pages/Test'
import Results from './pages/Results'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/registro" element={<Registration />} />
      <Route path="/teste" element={<Test />} />
      <Route path="/resultado" element={<Results />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
