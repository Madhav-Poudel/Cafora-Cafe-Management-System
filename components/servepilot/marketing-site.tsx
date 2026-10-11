import Link from 'next/link'
import Image from 'next/image'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CalendarCheck2,
  Check,
  ChefHat,
  ChevronDown,
  ClipboardList,
  Coffee,
  CreditCard,
  FileText,
  Gauge,
  Globe2,
  HandCoins,
  LayoutDashboard,
  MapPin,
  Menu,
  PackageCheck,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  TableProperties,
  Users,
  Wallet,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { BrandMark } from './shared'
import { ThemeToggle } from './theme-toggle'

export type MarketingFeature = {
  title: string
  description: string
  icon: LucideIcon
  tag: string
}

export const featureCatalog: MarketingFeature[] = [
  { title: 'Smart dashboard', description: 'Start each shift with the numbers, alerts, and next steps that actually matter.', icon: LayoutDashboard, tag: 'Know your day' },
  { title: 'Point of sale', description: 'Take dine-in, takeaway, and delivery orders from one easy service screen.', icon: CreditCard, tag: 'Sell with ease' },
  { title: 'Kitchen display', description: 'Keep every ticket moving with clear prep stages and live order timing.', icon: ChefHat, tag: 'Keep service moving' },
  { title: 'Table management', description: 'See your floor at a glance, turn tables faster, and make room for reservations.', icon: TableProperties, tag: 'Own your floor' },
  { title: 'Menu management', description: 'Update dishes, modifiers, pricing, and availability without the busywork.', icon: ClipboardList, tag: 'Menu in sync' },
  { title: 'QR ordering', description: 'Let guests explore your menu and order from the table they are sitting at.', icon: Globe2, tag: 'Invite guests in' },
  { title: 'Inventory control', description: 'Track ingredients, catch low stock early, and reduce unnecessary waste.', icon: Boxes, tag: 'Waste less' },
  { title: 'Purchasing & suppliers', description: 'Create purchase orders, follow deliveries, and keep supplier balances visible.', icon: ShoppingCart, tag: 'Buy smarter' },
  { title: 'Customer CRM', description: 'Remember returning guests, favorite dishes, and the moments worth celebrating.', icon: Users, tag: 'Bring them back' },
  { title: 'Staff & roles', description: 'Give every teammate a clear shift, the right access, and a shared rhythm.', icon: Workflow, tag: 'Team together' },
  { title: 'Sales reports', description: 'Find the story behind sales, popular dishes, discounts, and busy hours.', icon: BarChart3, tag: 'See what works' },
  { title: 'Expenses & finance', description: 'Understand cash flow with income, expenses, cash drawers, and payment mix.', icon: Wallet, tag: 'Mind your margins' },
  { title: 'Multi-branch operations', description: 'Compare locations and keep standards consistent as your restaurant grows.', icon: MapPin, tag: 'Grow confidently' },
]

export const solutionCatalog = [
  { title: 'Independent restaurants', description: 'Spend less time switching tabs and more time looking after the room.', icon: StoreIcon },
  { title: 'Cafés & bakeries', description: 'Keep counter service, takeaway, and daily prep on the same page.', icon: Coffee },
  { title: 'Growing restaurant groups', description: 'See the full picture across locations without losing local context.', icon: MapPin },
  { title: 'Cloud kitchens', description: 'Coordinate tickets and delivery channels during every rush.', icon: ShoppingBag },
  { title: 'Nepal-first operations', description: 'Work in NPR, support local payment methods, and serve nearby communities.', icon: Globe2 },
  { title: 'Busy service teams', description: 'Give front of house and kitchen one shared view of what happens next.', icon: Workflow },
  { title: 'Owners & operators', description: 'Make decisions from clear numbers instead of end-of-week guesswork.', icon: HandCoins },
]

function StoreIcon(props: React.ComponentProps<LucideIcon>) {
  return <ShoppingBag {...props} />
}

