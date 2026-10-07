import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Check,
  Globe2,
  HandHeart,
  LifeBuoy,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react'
import { FeatureGrid, PricingGrid, SiteFooter, SiteHeader, SolutionsGrid } from './marketing-site'

const pageContent: Record<string, { eyebrow: string; title: string; description: string }> = {
  features: {
    eyebrow: 'One workspace, every shift',
    title: 'The tools behind a great restaurant day.',
    description: 'Bring the guest experience and the work behind it into one connected rhythm.',
  },
  solutions: {
    eyebrow: 'Built for your kind of place',
    title: 'Tools that flex around your restaurant.',
    description: 'A neighborhood café and a growing group do not run the same way. ServePilot helps every team find its flow.',
  },
  pricing: {
    eyebrow: 'Simple, transparent plans',
    title: 'More clarity. No long-term lock-in.',
    description: 'Start with the essentials, then bring more of your operation together when you are ready.',
  },
  resources: {
    eyebrow: 'The ServePilot journal',
    title: 'A little more thought for the work you do.',
    description: 'Ideas, checklists, and useful details for the people who keep the room moving.',
  },
  about: {
    eyebrow: 'About ServePilot',
    title: 'Restaurant work deserves better tools.',
    description: 'We are building a clearer way for teams to run service, care for guests, and grow with confidence.',
  },
  contact: {
    eyebrow: 'Let’s make a good plan',
    title: 'Tell us what your restaurant needs next.',
    description: 'Share a little about your team. We will help you find the right way to explore ServePilot.',
  },
}

const resources = [
  { type: 'Shift planning', title: 'A calmer opening checklist for your whole team', text: 'Give everyone a clear place to start before the first guest arrives.', read: '6 min', icon: Sparkles },
  { type: 'Food cost', title: 'How to keep a useful eye on ingredient costs', text: 'A practical way to connect purchasing, portions, and the menu.', read: '8 min', icon: BookOpenText },
  { type: 'Kitchen', title: 'Make the handoff from service to kitchen feel easy', text: 'Small habits that reduce the back-and-forth during a busy service.', read: '5 min', icon: Workflow },
  { type: 'Guest experience', title: 'Thoughtful ways to welcome regulars back', text: 'Use customer notes to make familiar faces feel remembered.', read: '4 min', icon: HandHeart },
  { type: 'Multi-location', title: 'Keep standards consistent while teams stay local', text: 'Build helpful guardrails without taking away a branch’s character.', read: '7 min', icon: Globe2 },
  { type: 'Reporting', title: 'What a daily sales report should answer', text: 'A short list of questions to ask before your team heads home.', read: '5 min', icon: MessageSquareText },
]

