import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function saveResult({ nome, email, telefone, answers, scores, topSaboteurs }) {
  if (!supabase) {
    console.warn('Supabase não configurado')
    return { id: Date.now().toString() }
  }
  const { data, error } = await supabase
    .from('sabotagem_results')
    .insert([{ nome, email, telefone, answers, scores, top_saboteurs: topSaboteurs, created_at: new Date().toISOString() }])
    .select()
  if (error) throw error
  return data[0]
}

export async function getAllResults() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('sabotagem_results')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
