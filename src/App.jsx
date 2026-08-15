import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Registration from './pages/Registration'
import Test from './pages/Test'
import Results from './pages/Results'

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/registro" element={<Registration />} />
        <Route path="/teste" element={<Test />} />
        <Route path="/resultado" element={<Results />} />
      </Routes>
    </>
  )
}
