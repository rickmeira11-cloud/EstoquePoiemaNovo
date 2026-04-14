'use client'

export default function Teste() {
  return (
    <div>
      <h1>Teste ENV</h1>

      <button onClick={() => {
        console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      }}>
        Testar Variáveis
      </button>
    </div>
  )
}