const pricingPlans = [
  {
    name: 'Starter',
    description: 'For one location finding its rhythm.',
    price: '1,499',
    period: '/ month',
    features: ['1 restaurant location', 'POS and order management', 'Menu and QR ordering', 'Basic sales reports', 'Email support'],
    featured: false,
  },
  {
    name: 'Growth',
    description: 'For teams ready to connect the dots.',
    price: '2,999',
    period: '/ month',
    features: ['Everything in Starter', 'Kitchen display and table map', 'Inventory and purchasing', 'Customer and staff tools', 'Advanced reporting'],
    featured: true,
  },
  {
    name: 'Scale',
    description: 'For more than one location.',
    price: '5,499',
    period: '/ month',
    features: ['Everything in Growth', 'Up to 5 locations', 'Branch comparison', 'Role permissions', 'Priority support'],
    featured: false,
  },
  {
    name: 'Enterprise',
    description: 'For restaurant groups with bigger plans.',
    price: 'Let’s talk',
    period: '',
    features: ['Custom locations and controls', 'Dedicated onboarding', 'Account success partner', 'Custom reporting support', 'Flexible billing'],
    featured: false,
  },
]

const faqs = [
  { question: 'Can I try Cafora before choosing a plan?', answer: 'Yes. The product demo is open to explore, and every paid plan starts with a 14-day trial. You can see how your team works with it before committing.' },
  { question: 'Does Cafora work for more than one restaurant?', answer: 'Yes. Growth teams can compare locations, while Scale and Enterprise plans add multi-branch controls, consolidated reporting, and role-based access.' },
  { question: 'Can I use local payments and NPR pricing?', answer: 'Cafora is designed around Nepal-first operations, with NPR reporting and payment methods your guests already recognize.' },
  { question: 'Do I need special hardware?', answer: 'No special hardware is required to explore the workspace. Cafora is designed for modern browsers and can be paired with compatible printers and devices.' },
  { question: 'Will my kitchen see new orders right away?', answer: 'Orders move from the service screen to the kitchen display as they are sent. Teams can update prep status so the front of house knows what is ready.' },
  { question: 'Can my team control who sees financial information?', answer: 'Yes. Staff roles let owners and managers decide which tools are visible to each teammate.' },
  { question: 'Can I import my existing menu and stock list?', answer: 'A guided onboarding flow helps you set up your menu and ingredients. Teams on Growth and above can also get help with larger imports.' },
  { question: 'Is the demo connected to a real restaurant account?', answer: 'No. This preview uses sample information in browser memory. It is designed to show the workflows, not to process real orders or store account data.' },
]

const testimonials = [
  { quote: 'The whole team can see what is happening now. That sounds simple, but it changed our evenings.', name: 'Aastha Shrestha', role: 'Owner, Juniper Table · Kathmandu', initials: 'AS' },
  { quote: 'We used to find out about low stock when it was already a problem. Now it is part of the morning routine.', name: 'Rabin Koirala', role: 'Operations lead, Ghar Café · Lalitpur', initials: 'RK' },
  { quote: 'The dashboard gives me the full story without being in the restaurant every hour.', name: 'Meera Poudel', role: 'Founder, The Courtyard · Pokhara', initials: 'MP' },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link onClick={onNavigate} href="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Features</Link>
      <Link onClick={onNavigate} href="/solutions" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Solutions</Link>
      <Link onClick={onNavigate} href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Pricing</Link>
      <Link onClick={onNavigate} href="/resources" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Resources</Link>
      <Link onClick={onNavigate} href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">About</Link>
    </>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/95 backdrop-blur-sm">
      <div className="page-container flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="Cafora home"><BrandMark /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex"><NavLinks /></nav>
        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle compact />
          <Link href="/login" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">Log in</Link>
          <Link href="/signup" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-800">
            Start free <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <details className="relative sm:hidden">
          <summary aria-label="Open navigation" className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-border bg-white text-foreground [&::-webkit-details-marker]:hidden">
            <Menu className="size-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-12 z-50 flex w-64 flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-xl">
            <NavLinks />
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold">Appearance</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-4 border-t border-border pt-3">
              <Link href="/login" className="text-sm font-semibold">Log in</Link>
              <Link href="/signup" className="text-sm font-semibold text-primary">Start free</Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  )
}

