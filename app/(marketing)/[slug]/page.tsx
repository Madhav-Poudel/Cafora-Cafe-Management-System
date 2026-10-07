import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MarketingSubpage, marketingPageTitle } from '@/components/servepilot/marketing-pages'

const validSlugs = ['features', 'solutions', 'pricing', 'resources', 'about', 'contact']

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  if (!validSlugs.includes(slug)) return { title: 'Not found' }
  return {
    title: marketingPageTitle(slug),
    description: `Explore ${slug} with ServePilot, the connected restaurant operations workspace.`,
  }
}

export default async function MarketingRoute({ params }: PageProps) {
  const { slug } = await params
  if (!validSlugs.includes(slug)) notFound()
  return <MarketingSubpage slug={slug} />
}
