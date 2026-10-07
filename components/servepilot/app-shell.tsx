'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  Bell,
  Boxes,
  CalendarDays,
  ChartNoAxesCombined,
  ChefHat,
  ChevronDown,
  ChevronsLeft,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Grid2X2,
  LayoutDashboard,
  Menu,
  PanelLeftOpen,
  Search,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  TableProperties,
  Truck,
  UserRound,
  Users,
  UtensilsCrossed,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'
import { BrandMark } from './shared'
import { useDemoStore } from './demo-store'
import { branches } from './data'

type AppNavItem = { label: string; href: string; icon: LucideIcon }
type AppNavGroup = { label: string; items: AppNavItem[] }

const navGroups: AppNavGroup[] = [
  { label: 'Workspace', items: [{ label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard }] },
  {
    label: 'Service',
    items: [
      { label: 'Orders', href: '/app/orders', icon: ClipboardList },
      { label: 'Point of sale', href: '/app/pos', icon: ShoppingBag },
      { label: 'Kitchen display', href: '/app/kitchen', icon: ChefHat },
      { label: 'Tables & reservations', href: '/app/tables', icon: TableProperties },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Menu', href: '/app/menu/items', icon: UtensilsCrossed },
      { label: 'Inventory', href: '/app/inventory', icon: Boxes },
      { label: 'Purchasing', href: '/app/purchases', icon: ShoppingCart },
      { label: 'Suppliers', href: '/app/suppliers', icon: Truck },
      { label: 'Customers', href: '/app/customers', icon: Users },
      { label: 'Staff & roles', href: '/app/staff', icon: UserRound },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Finance', href: '/app/finance', icon: Wallet },
      { label: 'Reports', href: '/app/reports', icon: ChartNoAxesCombined },
    ],
  },
  { label: 'Configuration', items: [{ label: 'Settings', href: '/app/settings', icon: Settings2 }] },
]

const allNavItems = navGroups.flatMap((group) => group.items)
const notifications = [
  { id: 'order', icon: ClipboardList, title: 'New order received', detail: 'SP-2487 · Delivery · 2 min ago', tone: 'bg-accent text-accent-foreground' },
  { id: 'stock', icon: Boxes, title: 'Stock needs a look', detail: 'Paneer is out of stock · 18 min ago', tone: 'bg-[#fff1df] text-[#9a5118]' },
  { id: 'purchase', icon: Truck, title: 'Purchase order updated', detail: 'PO-1028 · Awaiting delivery · 34 min ago', tone: 'bg-secondary text-primary' },
]

function NavigationLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: AppNavItem
  active: boolean
  collapsed: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      onClick={onNavigate}
      className={`group flex min-h-9 items-center gap-3 rounded-lg px-3 text-[12px] font-medium transition-colors ${
        active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      } ${collapsed ? 'justify-center px-0' : ''}`}
    >
      <Icon aria-hidden="true" className={`size-4 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {active && !collapsed && <span className="ml-auto size-1.5 rounded-full bg-brand-orange" />}
    </Link>
  )
}

export function ServePilotAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { branch, setBranch, showToast, orders, inventory, toast } = useDemoStore()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [allRead, setAllRead] = useState(false)
  const [period, setPeriod] = useState('Today')

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return allNavItems.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 5)
  }, [search])
  const newOrders = orders.filter((order) => order.status === 'New').length
  const lowStock = inventory.filter((item) => item.stock <= item.reorderLevel).length
  const unreadCount = allRead ? 0 : Math.min(9, Math.max(1, newOrders + (lowStock > 0 ? 1 : 0)))

  function closeMobileNav() {
    setDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {drawerOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-[#172026]/35 lg:hidden" onClick={closeMobileNav} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-white transition-[width,transform] duration-200 ${collapsed ? 'w-[76px]' : 'w-[256px]'} ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className={`flex h-[68px] shrink-0 items-center border-b border-border px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/app/dashboard" aria-label="ServePilot workspace" className="min-w-0" onClick={closeMobileNav}><BrandMark compact={collapsed} /></Link>
          {!collapsed && <button aria-label="Close navigation" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden" onClick={closeMobileNav}><X className="size-4" /></button>}
          {!collapsed && <button aria-label="Collapse navigation" className="hidden size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:grid" onClick={() => setCollapsed(true)}><ChevronsLeft className="size-4" /></button>}
          {collapsed && <button aria-label="Expand navigation" className="hidden size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:grid" onClick={() => setCollapsed(false)}><PanelLeftOpen className="size-4" /></button>}
        </div>

        <div className="subtle-scrollbar flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => <div key={group.label} className="mb-5 last:mb-1">
            {!collapsed && <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-muted-foreground/80">{group.label}</p>}
            <nav aria-label={group.label} className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/app/dashboard' && pathname.startsWith(`${item.href}/`))
                return <NavigationLink key={item.href} item={item} active={active} collapsed={collapsed} onNavigate={closeMobileNav} />
              })}
            </nav>
          </div>)}
        </div>

        <div className="shrink-0 border-t border-border p-3">
          {!collapsed ? <label className="flex flex-col gap-1.5 rounded-xl bg-[#f7f8f6] p-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Restaurant location</span>
            <span className="relative flex items-center">
              <select aria-label="Switch restaurant location" value={branch} onChange={(event) => { setBranch(event.target.value); showToast(`Viewing ${event.target.value}.`) }} className="h-9 w-full appearance-none rounded-lg border border-border bg-white pl-2.5 pr-8 text-[11px] font-semibold text-foreground outline-none focus:border-primary/40">
                {branches.map((location) => <option key={location}>{location}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground" />
            </span>
          </label> : <button aria-label={`Current location: ${branch}`} title={branch} className="grid size-10 w-full place-items-center rounded-lg bg-secondary text-primary"><Grid2X2 className="size-4" /></button>}
          <Link href="/app/settings" onClick={closeMobileNav} className={`mt-3 flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-muted ${collapsed ? 'justify-center' : ''}`}>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8eee9] text-[10px] font-semibold text-primary">AK</span>
            {!collapsed && <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">Aarya K.C.</span><span className="mt-0.5 block text-[9px] text-muted-foreground">Workspace owner</span></span>}
          </Link>
        </div>
      </aside>

      <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[256px]'}`}>
        <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6">
          <button aria-label="Open navigation" className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted lg:hidden" onClick={() => setDrawerOpen(true)}><Menu className="size-4" /></button>
          <div className="hidden min-w-0 items-center gap-2 text-[11px] text-muted-foreground sm:flex"><span className="text-foreground">Workspace</span><span aria-hidden="true">/</span><span className="truncate font-medium text-foreground">{allNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? 'Dashboard'}</span></div>

          <div className="relative ml-auto hidden w-full max-w-[260px] md:block">
            <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-[#fbfcfb] px-3 text-muted-foreground focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
              <Search aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="sr-only">Search workspace</span>
              <input value={search} onFocus={() => setSearchOpen(true)} onChange={(event) => { setSearch(event.target.value); setSearchOpen(true) }} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); if (event.key === 'Enter' && searchResults[0]) { window.location.href = searchResults[0].href } }} placeholder="Search workspace" className="min-w-0 flex-1 bg-transparent text-[11px] text-foreground outline-none placeholder:text-muted-foreground" />
              <kbd className="hidden rounded border border-border bg-white px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground lg:inline">⌘ K</kbd>
            </label>
            {searchOpen && searchResults.length > 0 && <div className="absolute inset-x-0 top-11 z-50 rounded-xl border border-border bg-white p-1.5 shadow-xl">
              {searchResults.map((item) => <Link key={item.href} href={item.href} onClick={() => { setSearch(''); setSearchOpen(false) }} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-foreground hover:bg-muted"><item.icon aria-hidden="true" className="size-4 text-primary" />{item.label}</Link>)}
            </div>}
            {searchOpen && search.length > 0 && searchResults.length === 0 && <div className="absolute inset-x-0 top-11 z-50 rounded-xl border border-border bg-white px-3 py-3 text-xs text-muted-foreground shadow-xl">No workspace pages match "{search}".</div>}
          </div>

          <label className="relative hidden items-center sm:flex">
            <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            <select aria-label="Dashboard period" value={period} onChange={(event) => setPeriod(event.target.value)} className="h-9 appearance-none rounded-lg border border-border bg-white pl-8 pr-8 text-[10px] font-semibold text-foreground outline-none focus:border-primary/40">
              {['Today', 'Yesterday', 'This week', 'This month'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 size-3 text-muted-foreground" />
          </label>

          <div className="relative">
            <button type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((current) => !current); setSearchOpen(false) }} className="relative grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Bell className="size-4" />{unreadCount > 0 && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-brand-orange ring-2 ring-white" />}</button>
            {notificationsOpen && <div className="absolute right-0 top-11 z-50 w-[min(330px,calc(100vw-24px))] rounded-xl border border-border bg-white p-4 shadow-xl">
              <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">Notifications</h2><p className="mt-1 text-[10px] text-muted-foreground">Updates for your workspace</p></div><button type="button" onClick={() => setAllRead(true)} className="text-[10px] font-semibold text-primary">Mark all read</button></div>
              <div className="mt-3 flex flex-col divide-y divide-border">{notifications.map((item) => { const Icon = item.icon; return <div key={item.id} className="flex gap-3 py-3"><span className={`grid size-8 shrink-0 place-items-center rounded-lg ${item.tone}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-semibold">{item.title}</span><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{item.detail}</span></span>{!allRead && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-orange" />}</div>})}</div>
            </div>}
          </div>
          <Link href="/resources" aria-label="Help center" title="Help center" className="hidden size-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted sm:grid"><CircleHelp className="size-4" /></Link>
          <Link href="/app/settings" aria-label="Open account settings" className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-white">AK</Link>
        </header>

        <main className="mx-auto min-h-[calc(100vh-68px)] w-full max-w-[1600px] px-4 pb-24 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur md:hidden">
        {[
          { label: 'Home', href: '/app/dashboard', icon: LayoutDashboard },
          { label: 'POS', href: '/app/pos', icon: ShoppingBag },
          { label: 'Orders', href: '/app/orders', icon: ClipboardList },
          { label: 'Kitchen', href: '/app/kitchen', icon: ChefHat },
        ].map((item) => { const Icon = item.icon; const active = pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-1 py-1 text-[9px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}><Icon aria-hidden="true" className="size-[18px]" />{item.label}</Link>})}
        <button type="button" onClick={() => setDrawerOpen(true)} className="flex flex-col items-center gap-1 px-1 py-1 text-[9px] font-medium text-muted-foreground"><Menu aria-hidden="true" className="size-[18px]" />More</button>
      </nav>

      {toast && <div role="status" aria-live="polite" className="fixed bottom-20 left-1/2 z-[60] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border border-primary/10 bg-primary px-4 py-3 text-center text-xs font-medium text-white shadow-xl md:bottom-6">{toast}</div>}
    </div>
  )
}

export function AppShellPulse() {
  return <Activity aria-hidden="true" className="size-4" />
}

export function AppShellPaymentIcon() {
  return <CreditCard aria-hidden="true" className="size-4" />
}

export function AppShellWalletIcon() {
  return <Wallet aria-hidden="true" className="size-4" />
}

export function AppShellHelpIcon() {
  return <CircleHelp aria-hidden="true" className="size-4" />
}
