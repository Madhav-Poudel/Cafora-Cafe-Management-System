import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { authCookie, deleteSession } from '@/server/auth-store'

export const runtime = 'nodejs'

export async function POST() {
  const cookieStore = await cookies()
  await deleteSession(cookieStore.get(authCookie)?.value)
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(authCookie)
  return response
}
