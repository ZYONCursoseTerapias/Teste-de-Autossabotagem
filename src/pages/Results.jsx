import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saboteurs, juizInfo } from '../data/saboteurs'
import { buildFullResult, formatScore } from '../lib/result'
import emailjs from '@emailjs/browser'

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '') || '5511957947776'
const whatsappMessage = encodeURIComponent('Olá, Sandrä. Fiz o Teste de Autossabotagem e quero agendar meu Atendimento de Análise dos Sabotadores.')
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

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
  const [resendStatus, setResendStatus] = useState('idle')

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

  const result = buildFullResult(scores)
  const rankedSaboteurs = result.ranked

  async function resendRealResult() {
    setResendStatus('sending')
    const primary = result.primary
    const second = saboteurs[rankedSaboteurs[1].key]
    const third = saboteurs[rankedSaboteurs[2].key]
    const commonParams = {
      to_name: user.nome,
      to_email: user.email,
      email: user.email,
      user_email: user.email,
      recipient_email: user.email,
      client_name: user.nome,
      user_name: user.nome,
      client_email: user.email,
      client_phone: user.telefone,
      telefone: user.telefone,
      phone: user.telefone,
      date: new Date().toLocaleString('pt-BR'),
      sabotador_principal: primary.name,
      dominant_trait: primary.name,
      second_name: second.name,
      third_name: third.name,
      full_detail: result.fullResult,
      critico_nome: juizInfo.name,
      critico_descricao: juizInfo.description,
      critico_resultado: result.criticSummary,
      descricao_principal: primary.description,
      pontuacoes: result.scoresSummary,
      resultado: result.fullResult,
      message: result.fullResult,
      atendimento_link: whatsappLink,
      whatsapp_link: whatsappLink,
      reply_to: user.email,
    }

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_a1x68ec'
      const resultTemplateId = import.meta.env.VITE_EMAILJS_RESULT_TEMPLATE_ID || 'template_rm9d1le'
      const adminTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_u7dvf9b'
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Zl7xHYzIlna9G5ST3'
      await emailjs.send(serviceId, resultTemplateId, commonParams, { publicKey })
      await emailjs.send(serviceId, adminTemplateId, {
        ...commonParams,
        to_name: 'Sandrä',
        from_name: user.nome,
        from_email: user.email,
      }, { publicKey })
      sessionStorage.setItem('sabotagem_email_status', 'sent')
      setResendStatus('sent')
    } catch (error) {
      console.error('Erro ao reenviar o resultado verdadeiro:', error)
      setResendStatus('failed')
    }
  }

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
          {!emailSent && (
            <button
              type="button"
              onClick={resendRealResult}
              disabled={resendStatus === 'sending'}
              className="mt-4 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: '#1E6F30' }}
            >
              {resendStatus === 'sending' ? 'Enviando resultado...' : 'Enviar meu resultado verdadeiro por email'}
            </button>
          )}
          {resendStatus === 'sent' && (
            <p className="text-sm mt-3" style={{ color: '#1E6F30' }}>Seu resultado verdadeiro foi enviado aos dois emails.</p>
          )}
          {resendStatus === 'failed' && (
            <p className="text-sm mt-3" style={{ color: '#9a6700' }}>O envio não foi concluído. Tente novamente.</p>
          )}
        </div>

        {/* ===== O CRÍTICO ===== */}
        <div className="rounded-2xl overflow-hidden shadow-md mb-6 fade-in" style={{ background: '#1E6F30' }}>
          <div className="px-6 py-5 border-b border-white border-opacity-20">
            <div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white opacity-60 mb-0.5">Sabotadora comum a todas as pessoas</p>
                <h2 className="text-xl font-semibold text-white playfair">{juizInfo.name}</h2>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-white opacity-80 leading-relaxed mb-4">{juizInfo.description}</p>
            <p className="text-sm text-white opacity-80 leading-relaxed mb-4">{juizInfo.operation}</p>
            <ul className="space-y-1 list-disc pl-5 mb-4">
              {juizInfo.lies.map((lie) => <li key={lie} className="text-sm text-white opacity-80">“{lie}”</li>)}
            </ul>
            <p className="text-sm text-white opacity-80 leading-relaxed mb-4">{juizInfo.outcome}</p>
            <p className="text-sm text-white opacity-80 leading-relaxed mb-6">{juizInfo.takeover}</p>

            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9BE198' }}>
              Como o Crítico age em você
            </p>

            {result.criticModes.map(({ key, score, max, pct }) => {
              const mode = juizInfo.modes[key]
              const { label } = intensityLabel(pct)
              return (
                <div key={key} className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-white font-medium">{mode.label}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#EFBE7D', color: '#1E6F30' }}>
                      {label} · {score} de {max}
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
            {rankedSaboteurs.map(({ key, score, pct }) => {
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
                        <span className="text-xs font-bold" style={{ color }}>{label} · {formatScore(score)} de 10</span>
                      </div>
                    </div>
                  </div>
                  <ScoreBar pct={pct} color={isTop ? '#1E6F30' : '#9BE198'} height={6} />
                </div>
              )
            })}
          </div>
        </div>

        {/* ===== SABOTADORA PRINCIPAL DETALHADA ===== */}
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1E6F30' }}>
          Sua sabotadora em destaque
        </p>

        {top.slice(0, 1).map((key) => {
          const info = saboteurs[key]
          const primaryScore = rankedSaboteurs.find(item => item.key === key)
          const pct = primaryScore?.pct || 0
          return (
            <div key={key} className="rounded-2xl overflow-hidden shadow-sm mb-4 fade-in" style={{ background: 'white', border: '2px solid #9BE198' }}>
              <div className="px-6 py-5 border-b" style={{ borderColor: '#9BE198', background: '#f0faf0' }}>
                <div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#6CC24A' }}>
                      Principal sabotadora
                    </p>
                    <h3 className="playfair text-xl font-semibold" style={{ color: '#1E6F30' }}>{info.name}</h3>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                {[
                  ['Como ela nasce', info.origin],
                  ['Como ela funciona', info.operation],
                  ['A mentira que ela conta', null],
                  ['O resultado', info.outcome],
                  [`Quando a ${info.name} assume o controle`, info.takeover],
                ].map(([title, content]) => (
                  <section key={title} className="mb-5 last:mb-0">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#1E6F30' }}>{title}</h4>
                    {content ? (
                      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
                    ) : (
                      <ul className="space-y-2 list-disc pl-5">
                        {info.lies.map((lie) => <li key={lie} className="text-sm text-gray-600 pl-1">“{lie}”</li>)}
                      </ul>
                    )}
                  </section>
                ))}

                <div className="mt-5 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-500">Intensidade</span>
                    <span className="text-xs font-bold" style={{ color: '#1E6F30' }}>{formatScore(primaryScore?.score || 0)} de 10</span>
                  </div>
                  <ScoreBar pct={pct} color="#1E6F30" height={8} />
                </div>
              </div>
            </div>
          )
        })}

        {/* ===== CTA ===== */}
        <div className="rounded-2xl p-6 text-center shadow-md mt-8 fade-in" style={{ background: 'linear-gradient(135deg, #1E6F30, #6CC24A)' }}>
          <p className="playfair text-xl font-semibold text-white mb-3">
            Quer conhecer o seu Mapa de Autossabotagem?
          </p>
          <p className="text-sm text-white opacity-80 mb-5 leading-relaxed">
            No Atendimento de Análise dos Sabotadores, você identifica e compreende como esses padrões podem interferir em diferentes áreas da sua vida.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#EFBE7D', color: '#1E6F30' }}
          >
            Quero Agendar meu Atendimento de Análise dos Sabotadores
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Sandrä Costa | Terapeuta Holística e Comportamental
        </p>
      </main>
    </div>
  )
}
