import { NextResponse } from 'next/server'
import { authenticate, authCookie, authCookieMaxAge, createSession } from '@/server/auth-store'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const user = await authenticate(email, password)

  if (!user) return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 })

  const response = NextResponse.json({ user })
  response.cookies.set(authCookie, await createSession(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: authCookieMaxAge,
    path: '/',
  })
  return response
}
