import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ede6 100%)' }}>

      {/* Header */}
      <header className="py-6 px-4 text-center" style={{ background: '#1E6F30' }}>
        <p className="text-sm font-medium tracking-widest uppercase text-white opacity-80 mb-1">Sandrä Costa</p>
        <p className="text-xs tracking-widest uppercase" style={{ color: '#9BE198' }}>Terapeuta Holística · Comportamental</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: '#EFBE7D', color: '#1E6F30' }}>
            Baseado na pesquisa de Shirzad Chamine
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="playfair text-4xl md:text-5xl font-semibold mb-2" style={{ color: '#1E6F30' }}>
            Teste de
          </h1>
          <h1 className="playfair text-4xl md:text-5xl font-semibold italic" style={{ color: '#6CC24A' }}>
            Autossabotagem
          </h1>
        </div>

        {/* Description card */}
        <div className="rounded-2xl p-6 mb-6 shadow-sm" style={{ background: '#1E6F30' }}>
          <p className="text-white text-sm leading-relaxed mb-4">
            Todas nós temos padrões mentais que agem contra o nosso bem estar, mesmo sem percebermos. Eles se chamam <strong>Sabotadores</strong> e foram desenvolvidos na infância como mecanismos de proteção.
          </p>
          <p className="text-white text-sm leading-relaxed">
            Este teste identifica quais Sabotadores têm mais força em você hoje, revelando os padrões que mais impactam sua felicidade e seus resultados.
          </p>
        </div>

        {/* How to respond */}
        <div className="rounded-2xl p-6 mb-6 shadow-sm border" style={{ background: 'white', borderColor: '#9BE198' }}>
          <h2 className="font-semibold mb-3 text-sm uppercase tracking-widest" style={{ color: '#1E6F30' }}>Como responder</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Responda com a <strong>primeira reação que vier à mente</strong>, sem pensar muito. Não existem respostas certas ou erradas. Seus resultados serão mais precisos quanto mais espontânea for sua resposta.
          </p>
        </div>

        {/* Warning */}
        <div className="rounded-2xl p-5 mb-8 border-l-4" style={{ background: '#fffbf0', borderLeftColor: '#EFBE7D' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#b8860b' }}>
            ⚠️ Atenção antes de começar
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Se você viveu alguma situação emocionalmente intensa nas últimas 24 horas, seja algo positivo ou negativo, recomendamos aguardar 48 horas antes de responder. Momentos de grande emoção podem influenciar suas respostas e alterar o resultado.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { value: '45', label: 'afirmações' },
            { value: '10', label: 'sabotadores' },
            { value: '~5min', label: 'duração' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center shadow-sm" style={{ background: 'white' }}>
              <p className="text-2xl font-bold" style={{ color: '#6CC24A' }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/registro')}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base tracking-wide shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #1E6F30, #6CC24A)' }}
        >
          Iniciar meu Teste
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Sandrä Costa | Terapeuta Holística e Comportamental
        </p>
      </main>
    </div>
  )
}
