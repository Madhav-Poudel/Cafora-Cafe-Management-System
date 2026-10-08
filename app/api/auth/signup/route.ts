import { NextResponse } from 'next/server'
import { createUser } from '@/server/auth-store'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const restaurant = typeof body?.restaurant === 'string' ? body.restaurant.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const phone = typeof body?.phone === 'string' ? body.phone : undefined

  if (!name || !restaurant || !email || password.length < 8) {
    return NextResponse.json({ error: 'Name, restaurant, email and an 8-character password are required.' }, { status: 400 })
  }

  const user = createUser({ name, restaurant, email, password, phone })
  if (!user) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })

  return NextResponse.json({ user }, { status: 201 })
}
