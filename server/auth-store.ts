import { randomUUID } from 'node:crypto'

export const authCookie = 'cafora.session'
export const authCookieMaxAge = 60 * 60 * 24 * 30

export interface AuthUser {
  name: string
  restaurant: string
  email: string
  phone?: string
  onboardingCompleted: boolean
}

interface StoredUser extends AuthUser {
  password: string
}

const users = new Map<string, StoredUser>()
const sessions = new Map<string, string>()

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function publicUser(user: StoredUser): AuthUser {
  const { password: _password, ...safeUser } = user
  return safeUser
}

export function createUser(input: {
  name: string
  restaurant: string
  email: string
  password: string
  phone?: string
}) {
  const email = normalizeEmail(input.email)
  if (users.has(email)) return null

  const user: StoredUser = {
    name: input.name,
    restaurant: input.restaurant,
    email,
    phone: input.phone || undefined,
    password: input.password,
    onboardingCompleted: false,
  }
  users.set(email, user)
  return publicUser(user)
}

export function authenticate(email: string, password: string) {
  const user = users.get(normalizeEmail(email))
  if (!user || user.password !== password) return null
  return publicUser(user)
}

export function createSession(email: string) {
  const token = randomUUID()
  sessions.set(token, normalizeEmail(email))
  return token
}

export function getUserBySession(token: string | undefined) {
  if (!token) return null
  const email = sessions.get(token)
  const user = email ? users.get(email) : undefined
  return user ? publicUser(user) : null
}

export function deleteSession(token: string | undefined) {
  if (token) sessions.delete(token)
}

export function completeOnboarding(token: string | undefined) {
  if (!token) return null
  const email = sessions.get(token)
  const user = email ? users.get(email) : undefined
  if (!user) return null

  user.onboardingCompleted = true
  return publicUser(user)
}
