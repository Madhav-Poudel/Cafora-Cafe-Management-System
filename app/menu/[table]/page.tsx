import type { Metadata } from 'next'
import { PublicMenuPage } from '@/components/servepilot/qr-menu'

type PageProps = {
  params: Promise<{ table: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { table } = await params
  return {
    title: `Guest menu · ${decodeURIComponent(table)}`,
    description: 'Browse the Thamel Kitchen menu and send a table order from your phone.',
  }
}

export default async function GuestMenuRoute({ params }: PageProps) {
  const { table } = await params
  return <PublicMenuPage table={table} />
}
