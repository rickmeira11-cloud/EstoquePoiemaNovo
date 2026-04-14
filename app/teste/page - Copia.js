'use client'

import { supabase } from '@/lib/supabaseClient'

export default function TestLogin() {
  const testar = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'rickmeira11@gmail.com',
      password: '123456' // usa a senha que você definiu
    })

    console.log('DATA:', data)
    console.log('ERROR:', error)
  }

  return <button onClick={testar}>Testar Login</button>
}