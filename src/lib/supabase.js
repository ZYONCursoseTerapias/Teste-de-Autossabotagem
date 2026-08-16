import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kihtbkuqclumqbuhxkfc.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hq88oVNuE-x6jfE-u1-UbQ_7vOrkUjh'

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function saveResult({ nome, email, telefone, answers, scores, topSaboteurs }) {
  if (!supabase) {
    console.warn('Supabase não configurado')
    return { id: Date.now().toString() }
  }
  const { error } = await supabase
    .from('sabotagem_results')
    .insert([{ nome, email, telefone, answers, scores, top_saboteurs: topSaboteurs, created_at: new Date().toISOString() }])
  if (error) throw error
  return { saved: true }
}
