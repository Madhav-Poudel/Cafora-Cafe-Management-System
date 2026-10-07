import type { Metadata } from 'next'
import { AuthScreen } from '@/components/servepilot/auth-screen'

export const metadata: Metadata = { title: 'Reset your password' }

export default function ForgotPasswordPage() {
  return <AuthScreen mode="forgot" />
}
