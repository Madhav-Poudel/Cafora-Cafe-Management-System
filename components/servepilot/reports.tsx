'use client'

import { useMemo, useState } from 'react'
import { ArrowDownToLine, BarChart3, ClipboardList, CreditCard, TrendingUp } from 'lucide-react'
import {
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
import { formatNpr, menuCategories, orderTypes, paymentMethods, revenueByDay } from './data'
import { MetricCard, PageHeader, Panel, PanelHeading, StatusBadge, TableScroller, controlClassName } from './shared'

const chartColors = ['#dc143c', '#e11d48', '#9f1239', '#f43f5e', '#fb7185']

type ReportRange = 'Today' | 'Last 7 days' | 'Last 30 days'

export function ReportsView() {
  const { orders, menuItems, branch } = useDemoStore()
  const [range, setRange] = useState<ReportRange>('Last 7 days')
  const [orderType, setOrderType] = useState('All order types')
  const [category, setCategory] = useState('All categories')
  const [paymentMethod, setPaymentMethod] = useState('All methods')

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesType = orderType === 'All order types' || order.type === orderType
    const matchesPayment = paymentMethod === 'All methods' || (order.paymentMethod ?? 'Cash').includes(paymentMethod)
    const matchesCategory = category === 'All categories' || (order.lines ?? []).some((line) => menuItems.find((item) => item.name === line.name)?.category === category)
    return matchesType && matchesPayment && matchesCategory
  }), [orders, menuItems, orderType, paymentMethod, category])

  const totalSales = filteredOrders.reduce((total, order) => total + order.amount, 0)
  const averageOrder = filteredOrders.length ? Math.round(totalSales / filteredOrders.length) : 0
  const salesSeries = range === 'Today' ? revenueByDay.slice(-1) : range === 'Last 30 days' ? revenueByDay : revenueByDay.slice(-7)
  const productSummary = new Map<string, { quantity: number; sales: number }>()
  for (const order of filteredOrders) {
    for (const line of order.lines ?? [{ name: order.items, quantity: 1, price: order.amount }]) {
      const existing = productSummary.get(line.name) ?? { quantity: 0, sales: 0 }
      productSummary.set(line.name, { quantity: existing.quantity + line.quantity, sales: existing.sales + line.quantity * line.price })
    }
  }
  const topProducts = Array.from(productSummary.entries()).map(([name, values]) => ({ name, ...values })).sort((a, b) => b.sales - a.sales).slice(0, 5)
  const paymentTotals = paymentMethods.slice(0, 5).map((method, index) => ({
    name: method,
    value: filteredOrders.filter((order) => (order.paymentMethod ?? (index === 0 ? 'Cash' : '')).includes(method)).reduce((total, order) => total + order.amount, 0),
    color: chartColors[index],
  })).filter((item) => item.value > 0)

  function exportReport() {
    const header = ['Order', 'Guest', 'Type', 'Items', 'Payment', 'Amount (NPR)', 'Status']
    const rows = filteredOrders.map((order) => [order.id, order.customer, order.type, order.items, order.paymentMethod ?? order.paymentStatus, order.amount, order.status])
    const csv = [header, ...rows].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'cafora-report-demo.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return <div>
    <PageHeader eyebrow="Performance & trends" title="Reports & analytics" description={`Understand service patterns and sales performance for ${branch}.`} action={<Button onClick={exportReport} size="sm" variant="outline"><ArrowDownToLine data-icon="inline-start" /> Export report</Button>} />

    <Panel className="mb-4 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold"><BarChart3 className="size-4 text-primary" /> Report filters</div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-[10px] font-medium text-muted-foreground">Date range<select aria-label="Date range" className={controlClassName} onChange={(event) => setRange(event.target.value as ReportRange)} value={range}><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></select></label>
        <label className="flex flex-col gap-1.5 text-[10px] font-medium text-muted-foreground">Order type<select aria-label="Order type" className={controlClassName} onChange={(event) => setOrderType(event.target.value)} value={orderType}><option>All order types</option>{orderTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="flex flex-col gap-1.5 text-[10px] font-medium text-muted-foreground">Category<select aria-label="Menu category" className={controlClassName} onChange={(event) => setCategory(event.target.value)} value={category}><option>All categories</option>{menuCategories.filter((item) => item !== 'All items').map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="flex flex-col gap-1.5 text-[10px] font-medium text-muted-foreground">Payment method<select aria-label="Payment method" className={controlClassName} onChange={(event) => setPaymentMethod(event.target.value)} value={paymentMethod}><option>All methods</option>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label>
      </div>
    </Panel>

    <section aria-label="Selected report metrics" className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
      <MetricCard label="Sales in selected view" value={formatNpr(totalSales)} caption={`${filteredOrders.length} matching orders`} icon={<TrendingUp />} tone="teal" />
      <MetricCard label="Orders" value={String(filteredOrders.length)} caption={`Current sample · ${range.toLowerCase()}`} icon={<ClipboardList />} tone="orange" />
      <MetricCard label="Average order value" value={formatNpr(averageOrder)} caption="Across matching orders" icon={<CreditCard />} tone="blue" />
      <MetricCard label="Top selling item" value={topProducts[0]?.name ?? '-'} caption={topProducts[0] ? `${topProducts[0].quantity} items sold` : 'No matching sales'} icon={<BarChart3 />} tone="green" />
    </section>

    <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
      <Panel>
        <PanelHeading title="Sales trend" detail={`${range} · demo revenue by day`} />
        <div className="h-[270px] px-2 pb-4 pt-5 sm:px-5" role="img" aria-label="Bar chart showing restaurant sales by day">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={salesSeries} margin={{ top: 5, right: 4, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="#e9eeeb" strokeDasharray="3 5" vertical={false} />
              <XAxis axisLine={false} dataKey="day" dy={8} tick={{ fill: '#7d8987', fontSize: 10 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7d8987', fontSize: 9 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} tickLine={false} />
              <Tooltip formatter={(value) => [formatNpr(Number(value)), 'Sales']} />
              <Bar dataKey="revenue" fill="#dc143c" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel>
        <PanelHeading title="Payment methods" detail="Share of matching orders" />
        <div className="relative mx-auto h-[190px] max-w-[260px] pt-2" role="img" aria-label="Donut chart showing payment method totals">
          <ResponsiveContainer height="100%" width="100%"><PieChart><Pie data={paymentTotals} dataKey="value" nameKey="name" innerRadius={48} outerRadius={73} paddingAngle={3} stroke="none">{paymentTotals.map((entry) => <Cell fill={entry.color} key={entry.name} />)}</Pie><Tooltip formatter={(value) => formatNpr(Number(value))} /></PieChart></ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-[10px] text-muted-foreground">Collected</span><span className="numeric mt-1 text-base font-semibold">{formatNpr(paymentTotals.reduce((total, item) => total + item.value, 0))}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-5 pb-5">{paymentTotals.map((item) => <div className="flex items-center gap-2 text-[10px]" key={item.name}><span className="size-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="min-w-0 flex-1 truncate text-muted-foreground">{item.name}</span><span className="numeric font-semibold">{formatNpr(item.value)}</span></div>)}</div>
      </Panel>
    </section>

    <Panel className="mt-4 overflow-hidden">
      <PanelHeading title="Top menu items" detail="Ranked by sales in the current filter" />
      {topProducts.length ? <TableScroller><table className="mt-4 w-full min-w-[620px] text-left"><thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Menu item</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Quantity sold</th><th className="px-3 py-3">Sales</th><th className="px-5 py-3">Availability</th></tr></thead><tbody>{topProducts.map((item) => { const product = menuItems.find((entry) => entry.name === item.name); return <tr className="border-b border-border/70 last:border-0" key={item.name}><td className="px-5 py-3 text-xs font-semibold">{item.name}</td><td className="px-3 py-3 text-xs text-muted-foreground">{product?.category ?? 'Other'}</td><td className="numeric px-3 py-3 text-xs">{item.quantity}</td><td className="numeric px-3 py-3 text-xs font-semibold">{formatNpr(item.sales)}</td><td className="px-5 py-3">{product ? <StatusBadge status={product.available ? 'Available' : 'Unavailable'} /> : <StatusBadge status="Recorded" />}</td></tr>})}</tbody></table></TableScroller> : <div className="p-5 text-xs text-muted-foreground">No orders match the selected report filters.</div>}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span>{filteredOrders.length} orders included</span><span>Export reflects the order filter selection.</span></div>
    </Panel>
  </div>
}
