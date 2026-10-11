import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import type { Collection, Db } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'

const scrypt = promisify(scryptCallback)

export const authCookie = 'cafora.session'
export const authCookieMaxAge = 60 * 60 * 24 * 30

export interface AuthUser {
  name: string
  restaurant: string
  email: string
  phone?: string
  onboardingCompleted: boolean
}

export type WorkspaceOwner = Pick<AuthUser, 'email'>

interface StoredUser extends AuthUser {
  _id?: string
  passwordHash: string
  passwordSalt: string
}

interface StoredSession {
  _id: string
  email: string
  expiresAt: Date
}

let indexesReady: Promise<void> | undefined

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isSuperAdmin(email: string) {
  const allowedEmails = (process.env.SUPER_ADMIN_EMAIL ?? '')
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean)
  return allowedEmails.includes(normalizeEmail(email))
}

function publicUser(user: StoredUser): AuthUser {
  const { _id: _ignoredId, passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...safeUser } = user
  return safeUser
}

async function getCollections(): Promise<{ users: Collection<StoredUser>; sessions: Collection<StoredSession> }> {
  const db: Db = await getDatabase()
  const users = db.collection<StoredUser>('users')
  const sessions = db.collection<StoredSession>('sessions')

  indexesReady ??= Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).then(() => undefined)
  await indexesReady

  return { users, sessions }
}

async function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const derivedKey = await scrypt(password, salt, 64) as Buffer
  return { passwordHash: derivedKey.toString('hex'), passwordSalt: salt }
}

async function matchesPassword(password: string, user: StoredUser) {
  const { passwordHash } = await hashPassword(password, user.passwordSalt)
  const expected = Buffer.from(user.passwordHash, 'hex')
  const actual = Buffer.from(passwordHash, 'hex')
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function createUser(input: {
  name: string
  restaurant: string
  email: string
  password: string
  phone?: string
}) {
  const { users } = await getCollections()
  const email = normalizeEmail(input.email)
  const { passwordHash, passwordSalt } = await hashPassword(input.password)
  const user: StoredUser = {
    name: input.name,
    restaurant: input.restaurant,
    email,
    phone: input.phone || undefined,
    passwordHash,
    passwordSalt,
    onboardingCompleted: false,
  }

  try {
    await users.insertOne(user)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) return null
    throw error
  }
  return publicUser(user)
}

export async function authenticate(email: string, password: string) {
  const { users } = await getCollections()
  const user = await users.findOne({ email: normalizeEmail(email) })
  if (!user || !(await matchesPassword(password, user))) return null
  return publicUser(user)
}

export async function createSession(email: string) {
  const { sessions } = await getCollections()
  const token = randomUUID()
  await sessions.insertOne({
    _id: token,
    email: normalizeEmail(email),
    expiresAt: new Date(Date.now() + authCookieMaxAge * 1000),
  })
  return token
}

export async function getUserBySession(token: string | undefined) {
  if (!token) return null
  const { users, sessions } = await getCollections()
  const session = await sessions.findOne({ _id: token, expiresAt: { $gt: new Date() } })
  if (!session) return null
  const user = await users.findOne({ email: session.email })
  return user ? publicUser(user) : null
}

export async function deleteSession(token: string | undefined) {
  if (!token) return
  const { sessions } = await getCollections()
  await sessions.deleteOne({ _id: token })
}

export async function completeOnboarding(token: string | undefined) {
  if (!token) return null
  const { users, sessions } = await getCollections()
  const session = await sessions.findOne({ _id: token, expiresAt: { $gt: new Date() } })
  if (!session) return null
  const result = await users.findOneAndUpdate(
    { email: session.email },
    { $set: { onboardingCompleted: true } },
    { returnDocument: 'after' },
  )
  return result ? publicUser(result) : null
}