function BrowserPreview() {
  const bars = [36, 53, 45, 70, 56, 84, 63, 91, 72, 100, 77, 88]
  return (
    <div aria-label="Preview of the Cafora restaurant dashboard" className="relative mx-auto w-full max-w-[740px] rounded-[18px] border border-border bg-white p-2 shadow-[0_30px_80px_-36px_rgba(220,20,60,0.22)] sm:p-3">
      <div className="flex h-8 items-center gap-1.5 border-b border-border px-2 pb-2">
        <span className="size-2 rounded-full bg-[#e6a29e]" />
        <span className="size-2 rounded-full bg-[#ebc376]" />
        <span className="size-2 rounded-full bg-[#7fc69c]" />
        <span className="ml-3 flex h-5 flex-1 items-center rounded-md bg-[#f4f6f5] px-2 text-[8px] text-muted-foreground">app.cafora.com / dashboard</span>
        <span className="hidden rounded-md bg-secondary px-2 py-1 text-[8px] font-semibold text-primary sm:inline">Thamel Kitchen</span>
      </div>
      <div className="grid min-h-[360px] grid-cols-[52px_1fr] sm:grid-cols-[116px_1fr]">
        <div className="border-r border-border px-2 py-3 sm:px-3">
          <div className="mb-4 flex items-center gap-1.5">
            <BrandMark compact />
            <span className="hidden text-[9px] font-semibold text-foreground sm:inline">Cafora</span>
          </div>
          <div className="flex flex-col gap-1">
            {[
              { icon: LayoutDashboard, label: 'Overview', active: true },
              { icon: ClipboardList, label: 'Orders' },
              { icon: TableProperties, label: 'Tables' },
              { icon: Boxes, label: 'Inventory' },
              { icon: BarChart3, label: 'Reports' },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className={`flex items-center gap-2 rounded-md px-1.5 py-2 text-[8px] sm:px-2 ${active ? 'bg-secondary font-semibold text-primary' : 'text-muted-foreground'}`}>
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[8px] text-muted-foreground sm:text-[10px]">Wednesday, 7 October 2026</p>
              <h3 className="mt-1 text-[14px] font-semibold tracking-tight text-foreground sm:text-[18px]">Good afternoon, Aarya</h3>
            </div>
            <span className="hidden h-7 items-center rounded-md border border-border px-2 text-[8px] text-muted-foreground sm:inline-flex">Today <ChevronDown className="ml-2 size-3" /></span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: 'Net sales', value: 'Rs. 52,480', delta: '+12.8%' },
              { label: 'Orders', value: '79', delta: '+8.2%' },
              { label: 'Avg. order', value: 'Rs. 664', delta: '+4.1%' },
              { label: 'Tables', value: '8 / 12', delta: '67% full' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border p-2 sm:p-2.5">
                <p className="text-[7px] text-muted-foreground sm:text-[9px]">{item.label}</p>
                <p className="numeric mt-1 text-[10px] font-semibold text-foreground sm:text-[14px]">{item.value}</p>
                <p className="mt-1 text-[7px] font-medium text-success sm:text-[8px]">{item.delta}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-[1.4fr_0.9fr] gap-2">
            <div className="rounded-lg border border-border p-2.5 sm:p-3">
              <div className="flex items-center justify-between">
                <div><p className="text-[8px] font-semibold text-foreground sm:text-[10px]">Sales overview</p><p className="mt-0.5 text-[7px] text-muted-foreground">Last 7 days</p></div>
                <span className="text-[7px] font-semibold text-success">+12.8%</span>
              </div>
              <div className="mt-3 flex h-[100px] items-end gap-1 border-b border-l border-border px-1 sm:h-[122px] sm:gap-2">
                {[30, 46, 38, 72, 56, 88, 65, 80, 55, 94, 74, 100].map((height, index) => (
                  <span key={index} className={`flex-1 rounded-t-[3px] ${index === 9 ? 'bg-brand-orange' : 'bg-primary/70'}`} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[6px] text-muted-foreground sm:text-[8px]"><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span></div>
            </div>
            <div className="rounded-lg border border-border p-2.5 sm:p-3">
              <p className="text-[8px] font-semibold text-foreground sm:text-[10px]">Top sellers</p>
              <div className="mt-3 flex flex-col gap-2.5">
                {[
                  { name: 'Chicken momo', value: 'Rs. 12,480', width: '88%' },
                  { name: 'Nepali thali', value: 'Rs. 8,640', width: '68%' },
                  { name: 'Chicken sekuwa', value: 'Rs. 6,120', width: '52%' },
                  { name: 'Masala chai', value: 'Rs. 4,180', width: '36%' },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between gap-1 text-[7px] sm:text-[8px]"><span className="truncate text-foreground">{item.name}</span><span className="shrink-0 text-muted-foreground">{item.value}</span></div>
                    <div className="mt-1 h-1 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: item.width }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#f6f8f7] px-2.5 py-2 sm:px-3">
            <div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-md bg-accent text-accent-foreground"><PackageCheck className="size-3" /></span><span className="text-[8px] font-medium text-foreground sm:text-[9px]">Chicken breast is running low</span></div>
            <span className="hidden text-[8px] font-semibold text-primary sm:inline">Review stock <ArrowUpRight className="inline size-3" /></span>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-lg sm:flex">
        <span className="grid size-8 place-items-center rounded-lg bg-[#e8f4ec] text-success"><CalendarCheck2 className="size-4" /></span>
        <span><span className="block text-[10px] font-semibold">Shift ready</span><span className="block text-[9px] text-muted-foreground">Your team is in sync</span></span>
      </div>
    </div>
  )
}

export function FeatureGrid({ dense = false }: { dense?: boolean }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${dense ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {featureCatalog.map(({ title, description, icon: Icon, tag }) => (
        <article key={title} className="group rounded-xl border border-border bg-white p-5 transition-colors hover:border-primary/25 hover:bg-[#fbfcfb]">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-[18px]" aria-hidden="true" /></span>
            <ArrowUpRight className="size-4 text-muted-foreground/70 transition-colors group-hover:text-primary" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-orange">{tag}</p>
          <h3 className="mt-1.5 text-[15px] font-semibold tracking-[-0.025em]">{title}</h3>
          <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{description}</p>
        </article>
      ))}
    </div>
  )
}

export function SolutionsGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {solutionCatalog.map(({ title, description, icon: Icon }) => (
        <article key={title} className="flex gap-4 rounded-xl border border-border bg-white p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="size-[18px]" aria-hidden="true" /></span>
          <div><h3 className="text-sm font-semibold tracking-[-0.02em]">{title}</h3><p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">{description}</p></div>
        </article>
      ))}
    </div>
  )
}

export function PricingGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {pricingPlans.map((plan) => (
        <article key={plan.name} className={`relative flex flex-col rounded-xl border p-5 ${plan.featured ? 'border-primary bg-[#f2f7f5] ring-1 ring-primary/10' : 'border-border bg-white'}`}>
          {plan.featured && <span className="absolute -top-3 left-5 rounded-full bg-primary px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white">Most popular</span>}
          <h3 className="text-[15px] font-semibold">{plan.name}</h3>
          <p className="mt-1.5 min-h-10 text-xs leading-5 text-muted-foreground">{plan.description}</p>
          <p className="mt-4 flex items-baseline gap-1 text-2xl font-semibold tracking-[-0.05em]">{plan.name === 'Enterprise' ? plan.price : <><span className="text-sm font-medium text-muted-foreground">Rs.</span>{plan.price}</>}<span className="text-[11px] font-medium tracking-normal text-muted-foreground">{plan.period}</span></p>
          {plan.name !== 'Enterprise' && <p className="mt-1 text-[10px] text-muted-foreground">Billed annually, plus applicable taxes</p>}
          <Link href={plan.name === 'Enterprise' ? '/contact' : '/signup'} className={`mt-5 inline-flex h-10 items-center justify-center rounded-lg px-3 text-xs font-semibold transition-colors ${plan.featured ? 'bg-primary text-white hover:bg-brand-800' : 'border border-border bg-white text-foreground hover:bg-muted'}`}>
            {plan.name === 'Enterprise' ? 'Talk to our team' : 'Start 14-day trial'}
          </Link>
          <ul className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
            {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-[11px] leading-4 text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />{feature}</li>)}
          </ul>
        </article>
      ))}
    </div>
  )
}

function ShowcasePreview({ type }: { type: 'orders' | 'kitchen' | 'inventory' | 'finance' }) {
  if (type === 'orders') {
    return <div className="rounded-xl border border-border bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold">Open orders</span><span className="rounded-md bg-secondary px-2 py-1 text-[9px] font-semibold text-primary">12 active</span></div>{[
      ['SP-2489', 'Chicken momo · T-08', 'Preparing'], ['SP-2488', 'Nepali thali · Takeaway', 'Ready'], ['SP-2487', 'Chicken sekuwa · Delivery', 'New'],
    ].map(([id, text, status]) => <div key={id} className="flex items-center justify-between gap-3 border-t border-border py-3"><div><p className="text-[10px] font-semibold text-primary">{id}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{text}</p></div><span className="rounded-md bg-accent px-2 py-1 text-[9px] font-semibold text-accent-foreground">{status}</span></div>)}</div>
  }
  if (type === 'kitchen') {
    return <div className="grid grid-cols-3 gap-2"><div className="rounded-xl border border-border bg-white p-3"><p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">New · 2</p><div className="mt-3 rounded-lg border border-border p-2"><p className="text-[9px] font-semibold">#2487 · Delivery</p><p className="mt-1.5 text-[9px] leading-4 text-muted-foreground">Chicken sekuwa<br />Steamed momo × 2</p></div></div><div className="rounded-xl border border-border bg-white p-3"><p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Cooking · 4</p><div className="mt-3 rounded-lg border border-border p-2"><p className="text-[9px] font-semibold">#2489 · T-08</p><p className="mt-1.5 text-[9px] leading-4 text-muted-foreground">Chicken momo × 2<br />Masala chai</p></div></div><div className="rounded-xl border border-border bg-white p-3"><p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Ready · 1</p><div className="mt-3 rounded-lg border border-border p-2"><p className="text-[9px] font-semibold">#2488 · Pickup</p><p className="mt-1.5 text-[9px] leading-4 text-muted-foreground">Nepali thali<br />Lemon soda</p></div></div></div>
  }
  if (type === 'inventory') {
    return <div className="rounded-xl border border-border bg-white p-4"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold">Stock health</span><span className="text-[9px] text-muted-foreground">Today</span></div>{[
      { name: 'Chicken breast', stock: '8.4 kg', width: '30%', color: 'bg-brand-orange' }, { name: 'Basmati rice', stock: '24 kg', width: '78%', color: 'bg-primary' }, { name: 'Cooking oil', stock: '3 liters', width: '25%', color: 'bg-brand-orange' },
    ].map((item) => <div key={item.name} className="border-t border-border py-3"><div className="flex justify-between text-[10px]"><span className="font-medium">{item.name}</span><span className="text-muted-foreground">{item.stock}</span></div><div className="mt-2 h-1.5 rounded-full bg-muted"><span className={`block h-full rounded-full ${item.color}`} style={{ width: item.width }} /></div></div>)}</div>
  }
  return <div className="rounded-xl border border-border bg-white p-4"><div className="mb-4 flex items-start justify-between"><div><p className="text-[9px] text-muted-foreground">Sales this week</p><p className="mt-1 text-xl font-semibold tracking-tight">Rs. 318,640</p></div><span className="rounded-md bg-[#e8f4ec] px-2 py-1 text-[9px] font-semibold text-success">+12.8%</span></div><div className="flex h-24 items-end gap-2 border-b border-l border-border px-2"><span className="h-[35%] flex-1 rounded-t bg-primary/65"/><span className="h-[54%] flex-1 rounded-t bg-primary/65"/><span className="h-[42%] flex-1 rounded-t bg-primary/65"/><span className="h-[83%] flex-1 rounded-t bg-primary/65"/><span className="h-[61%] flex-1 rounded-t bg-primary/65"/><span className="h-[94%] flex-1 rounded-t bg-brand-orange"/><span className="h-[73%] flex-1 rounded-t bg-primary/65"/></div><div className="mt-2 flex justify-between text-[8px] text-muted-foreground"><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span></div></div>
}

