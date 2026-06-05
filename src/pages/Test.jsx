import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { blocks, calcScores, getTopSaboteurs } from '../data/questions'
import { saveResult } from '../lib/supabase'
import emailjs from 'emailjs-com'

const LABELS = ['Discordo fortemente', 'Discordo', 'Neutro', 'Concordo', 'Concordo fortemente']

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

  function handleAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  function handleNext() {
    if (!allAnswered) return
    if (currentBlock < totalBlocks - 1) {
      setCurrentBlock(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  function handlePrev() {
    if (currentBlock > 0) {
      setCurrentBlock(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleSubmit() {
    setSaving(true)
    try {
      const scores = calcScores(answers)
      const topSaboteurs = getTopSaboteurs(scores)

      await saveResult({ nome: user.nome, email: user.email, answers, scores, topSaboteurs })

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(serviceId, templateId, {
            to_name: 'Sandrä',
            from_name: user.nome,
            from_email: user.email,
            message: `Nova cliente preencheu o Teste de Autossabotagem!\n\nNome: ${user.nome}\nE-mail: ${user.email}\nSabotadores em destaque: ${topSaboteurs.join(', ')}`,
            reply_to: user.email,
          }, publicKey)
        } catch (emailErr) {
          console.warn('Erro ao enviar e-mail:', emailErr)
        }
      }

      sessionStorage.setItem('sabotagem_scores', JSON.stringify(scores))
      sessionStorage.setItem('sabotagem_top', JSON.stringify(topSaboteurs))
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
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      title={LABELS[val - 1]}
                      className="flex-1 min-w-[40px] py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border-2"
                      style={{
                        borderColor: answers[q.id] === val ? '#1E6F30' : '#e5e7eb',
                        background: answers[q.id] === val ? '#1E6F30' : 'white',
                        color: answers[q.id] === val ? 'white' : '#6b7280',
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-400">Discordo</span>
                  <span className="text-xs text-gray-400">Concordo</span>
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
    </div>
  )
}
