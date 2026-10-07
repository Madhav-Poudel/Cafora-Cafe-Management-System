'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChefHat,
  Clock3,
  CreditCard,
  Minus,
  Plus,
  Printer,
  Search,
  ShoppingBag,
  TableProperties,
  TicketCheck,
  Trash2,
  Utensils,
  Wallet,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from './demo-store'
import {
  formatNpr,
  initialOrders,
  menuCategories,
  orderTypes,
  paymentMethods,
  type DemoOrder,
  type DemoTable,
  type OrderStatus,
  type OrderType,
} from './data'
import {
  controlClassName,
  EmptyState,
  FormField,
  Modal,
  PageHeader,
  Panel,
  PanelHeading,
  SearchField,
  SelectField,
  StatusBadge,
  TableScroller,
} from './shared'

const orderFilters = ['All', 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled'] as const

export function OrdersView() {
  const { orders, updateOrderStatus, updateOrderPayment, showToast } = useDemoStore()
  const [filter, setFilter] = useState<string>('All')
  const [query, setQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null)
  const visibleOrders = useMemo(() => orders.filter((order) => {
    const matchesFilter = filter === 'All' || order.status === filter
    const matchesQuery = `${order.id} ${order.customer} ${order.items} ${order.table}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  }), [orders, filter, query])

  return (
    <div>
      <PageHeader eyebrow="Service" title="Orders" description="Follow every ticket from the first tap to the final handoff." action={<Link href="/app/pos" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-brand-800"><Plus className="size-4" />New order</Link>} />
      <section aria-label="Order summary" className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Open orders', value: orders.filter((order) => ['New', 'Preparing', 'Ready'].includes(order.status)).length },
          { label: 'New tickets', value: orders.filter((order) => order.status === 'New').length },
          { label: 'Ready to serve', value: orders.filter((order) => order.status === 'Ready').length },
          { label: 'Today’s total', value: formatNpr(52480 + orders.slice(0, Math.max(0, orders.length - initialOrders.length)).reduce((sum, order) => sum + order.amount, 0)) },
        ].map((item) => <Panel key={item.label} className="p-4"><p className="text-[10px] font-medium text-muted-foreground">{item.label}</p><p className="numeric mt-2 text-xl font-semibold tracking-[-0.04em]">{item.value}</p></Panel>)}
      </section>
      <Panel>
        <div className="flex flex-col gap-4 px-4 pt-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter orders by status">
              {orderFilters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-[10px] font-semibold transition-colors ${filter === item ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{item}{item === 'All' ? ` ${orders.length}` : ` ${orders.filter((order) => order.status === item).length}`}</button>)}
            </div>
            <SearchField value={query} onChange={setQuery} placeholder="Search orders" className="w-full sm:max-w-[230px]" />
          </div>
          {visibleOrders.length === 0 ? <div className="px-4 pb-5"><EmptyState title="No matching orders" description="Try a different search or choose another status." action={<Button size="sm" onClick={() => { setQuery(''); setFilter('All') }}>Clear filters</Button>} /></div> : (
            <TableScroller>
              <table className="w-full min-w-[830px] text-left">
                <thead><tr className="border-y border-border text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Order</th><th className="px-3 py-3">Guest</th><th className="px-3 py-3">Type / table</th><th className="px-3 py-3">Items</th><th className="px-3 py-3">Payment</th><th className="px-3 py-3">Amount</th><th className="px-5 py-3">Status</th></tr></thead>
                <tbody>{visibleOrders.map((order) => <tr key={order.id} className="border-b border-border/70 last:border-0 hover:bg-[#fbfcfb]">
                  <td className="px-5 py-3.5"><button type="button" onClick={() => setSelectedOrder(order)} className="text-left"><span className="block text-[11px] font-semibold text-primary">{order.id}</span><span className="mt-1 block text-[9px] text-muted-foreground">{order.time}</span></button></td>
                  <td className="px-3 py-3.5"><span className="block text-[11px] font-medium">{order.customer}</span><span className="mt-1 block text-[9px] text-muted-foreground">{order.type === 'Dine in' ? order.table : 'Guest order'}</span></td>
                  <td className="px-3 py-3.5"><span className="text-[10px]">{order.type}</span><span className="mt-1 block text-[9px] text-muted-foreground">{order.table !== '—' ? order.table : 'No table'}</span></td>
                  <td className="max-w-[180px] px-3 py-3.5"><span className="block truncate text-[10px]">{order.items}</span><span className="mt-1 block text-[9px] text-muted-foreground">{order.lines?.reduce((sum, line) => sum + line.quantity, 0) ?? 1} items</span></td>
                  <td className="px-3 py-3.5"><StatusBadge status={order.paymentStatus} /></td>
                  <td className="numeric px-3 py-3.5 text-[10px] font-semibold">{formatNpr(order.amount)}</td>
                  <td className="px-5 py-3.5"><button type="button" aria-label={`View ${order.id} details`} onClick={() => setSelectedOrder(order)}><StatusBadge status={order.status} /></button></td>
                </tr>)}</tbody>
              </table>
            </TableScroller>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span>Showing {visibleOrders.length} of {orders.length} orders</span><span>Updated just now</span></div>
      </Panel>

      {selectedOrder && <Modal title={`Order ${selectedOrder.id}`} description={`${selectedOrder.time} · ${selectedOrder.type} · ${selectedOrder.table}`} onClose={() => setSelectedOrder(null)}>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3"><div className="rounded-lg bg-[#f7f8f6] p-3"><p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">Guest</p><p className="mt-1 text-xs font-semibold">{selectedOrder.customer}</p></div><div className="rounded-lg bg-[#f7f8f6] p-3"><p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">Order total</p><p className="numeric mt-1 text-xs font-semibold">{formatNpr(selectedOrder.amount)}</p></div></div>
          <div><p className="mb-2 text-xs font-semibold">Order items</p><div className="flex flex-col gap-2">{(selectedOrder.lines ?? [{ name: selectedOrder.items, quantity: 1, price: selectedOrder.amount }]).map((line, index) => <div key={`${line.name}-${index}`} className="flex justify-between gap-4 text-xs"><span className="text-muted-foreground">{line.quantity} × {line.name}</span><span className="numeric font-medium">{formatNpr(line.price * line.quantity)}</span></div>)}</div></div>
          {selectedOrder.specialInstructions && <p className="rounded-lg border border-[#f1d7b7] bg-accent p-3 text-xs leading-5 text-accent-foreground">Note: {selectedOrder.specialInstructions}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><div className="flex flex-wrap gap-2"><StatusBadge status={selectedOrder.status} /><StatusBadge status={selectedOrder.paymentStatus} /></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => { updateOrderPayment(selectedOrder.id, selectedOrder.paymentStatus === 'Paid' ? 'Refunded' : 'Paid'); setSelectedOrder({ ...selectedOrder, paymentStatus: selectedOrder.paymentStatus === 'Paid' ? 'Refunded' : 'Paid' }); showToast(selectedOrder.paymentStatus === 'Paid' ? 'Payment marked as refunded in this demo.' : 'Payment marked as paid.') }}>{selectedOrder.paymentStatus === 'Paid' ? 'Refund' : 'Mark paid'}</Button><Button type="button" size="sm" onClick={() => { const nextStatus: OrderStatus = selectedOrder.status === 'New' ? 'Preparing' : selectedOrder.status === 'Preparing' ? 'Ready' : selectedOrder.status === 'Ready' ? 'Completed' : selectedOrder.status; updateOrderStatus(selectedOrder.id, nextStatus); setSelectedOrder({ ...selectedOrder, status: nextStatus }); showToast(`Order moved to ${nextStatus.toLowerCase()}.`) }}>{selectedOrder.status === 'New' ? 'Start prep' : selectedOrder.status === 'Preparing' ? 'Mark ready' : selectedOrder.status === 'Ready' ? 'Complete order' : 'Done'}</Button></div></div>
        </div>
      </Modal>}
    </div>
  )
}

type CartLine = { productId: string; quantity: number }

export function PosView() {
  const { menuItems, tables, addOrder, updateTable, showToast } = useDemoStore()
  const [activeCategory, setActiveCategory] = useState('All items')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [orderType, setOrderType] = useState<OrderType>('Dine in')
  const [table, setTable] = useState('T-02')
  const [customer, setCustomer] = useState('Walk-in guest')
  const [discount, setDiscount] = useState(0)
  const [heldOrders, setHeldOrders] = useState(0)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [splitPayment, setSplitPayment] = useState(false)
  const [splitMethod, setSplitMethod] = useState('eSewa')
  const [splitAmount, setSplitAmount] = useState('0')
  const [paymentError, setPaymentError] = useState('')

  const availableProducts = menuItems.filter((item) => item.available && (activeCategory === 'All items' || item.category === activeCategory) && `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase()))
  const selectedProducts = cart.map((line) => ({ ...line, product: menuItems.find((item) => item.id === line.productId) })).filter((line): line is CartLine & { product: NonNullable<typeof line.product> } => Boolean(line.product))
  const subtotal = selectedProducts.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const discountAmount = subtotal * Math.min(100, Math.max(0, discount)) / 100
  const taxableTotal = Math.max(0, subtotal - discountAmount)
  const tax = taxableTotal * 0.13
  const total = taxableTotal + tax
  const availableTables = tables.filter((entry) => entry.status === 'Available' || entry.label === table)

  function addToCart(productId: string) {
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId)
      if (existing) return current.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line)
      return [...current, { productId, quantity: 1 }]
    })
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((current) => current.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0))
  }

  function createTicket(paid: boolean) {
    if (!selectedProducts.length) return
    const newOrder = addOrder({
      time: new Intl.DateTimeFormat('en-NP', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
      type: orderType,
      table: orderType === 'Dine in' ? table : '—',
      customer: customer.trim() || 'Walk-in guest',
      items: selectedProducts.map((line) => `${line.product.name}${line.quantity > 1 ? ` × ${line.quantity}` : ''}`).join(', '),
      amount: Math.round(total),
      paymentStatus: paid ? 'Paid' : 'Pending',
      status: 'New',
      lines: selectedProducts.map((line) => ({ name: line.product.name, quantity: line.quantity, price: line.product.price })),
    })
    if (orderType === 'Dine in') updateTable(tables.find((entry) => entry.label === table)?.id ?? '', { status: 'Occupied', guest: customer.trim() || 'Walk-in guest', since: newOrder.time, amount: Math.round(total) })
    setCart([])
    setDiscount(0)
    setCheckoutOpen(false)
    setPaymentError('')
    showToast(`${newOrder.id} sent to the kitchen.`)
  }

  function holdOrder() {
    if (!selectedProducts.length) return
    setHeldOrders((current) => current + 1)
    setCart([])
    setDiscount(0)
    showToast('Order held. It can be reopened from the held orders list.')
  }

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (splitPayment) {
      const first = Number(splitAmount)
      if (!Number.isFinite(first) || first <= 0 || first >= total) {
        setPaymentError('Enter an amount between Rs. 0 and the order total.')
        return
      }
    }
    createTicket(true)
  }

  return (
    <div>
      <PageHeader eyebrow="Service" title="Point of sale" description="Build an order and send it straight to the kitchen." action={<div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => window.print()}><Printer data-icon="inline-start" />Print</Button><span className="rounded-lg bg-secondary px-3 py-2 text-[10px] font-semibold text-primary">{heldOrders} held</span></div>} />
      <div className="grid items-start gap-4 xl:grid-cols-[1.35fr_0.8fr]">
        <section aria-label="Menu items for order">
          <Panel>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-sm font-semibold">Menu</h2><p className="mt-1 text-[10px] text-muted-foreground">Tap an item to add it to the order.</p></div>
              <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3 sm:w-[220px]"><Search className="size-3.5 text-muted-foreground" /><span className="sr-only">Search menu</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /></label>
            </div>
            <div className="subtle-scrollbar flex gap-2 overflow-x-auto border-y border-border px-4 py-3" role="tablist" aria-label="Menu categories">{menuCategories.map((category) => <button type="button" role="tab" aria-selected={activeCategory === category} key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-colors ${activeCategory === category ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{category}</button>)}</div>
            {availableProducts.length === 0 ? <div className="p-4"><EmptyState title="No menu items here" description="Try another category or search for a different dish." action={<Button size="sm" variant="outline" onClick={() => { setActiveCategory('All items'); setSearch('') }}>Reset filters</Button>} /></div> : <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {availableProducts.map((product) => <button type="button" key={product.id} onClick={() => addToCart(product.id)} className="group overflow-hidden rounded-xl border border-border bg-white text-left transition-colors hover:border-primary/35 hover:bg-[#fbfcfb]">
                <div className="relative aspect-[1.45] overflow-hidden bg-[#f0f3f1]"><img src={product.image} alt={product.name} loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /><span className="absolute right-2 top-2 grid size-7 place-items-center rounded-lg bg-white/95 text-primary shadow-sm"><Plus className="size-4" /></span></div>
                <span className="block p-3"><span className="block min-h-9 text-[11px] font-semibold leading-4">{product.name}</span><span className="mt-1 block text-[9px] text-muted-foreground">{product.preparationTime} min prep</span><span className="numeric mt-2 block text-xs font-semibold text-primary">{formatNpr(product.price)}</span></span>
              </button>)}
            </div>}
          </Panel>
        </section>

        <aside className="xl:sticky xl:top-[88px]">
          <Panel>
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4"><div><h2 className="text-sm font-semibold">Current order</h2><p className="mt-1 text-[10px] text-muted-foreground">Ticket {String(orders.length + 2484).padStart(4, '0')}</p></div><button type="button" aria-label="Clear order" disabled={!cart.length} onClick={() => { setCart([]); setDiscount(0) }} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40"><Trash2 className="size-4" /></button></div>
            <div className="grid grid-cols-2 gap-2 p-4 pb-2">
              <SelectField label="Order type" value={orderType} onChange={(value) => setOrderType(value as OrderType)} options={orderTypes} />
              {orderType === 'Dine in' ? <SelectField label="Table" value={table} onChange={setTable} options={availableTables.map((entry) => entry.label)} /> : <label className="flex h-10 items-center rounded-lg border border-border bg-white px-3"><span className="sr-only">Guest name</span><input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Guest name" className="min-w-0 flex-1 bg-transparent text-[11px] outline-none" /></label>}
            </div>
            {orderType === 'Dine in' && <label className="mx-4 mb-2 flex h-10 items-center rounded-lg border border-border bg-white px-3"><span className="sr-only">Guest name</span><input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Guest name (optional)" className="min-w-0 flex-1 bg-transparent text-[11px] outline-none" /></label>}
            <div className="max-h-[280px] min-h-[135px] overflow-y-auto border-y border-border px-4">
              {selectedProducts.length === 0 ? <div className="flex min-h-[135px] flex-col items-center justify-center text-center"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><ShoppingBag className="size-5" /></span><p className="mt-3 text-xs font-semibold">Your order is empty</p><p className="mt-1 text-[10px] text-muted-foreground">Choose an item from the menu to get started.</p></div> : <div className="flex flex-col">{selectedProducts.map(({ product, quantity }) => <div key={product.id} className="flex items-center gap-2 border-b border-border/70 py-3 last:border-0"><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold">{product.name}</p><p className="numeric mt-1 text-[9px] text-muted-foreground">{formatNpr(product.price)} each</p></div><div className="flex items-center gap-1"><button type="button" aria-label={`Remove one ${product.name}`} onClick={() => updateQuantity(product.id, -1)} className="grid size-7 place-items-center rounded-md border border-border hover:bg-muted"><Minus className="size-3" /></button><span className="numeric w-5 text-center text-[10px] font-semibold">{quantity}</span><button type="button" aria-label={`Add one ${product.name}`} onClick={() => updateQuantity(product.id, 1)} className="grid size-7 place-items-center rounded-md border border-border hover:bg-muted"><Plus className="size-3" /></button></div><span className="numeric w-[68px] text-right text-[10px] font-semibold">{formatNpr(product.price * quantity)}</span></div>)}</div>}
            </div>
            <div className="flex flex-col gap-2 px-4 py-4 text-[10px]">
              <div className="flex items-center justify-between text-muted-foreground"><span>Subtotal</span><span className="numeric">{formatNpr(subtotal)}</span></div>
              <div className="flex items-center justify-between gap-3 text-muted-foreground"><label htmlFor="discount" className="flex items-center gap-2">Discount <input id="discount" type="number" min="0" max="100" value={discount} onChange={(event) => setDiscount(Math.min(100, Math.max(0, Number(event.target.value))))} className="h-7 w-14 rounded-md border border-border px-2 text-center text-[10px] text-foreground outline-none focus:border-primary/40" />%</label><span className="numeric">− {formatNpr(discountAmount)}</span></div>
              <div className="flex items-center justify-between text-muted-foreground"><span>VAT <span className="text-[9px]">13%</span></span><span className="numeric">{formatNpr(tax)}</span></div>
              <div className="mt-1 flex items-center justify-between border-t border-border pt-3 text-xs font-semibold"><span>Total</span><span className="numeric text-sm">{formatNpr(total)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 pb-4"><Button type="button" variant="outline" disabled={!cart.length} onClick={holdOrder}>Hold order</Button><Button type="button" variant="secondary" disabled={!cart.length} onClick={() => createTicket(false)}><ChefHat data-icon="inline-start" />Send to kitchen</Button><Button type="button" className="col-span-2" disabled={!cart.length} onClick={() => setCheckoutOpen(true)}><CreditCard data-icon="inline-start" />Charge {formatNpr(total)}</Button></div>
          </Panel>
          <p className="mt-2 text-center text-[9px] leading-4 text-muted-foreground">Demo checkout only — no real payment will be collected.</p>
        </aside>
      </div>
      {checkoutOpen && <Modal title="Take payment" description={`Collect ${formatNpr(total)} for this order.`} onClose={() => setCheckoutOpen(false)} size="sm">
        <form onSubmit={submitPayment} className="flex flex-col gap-5">
          <fieldset><legend className="mb-2 text-xs font-semibold">Payment method</legend><div className="grid grid-cols-2 gap-2">{paymentMethods.slice(0, 4).map((method) => <button type="button" key={method} onClick={() => setPaymentMethod(method)} className={`h-10 rounded-lg border text-xs font-semibold transition-colors ${paymentMethod === method ? 'border-primary bg-[#f2f7f5] text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>{method}</button>)}</div></fieldset>
          <label className="flex items-center gap-2 text-xs font-medium"><input type="checkbox" checked={splitPayment} onChange={(event) => { setSplitPayment(event.target.checked); setSplitAmount(String(Math.round(total / 2))); setPaymentError('') }} className="size-4 accent-primary" />Split across two payment methods</label>
          {splitPayment && <div className="grid grid-cols-2 gap-3"><FormField label={`${paymentMethod} amount`}><input type="number" min="1" max={total - 1} value={splitAmount} onChange={(event) => setSplitAmount(event.target.value)} className={controlClassName} /></FormField><FormField label="Second method"><select value={splitMethod} onChange={(event) => setSplitMethod(event.target.value)} className={controlClassName}>{paymentMethods.filter((method) => method !== paymentMethod).map((method) => <option key={method}>{method}</option>)}</select></FormField><p className="col-span-2 text-[10px] text-muted-foreground">Remaining: {formatNpr(Math.max(0, total - Number(splitAmount || 0)))} by {splitMethod}</p></div>}
          {paymentError && <p role="alert" className="rounded-lg bg-[#fceceb] px-3 py-2 text-[11px] text-destructive">{paymentError}</p>}
          <div className="rounded-lg bg-[#f7f8f6] p-3"><div className="flex justify-between text-xs"><span className="text-muted-foreground">Amount due</span><span className="numeric font-semibold">{formatNpr(total)}</span></div><p className="mt-2 text-[10px] text-muted-foreground">This demo marks the order as paid locally. It will not contact a payment provider.</p></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button><Button type="submit"><Check data-icon="inline-start" />Confirm payment</Button></div>
        </form>
      </Modal>}
    </div>
  )
}

function nextKitchenStatus(status: OrderStatus): OrderStatus {
  if (status === 'New') return 'Preparing'
  if (status === 'Preparing') return 'Ready'
  if (status === 'Ready') return 'Completed'
  return status
}

const kitchenColumns: Array<{ status: OrderStatus; title: string; description: string }> = [
  { status: 'New', title: 'New tickets', description: 'Ready to start' },
  { status: 'Preparing', title: 'In preparation', description: 'Cooking now' },
  { status: 'Ready', title: 'Ready to serve', description: 'Call the runner' },
  { status: 'Completed', title: 'Completed', description: 'Recently handed off' },
]

export function KitchenView() {
  const { orders, updateOrderStatus, showToast } = useDemoStore()
  const [showCompleted, setShowCompleted] = useState(true)
  const activeOrders = orders.filter((order) => order.status !== 'Cancelled')

  return (
    <div>
      <PageHeader eyebrow="Service" title="Kitchen display" description="A clear queue for every ticket, from new to ready." action={<Button variant="outline" size="sm" onClick={() => setShowCompleted((current) => !current)}>{showCompleted ? 'Hide completed' : 'Show completed'}</Button>} />
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'New', count: activeOrders.filter((order) => order.status === 'New').length },
          { label: 'Preparing', count: activeOrders.filter((order) => order.status === 'Preparing').length },
          { label: 'Ready', count: activeOrders.filter((order) => order.status === 'Ready').length },
        ].map((item) => <Panel key={item.label} className="p-3 sm:p-4"><p className="text-[10px] text-muted-foreground">{item.label}</p><p className="mt-1 text-xl font-semibold">{item.count}</p></Panel>)}
      </div>
      <div className="subtle-scrollbar grid gap-3 overflow-x-auto pb-2 md:grid-cols-2 2xl:grid-cols-4">
        {kitchenColumns.filter((column) => showCompleted || column.status !== 'Completed').map((column) => {
          const columnOrders = activeOrders.filter((order) => order.status === column.status).slice(0, column.status === 'Completed' ? 4 : undefined)
          return <section key={column.status} aria-label={column.title} className="min-w-[250px] rounded-xl border border-border bg-[#edf1ef] p-3">
            <div className="flex items-center justify-between gap-2 px-1 pb-3"><div><h2 className="text-xs font-semibold">{column.title}</h2><p className="mt-1 text-[9px] text-muted-foreground">{column.description}</p></div><span className="grid size-6 place-items-center rounded-md bg-white text-[10px] font-semibold text-primary">{columnOrders.length}</span></div>
            <div className="flex min-h-40 flex-col gap-2">{columnOrders.length === 0 ? <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-border bg-white/60 text-[10px] text-muted-foreground">Nothing in this column</div> : columnOrders.map((order) => <article key={order.id} className="rounded-xl border border-border bg-white p-3 shadow-[0_1px_2px_rgba(10,25,20,0.03)]">
              <div className="flex items-start justify-between gap-2"><div><p className="text-[11px] font-semibold text-primary">{order.id}</p><p className="mt-1 text-[9px] text-muted-foreground">{order.time} <span className="px-1">·</span> {order.type}{order.table !== '—' ? ` · ${order.table}` : ''}</p></div><StatusBadge status={order.status} /></div>
              <div className="my-3 border-y border-border/70 py-2.5">{(order.lines ?? [{ name: order.items, quantity: 1, price: order.amount }]).map((line, index) => <p key={`${line.name}-${index}`} className="py-0.5 text-[10px]"><span className="mr-2 font-semibold text-primary">{line.quantity}×</span>{line.name}</p>)}</div>
              {order.specialInstructions && <p className="mb-3 rounded-md bg-accent px-2 py-1.5 text-[9px] leading-4 text-accent-foreground">{order.specialInstructions}</p>}
              <div className="flex items-center justify-between gap-2"><p className="truncate text-[9px] text-muted-foreground">{order.customer}</p>{column.status !== 'Completed' && <Button type="button" size="xs" onClick={() => { const status = nextKitchenStatus(order.status); updateOrderStatus(order.id, status); showToast(`${order.id} moved to ${status.toLowerCase()}.`) }}>{order.status === 'New' ? 'Start' : order.status === 'Preparing' ? 'Mark ready' : 'Complete'}<ArrowRight data-icon="inline-end" /></Button>}</div>
            </article>)}</div>
          </section>
        })}
      </div>
    </div>
  )
}

const tableStatuses: DemoTable['status'][] = ['Available', 'Occupied', 'Reserved', 'Cleaning']

export function TablesView() {
  const { tables, addTable, updateTable, showToast } = useDemoStore()
  const [section, setSection] = useState('All sections')
  const [selectedTable, setSelectedTable] = useState<DemoTable | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newSection, setNewSection] = useState('Main room')
  const [newCapacity, setNewCapacity] = useState('4')
  const sections = ['All sections', ...Array.from(new Set(tables.map((table) => table.section)))]
  const visibleTables = tables.filter((table) => section === 'All sections' || table.section === section)
  const statusColors: Record<DemoTable['status'], string> = {
    Available: 'border-[#d6e3da] bg-[#f1f7f2] hover:bg-[#eaf3ec]',
    Occupied: 'border-primary/25 bg-[#eaf1ef] hover:bg-[#dfeae6]',
    Reserved: 'border-[#efd6b7] bg-[#fff6eb] hover:bg-[#fff0dc]',
    Cleaning: 'border-border bg-[#f2f4f3] hover:bg-[#edf0ef]',
  }

  function saveTable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newLabel.trim()) return
    addTable({ label: newLabel.trim(), section: newSection, capacity: Number(newCapacity) || 2, status: 'Available', guest: '', since: '', amount: 0 })
    setNewLabel('')
    setAddOpen(false)
    showToast('Table added to your floor.')
  }

  return (
    <div>
      <PageHeader eyebrow="Service" title="Table management" description="A live view of your dining room, patio, and reservations." action={<Button onClick={() => setAddOpen(true)}><Plus data-icon="inline-start" />Add table</Button>} />
      <section aria-label="Table status totals" className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{tableStatuses.map((status) => <Panel key={status} className="flex items-center justify-between p-4"><div><p className="text-[10px] text-muted-foreground">{status}</p><p className="mt-1 text-xl font-semibold">{tables.filter((table) => table.status === status).length}</p></div><span className={`size-2.5 rounded-full ${status === 'Available' ? 'bg-success' : status === 'Occupied' ? 'bg-primary' : status === 'Reserved' ? 'bg-brand-orange' : 'bg-muted-foreground'}`} /></Panel>)}</section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter tables by section">{sections.map((item) => <button key={item} type="button" role="tab" aria-selected={section === item} onClick={() => setSection(item)} className={`rounded-lg px-3 py-2 text-[10px] font-semibold ${section === item ? 'bg-primary text-white' : 'border border-border bg-white text-muted-foreground hover:text-foreground'}`}>{item}</button>)}</div><p className="text-[10px] text-muted-foreground">{tables.length} tables <span className="px-1">·</span> {tables.reduce((sum, table) => sum + table.capacity, 0)} seats</p></div>
      <Panel className="p-4 sm:p-5"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{visibleTables.map((table) => <button type="button" key={table.id} onClick={() => setSelectedTable(table)} className={`min-h-[155px] rounded-xl border p-4 text-left transition-colors ${statusColors[table.status]}`}><div className="flex items-center justify-between"><span className="text-sm font-semibold">{table.label}</span><span className="grid size-7 place-items-center rounded-lg bg-white/80 text-primary"><Utensils className="size-4" /></span></div><p className="mt-1 text-[9px] text-muted-foreground">{table.section} <span className="px-1">·</span> {table.capacity} seats</p><div className="mt-5"><StatusBadge status={table.status} />{table.guest && <p className="mt-2 truncate text-[10px] font-medium">{table.guest}</p>}{table.since && <p className="mt-1 text-[9px] text-muted-foreground">Since {table.since}</p>}</div></button>)}</div></Panel>
      <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-muted-foreground">{tableStatuses.map((status) => <span key={status} className="inline-flex items-center gap-2"><span className={`size-2 rounded-full ${status === 'Available' ? 'bg-success' : status === 'Occupied' ? 'bg-primary' : status === 'Reserved' ? 'bg-brand-orange' : 'bg-muted-foreground'}`} />{status}</span>)}</div>

      {selectedTable && <Modal title={selectedTable.label} description={`${selectedTable.section} · ${selectedTable.capacity} seats`} onClose={() => setSelectedTable(null)} size="sm">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-[#f7f8f6] p-4"><p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">Current status</p><div className="mt-2 flex items-center justify-between"><StatusBadge status={selectedTable.status} />{selectedTable.guest && <span className="text-xs font-medium">{selectedTable.guest}</span>}</div>{selectedTable.amount > 0 && <p className="numeric mt-3 text-sm font-semibold">Current check · {formatNpr(selectedTable.amount)}</p>}</div>
          <div><p className="mb-2 text-xs font-semibold">Update table status</p><div className="grid grid-cols-2 gap-2">{tableStatuses.map((status) => <Button key={status} type="button" variant={selectedTable.status === status ? 'default' : 'outline'} size="sm" onClick={() => { updateTable(selectedTable.id, { status, guest: status === 'Available' || status === 'Cleaning' ? '' : selectedTable.guest }); setSelectedTable({ ...selectedTable, status, guest: status === 'Available' || status === 'Cleaning' ? '' : selectedTable.guest }); showToast(`${selectedTable.label} marked ${status.toLowerCase()}.`) }}>{status}</Button>)}</div></div>
          <Button type="button" className="w-full" onClick={() => { setSelectedTable(null); window.location.href = '/app/pos' }}>Start order at this table<ArrowRight data-icon="inline-end" /></Button>
        </div>
      </Modal>}

      {addOpen && <Modal title="Add a table" description="Add a place to your floor plan." onClose={() => setAddOpen(false)} size="sm"><form onSubmit={saveTable} className="flex flex-col gap-4"><FormField label="Table name"><input autoFocus required value={newLabel} onChange={(event) => setNewLabel(event.target.value)} placeholder="T-13" className={controlClassName} /></FormField><FormField label="Section"><select value={newSection} onChange={(event) => setNewSection(event.target.value)} className={controlClassName}>{['Main room', 'Window', 'Patio', 'Private dining'].map((item) => <option key={item}>{item}</option>)}</select></FormField><FormField label="Seats"><input type="number" min="1" max="20" value={newCapacity} onChange={(event) => setNewCapacity(event.target.value)} className={controlClassName} /></FormField><div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button type="submit">Add table</Button></div></form></Modal>}
    </div>
  )
}
