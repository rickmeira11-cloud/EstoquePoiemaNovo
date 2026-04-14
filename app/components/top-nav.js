'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const dashboardLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard#estoque', label: 'Estoque' },
  { href: '/dashboard#movimentar', label: 'Movimentar' },
  { href: '/dashboard#historico', label: 'Historico' },
]

const authLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/login', label: 'Entrar' },
]

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function TopNav({
  userLabel = null,
  onSignOut = null,
  accentLabel = 'Gestao de estoque',
  showAuthLinks = false,
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = showAuthLinks ? authLinks : dashboardLinks

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#12121a]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
            <div className="h-4 w-4 rotate-45 rounded-[4px] border border-violet-300/80 bg-gradient-to-br from-violet-300 to-cyan-300" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[0.65rem] uppercase tracking-[0.35em] text-violet-200/70">
              {accentLabel}
            </p>
            <p className="truncate text-lg font-semibold text-white">Poiema Blumenau</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm transition',
                  isActive
                    ? 'bg-violet-500 text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {userLabel ? (
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              {userLabel}
            </div>
          ) : null}

          {onSignOut ? (
            <button
              onClick={onSignOut}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
            >
              Sair
            </button>
          ) : null}
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Abrir menu"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded bg-current" />
            <span className="block h-0.5 w-5 rounded bg-current" />
            <span className="block h-0.5 w-5 rounded bg-current" />
          </span>
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
              >
                {item.label}
              </Link>
            ))}

            {userLabel ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                {userLabel}
              </div>
            ) : null}

            {onSignOut ? (
              <button
                onClick={onSignOut}
                className="rounded-2xl border border-white/10 bg-violet-500/10 px-4 py-3 text-left text-sm text-white"
              >
                Sair
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
