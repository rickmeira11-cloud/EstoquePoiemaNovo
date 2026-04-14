'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { TopNav } from '@/app/components/top-nav'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function login() {
    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setSubmitting(false)

    if (!error) {
      router.push('/dashboard')
      return
    }

    setErrorMessage(error.message)
  }

  async function createAdminFirstAccess() {
    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin',
          access_level: 'admin',
          first_access_admin: true,
        },
      },
    })

    setSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (data.session) {
      router.push('/dashboard')
      return
    }

    setSuccessMessage(
      'Usuario admin criado. Se a confirmacao de email estiver ativa no Supabase, confirme o email antes de entrar.'
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      <TopNav showAuthLinks accentLabel="Acesso seguro" />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.22),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.02))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-violet-200/70">
              Login Poiema
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
              Controle o estoque com uma visao limpa em qualquer tela.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              O painel foi reorganizado para usar menu no topo, cards mais claros e
              leitura rapida dos itens criticos.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#12121a] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <p className="text-[0.72rem] uppercase tracking-[0.35em] text-slate-500">
              Entrar
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Acesse sua conta</h2>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Email</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60"
                  placeholder="voce@poiema.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Senha</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                Primeiro acesso:
                {' '}
                use o segundo botao para criar um usuario com papel de admin no Supabase Auth.
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {successMessage}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={login}
                  disabled={submitting}
                  className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Processando...' : 'Entrar'}
                </button>

                <button
                  onClick={createAdminFirstAccess}
                  disabled={submitting}
                  className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Primeiro acesso admin
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
