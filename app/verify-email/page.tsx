import type { Metadata } from 'next'
import { AuthScreen } from '@/components/servepilot/auth-screen'

export const metadata: Metadata = { title: 'Check your inbox' }

export default function VerifyEmailPage() {
  return <AuthScreen mode="verify" />
}
