import type { Metadata } from 'next'
import { ServePilotAppShell } from '@/components/servepilot/app-shell'
import { DemoStoreProvider } from '@/components/servepilot/demo-store'

export const metadata: Metadata = {
  title: {
    default: 'Restaurant workspace',
    template: '%s | ServePilot',
  },
  robots: { index: false, follow: false },
}

export default function ApplicationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DemoStoreProvider><ServePilotAppShell>{children}</ServePilotAppShell></DemoStoreProvider>
}
