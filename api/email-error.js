const allowedOrigins = new Set([
  'https://testedeautossabotagem.terapeutasandracosta.com',
])

export default function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false })
  }

  const origin = request.headers.origin
  if (origin && !allowedOrigins.has(origin)) {
    return response.status(403).json({ ok: false })
  }

  const { scope, status, text } = request.body || {}
  console.error('[emailjs] envio falhou', {
    scope: String(scope || 'desconhecido').slice(0, 40),
    status: Number.isFinite(Number(status)) ? Number(status) : null,
    text: String(text || 'sem mensagem').slice(0, 500),
  })

  return response.status(204).end()
}
