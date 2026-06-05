import { useState, useEffect } from 'react'
import { getAllResults } from '../lib/supabase'
import { saboteurLabels } from '../data/saboteurs'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'sandra2024'

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Senha incorreta.')
    }
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    getAllResults().then(data => { setResults(data); setLoading(false) }).catch(() => setLoading(false))
  }, [authed])

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ede6 100%)' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="playfair text-2xl font-semibold" style={{ color: '#1E6F30' }}>Painel Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Sandrä Costa · Teste de Autossabotagem</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl p-8 shadow-sm" style={{ background: 'white' }}>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#1E6F30' }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none mb-4"
              style={{ borderColor: '#9BE198', background: '#f9f7f4' }}
              placeholder="••••••••"
            />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #1E6F30, #6CC24A)' }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ede6 100%)' }}>
      <header className="py-5 px-6 shadow-sm flex justify-between items-center" style={{ background: '#1E6F30' }}>
        <div>
          <p className="text-white font-semibold">Painel Admin</p>
          <p className="text-xs opacity-60 text-white">Teste de Autossabotagem · Sandrä Costa</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: '#EFBE7D', color: '#1E6F30' }}>
          {results.length} resultado{results.length !== 1 ? 's' : ''}
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading && <p className="text-center text-sm text-gray-500">Carregando...</p>}

        {!loading && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-sm text-gray-500">Nenhum resultado ainda.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map(r => (
              <div key={r.id} className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'white' }}>
                <div className="px-5 py-4 border-b flex justify-between items-start" style={{ borderColor: '#f0ede6', background: '#f9f7f4' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1E6F30' }}>{r.nome}</p>
                    <p className="text-xs text-gray-500">{r.email}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6CC24A' }}>Em destaque</p>
                  <div className="flex flex-wrap gap-2">
                    {(r.top_saboteurs || []).map(s => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: '#1E6F30', color: 'white' }}>
                        {saboteurLabels[s] || s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
