import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { authCookie, getUserBySession } from '@/server/auth-store'

export const runtime = 'nodejs'

export async function GET() {
  const cookieStore = await cookies()
  const user = await getUserBySession(cookieStore.get(authCookie)?.value)
  return user ? NextResponse.json({ user }) : NextResponse.json({ user: null }, { status: 401 })
}
