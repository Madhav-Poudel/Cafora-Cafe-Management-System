import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { authCookie, getUserBySession } from '@/server/auth-store'

export const runtime = 'nodejs'

const collectionName = 'workspaces'

async function getOwner() {
  const cookieStore = await cookies()
  return getUserBySession(cookieStore.get(authCookie)?.value)
}

export async function GET() {
  const user = await getOwner()
  if (!user) return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 })

  const workspace = await (await getDatabase()).collection(collectionName).findOne(
    { ownerEmail: user.email },
    { projection: { _id: 0, ownerEmail: 0, updatedAt: 0 } },
  )
  return NextResponse.json({ workspace: workspace ?? null })
}

export async function PUT(request: Request) {
  const user = await getOwner()
  if (!user) return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid workspace data.' }, { status: 400 })
  }

  const { _id: _ignoredId, ownerEmail: _ignoredOwner, updatedAt: _ignoredUpdatedAt, ...workspace } = body as Record<string, unknown>
  await (await getDatabase()).collection(collectionName).updateOne(
    { ownerEmail: user.email },
    { $set: { ...workspace, ownerEmail: user.email, updatedAt: new Date() } },
    { upsert: true },
  )
  return NextResponse.json({ saved: true })
}
