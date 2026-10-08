'use client'

import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  ClipboardList,
  Clock3,
  CreditCard,
  Plus,
  ShoppingBag,
  TableProperties,
  Users,
  Wallet,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { useDemoStore } from './demo-store'
import { formatNpr, paymentMix, revenueByDay } from './data'
import { MetricCard, PageHeader, Panel, PanelHeading, StatusBadge, TableScroller } from './shared'

const topProducts = [
  { name: 'Steamed chicken momo', quantity: 48, sales: 24960, share: 88 },
  { name: 'Nepali thali', quantity: 32, sales: 23040, share: 75 },
  { name: 'Chicken sekuwa', quantity: 24, sales: 16320, share: 58 },
  { name: 'Masala chai', quantity: 38, sales: 4180, share: 34 },
]

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg"><p className="text-[10px] font-medium text-muted-foreground">{label}</p><p className="mt-1 text-xs font-semibold">{formatNpr(payload[0].value)}</p></div>
}

export function DashboardView() {
  const { orders, inventory, tables, customers, branch, showToast } = useDemoStore()
  const additionalSales = orders.reduce((total, order) => total + order.amount, 0)
  const lowStock = inventory.filter((item) => item.stock <= item.reorderLevel)
  const occupiedTables = tables.filter((table) => table.status === 'Occupied').length
  const currentSales = additionalSales
  const paidOrders = orders.filter((order) => order.paymentStatus === 'Paid').length

  return (
    <div className="dashboard-container">
      <PageHeader
        eyebrow="Wednesday, October 7, 2026"
        title="Good afternoon, Aarya."
        description={`Here is what is happening at ${branch} today.`}
        action={<><Button variant="outline" size="sm" onClick={() => window.print()}><Clock3 data-icon="inline-start" />Today</Button><button type="button" onClick={() => showToast('Orders are disabled until your menu and workspace are configured.')} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-muted px-3 text-xs font-semibold text-muted-foreground"><Plus className="size-3.5" />New order</button></>}
      />

      <section aria-label="Today's key performance indicators" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard label="Net sales" value={formatNpr(currentSales)} change="12.8%" caption="vs. last Wednesday" icon={<Wallet className="size-4" />} tone="teal" />
        <MetricCard label="Orders today" value={String(orders.length)} change="0%" caption="No orders recorded" icon={<ClipboardList className="size-4" />} tone="orange" />
        <MetricCard label="Average order value" value={formatNpr(0)} change="0%" caption="No orders recorded" icon={<CreditCard className="size-4" />} tone="blue" />
        <MetricCard label="Guests served" value={String(customers.length)} change="0%" caption="No guests recorded" icon={<Users className="size-4" />} tone="green" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
        <Panel>
          <PanelHeading title="Sales overview" detail="Your service, day by day" action={<select aria-label="Sales chart date range" className="h-8 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-muted-foreground"><option>Last 7 days</option><option>Today</option><option>Last 30 days</option></select>} />
          <div className="h-[242px] px-2 pb-4 pt-5 sm:h-[278px] sm:px-5" role="img" aria-label="Area chart showing sales over the last seven days">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByDay} margin={{ top: 5, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e9eeeb" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#7d8987', fontSize: 10 }} dy={9} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7d8987', fontSize: 9 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#c9d6d2', strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="revenue" stroke="#dc143c" strokeWidth={2.5} fill="#ffe4e8" activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Payment mix" detail="How guests paid today" action={<Link href="/app/finance" className="text-[10px] font-semibold text-primary">Details</Link>} />
          <div className="relative mx-auto h-[190px] max-w-[280px] pt-2" role="img" aria-label="Donut chart of payment mix: cash 34 percent, card 29 percent, eSewa 22 percent, Khalti 15 percent">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMix} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={3} stroke="none">
                  {paymentMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1"><span className="text-[10px] text-muted-foreground">Payments</span><span className="mt-1 text-[22px] font-semibold tracking-[-0.05em]">{paymentMix.length} methods</span></div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-5 pb-5">
            {paymentMix.map((item) => <div key={item.name} className="flex items-center gap-2 text-[10px]"><span className="size-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="flex-1 text-muted-foreground">{item.name}</span><span className="font-semibold">{item.value}%</span></div>)}
          </div>
        </Panel>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.85fr_0.9fr]">
        <Panel>
          <PanelHeading title="Recent orders" detail="The latest from your floor" action={<Link href="/app/orders" className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">All orders <ArrowRight className="size-3" /></Link>} />
          <TableScroller>
            <table className="w-full min-w-[570px] text-left">
              <thead><tr className="border-b border-border text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 pb-2 pt-4">Order</th><th className="px-3 pb-2 pt-4">Guest / table</th><th className="px-3 pb-2 pt-4">Total</th><th className="px-5 pb-2 pt-4">Status</th></tr></thead>
              <tbody>{orders.slice(0, 4).map((order) => <tr key={order.id} className="border-b border-border/70 last:border-0"><td className="px-5 py-3"><p className="text-[11px] font-semibold text-primary">{order.id}</p><p className="mt-1 text-[9px] text-muted-foreground">{order.time}</p></td><td className="max-w-[150px] px-3 py-3"><p className="truncate text-[10px] font-medium">{order.customer}</p><p className="mt-1 text-[9px] text-muted-foreground">{order.table === '—' ? order.type : order.table}</p></td><td className="numeric px-3 py-3 text-[10px] font-semibold">{formatNpr(order.amount)}</td><td className="px-5 py-3"><StatusBadge status={order.status} /></td></tr>)}{orders.length === 0 && <tr><td colSpan={4} className="px-5 py-12 text-center text-xs text-muted-foreground">No orders yet. New orders are disabled for now.</td></tr>}</tbody>
            </table>
          </TableScroller>
        </Panel>

        <Panel>
          <PanelHeading title="Popular items" detail="Top sellers by sales" action={<Link href="/app/reports" className="text-[10px] font-semibold text-primary">Report</Link>} />
          <div className="h-[190px] px-3 pb-4 pt-2" role="img" aria-label="Bar chart of top selling restaurant menu items">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 3, right: 8, left: 1, bottom: 0 }}>
                <CartesianGrid stroke="#e9eeeb" strokeDasharray="3 5" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={108} axisLine={false} tickLine={false} tick={{ fill: '#68737a', fontSize: 9 }} />
                <Tooltip formatter={(value) => [formatNpr(Number(value)), 'Sales']} cursor={{ fill: '#f5f7f6' }} />
                <Bar dataKey="sales" fill="#dc143c" radius={[0, 4, 4, 0]} barSize={13} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Stock to watch" detail={`${lowStock.length} ingredients at reorder level`} action={<Link href="/app/inventory" className="text-[10px] font-semibold text-primary">View stock</Link>} />
          <div className="flex flex-col px-5 pb-2 pt-3">
            {lowStock.slice(0, 4).map((item) => <div key={item.id} className="flex items-center gap-3 border-b border-border/70 py-3 last:border-0"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><Boxes className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold">{item.name}</span><span className="mt-1 block text-[9px] text-muted-foreground">Reorder at {item.reorderLevel} {item.unit}</span></span><span className="shrink-0 text-right"><span className="block text-[10px] font-semibold text-accent-foreground">{item.stock} {item.unit}</span><span className="mt-1 block text-[8px] text-muted-foreground">on hand</span></span></div>)}
            {lowStock.length === 0 && <p className="py-8 text-center text-xs text-muted-foreground">All ingredients are above their reorder levels.</p>}
          </div>
        </Panel>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.1fr]">
        <Panel>
          <PanelHeading title="Floor status" detail="A quick look at your tables" action={<Link href="/app/tables" className="text-[10px] font-semibold text-primary">Open floor</Link>} />
          <div className="px-5 pb-5 pt-4">
            <div className="flex items-center justify-between gap-4"><div><p className="text-2xl font-semibold tracking-[-0.05em]">{occupiedTables}<span className="text-sm font-medium text-muted-foreground"> / {tables.length}</span></p><p className="mt-1 text-[10px] text-muted-foreground">tables currently occupied</p></div><div className="grid size-16 place-items-center rounded-full border-[5px] border-[#e7eeea] text-center"><span className="text-xs font-semibold">{tables.length ? Math.round((occupiedTables / tables.length) * 100) : 0}%</span></div></div>
            <div className="mt-4 grid grid-cols-4 gap-1.5">{tables.slice(0, 12).map((table) => <span key={table.id} aria-label={`${table.label}: ${table.status}`} className={`grid h-8 place-items-center rounded-md text-[9px] font-semibold ${table.status === 'Occupied' ? 'bg-primary text-white' : table.status === 'Reserved' ? 'bg-accent text-accent-foreground' : table.status === 'Cleaning' ? 'bg-muted text-muted-foreground' : 'border border-border bg-white text-muted-foreground'}`}>{table.label.replace('T-', '')}</span>)}</div>
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Today’s snapshot" detail="A few things to keep in mind" />
          <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
            <div className="flex items-center gap-3 rounded-lg bg-[#f7f8f6] p-3"><span className="grid size-8 place-items-center rounded-lg bg-[#e8f4ec] text-success"><Activity className="size-4" /></span><span><span className="block text-[10px] font-semibold">Kitchen is moving well</span><span className="mt-1 block text-[9px] text-muted-foreground">Average prep time is 14 minutes.</span></span></div>
            <div className="flex items-center gap-3 rounded-lg bg-[#f7f8f6] p-3"><span className="grid size-8 place-items-center rounded-lg bg-[#edf2ff] text-info"><CreditCard className="size-4" /></span><span><span className="block text-[10px] font-semibold">{paidOrders} paid orders today</span><span className="mt-1 block text-[9px] text-muted-foreground">Payment mix is on track.</span></span></div>
            <div className="flex items-center gap-3 rounded-lg bg-[#f7f8f6] p-3"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><ShoppingBag className="size-4" /></span><span><span className="block text-[10px] font-semibold">Evening prep starts at 3:30 PM</span><span className="mt-1 block text-[9px] text-muted-foreground">4 team members are on the next shift.</span></span></div>
          </div>
        </Panel>

        <Panel>
          <PanelHeading title="Quick actions" detail="Common things, one click away" />
          <div className="grid grid-cols-2 gap-2 px-5 pb-5 pt-4">
            {[
              { label: 'Take an order', icon: Plus, href: '/app/pos' },
              { label: 'Add menu item', icon: ClipboardList, href: '/app/menu/items' },
              { label: 'Receive stock', icon: Boxes, href: '/app/inventory' },
              { label: 'View customers', icon: Users, href: '/app/customers' },
              { label: 'Check reports', icon: BarChart3, href: '/app/reports' },
              { label: 'Manage tables', icon: TableProperties, href: '/app/tables' },
            ].map(({ label, icon: Icon, href }) => <Link key={label} href={href} className="flex min-h-16 items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2 transition-colors hover:border-primary/30 hover:bg-[#f7f8f6]"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span><span className="text-[10px] font-semibold leading-4">{label}</span></Link>)}
          </div>
        </Panel>
      </section>
    </div>
  )
}
