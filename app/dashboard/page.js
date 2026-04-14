'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { TopNav } from '@/app/components/top-nav'

function numberFromRecord(record, keys, fallback = 0) {
  for (const key of keys) {
    const value = record?.[key]
    const parsed = Number(value)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

function textFromRecord(record, keys, fallback) {
  for (const key of keys) {
    const value = record?.[key]

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return fallback
}

function formatDate(value) {
  if (!value) return 'Sem data'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sem data'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

function getProductStatus(quantity, minimum) {
  if (quantity <= 0) {
    return {
      label: 'Sem estoque',
      tone: 'bg-rose-500/15 text-rose-300',
      highlight: 'text-rose-300',
    }
  }

  if (quantity <= minimum) {
    return {
      label: 'Estoque baixo',
      tone: 'bg-amber-400/15 text-amber-300',
      highlight: 'text-amber-300',
    }
  }

  return {
    label: 'Estoque ok',
    tone: 'bg-emerald-500/15 text-emerald-300',
    highlight: 'text-emerald-300',
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [movements, setMovements] = useState([])
  const [sessionUser, setSessionUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setErrorMessage('')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      if (!active) return

      setSessionUser(session.user)

      const [productsResult, movementsResult] = await Promise.all([
        supabase.from('produtos').select('*').order('created_at', { ascending: false }),
        supabase.from('movimentacoes').select('*').order('created_at', { ascending: false }).limit(8),
      ])

      if (!active) return

      if (productsResult.error) {
        setErrorMessage(productsResult.error.message)
      }

      setProducts(productsResult.data ?? [])
      setMovements(movementsResult.data ?? [])
      setLoading(false)
    }

    loadDashboard()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login')
        return
      }

      setSessionUser(session.user)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [router])

  const normalizedProducts = useMemo(() => {
    return products.map((product, index) => {
      const quantity = numberFromRecord(product, [
        'quantidade',
        'qtd',
        'estoque',
        'estoque_atual',
        'quantity',
        'saldo',
      ])

      const minimum = numberFromRecord(product, [
        'estoque_minimo',
        'minimo',
        'minimo_estoque',
        'qtd_minima',
        'minimum',
      ], 1)

      const name = textFromRecord(
        product,
        ['nome', 'name', 'produto', 'descricao', 'titulo'],
        `Produto ${index + 1}`
      )

      const type = textFromRecord(
        product,
        ['tipo', 'categoria', 'category', 'tipo_produto'],
        'Sem categoria'
      )

      return {
        id: product.id ?? `${name}-${index}`,
        name,
        type,
        quantity,
        minimum,
        status: getProductStatus(quantity, minimum),
      }
    })
  }, [products])

  const stockSummary = useMemo(() => {
    return normalizedProducts.reduce(
      (summary, product) => {
        if (product.quantity <= 0) summary.out += 1
        else if (product.quantity <= product.minimum) summary.low += 1
        else summary.ok += 1

        return summary
      },
      { total: normalizedProducts.length, ok: 0, low: 0, out: 0 }
    )
  }, [normalizedProducts])

  const urgentProducts = normalizedProducts.filter(
    (product) => product.quantity <= product.minimum
  )

  const recentMovements = useMemo(() => {
    return movements.map((movement, index) => ({
      id: movement.id ?? index,
      title: textFromRecord(
        movement,
        ['produto_nome', 'nome_produto', 'produto', 'descricao', 'observacao'],
        'Movimentacao registrada'
      ),
      type: textFromRecord(movement, ['tipo', 'type', 'movimento'], 'Atualizacao'),
      quantity: numberFromRecord(movement, ['quantidade', 'qtd', 'valor', 'amount']),
      createdAt: formatDate(
        movement.created_at ?? movement.data ?? movement.updated_at ?? movement.inserted_at
      ),
    }))
  }, [movements])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d14] text-white">
        <TopNav userLabel="Carregando..." onSignOut={handleSignOut} />
        <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.03]" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      <TopNav
        userLabel={sessionUser?.email ?? 'Equipe Poiema'}
        onSignOut={handleSignOut}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section
          id="overview"
          className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-[0.72rem] uppercase tracking-[0.38em] text-violet-200/70">
                  Estoque Poiema
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Painel de estoque com leitura direta do Supabase
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Mesmo clima visual do painel anterior, agora com menu no topo, leitura
                  de produtos em tempo real e layout responsivo para desktop e mobile.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">
                    Banco ativo
                  </p>
                  <p className="mt-2 text-sm text-white">jbvyaykdcomqdqrcjmzo</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">
                    Usuario conectado
                  </p>
                  <p className="mt-2 truncate text-sm text-white">
                    {sessionUser?.email ?? 'Nao identificado'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-[28px] border border-white/10 bg-[#171720] p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
                  Total de itens
                </p>
                <p className="mt-5 text-5xl font-semibold text-violet-300">
                  {stockSummary.total}
                </p>
              </article>

              <article className="rounded-[28px] border border-white/10 bg-[#171720] p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
                  Estoque ok
                </p>
                <p className="mt-5 text-5xl font-semibold text-emerald-300">
                  {stockSummary.ok}
                </p>
              </article>

              <article className="rounded-[28px] border border-white/10 bg-[#171720] p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
                  Estoque baixo
                </p>
                <p className="mt-5 text-5xl font-semibold text-amber-300">
                  {stockSummary.low}
                </p>
              </article>

              <article className="rounded-[28px] border border-white/10 bg-[#171720] p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
                  Sem estoque
                </p>
                <p className="mt-5 text-5xl font-semibold text-rose-300">
                  {stockSummary.out}
                </p>
              </article>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <section className="rounded-[28px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            {errorMessage}
          </section>
        ) : null}

        <section className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 px-5 py-4">
          <p className="text-sm text-amber-200">
            {urgentProducts.length > 0
              ? `${urgentProducts.length} produto(s) precisam de reposicao.`
              : 'Nenhum item critico no momento. Quando o estoque cair, o alerta aparece aqui.'}
          </p>
        </section>

        <section id="estoque" className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
          <div className="rounded-[32px] border border-white/10 bg-[#12121a] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="border-b border-white/10 px-6 py-6">
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-slate-500">
                Estoque baixo ou zerado
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Produtos que pedem acao agora
              </h2>
            </div>

            {urgentProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-white/[0.03] text-[0.68rem] uppercase tracking-[0.28em] text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Qtd</th>
                      <th className="px-6 py-4">Minimo</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urgentProducts.map((product) => (
                      <tr key={product.id} className="border-t border-white/10">
                        <td className="px-6 py-5 text-base font-medium text-white">
                          {product.name}
                        </td>
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-200">
                            {product.type}
                          </span>
                        </td>
                        <td className={`px-6 py-5 text-lg font-semibold ${product.status.highlight}`}>
                          {product.quantity}
                        </td>
                        <td className="px-6 py-5 text-lg text-slate-200">{product.minimum}</td>
                        <td className="px-6 py-5">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.status.tone}`}>
                            {product.status.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-10 text-sm text-slate-300">
                Nenhum produto com estoque baixo ainda. Quando voce cadastrar itens em
                `produtos`, este painel vai destacar os mais urgentes.
              </div>
            )}
          </div>

          <aside className="grid gap-6">
            <section
              id="movimentar"
              className="rounded-[32px] border border-white/10 bg-[#12121a] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-slate-500">
                Movimentar
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Acesso rapido para operacao
              </h3>
              <div className="mt-6 grid gap-3">
                <button className="rounded-2xl bg-emerald-500 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-emerald-400">
                  Registrar entrada
                </button>
                <button className="rounded-2xl bg-violet-500 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-violet-400">
                  Registrar saida
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]">
                  Atualizar niveis minimos
                </button>
              </div>
            </section>

            <section
              id="historico"
              className="rounded-[32px] border border-white/10 bg-[#12121a] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-slate-500">
                Historico recente
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Ultimas movimentacoes
              </h3>

              <div className="mt-6 space-y-3">
                {recentMovements.length > 0 ? (
                  recentMovements.map((movement) => (
                    <article
                      key={movement.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">{movement.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                            {movement.type}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-violet-300">
                          {movement.quantity}
                        </p>
                      </div>
                      <p className="mt-3 text-xs text-slate-400">{movement.createdAt}</p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300">
                    Ainda nao ha registros em `movimentacoes`. Assim que houver entradas ou
                    saidas, elas aparecem aqui.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  )
}
