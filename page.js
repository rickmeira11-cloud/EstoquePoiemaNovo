'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleAuth = async () => {
    if (isLogin) {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('LOGIN:', data, error)

    } else {
      // SIGN UP (primeiro acesso)
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        console.log('Erro signup:', error.message)
        return
      }

      const user = data.user

      if (!user) return

      // criar profile manualmente
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: name,
          role: 'user'
        })

      if (profileError) {
        console.log('Erro profile:', profileError.message)
      }

      console.log('Usuário criado!')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>

      {!isLogin && (
        <>
          <input
            placeholder="Nome"
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />
        </>
      )}

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleAuth}>
        {isLogin ? 'Entrar' : 'Cadastrar'}
      </button>

      <br /><br />

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Criar conta' : 'Já tenho conta'}
      </button>
    </div>
  )
}

import { useRouter } from 'next/navigation'

const router = useRouter()

const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (!error) {
    router.push('/dashboard')
  }
}