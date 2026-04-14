import { supabase } from '@/lib/supabaseClient'

export async function getUserAndProfile() {
  const { data: userData } = await supabase.auth.getUser()

  const user = userData?.user
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}