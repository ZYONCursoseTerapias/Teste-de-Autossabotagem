import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saboteurs, juizInfo, saboteurLabels } from '../data/saboteurs'
import { saboteurKeys, getMaxScore } from '../data/questions'

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '')
const whatsappMessage = encodeURIComponent('Olá, Sandra! Acabei de fazer o Teste de Autossabotagem e gostaria de agendar minha sessão.')
const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : null

function ScoreBar({ pct, color = '#6CC24A', height = 8 }) {
  return (
    <div className="rounded-full overflow-hidden" style={{ background: '#e5e7eb', height }}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [scores, setScores] = useState(null)
  const [top, setTop] = useState([])

  useEffect(() => {
    const u = sessionStorage.getItem('sabotagem_user')
    const s = sessionStorage.getItem('sabotagem_scores')
    const t = sessionStorage.getItem('sabotagem_top')
    if (!u || !s || !t) { navigate('/'); return }
    setUser(JSON.parse(u))
    setScores(JSON.parse(s))
    setTop(JSON.parse(t))
  }, [navigate])

  if (!user || !scores) return null

  const firstName = user.nome.split(' ')[0]
  const emailSent = sessionStorage.getItem('sabotagem_email_status') === 'sent'

  const juizAutoMax = 15
  const juizOutrosMax = 15
  const juizCircMax = 10

  const juizAutoPct = Math.round((scores.juiz_auto / juizAutoMax) * 100)
  const juizOutrosPct = Math.round((scores.juiz_outros / juizOutrosMax) * 100)
  const juizCircPct = Math.round((scores.juiz_circ / juizCircMax) * 100)

  const rankedSaboteurs = saboteurKeys
    .map(k => ({ key: k, pct: Math.round((scores[k] / getMaxScore(k)) * 100) }))
    .sort((a, b) => b.pct - a.pct)

  function intensityLabel(pct) {
    if (pct >= 75) return { label: 'Alta', color: '#1E6F30' }
    if (pct >= 45) return { label: 'Moderada', color: '#6CC24A' }
    return { label: 'Baixa', color: '#9BE198' }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ede6 100%)' }}>

      <header className="py-6 px-4 text-center" style={{ background: '#1E6F30' }}>
        <p className="text-sm font-medium tracking-widest uppercase text-white opacity-80 mb-1">Sandrä Costa</p>
        <p className="text-xs tracking-widest uppercase" style={{ color: '#9BE198' }}>Terapeuta Holística · Comportamental</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Greeting */}
        <div className="text-center mb-8 fade-in">
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#6CC24A' }}>Seu resultado</p>
          <h1 className="playfair text-3xl font-semibold" style={{ color: '#1E6F30' }}>
            Olá, {firstName}!
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Veja abaixo os padrões que mais aparecem em você hoje.
          </p>
          <p className="text-sm mt-3" style={{ color: emailSent ? '#1E6F30' : '#9a6700' }}>
            {emailSent
              ? `Seu resultado também foi enviado para ${user.email}.`
              : 'Não foi possível enviar o email. Seu resultado completo está disponível nesta página.'}
          </p>
        </div>

        {/* ===== O JUIZ ===== */}
        <div className="rounded-2xl overflow-hidden shadow-md mb-6 fade-in" style={{ background: '#1E6F30' }}>
          <div className="px-6 py-5 border-b border-white border-opacity-20">
            <div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white opacity-60 mb-0.5">Sabotador Universal</p>
                <h2 className="text-xl font-semibold text-white playfair">{juizInfo.name}</h2>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-white opacity-80 leading-relaxed mb-6">{juizInfo.description}</p>

            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9BE198' }}>
              Como o Juiz age em você
            </p>

            {[
              { key: 'juiz_auto', pct: juizAutoPct },
              { key: 'juiz_outros', pct: juizOutrosPct },
              { key: 'juiz_circ', pct: juizCircPct },
            ].map(({ key, pct }) => {
              const mode = juizInfo.modes[key]
              const { label } = intensityLabel(pct)
              return (
                <div key={key} className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-white font-medium">{mode.label}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#EFBE7D', color: '#1E6F30' }}>
                      {label}
                    </span>
                  </div>
                  <ScoreBar pct={pct} color="#EFBE7D" height={8} />
                  <p className="text-xs mt-1.5 opacity-60 text-white">{mode.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ===== 9 CÚMPLICES ===== */}
        <div className="mb-6 fade-in">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1E6F30' }}>
            Seus 9 Sabotadores Cúmplices
          </p>

          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'white' }}>
            {rankedSaboteurs.map(({ key, pct }, idx) => {
              const info = saboteurs[key]
              const { label, color } = intensityLabel(pct)
              const isTop = top.includes(key)
              return (
                <div
                  key={key}
                  className="px-5 py-4 border-b last:border-b-0"
                  style={{ borderColor: '#f0ede6', background: isTop ? '#f0faf0' : 'white' }}
                >
                  <div className="flex items-center mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold" style={{ color: isTop ? '#1E6F30' : '#374151' }}>
                          {info.name}
                          {isTop && <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{ background: '#1E6F30', color: 'white' }}>Em destaque</span>}
                        </span>
                        <span className="text-xs font-bold" style={{ color }}>{label}</span>
                      </div>
                    </div>
                  </div>
                  <ScoreBar pct={pct} color={isTop ? '#1E6F30' : '#9BE198'} height={6} />
                </div>
              )
            })}
          </div>
        </div>

        {/* ===== TOP 2 DETALHADOS ===== */}
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1E6F30' }}>
          Seus sabotadores em destaque
        </p>

        {top.map((key, i) => {
          const info = saboteurs[key]
          const pct = Math.round((scores[key] / getMaxScore(key)) * 100)
          return (
            <div key={key} className="rounded-2xl overflow-hidden shadow-sm mb-4 fade-in" style={{ background: 'white', border: '2px solid #9BE198' }}>
              <div className="px-6 py-5 border-b" style={{ borderColor: '#9BE198', background: '#f0faf0' }}>
                <div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#6CC24A' }}>
                      {i === 0 ? 'Principal sabotadora' : 'Segunda sabotadora'}
                    </p>
                    <h3 className="playfair text-xl font-semibold" style={{ color: '#1E6F30' }}>{info.name}</h3>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{info.description}</p>

                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#1E6F30' }}>
                  Como isso aparece em você
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  {info.signs.map((sign, idx) => (
                    <li key={idx} className="text-sm text-gray-600 pl-1">{sign}</li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-500">Intensidade</span>
                    <span className="text-xs font-bold" style={{ color: '#1E6F30' }}>{pct}%</span>
                  </div>
                  <ScoreBar pct={pct} color="#1E6F30" height={8} />
                </div>
              </div>
            </div>
          )
        })}

        {/* ===== CTA ===== */}
        <div className="rounded-2xl p-6 text-center shadow-md mt-8 fade-in" style={{ background: 'linear-gradient(135deg, #1E6F30, #6CC24A)' }}>
          <p className="playfair text-xl font-semibold text-white mb-2">
            Pronta para transformar esses padrões?
          </p>
          <p className="text-sm text-white opacity-80 mb-5 leading-relaxed">
            Em uma sessão individual, vamos trabalhar juntas para identificar a origem dos seus sabotadores e criar estratégias reais de mudança.
          </p>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#EFBE7D', color: '#1E6F30' }}
            >
              Agendar minha sessão
            </a>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Sandrä Costa | Terapeuta Holística e Comportamental
        </p>
      </main>
    </div>
  )
}
