import { getMaxScore, getRelativeScore, getScorePercentage, saboteurKeys } from '../data/questions.js'
import { juizInfo, saboteurs, saboteurLabels } from '../data/saboteurs.js'

export function rankSaboteurs(scores) {
  return saboteurKeys
    .map(key => ({
      key,
      name: saboteurLabels[key],
      score: getRelativeScore(key, scores),
      pct: getScorePercentage(key, scores),
    }))
    .sort((a, b) => b.score - a.score)
}

export function getCriticModes(scores) {
  return [
    { key: 'juiz_auto', label: 'Crítica a si mesma', score: scores.juiz_auto || 0, max: getMaxScore('juiz_auto') },
    { key: 'juiz_outros', label: 'Crítica aos outros', score: scores.juiz_outros || 0, max: getMaxScore('juiz_outros') },
    { key: 'juiz_circ', label: 'Crítica às circunstâncias', score: scores.juiz_circ || 0, max: getMaxScore('juiz_circ') },
  ].map(mode => ({ ...mode, pct: Math.round((mode.score / mode.max) * 100) }))
}

export function formatScore(score) {
  return Number(score).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

export function buildSaboteurDetail(info) {
  return [
    `Como nasce\n${info.origin}`,
    `Como funciona\n${info.operation}`,
    `A mentira que conta\n${info.lies.map(item => `“${item}”`).join('\n')}`,
    `O resultado\n${info.outcome}`,
    `Quando assume o controle\n${info.takeover}`,
  ].join('\n\n')
}

export function buildCriticDetail() {
  return [
    `Como nasce\n${juizInfo.description}`,
    `Como funciona\n${juizInfo.operation}`,
    `A mentira que conta\n${juizInfo.lies.map(item => `“${item}”`).join('\n')}`,
    `O resultado\n${juizInfo.outcome}`,
    `Quando assume o controle\n${juizInfo.takeover}`,
  ].join('\n\n')
}

export function buildFullResult(scores) {
  const ranked = rankSaboteurs(scores)
  const criticModes = getCriticModes(scores)
  const primary = saboteurs[ranked[0].key]
  const scoresSummary = ranked
    .map(item => `${item.name}: ${formatScore(item.score)} de 10`)
    .join('\n')
  const criticSummary = criticModes
    .map(item => `${item.label}: ${item.score} de ${item.max}`)
    .join('\n')
  const fullResult = [
    'Sabotadora comum a todas as pessoas: A Crítica',
    buildCriticDetail(),
    '',
    'Como a Crítica age em você:',
    criticSummary,
    '',
    `Principal sabotadora: ${primary.name}`,
    buildSaboteurDetail(primary),
    '',
    'Seus 9 Sabotadores Cúmplices:',
    scoresSummary,
  ].join('\n')

  return { ranked, criticModes, primary, scoresSummary, criticSummary, fullResult }
}
