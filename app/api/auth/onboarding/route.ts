import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { authCookie, completeOnboarding } from '@/server/auth-store'

export const runtime = 'nodejs'

export async function POST() {
  const cookieStore = await cookies()
  const user = await completeOnboarding(cookieStore.get(authCookie)?.value)
  return user ? NextResponse.json({ user }) : NextResponse.json({ error: 'You must be signed in.' }, { status: 401 })
}
