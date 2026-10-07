import type { Metadata } from 'next'
import { AuthScreen } from '@/components/servepilot/auth-screen'

export const metadata: Metadata = { title: 'Start your free trial' }

export default function SignupPage() {
  return <AuthScreen mode="signup" />
}
