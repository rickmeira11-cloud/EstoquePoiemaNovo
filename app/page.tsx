'use client'

import Link from 'next/link'
import { TopNav } from '@/app/components/top-nav'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      <TopNav showAuthLinks accentLabel="Painel de operacao" />

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.02))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-violet-200/70">
              Estoque Poiema
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              O layout antigo voltou com uma leitura mais limpa no topo.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Mantivemos a atmosfera do painel anterior, mas trocando a barra lateral
              por um menu horizontal elegante, mais leve no desktop e muito melhor no
              mobile.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-full bg-violet-500 px-6 py-3 text-sm font-medium text-white shadow-[0_18px_35px_rgba(139,92,246,0.35)] transition hover:bg-violet-400"
              >
                Entrar no painel
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Ver dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[28px] border border-white/10 bg-[#171720] p-6">
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
                Banco conectado
              </p>
              <p className="mt-4 text-xl font-medium text-white">
                jbvyaykdcomqdqrcjmzo.supabase.co
              </p>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-[#171720] p-6">
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
                Secoes principais
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-200">
                <span className="rounded-full bg-white/[0.04] px-3 py-2">Dashboard</span>
                <span className="rounded-full bg-white/[0.04] px-3 py-2">Estoque</span>
                <span className="rounded-full bg-white/[0.04] px-3 py-2">Movimentar</span>
                <span className="rounded-full bg-white/[0.04] px-3 py-2">Historico</span>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
