export interface LocalUser {
  name: string
  restaurant: string
  email: string
  phone?: string
}

const userKey = 'cafora.local.user'
const passwordKey = 'cafora.local.password'

export function registerLocalUser(user: LocalUser, password: string) {
  window.localStorage.setItem(userKey, JSON.stringify(user))
  window.localStorage.setItem(passwordKey, password)
}

export function loginLocalUser(email: string, password: string) {
  const savedUser = window.localStorage.getItem(userKey)
  const savedPassword = window.localStorage.getItem(passwordKey)
  if (!savedUser || !savedPassword || savedPassword !== password) return null

  const user = JSON.parse(savedUser) as LocalUser
  return user.email.toLowerCase() === email.toLowerCase() ? user : null
}

export function hasLocalUser() {
  return Boolean(window.localStorage.getItem(userKey))
}
