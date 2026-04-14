import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set(name, value, options),
        remove: (name, options) => res.cookies.set(name, '', { ...options, maxAge: 0 }),
      },
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  // 🔐 não logado
  if (!user && path !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!user) return res

  // 👤 profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('church_id, role')
    .eq('id', user.id)
    .single()

  // 🏛️ onboarding obrigatório
  if (profile && !profile.church_id && path !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  // 🚫 bloquear onboarding se já tem igreja
  if (profile?.church_id && path === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // 👮 admin routes
  if (path.startsWith('/admin') && profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/produtos/:path*',
    '/movimentacoes/:path*',
    '/admin/:path*',
    '/onboarding',
  ],
}