function ProductShowcase() {
  const sections = [
    { eyebrow: 'The full picture', title: 'A dashboard built around your shift.', body: 'See sales, service, stock, and the next decisions in one clear view. Start with what is moving and drill into the detail when you need it.', icon: Gauge, preview: 'finance' as const, align: 'left' },
    { eyebrow: 'From first hello to final bill', title: 'A smoother kind of service.', body: 'Keep tables, tickets, and payment status moving together. Your front of house and your kitchen share the same live story.', icon: ClipboardList, preview: 'orders' as const, align: 'right' },
    { eyebrow: 'The kitchen in sync', title: 'Every order has a next step.', body: 'Prioritize prep, spot a ticket that needs attention, and let servers know when a dish is ready to run.', icon: ChefHat, preview: 'kitchen' as const, align: 'left' },
    { eyebrow: 'Ingredients under control', title: 'Catch stock gaps before the rush.', body: 'Follow the ingredients behind each favorite, review low-stock alerts, and turn a count into a purchase order.', icon: PackageCheck, preview: 'inventory' as const, align: 'right' },
    { eyebrow: 'A better way to grow', title: 'Build on what your numbers tell you.', body: 'Understand what sells, what costs, and which shifts are working. Make the next location feel like a confident next step.', icon: Activity, preview: 'finance' as const, align: 'left' },
  ]
  return (
    <div className="flex flex-col gap-20 lg:gap-24">
      {sections.map(({ eyebrow, title, body, icon: Icon, preview, align }, index) => (
        <div key={title} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${align === 'right' ? 'lg:[&>div:first-child]:order-2' : ''}`}>
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-orange"><Icon className="size-4" aria-hidden="true" />{eyebrow}</span>
            <h3 className="mt-4 text-[30px] font-semibold leading-[1.1] tracking-[-0.05em] sm:text-[40px]">{title}</h3>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">{body}</p>
            <Link href="/signup" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">See how it works <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className={`rounded-2xl border border-border p-3 sm:p-5 ${index % 2 === 0 ? 'bg-[#edf2f0]' : 'bg-[#f2efe8]'}`}>
            <ShowcasePreview type={preview} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Testimonials() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {testimonials.map((item) => (
        <blockquote key={item.name} className="rounded-xl border border-border bg-white p-5 sm:p-6">
          <div className="flex gap-0.5 text-brand-orange" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((star) => <Star key={star} className="size-3.5 fill-current" aria-hidden="true" />)}</div>
          <p className="mt-4 text-[14px] leading-6 text-foreground">“{item.quote}”</p>
          <footer className="mt-5 flex items-center gap-3 border-t border-border pt-4">
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-primary">{item.initials}</span>
            <span><span className="block text-xs font-semibold">{item.name}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">{item.role}</span></span>
          </footer>
        </blockquote>
      ))}
    </div>
  )
}

function FAQ() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
      {faqs.map((faq, index) => (
        <details key={faq.question} className="group py-4" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            {faq.question}<ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="max-w-2xl pt-3 text-[13px] leading-6 text-muted-foreground">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="page-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="Cafora home"><BrandMark /></Link>
          <p className="mt-4 max-w-xs text-[13px] leading-6 text-muted-foreground">A little more calm in every service. Built for the people who make restaurants feel like somewhere to be.</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><MapPin className="size-3.5" aria-hidden="true" /> Made with care in Kathmandu</p>
        </div>
        <div><p className="text-xs font-semibold">Product</p><div className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground"><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/solutions">Solutions</Link><Link href="/login">Log in</Link></div></div>
        <div><p className="text-xs font-semibold">Company</p><div className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground"><Link href="/about">About us</Link><Link href="/resources">Resources</Link><Link href="/contact">Contact</Link><Link href="mailto:hello@cafora.com">Talk to us</Link></div></div>
        <div><p className="text-xs font-semibold">Built for service</p><p className="mt-4 max-w-[210px] text-xs leading-5 text-muted-foreground">The small details that help a restaurant run like one team.</p><div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-primary"><span className="size-2 rounded-full bg-success" /> Workspace demo available</div></div>
      </div>
      <div className="border-t border-border"><div className="page-container flex flex-col gap-2 py-4 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Cafora Technologies Pvt. Ltd.</span><span>Privacy · Terms · Accessibility</span></div></div>
    </footer>
  )
}

export function MarketingSite() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden border-b border-border bg-[radial-gradient(circle_at_77%_44%,#ffe6e8_0,transparent_28%),linear-gradient(135deg,#fff_0%,#fff7f2_100%)]">
          <div className="pointer-events-none absolute -right-32 -top-40 -z-10 size-[520px] rounded-full border-[64px] border-white/70 blur-[1px]" />
          <div className="pointer-events-none absolute -bottom-52 left-[38%] -z-10 size-[440px] rounded-full bg-[#fff0d8]/70 blur-3xl" />
          <div className="page-container grid items-center gap-12 pb-20 pt-12 sm:pb-24 sm:pt-16 lg:min-h-[690px] lg:grid-cols-[0.88fr_1.12fr] lg:gap-8 lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary shadow-sm"><span className="size-1.5 animate-pulse rounded-full bg-brand-orange" /> The calm behind a great service</p>
            <h1 className="mt-6 text-[45px] font-semibold leading-[0.99] tracking-[-0.065em] text-foreground sm:text-[60px] lg:text-[70px]">Run a better<br className="hidden sm:block" /> <span className="bg-gradient-to-r from-primary via-[#b41034] to-brand-orange bg-clip-text text-transparent">restaurant day.</span></h1>
            <p className="mt-5 max-w-lg text-[16px] leading-7 text-muted-foreground sm:text-[18px] sm:leading-8">Orders, kitchen, stock, and your team - all in one place. Spend less time juggling tabs and more time making guests feel welcome.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(220,20,60,0.7)] transition-all hover:-translate-y-0.5 hover:bg-brand-800">Start your free trial <ArrowRight className="size-4" aria-hidden="true" /></Link>
              <Link href="/app/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white/80 px-5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white">Explore the demo <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">14 days on us · No card needed · Setup in minutes</p>
            <div className="mt-9 flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden="true"><span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#e8f4ec] text-[9px] font-semibold text-primary">AS</span><span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#fff1df] text-[9px] font-semibold text-accent-foreground">RK</span><span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#edf2ff] text-[9px] font-semibold text-info">MP</span><span className="grid size-8 place-items-center rounded-full border-2 border-background bg-primary text-[9px] font-semibold text-white">+1k</span></div>
              <span className="text-[11px] leading-4 text-muted-foreground"><strong className="font-semibold text-foreground">Made for people who serve.</strong><br />Built with Nepal&apos;s restaurant teams.</span>
            </div>
          </div>
          <div className="relative min-w-0 py-2 lg:pl-3">
            <div className="relative mx-auto w-full max-w-[760px]">
              <div className="absolute -left-3 top-8 z-20 hidden w-[148px] -rotate-6 rounded-2xl border border-white/80 bg-white/95 p-2.5 shadow-[0_18px_45px_-20px_rgba(28,25,23,0.5)] sm:block">
                <div className="relative h-20 overflow-hidden rounded-xl">
                  <Image src="/servepilot/momo.png" alt="Steamed momo" fill className="object-cover" sizes="148px" />
                </div>
                <p className="mt-2 text-[9px] font-semibold text-foreground">Best seller today</p>
                <p className="mt-0.5 text-[8px] text-muted-foreground">Chicken momo · 24 plates</p>
              </div>
              <div className="absolute -right-2 bottom-10 z-20 hidden w-[154px] rotate-6 rounded-2xl border border-white/80 bg-white/95 p-2.5 shadow-[0_18px_45px_-20px_rgba(28,25,23,0.5)] sm:block">
                <div className="flex items-center gap-2">
                  <div className="relative size-11 overflow-hidden rounded-xl"><Image src="/servepilot/masala-chai.png" alt="Masala chai" fill className="object-cover" sizes="44px" /></div>
                  <div><p className="text-[9px] font-semibold text-foreground">Service is flowing</p><p className="mt-0.5 text-[8px] text-success">● 8 tables active</p></div>
                </div>
              </div>
              <BrowserPreview />
            </div>
          </div>
          </div>
        </section>

        <section className="border-y border-border bg-white">
          <div className="page-container grid gap-6 py-6 sm:grid-cols-2 sm:items-center lg:grid-cols-[1.3fr_repeat(3,1fr)]">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">The whole shift, in sync</p><p className="mt-1 text-sm font-semibold tracking-[-0.02em]">One clear view from open to close.</p></div>
            {[
              { title: 'All service styles', detail: 'Dine in · takeaway · delivery' },
              { title: 'One connected team', detail: 'Front of house to kitchen' },
              { title: 'Every location', detail: 'Local detail, shared insight' },
            ].map((item) => <div key={item.title} className="border-l border-border pl-4"><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.detail}</p></div>)}
          </div>
        </section>

        <section id="features" className="page-container scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">One place, fewer loose ends</p><h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.055em] sm:text-[46px]">The work behind the welcome.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">A connected set of tools for the work guests see - and all the work they don&apos;t.</p></div>
          <FeatureGrid />
          <div className="mt-7 text-center"><Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Explore every feature <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
        </section>

        <section id="product" className="border-y border-border bg-white py-20 sm:py-24">
          <div className="page-container"><div className="mb-14 max-w-2xl"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">A thoughtful workspace</p><h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.055em] sm:text-[46px]">See the whole restaurant.<br className="hidden sm:block" />Keep the details human.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Every screen connects to the next, so nothing gets lost between a guest&apos;s order and the end-of-day numbers.</p></div><ProductShowcase /></div>
        </section>

        <section id="solutions" className="page-container scroll-mt-24 py-20 sm:py-24">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-xl"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Made for your kind of place</p><h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.055em] sm:text-[44px]">Good service looks different everywhere.</h2></div><Link href="/solutions" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Find your fit <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
          <SolutionsGrid />
        </section>

        <section className="border-y border-border bg-[#eef3f1] py-20 sm:py-24">
          <div className="page-container grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">A clearer close</p><h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.055em] sm:text-[44px]">Know what worked before tomorrow starts.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Bring sales, costs, payments, and staff activity into one daily story. Give owners and managers a useful answer without building another spreadsheet.</p><Link href="/signup" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">See your first report <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Receipt, label: 'Sales by channel', value: 'Rs. 52,480', foot: 'Today · 79 orders' },
                { icon: Sparkles, label: 'Best seller', value: 'Chicken momo', foot: '24 plates today' },
                { icon: Wallet, label: 'Cash tracked', value: 'Rs. 17,840', foot: '4 payment methods' },
                { icon: Zap, label: 'Service time', value: '14 min', foot: '2 min faster this week' },
              ].map(({ icon: Icon, label, value, foot }) => <div key={label} className="rounded-xl border border-border bg-white p-4 sm:p-5"><span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span><p className="mt-4 text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold tracking-[-0.035em]">{value}</p><p className="mt-1 text-[10px] text-muted-foreground">{foot}</p></div>)}
            </div>
          </div>
        </section>

        <section className="page-container py-20 sm:py-24">
          <div className="mb-10 text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">A word from the floor</p><h2 className="mt-3 text-[34px] font-semibold tracking-[-0.055em] sm:text-[44px]">Built for real restaurant days.</h2></div>
          <Testimonials />
        </section>

        <section id="pricing" className="border-y border-border bg-white py-20 sm:py-24">
          <div className="page-container"><div className="mx-auto mb-10 max-w-xl text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Straightforward plans</p><h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.055em] sm:text-[44px]">Start small. Grow in your own time.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Try the full workspace, then choose the tools and locations that fit your team.</p></div><PricingGrid /><p className="mt-6 text-center text-[11px] text-muted-foreground">All prices shown in NPR. Annual billing shown. Taxes may apply.</p></div>
        </section>

        <section id="resources" className="page-container py-20 sm:py-24">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Ideas for better service</p><h2 className="mt-3 text-[34px] font-semibold tracking-[-0.055em] sm:text-[42px]">The little things that add up.</h2></div><Link href="/resources" className="hidden items-center gap-2 text-sm font-semibold text-primary sm:inline-flex">Visit the journal <ArrowRight className="size-4" /></Link></div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { category: 'Operations', title: 'A calmer opening checklist for your whole team', icon: CalendarCheck2, read: '6 min read' },
              { category: 'Inventory', title: 'How to keep a useful eye on food cost', icon: PackageCheck, read: '8 min read' },
              { category: 'People', title: 'Make the handoff from service to kitchen feel easy', icon: Workflow, read: '5 min read' },
            ].map(({ category, title, icon: Icon, read }) => <article key={title} className="rounded-xl border border-border bg-white p-5"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-[18px]" /></span><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-orange">{category}</p><h3 className="mt-2 text-[16px] font-semibold leading-6 tracking-[-0.025em]">{title}</h3><p className="mt-4 text-[10px] text-muted-foreground">{read} <span className="px-1">·</span> Cafora journal</p></article>)}
          </div>
        </section>

        <section className="page-container pb-20 sm:pb-24">
          <div className="mx-auto mb-9 max-w-2xl text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Questions, answered</p><h2 className="mt-3 text-[34px] font-semibold tracking-[-0.055em] sm:text-[44px]">A few things you might be wondering.</h2></div>
          <FAQ />
        </section>

        <section className="border-t border-border bg-primary py-14 text-white sm:py-20">
          <div className="page-container flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center"><div className="max-w-xl"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f7bd76]">Your next shift, a little clearer</p><h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.05em] sm:text-[42px]">Make space for the good part of running a restaurant.</h2><p className="mt-3 text-sm leading-6 text-white/70">Start with a workspace that brings the whole team together.</p></div><div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><Link href="/signup" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-primary transition-colors hover:bg-[#eef3f1]">Start your free trial <ArrowRight className="size-4" /></Link><Link href="/contact" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">Talk to our team</Link></div></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

export const marketingIcons = {
  FileText,
  Globe2,
  Sparkles,
  Receipt,
  BarChart3,
  Workflow,
}
