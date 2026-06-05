import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Registration() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Por favor, informe seu nome.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Por favor, informe um e-mail válido.'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    sessionStorage.setItem('sabotagem_user', JSON.stringify(form))
    navigate('/teste')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ede6 100%)' }}>

      <header className="py-6 px-4 text-center" style={{ background: '#1E6F30' }}>
        <p className="text-sm font-medium tracking-widest uppercase text-white opacity-80 mb-1">Sandrä Costa</p>
        <p className="text-xs tracking-widest uppercase" style={{ color: '#9BE198' }}>Terapeuta Holística · Comportamental</p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h2 className="playfair text-3xl font-semibold mb-2" style={{ color: '#1E6F30' }}>Antes de começar</h2>
            <p className="text-sm text-gray-500">Seus resultados serão enviados para o seu e-mail.</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl p-8 shadow-sm" style={{ background: 'white' }}>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#1E6F30' }}>
                Primeiro nome
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="Como posso te chamar?"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: errors.nome ? '#e53e3e' : '#9BE198', background: '#f9f7f4' }}
              />
              {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
            </div>

            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#1E6F30' }}>
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: errors.email ? '#e53e3e' : '#9BE198', background: '#f9f7f4' }}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-white font-semibold text-base tracking-wide shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1E6F30, #6CC24A)' }}
            >
              Continuar
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Suas informações são confidenciais e não serão compartilhadas com terceiros.
          </p>
        </div>
      </main>
    </div>
  )
}
