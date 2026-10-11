import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { authCookie, getUserBySession, isSuperAdmin } from '@/server/auth-store'

export const runtime = 'nodejs'

const plans = ['Free', 'Starter', 'Growth', 'Pro'] as const
const statuses = ['Active', 'Trial', 'Past due', 'Cancelled'] as const

type Subscription = {
  ownerEmail: string
  plan: (typeof plans)[number]
  status: (typeof statuses)[number]
  renewsAt?: Date
  updatedAt: Date
}

async function requireAdmin() {
  const cookieStore = await cookies()
  const user = await getUserBySession(cookieStore.get(authCookie)?.value)
  if (!user || !isSuperAdmin(user.email)) return null
  return user
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Super Admin access required.' }, { status: 403 })

  const db = await getDatabase()
  const users = await db.collection('users').find({}, {
    projection: { _id: 0, passwordHash: 0, passwordSalt: 0 },
    sort: { email: 1 },
  }).toArray()
  const subscriptions = await db.collection<Subscription>('subscriptions').find({}, { projection: { _id: 0 } }).toArray()
  const subscriptionMap = new Map(subscriptions.map((subscription) => [subscription.ownerEmail, subscription]))

  return NextResponse.json({
    admin: { email: admin.email, name: admin.name },
    users: users.map((user) => ({
      ...user,
      subscription: subscriptionMap.get(user.email) ?? {
        ownerEmail: user.email,
        plan: 'Free',
        status: 'Active',
      },
    })),
    plans,
    statuses,
  })
}

export async function PUT(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Super Admin access required.' }, { status: 403 })

  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const plan = body?.plan
  const status = body?.status
  if (!email || !plans.includes(plan) || !statuses.includes(status)) {
    return NextResponse.json({ error: 'A valid user, plan and status are required.' }, { status: 400 })
  }

  const db = await getDatabase()
  const user = await db.collection('users').findOne({ email }, { projection: { _id: 1 } })
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  await db.collection<Subscription>('subscriptions').updateOne(
    { ownerEmail: email },
    {
      $set: {
        ownerEmail: email,
        plan,
        status,
        updatedAt: new Date(),
        renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
    { upsert: true },
  )
  return NextResponse.json({ saved: true })
}
