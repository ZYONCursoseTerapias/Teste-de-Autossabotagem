import { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { blocks, calcScores, getTopSaboteurs, getMaxScore, saboteurKeys } from '../data/questions'
import { saboteurs, juizInfo, saboteurLabels } from '../data/saboteurs'
import { saveResult } from '../lib/supabase'
import emailjs from '@emailjs/browser'

const LABELS = ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente']
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '') || '5511957947776'
const WHATSAPP_MESSAGE = encodeURIComponent('Olá, Sandrä. Fiz o Teste de Autossabotagem e quero agendar meu Atendimento de Análise dos Sabotadores.')
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`
const SERVICE_TITLE = 'Quer conhecer o seu Mapa de Autossabotagem?'
const SERVICE_DESCRIPTION = 'No Atendimento de Análise dos Sabotadores, você identifica e compreende como esses padrões podem interferir em diferentes áreas da sua vida.'

export default function Test() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentBlock, setCurrentBlock] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const u = sessionStorage.getItem('sabotagem_user')
    if (!u) { navigate('/registro'); return }
    setUser(JSON.parse(u))
  }, [navigate])

  const block = blocks[currentBlock]
  const totalBlocks = blocks.length
  const progress = Math.round(((currentBlock) / totalBlocks) * 100)

  const allAnswered = block.questions.every(q => answers[q.id] !== undefined)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [currentBlock])

  function handleAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  function handleNext() {
    if (!allAnswered) return
    if (currentBlock < totalBlocks - 1) {
      setCurrentBlock(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  function handlePrev() {
    if (currentBlock > 0) {
      setCurrentBlock(prev => prev - 1)
    }
  }

  async function handleSubmit() {
    setSaving(true)
    try {
      const scores = calcScores(answers)
      const topSaboteurs = getTopSaboteurs(scores)
      const rankedSaboteurs = saboteurKeys
        .map(key => ({
          key,
          name: saboteurLabels[key],
          pct: Math.round((scores[key] / getMaxScore(key)) * 100),
        }))
        .sort((a, b) => b.pct - a.pct)

      const primary = saboteurs[topSaboteurs[0]]
      const second = saboteurs[topSaboteurs[1]]
      const third = saboteurs[topSaboteurs[2]]
      const scoresSummary = rankedSaboteurs
        .map(item => `${item.name}: ${item.pct}%`)
        .join('\n')
      const judgeSummary = [
        `Autocrítica: ${Math.round((scores.juiz_auto / 15) * 100)}%`,
        `Crítica aos outros: ${Math.round((scores.juiz_outros / 15) * 100)}%`,
        `Crítica às circunstâncias: ${Math.round((scores.juiz_circ / 10) * 100)}%`,
      ].join('\n')
      const fullResult = [
        'Sabotador comum a todas as pessoas: O Crítico',
        juizInfo.description,
        '',
        'Como o Crítico age em você:',
        judgeSummary,
        '',
        `Principal sabotadora: ${primary.name}`,
        primary.description,
        '',
        'Seus 9 Sabotadores Cúmplices:',
        scoresSummary,
        '',
        SERVICE_TITLE,
        SERVICE_DESCRIPTION,
        `Solicite seu atendimento: ${WHATSAPP_LINK}`,
      ].join('\n')

      try {
        await saveResult({ nome: user.nome, email: user.email, telefone: user.telefone, answers, scores, topSaboteurs })
      } catch (saveErr) {
        console.warn('Não foi possível salvar o resultado no Supabase:', saveErr)
      }

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_a1x68ec'
      const adminTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_x1s01ct'
      const resultTemplateId = import.meta.env.VITE_EMAILJS_RESULT_TEMPLATE_ID || 'template_a2n6s9d'
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Zl7xHYzIlna9G5ST3'
      let emailSent = false

      try {
        await emailjs.send(serviceId, resultTemplateId, {
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
          full_detail: fullResult,
          critico_nome: juizInfo.name,
          critico_descricao: juizInfo.description,
          critico_resultado: judgeSummary,
          juiz_nome: juizInfo.name,
          juiz_descricao: juizInfo.description,
          descricao_principal: primary.description,
          pontuacoes: scoresSummary,
          juiz: judgeSummary,
          resultado: fullResult,
          message: fullResult,
          atendimento_titulo: SERVICE_TITLE,
          atendimento_descricao: SERVICE_DESCRIPTION,
          atendimento_link: WHATSAPP_LINK,
          whatsapp_link: WHATSAPP_LINK,
          reply_to: user.email,
        }, { publicKey })
        emailSent = true
      } catch (emailErr) {
        console.warn('Erro ao enviar o resultado por e-mail:', emailErr)
      }

      try {
        await emailjs.send(serviceId, adminTemplateId, {
          to_name: 'Sandrä',
          from_name: user.nome,
          from_email: user.email,
          client_name: user.nome,
          client_email: user.email,
          client_phone: user.telefone,
          telefone: user.telefone,
          date: new Date().toLocaleString('pt-BR'),
          sabotador_principal: primary.name,
          dominant_trait: primary.name,
          second_name: second.name,
          third_name: third.name,
          full_detail: fullResult,
          critico_nome: juizInfo.name,
          critico_descricao: juizInfo.description,
          critico_resultado: judgeSummary,
          juiz_nome: juizInfo.name,
          juiz_descricao: juizInfo.description,
          resultado: fullResult,
          atendimento_titulo: SERVICE_TITLE,
          atendimento_descricao: SERVICE_DESCRIPTION,
          atendimento_link: WHATSAPP_LINK,
          whatsapp_link: WHATSAPP_LINK,
          message: `Novo Teste de Autossabotagem concluído.\n\nCliente: ${user.nome}\nEmail: ${user.email}\nCelular: ${user.telefone}\n\n${fullResult}`,
          reply_to: user.email,
        }, { publicKey })
      } catch (adminEmailErr) {
        console.warn('Erro ao enviar a notificação administrativa:', adminEmailErr)
      }

      sessionStorage.setItem('sabotagem_scores', JSON.stringify(scores))
      sessionStorage.setItem('sabotagem_top', JSON.stringify(topSaboteurs))
      sessionStorage.setItem('sabotagem_email_status', emailSent ? 'sent' : 'failed')
      navigate('/resultado')
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ede6 100%)' }}>

      <header className="py-4 px-4 text-center" style={{ background: '#1E6F30' }}>
        <p className="text-xs font-medium tracking-widest uppercase text-white opacity-80">Sandrä Costa · Teste de Autossabotagem</p>
      </header>

      {/* Progress */}
      <div className="w-full h-1.5" style={{ background: '#9BE198' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: '#1E6F30' }}
        />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#1E6F30' }}>
            Parte {currentBlock + 1} de {totalBlocks}
          </span>
          <span className="text-xs text-gray-400">{progress}% concluído</span>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm mb-6" style={{ background: 'white' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#9BE198', background: '#f9f7f4' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#1E6F30' }}>
              Indique sua concordância com cada afirmação
            </p>
          </div>

          <div className="divide-y" style={{ divideColor: '#f0ede6' }}>
            {block.questions.map((q, idx) => (
              <div key={q.id} className="px-6 py-5">
                <p className="text-sm font-medium text-gray-800 mb-4 leading-relaxed">
                  <span className="font-bold mr-2" style={{ color: '#6CC24A' }}>{idx + 1}.</span>
                  {q.text}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <div key={val} className="min-w-0 text-center">
                      <button
                        onClick={() => handleAnswer(q.id, val)}
                        title={LABELS[val - 1]}
                        aria-label={`${val}: ${LABELS[val - 1]}`}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border-2"
                        style={{
                          borderColor: answers[q.id] === val ? '#1E6F30' : '#e5e7eb',
                          background: answers[q.id] === val ? '#1E6F30' : 'white',
                          color: answers[q.id] === val ? 'white' : '#6b7280',
                        }}
                      >
                        {val}
                      </button>
                      <span className="block mt-1.5 text-[10px] leading-tight text-gray-400 break-words">
                        {LABELS[val - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!allAnswered && (
          <p className="text-center text-xs text-gray-400 mb-4">Responda todas as afirmações para continuar.</p>
        )}

        <div className="flex gap-3">
          {currentBlock > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3.5 rounded-2xl font-semibold text-sm border-2 transition-all duration-150"
              style={{ borderColor: '#1E6F30', color: '#1E6F30', background: 'white' }}
            >
              Anterior
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!allAnswered || saving}
            className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-md transition-all duration-200 disabled:opacity-40"
            style={{ background: allAnswered ? 'linear-gradient(135deg, #1E6F30, #6CC24A)' : '#9BE198' }}
          >
            {saving ? 'Salvando...' : currentBlock === totalBlocks - 1 ? 'Ver meu resultado' : 'Próximo'}
          </button>
        </div>
      </main>
      <footer className="px-4 py-5 text-center text-xs text-gray-400">
        Sandrä Costa | Terapeuta Holística e Comportamental
      </footer>
    </div>
  )
}
