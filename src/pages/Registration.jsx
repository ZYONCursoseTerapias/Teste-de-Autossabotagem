import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Registration() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', pais: '55', ddd: '', celular: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Por favor, informe seu nome.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Por favor, informe um email válido.'
    if (!/^\d{1,3}$/.test(form.pais)) e.pais = 'Informe o código do país.'
    if (!/^\d{2,3}$/.test(form.ddd)) e.ddd = 'Informe o código da cidade.'
    if (!/^\d{8,9}$/.test(form.celular)) e.celular = 'Informe um número de celular válido.'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    const user = { ...form, telefone: `+${form.pais}${form.ddd}${form.celular}` }
    sessionStorage.setItem('sabotagem_user', JSON.stringify(user))
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
            <p className="text-sm text-gray-500">Seus resultados serão enviados para o seu email.</p>
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

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#1E6F30' }}>
                Email
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

            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#1E6F30' }}>
                Celular
              </label>
              <div className="grid grid-cols-[72px_76px_1fr] gap-2">
                <input
                  type="tel"
                  inputMode="numeric"
                  aria-label="Código do país"
                  value={form.pais}
                  onChange={e => setForm({ ...form, pais: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                  placeholder="55"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: errors.pais ? '#e53e3e' : '#9BE198', background: '#f9f7f4' }}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  aria-label="Código da cidade"
                  value={form.ddd}
                  onChange={e => setForm({ ...form, ddd: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                  placeholder="DDD"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: errors.ddd ? '#e53e3e' : '#9BE198', background: '#f9f7f4' }}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  aria-label="Número do celular"
                  value={form.celular}
                  onChange={e => setForm({ ...form, celular: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                  placeholder="Número do celular"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: errors.celular ? '#e53e3e' : '#9BE198', background: '#f9f7f4' }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">País, cidade e número.</p>
              {(errors.pais || errors.ddd || errors.celular) && (
                <p className="text-xs text-red-500 mt-1">{errors.pais || errors.ddd || errors.celular}</p>
              )}
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
      <footer className="px-4 py-5 text-center text-xs text-gray-400">
        Sandrä Costa | Terapeuta Holística e Comportamental
      </footer>
    </div>
  )
}