export function MarketingSubpage({ slug }: { slug: string }) {
  const content = pageContent[slug]
  if (!content) return null

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-white py-16 sm:py-20">
          <div className="page-container">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">{content.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-[-0.06em] sm:text-[56px]">{content.title}</h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">{content.description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {slug !== 'contact' && <Link href="/signup" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-brand-800">Start your free trial <ArrowRight className="size-4" /></Link>}
              <Link href="/app/dashboard" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 text-sm font-semibold hover:bg-muted">Explore the demo <ArrowUpRight className="size-4" /></Link>
            </div>
          </div>
        </section>

        {slug === 'features' && (
          <section className="page-container py-14 sm:py-20">
            <div className="mb-8 max-w-xl"><h2 className="text-2xl font-semibold tracking-[-0.04em]">One connected flow, from order to close.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Each tool works on its own. Together, they help your team make the next right move.</p></div>
            <FeatureGrid dense />
          </section>
        )}

        {slug === 'solutions' && (
          <section className="page-container py-14 sm:py-20">
            <div className="mb-8 max-w-xl"><h2 className="text-2xl font-semibold tracking-[-0.04em]">For the shape of your service.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Start with one location or bring more of your operation together.</p></div>
            <SolutionsGrid />
          </section>
        )}

        {slug === 'pricing' && (
          <section className="page-container py-14 sm:py-20">
            <PricingGrid />
            <div className="mt-8 flex flex-col items-center gap-2 text-center"><p className="text-xs text-muted-foreground">Need a different mix of locations or onboarding support?</p><Link href="/contact" className="text-sm font-semibold text-primary">Talk to our team <ArrowRight className="inline size-4" /></Link></div>
          </section>
        )}

        {slug === 'resources' && (
          <section className="page-container py-14 sm:py-20">
            <div className="mb-7 flex flex-wrap gap-2"><span className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-semibold text-white">All topics</span>{['Operations', 'People', 'Guest experience', 'Food cost', 'Growth'].map((topic) => <span key={topic} className="rounded-full border border-border bg-white px-3 py-1.5 text-[10px] font-medium text-muted-foreground">{topic}</span>)}</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map(({ type, title, text, read, icon: Icon }) => <article key={title} className="flex min-h-[220px] flex-col rounded-xl border border-border bg-white p-5"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-[18px]" /></span><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-orange">{type}</p><h2 className="mt-2 text-[15px] font-semibold leading-6 tracking-[-0.025em]">{title}</h2><p className="mt-2 text-[12px] leading-5 text-muted-foreground">{text}</p><p className="mt-auto pt-5 text-[10px] text-muted-foreground">ServePilot journal <span className="px-1">·</span> {read} read</p></article>)}
            </div>
          </section>
        )}

        {slug === 'about' && (
          <>
            <section className="page-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">A little context</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">A restaurant is a hundred small things, happening at once.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">The best service feels effortless to a guest. The people behind it know how much care, timing, and teamwork that takes. ServePilot brings the work into a shared, thoughtful space so teams can focus on the moments that make people come back.</p><p className="mt-4 text-sm leading-7 text-muted-foreground">We are starting with restaurants in Nepal: their pace, their payment mix, their familiar ways of working, and their appetite to grow. The product is designed to make the everyday feel clearer, not more complicated.</p></div>
              <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border bg-white p-5"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Users className="size-5" /></span><h3 className="mt-4 text-sm font-semibold">People first</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Software should help the team do better work together.</p></div><div className="rounded-xl border border-border bg-white p-5"><span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground"><ShieldCheck className="size-5" /></span><h3 className="mt-4 text-sm font-semibold">Clear by default</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Useful information should be easy to find and act on.</p></div><div className="rounded-xl border border-border bg-white p-5 sm:col-span-2"><span className="grid size-10 place-items-center rounded-xl bg-[#edf2ff] text-info"><MapPin className="size-5" /></span><h3 className="mt-4 text-sm font-semibold">Rooted in the neighborhood</h3><p className="mt-2 max-w-lg text-xs leading-5 text-muted-foreground">We are building with the realities of Nepal’s restaurant teams in mind, from NPR reporting to the way a busy shift changes by the hour.</p></div></div>
            </section>
            <section className="border-y border-border bg-white py-14 sm:py-20"><div className="page-container grid gap-6 sm:grid-cols-3"><div><p className="text-3xl font-semibold tracking-[-0.05em]">One team</p><p className="mt-2 text-xs text-muted-foreground">Service, kitchen, and operations in sync.</p></div><div><p className="text-3xl font-semibold tracking-[-0.05em]">One view</p><p className="mt-2 text-xs text-muted-foreground">The full story of the shift, not another silo.</p></div><div><p className="text-3xl font-semibold tracking-[-0.05em]">One better day</p><p className="mt-2 text-xs text-muted-foreground">More room to focus on why you opened your doors.</p></div></div></section>
          </>
        )}

        {slug === 'contact' && (
          <section className="page-container grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-orange">A quick introduction</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Let’s start with your restaurant.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">The demo is ready when you are. For a tailored walkthrough, tell us what you are working on and our team will be happy to help.</p><a href="mailto:hello@servepilot.app?subject=ServePilot%20restaurant%20walkthrough" className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-brand-800"><Mail className="size-4" /> Email our team</a><p className="mt-4 text-[11px] text-muted-foreground">hello@servepilot.app <span className="px-1">·</span> Kathmandu, Nepal</p></div>
            <div className="flex flex-col gap-3"><div className="rounded-xl border border-border bg-[#eef3f1] p-5"><span className="grid size-10 place-items-center rounded-xl bg-white text-primary"><LifeBuoy className="size-5" /></span><h3 className="mt-4 text-sm font-semibold">Have a product question?</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">We can help you explore what fits your service style and team.</p></div><div className="rounded-xl border border-border bg-white p-5"><span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Phone className="size-5" /></span><h3 className="mt-4 text-sm font-semibold">Prefer a conversation?</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Include a number and a good time to reach you in your email.</p></div><div className="rounded-xl border border-border bg-white p-5"><span className="grid size-10 place-items-center rounded-xl bg-[#edf2ff] text-info"><Check className="size-5" /></span><h3 className="mt-4 text-sm font-semibold">Want to see the product now?</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Explore the demo workspace with sample restaurant data.</p><Link href="/app/dashboard" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Open demo <ArrowRight className="size-3.5" /></Link></div></div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

export function marketingPageTitle(slug: string) {
  return pageContent[slug]?.title ?? 'ServePilot'
}
