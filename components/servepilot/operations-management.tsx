'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import {
  ArrowDownToLine,
  Boxes,
  Check,
  ClipboardList,
  PackagePlus,
  Plus,
  Search,
  Truck,
  UserPlus,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from './demo-store'
import {
  formatNpr,
  type DemoCustomer,
  type DemoPurchase,
  type DemoStaff,
  type DemoSupplier,
  type InventoryItem,
} from './data'
import {
  EmptyState,
  FormField,
  LabeledField,
  MetricCard,
  Modal,
  PageHeader,
  Panel,
  PanelHeading,
  SearchField,
  StatusBadge,
  TableScroller,
  controlClassName,
} from './shared'

const stockUnits = ['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'packet']
const roleNames = ['Owner', 'Admin', 'Manager', 'Cashier', 'Waiter', 'Kitchen Staff', 'Accountant']
const permissionNames = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'] as const

type InventoryFilter = 'All stock' | 'Low stock' | 'Out of stock'
type StaffSection = 'Team' | 'Roles & permissions' | 'Attendance'
type PermissionMatrix = Record<string, Record<(typeof permissionNames)[number], boolean>>

function FilterTabs<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: readonly T[]
  value: T
  onChange: (item: T) => void
}) {
  return (
    <div aria-label={label} className="subtle-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist">
      {items.map((item) => <button
        key={item}
        type="button"
        role="tab"
        aria-selected={value === item}
        onClick={() => onChange(item)}
        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${value === item ? 'bg-primary text-primary-foreground' : 'border border-border bg-white text-muted-foreground hover:text-foreground'}`}
      >{item}</button>)}
    </div>
  )
}

function InventoryItemModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (item: Omit<InventoryItem, 'id'>) => void
}) {
  const [form, setForm] = useState({ name: '', category: 'Produce', sku: '', stock: '0', unit: 'kg', cost: '0', reorderLevel: '5' })
  const [notice, setNotice] = useState('')
  const { inventory } = useDemoStore()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inventory.some((item) => item.sku.toLowerCase() === form.sku.trim().toLowerCase())) {
      setNotice('That SKU is already in your inventory.')
      return
    }
    onSave({
      name: form.name.trim(),
      category: form.category.trim(),
      sku: form.sku.trim().toUpperCase(),
      stock: Number(form.stock),
      unit: form.unit,
      cost: Number(form.cost),
      sellingPrice: 0,
      reorderLevel: Number(form.reorderLevel),
    })
  }

  return <Modal title="Add inventory item" description="Track an ingredient or supply used by your restaurant." onClose={onClose}>
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledField htmlFor="inventory-name" label="Item name"><input autoFocus id="inventory-name" className={controlClassName} maxLength={70} onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} /></LabeledField>
        <LabeledField htmlFor="inventory-sku" label="SKU"><input id="inventory-sku" className={controlClassName} maxLength={24} onChange={(event) => setForm({ ...form, sku: event.target.value })} required value={form.sku} /></LabeledField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledField htmlFor="inventory-category" label="Category"><input id="inventory-category" className={controlClassName} maxLength={40} onChange={(event) => setForm({ ...form, category: event.target.value })} required value={form.category} /></LabeledField>
        <LabeledField htmlFor="inventory-unit" label="Unit"><select id="inventory-unit" className={controlClassName} onChange={(event) => setForm({ ...form, unit: event.target.value })} value={form.unit}>{stockUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></LabeledField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <LabeledField htmlFor="inventory-stock" label="Opening stock"><input id="inventory-stock" className={controlClassName} min="0" onChange={(event) => setForm({ ...form, stock: event.target.value })} required step="0.01" type="number" value={form.stock} /></LabeledField>
        <LabeledField htmlFor="inventory-cost" label="Cost per unit (Rs.)"><input id="inventory-cost" className={controlClassName} min="0" onChange={(event) => setForm({ ...form, cost: event.target.value })} required step="0.01" type="number" value={form.cost} /></LabeledField>
        <LabeledField htmlFor="inventory-reorder" label="Reorder at"><input id="inventory-reorder" className={controlClassName} min="0" onChange={(event) => setForm({ ...form, reorderLevel: event.target.value })} required step="0.01" type="number" value={form.reorderLevel} /></LabeledField>
      </div>
      {notice && <p className="text-xs text-destructive" role="alert">{notice}</p>}
      <div className="flex justify-end gap-2 border-t border-border pt-4"><Button onClick={onClose} type="button" variant="outline">Cancel</Button><Button data-icon="inline-start" type="submit"><Check /> Add item</Button></div>
    </form>
  </Modal>
}

export function InventoryView({ initialFilter = 'All stock' }: { initialFilter?: InventoryFilter }) {
  const { inventory, addInventoryItem, adjustInventory, showToast } = useDemoStore()
  const [filter, setFilter] = useState<InventoryFilter>(initialFilter)
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [adjustItemId, setAdjustItemId] = useState<string | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<'Stock in' | 'Wastage'>('Stock in')
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('1')
  const [adjustmentNote, setAdjustmentNote] = useState('')
  const [adjustmentError, setAdjustmentError] = useState('')
  const selectedItem = inventory.find((item) => item.id === adjustItemId)
  const lowStock = inventory.filter((item) => item.stock <= item.reorderLevel)
  const stockValue = inventory.reduce((total, item) => total + item.stock * item.cost, 0)
  const visibleItems = useMemo(() => inventory.filter((item) => {
    const matchesQuery = `${item.name} ${item.category} ${item.sku}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All stock' || (filter === 'Out of stock' ? item.stock <= 0 : item.stock > 0 && item.stock <= item.reorderLevel)
    return matchesQuery && matchesFilter
  }), [inventory, filter, query])

  function saveAdjustment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedItem) return
    const quantity = Number(adjustmentQuantity)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setAdjustmentError('Enter a quantity greater than zero.')
      return
    }
    if (adjustmentType === 'Wastage' && quantity > selectedItem.stock) {
      setAdjustmentError('Wastage cannot exceed the current stock.')
      return
    }
    adjustInventory(selectedItem.id, adjustmentType === 'Stock in' ? quantity : -quantity)
    showToast(`${formatQuantity(quantity)} ${selectedItem.unit} ${adjustmentType === 'Stock in' ? 'added to' : 'recorded as wastage from'} ${selectedItem.name}.`)
    setAdjustItemId(null)
    setAdjustmentQuantity('1')
    setAdjustmentNote('')
    setAdjustmentError('')
  }

  return <div>
    <PageHeader eyebrow="Stock control" title="Inventory" description="Know what is on hand, what needs reordering, and what your ingredients are worth." action={<Button data-icon="inline-start" onClick={() => setAddOpen(true)}><Plus /> Add item</Button>} />
    <section aria-label="Inventory summary" className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetricCard label="Tracked items" value={String(inventory.length)} icon={<Boxes />} tone="teal" />
      <MetricCard label="Stock value" value={formatNpr(stockValue)} icon={<PackagePlus />} tone="blue" />
      <MetricCard label="Low stock" value={String(lowStock.length)} caption="at or below reorder level" icon={<Search />} tone="orange" />
      <MetricCard label="Out of stock" value={String(inventory.filter((item) => item.stock <= 0).length)} caption="needs attention" icon={<ClipboardList />} tone="green" />
    </section>
    <Panel>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <FilterTabs label="Filter inventory" items={['All stock', 'Low stock', 'Out of stock'] as const} value={filter} onChange={setFilter} />
        <SearchField className="w-full sm:max-w-[260px]" onChange={setQuery} placeholder="Search inventory" value={query} />
      </div>
      {visibleItems.length ? <TableScroller><table className="w-full min-w-[850px] text-left">
        <thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Ingredient</th><th className="px-3 py-3">SKU</th><th className="px-3 py-3">On hand</th><th className="px-3 py-3">Cost / unit</th><th className="px-3 py-3">Reorder at</th><th className="px-3 py-3">Stock value</th><th className="px-3 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
        <tbody>{visibleItems.map((item) => <tr key={item.id} className="border-b border-border/70 last:border-0 hover:bg-[#fbfcfb]"><td className="px-5 py-3"><p className="text-xs font-semibold">{item.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.category}</p></td><td className="px-3 py-3 font-mono text-[10px] text-muted-foreground">{item.sku}</td><td className="numeric px-3 py-3 text-xs font-semibold">{formatQuantity(item.stock)} {item.unit}</td><td className="numeric px-3 py-3 text-xs">{formatNpr(item.cost)}</td><td className="numeric px-3 py-3 text-xs text-muted-foreground">{formatQuantity(item.reorderLevel)} {item.unit}</td><td className="numeric px-3 py-3 text-xs font-medium">{formatNpr(item.stock * item.cost)}</td><td className="px-3 py-3"><StatusBadge status={item.stock <= 0 ? 'Out of stock' : item.stock <= item.reorderLevel ? 'Low stock' : 'In stock'} /></td><td className="px-5 py-3 text-right"><Button onClick={() => { setAdjustItemId(item.id); setAdjustmentError('') }} size="sm" variant="outline">Adjust</Button></td></tr>)}</tbody>
      </table></TableScroller> : <div className="p-5"><EmptyState title="No stock items match" description="Try another search or stock filter." action={<Button onClick={() => { setQuery(''); setFilter('All stock') }} size="sm" variant="outline">Clear filters</Button>} /></div>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span>{visibleItems.length} of {inventory.length} inventory items</span><span>Stock movements update this demo immediately.</span></div>
    </Panel>
    <div className="mt-4 flex flex-wrap gap-2"><Button data-icon="inline-start" onClick={() => setAddOpen(true)} size="sm"><Plus /> Add inventory item</Button><Link className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-xs font-medium text-foreground hover:bg-muted" href="/app/purchases"><Truck className="size-3.5" /> Create purchase order</Link><Button onClick={() => window.print()} size="sm" variant="outline"><ArrowDownToLine data-icon="inline-start" /> Export / print</Button></div>
    {addOpen && <InventoryItemModal onClose={() => setAddOpen(false)} onSave={(item) => { addInventoryItem(item); showToast(`${item.name} added to inventory.`); setAddOpen(false) }} />}
    {selectedItem && <Modal title={`Adjust ${selectedItem.name}`} description={`Current stock: ${formatQuantity(selectedItem.stock)} ${selectedItem.unit} · Reorder at ${formatQuantity(selectedItem.reorderLevel)} ${selectedItem.unit}`} onClose={() => setAdjustItemId(null)} size="sm"><form className="flex flex-col gap-4" onSubmit={saveAdjustment}>
      <FormField label="Movement"><select className={controlClassName} onChange={(event) => { setAdjustmentType(event.target.value as 'Stock in' | 'Wastage'); setAdjustmentError('') }} value={adjustmentType}><option>Stock in</option><option>Wastage</option></select></FormField>
      <FormField label={`Quantity (${selectedItem.unit})`}><input className={controlClassName} min="0.01" onChange={(event) => setAdjustmentQuantity(event.target.value)} required step="0.01" type="number" value={adjustmentQuantity} /></FormField>
      <FormField label="Note"><input className={controlClassName} maxLength={100} onChange={(event) => setAdjustmentNote(event.target.value)} placeholder={adjustmentType === 'Wastage' ? 'Reason for wastage' : 'Supplier delivery or note'} value={adjustmentNote} /></FormField>
      {adjustmentError && <p className="text-xs text-destructive" role="alert">{adjustmentError}</p>}
      <div className="flex justify-end gap-2 border-t border-border pt-3"><Button onClick={() => setAdjustItemId(null)} type="button" variant="outline">Cancel</Button><Button type="submit">Save movement</Button></div>
    </form></Modal>}
  </div>
}

function PurchaseOrderModal({
  inventory,
  suppliers,
  onClose,
  onSave,
}: {
  inventory: InventoryItem[]
  suppliers: DemoSupplier[]
  onClose: () => void
  onSave: (purchase: Omit<DemoPurchase, 'id'>) => void
}) {
  const firstItem = inventory[0]
  const [form, setForm] = useState({ supplier: suppliers[0]?.name ?? '', itemName: firstItem?.name ?? '', quantity: '1', unitCost: String(firstItem?.cost ?? 0) })
  const amount = Number(form.quantity || 0) * Number(form.unitCost || 0)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ supplier: form.supplier, itemName: form.itemName.trim(), quantity: Number(form.quantity), unitCost: Number(form.unitCost), amount, date: 'Today', status: 'Ordered', paymentStatus: 'Pending' })
  }

  return <Modal title="New purchase order" description="Record an ingredient order. Receiving it will update your stock." onClose={onClose}>
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Supplier"><select className={controlClassName} onChange={(event) => setForm({ ...form, supplier: event.target.value })} required value={form.supplier}>{suppliers.map((supplier) => <option key={supplier.id}>{supplier.name}</option>)}</select></FormField>
        <FormField label="Inventory item"><select className={controlClassName} onChange={(event) => { const item = inventory.find((entry) => entry.name === event.target.value); setForm({ ...form, itemName: event.target.value, unitCost: String(item?.cost ?? 0) }) }} required value={form.itemName}>{inventory.map((item) => <option key={item.id}>{item.name}</option>)}</select></FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Quantity"><input className={controlClassName} min="0.01" onChange={(event) => setForm({ ...form, quantity: event.target.value })} required step="0.01" type="number" value={form.quantity} /></FormField>
        <FormField label="Unit cost (Rs.)"><input className={controlClassName} min="0" onChange={(event) => setForm({ ...form, unitCost: event.target.value })} required step="0.01" type="number" value={form.unitCost} /></FormField>
        <div className="rounded-lg bg-[#f7f8f6] px-3 py-2"><p className="text-[10px] text-muted-foreground">Order total</p><p className="numeric mt-1 text-sm font-semibold">{formatNpr(amount)}</p></div>
      </div>
      <p className="rounded-lg bg-[#f7f8f6] p-3 text-[10px] leading-5 text-muted-foreground">VAT and payment settlement can be reconciled when the bill is received.</p>
      <div className="flex justify-end gap-2 border-t border-border pt-4"><Button onClick={onClose} type="button" variant="outline">Cancel</Button><Button type="submit">Create purchase order</Button></div>
    </form>
  </Modal>
}

export function PurchasesView({ initialTab = 'Purchase orders' }: { initialTab?: 'Purchase orders' | 'Purchase history' }) {
  const { purchases, inventory, suppliers, addPurchase, updatePurchase, receivePurchase, showToast } = useDemoStore()
  const [tab, setTab] = useState(initialTab)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const filteredPurchases = purchases.filter((purchase) => `${purchase.id} ${purchase.supplier} ${purchase.itemName} ${purchase.status}`.toLowerCase().includes(query.toLowerCase()))
  const openOrders = purchases.filter((purchase) => !['Received', 'Cancelled'].includes(purchase.status)).length
  const pendingAmount = purchases.filter((purchase) => purchase.paymentStatus !== 'Paid').reduce((sum, purchase) => sum + purchase.amount, 0)

  return <div>
    <PageHeader eyebrow="Supply chain" title="Purchasing" description="Keep supplier orders, incoming stock, and outstanding bills in one place." action={<Button data-icon="inline-start" onClick={() => setIsOpen(true)}><Plus /> New purchase order</Button>} />
    <section aria-label="Purchasing summary" className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><MetricCard label="Open orders" value={String(openOrders)} icon={<ClipboardList />} tone="teal" /><MetricCard label="Awaiting payment" value={formatNpr(pendingAmount)} icon={<Truck />} tone="orange" /><MetricCard label="Orders tracked" value={String(purchases.length)} icon={<Boxes />} tone="blue" /></section>
    <Panel>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><FilterTabs label="Purchase order views" items={['Purchase orders', 'Purchase history'] as const} value={tab} onChange={setTab} /><SearchField className="w-full sm:max-w-[260px]" onChange={setQuery} placeholder="Search purchase orders" value={query} /></div>
      {filteredPurchases.length ? <TableScroller><table className="w-full min-w-[790px] text-left"><thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Purchase order</th><th className="px-3 py-3">Supplier</th><th className="px-3 py-3">Item</th><th className="px-3 py-3">Quantity</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Payment</th><th className="px-3 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
        <tbody>{filteredPurchases.map((purchase) => <tr key={purchase.id} className="border-b border-border/70 last:border-0 hover:bg-[#fbfcfb]"><td className="px-5 py-3"><p className="text-xs font-semibold text-primary">{purchase.id}</p><p className="mt-1 text-[10px] text-muted-foreground">{purchase.date}</p></td><td className="px-3 py-3 text-xs">{purchase.supplier}</td><td className="px-3 py-3 text-xs">{purchase.itemName}</td><td className="numeric px-3 py-3 text-xs">{purchase.quantity}</td><td className="numeric px-3 py-3 text-xs font-semibold">{formatNpr(purchase.amount)}</td><td className="px-3 py-3"><StatusBadge status={purchase.paymentStatus} /></td><td className="px-3 py-3"><StatusBadge status={purchase.status} /></td><td className="px-5 py-3 text-right">{purchase.status === 'Received' ? <span className="text-[10px] text-muted-foreground">Stock received</span> : purchase.status === 'Cancelled' ? <span className="text-[10px] text-muted-foreground">Cancelled</span> : <div className="flex justify-end gap-1"><Button onClick={() => { receivePurchase(purchase.id); showToast(`${purchase.itemName} stock updated from ${purchase.id}.`) }} size="sm">Receive</Button><Button aria-label={`Cancel ${purchase.id}`} onClick={() => { updatePurchase(purchase.id, { status: 'Cancelled' }); showToast(`${purchase.id} cancelled.`) }} size="icon-sm" variant="ghost">×</Button></div>}</td></tr>)}</tbody>
      </table></TableScroller> : <div className="p-5"><EmptyState title="No purchase orders found" description="Create an order for an ingredient or search a different supplier." action={<Button onClick={() => setIsOpen(true)} size="sm">Create purchase order</Button>} /></div>}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span>{filteredPurchases.length} purchase orders</span><span>Receiving an order adds its quantity to inventory.</span></div>
    </Panel>
    <div className="mt-4 flex flex-wrap gap-2"><Link className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-white px-3 text-xs font-medium hover:bg-muted" href="/app/suppliers"><Truck className="size-3.5" /> Manage suppliers</Link><Button onClick={() => window.print()} size="sm" variant="outline"><ArrowDownToLine data-icon="inline-start" /> Export / print</Button></div>
    {isOpen && <PurchaseOrderModal inventory={inventory} suppliers={suppliers} onClose={() => setIsOpen(false)} onSave={(purchase) => { addPurchase(purchase); setIsOpen(false); showToast('Purchase order created.') }} />}
  </div>
}

function formatQuantity(quantity: number) {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1).replace(/\.0$/, '')
}

function SupplierModal({ onClose, onSave }: { onClose: () => void; onSave: (supplier: Omit<DemoSupplier, 'id'>) => void }) {
  const [form, setForm] = useState({ name: '', contact: '', phone: '', category: '', balance: '0' })
  return <Modal title="Add supplier" description="Save a supplier to use on future purchase orders." onClose={onClose} size="sm"><form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); onSave({ ...form, name: form.name.trim(), contact: form.contact.trim(), phone: form.phone.trim(), category: form.category.trim(), balance: Number(form.balance), status: 'Active' }) }}>
    <FormField label="Supplier name"><input autoFocus className={controlClassName} maxLength={70} onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} /></FormField>
    <FormField label="Contact person"><input className={controlClassName} maxLength={70} onChange={(event) => setForm({ ...form, contact: event.target.value })} required value={form.contact} /></FormField>
    <div className="grid grid-cols-2 gap-3"><FormField label="Phone"><input className={controlClassName} onChange={(event) => setForm({ ...form, phone: event.target.value })} required type="tel" value={form.phone} /></FormField><FormField label="Category"><input className={controlClassName} onChange={(event) => setForm({ ...form, category: event.target.value })} required value={form.category} /></FormField></div>
    <FormField label="Opening balance (Rs.)"><input className={controlClassName} min="0" onChange={(event) => setForm({ ...form, balance: event.target.value })} step="1" type="number" value={form.balance} /></FormField>
    <div className="flex justify-end gap-2 border-t border-border pt-3"><Button onClick={onClose} type="button" variant="outline">Cancel</Button><Button type="submit">Save supplier</Button></div>
  </form></Modal>
}

export function SuppliersView() {
  const { suppliers, purchases, addSupplier, showToast } = useDemoStore()
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const visibleSuppliers = suppliers.filter((supplier) => `${supplier.name} ${supplier.contact} ${supplier.category} ${supplier.phone}`.toLowerCase().includes(query.toLowerCase()))
  const outstanding = suppliers.reduce((total, supplier) => total + supplier.balance, 0)

  return <div>
    <PageHeader eyebrow="Supply chain" title="Suppliers" description="Keep reliable contacts and balances close to your purchasing workflow." action={<Button data-icon="inline-start" onClick={() => setAddOpen(true)}><Plus /> Add supplier</Button>} />
    <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><MetricCard label="Active suppliers" value={String(suppliers.filter((supplier) => supplier.status === 'Active').length)} icon={<Truck />} tone="teal" /><MetricCard label="Outstanding balance" value={formatNpr(outstanding)} icon={<ClipboardList />} tone="orange" /><MetricCard label="Purchase partners" value={String(new Set(purchases.map((purchase) => purchase.supplier)).size)} icon={<Boxes />} tone="blue" /></section>
    <Panel><div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><h2 className="text-sm font-semibold">Supplier directory</h2><p className="mt-1 text-[10px] text-muted-foreground">Contact and payment details for your vendors.</p></div><SearchField className="w-full sm:max-w-[260px]" onChange={setQuery} placeholder="Search suppliers" value={query} /></div>
      {visibleSuppliers.length ? <TableScroller><table className="w-full min-w-[700px] text-left"><thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Supplier</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Phone</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Balance due</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{visibleSuppliers.map((supplier) => <tr key={supplier.id} className="border-b border-border/70 last:border-0"><td className="px-5 py-3"><p className="text-xs font-semibold">{supplier.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{supplier.id}</p></td><td className="px-3 py-3 text-xs">{supplier.contact}</td><td className="px-3 py-3 text-xs">{supplier.phone}</td><td className="px-3 py-3 text-xs text-muted-foreground">{supplier.category}</td><td className="numeric px-3 py-3 text-xs font-semibold">{formatNpr(supplier.balance)}</td><td className="px-5 py-3"><StatusBadge status={supplier.status} /></td></tr>)}</tbody></table></TableScroller> : <div className="p-5"><EmptyState title="No suppliers found" description="Try a different search or add a supplier." action={<Button onClick={() => setAddOpen(true)} size="sm">Add supplier</Button>} /></div>}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span>{visibleSuppliers.length} of {suppliers.length} suppliers</span><Link className="font-semibold text-primary" href="/app/purchases">Open purchasing</Link></div>
    </Panel>
    {addOpen && <SupplierModal onClose={() => setAddOpen(false)} onSave={(supplier) => { addSupplier(supplier); setAddOpen(false); showToast(`${supplier.name} added to suppliers.`) }} />}
  </div>
}

function CustomerModal({ onClose, onSave }: { onClose: () => void; onSave: (customer: Omit<DemoCustomer, 'id'>) => void }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  return <Modal title="Add customer" description="Create a guest profile for future visits and loyalty tracking." onClose={onClose} size="sm"><form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); onSave({ ...form, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), totalOrders: 0, totalSpent: 0, lastVisit: 'Not yet visited', loyaltyPoints: 0, favorite: 'Not yet set' }) }}>
    <FormField label="Customer name"><input autoFocus className={controlClassName} maxLength={70} onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} /></FormField>
    <FormField label="Phone number"><input className={controlClassName} onChange={(event) => setForm({ ...form, phone: event.target.value })} required type="tel" value={form.phone} /></FormField>
    <FormField label="Email address"><input className={controlClassName} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" value={form.email} /></FormField>
    <div className="flex justify-end gap-2 border-t border-border pt-3"><Button onClick={onClose} type="button" variant="outline">Cancel</Button><Button type="submit">Save customer</Button></div>
  </form></Modal>
}

export function CustomersView() {
  const { customers, orders, addCustomer, showToast } = useDemoStore()
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<DemoCustomer | null>(null)
  const visibleCustomers = customers.filter((customer) => `${customer.name} ${customer.phone} ${customer.email} ${customer.favorite}`.toLowerCase().includes(query.toLowerCase()))
  const lifetimeValue = customers.reduce((total, customer) => total + customer.totalSpent, 0)
  const loyaltyTotal = customers.reduce((total, customer) => total + customer.loyaltyPoints, 0)
  const customerOrders = selectedCustomer ? orders.filter((order) => order.customer === selectedCustomer.name) : []

  return <div>
    <PageHeader eyebrow="Guest relationships" title="Customers" description="Recognize regulars, understand what they love, and build lasting loyalty." action={<Button data-icon="inline-start" onClick={() => setAddOpen(true)}><UserPlus /> Add customer</Button>} />
    <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><MetricCard label="Guest profiles" value={String(customers.length)} icon={<Users />} tone="teal" /><MetricCard label="Lifetime spend" value={formatNpr(lifetimeValue)} icon={<ClipboardList />} tone="orange" /><MetricCard label="Loyalty points" value={loyaltyTotal.toLocaleString()} icon={<Check />} tone="blue" /></section>
    <Panel><div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><h2 className="text-sm font-semibold">Customer directory</h2><p className="mt-1 text-[10px] text-muted-foreground">Guest details, visit history, and loyalty points.</p></div><SearchField className="w-full sm:max-w-[260px]" onChange={setQuery} placeholder="Search customers" value={query} /></div>
      {visibleCustomers.length ? <TableScroller><table className="w-full min-w-[760px] text-left"><thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Orders</th><th className="px-3 py-3">Total spent</th><th className="px-3 py-3">Last visit</th><th className="px-3 py-3">Points</th><th className="px-5 py-3 text-right">Profile</th></tr></thead><tbody>{visibleCustomers.map((customer) => <tr key={customer.id} className="border-b border-border/70 last:border-0 hover:bg-[#fbfcfb]"><td className="px-5 py-3"><p className="text-xs font-semibold">{customer.name}</p><p className="mt-1 text-[10px] text-muted-foreground">Favorite · {customer.favorite}</p></td><td className="px-3 py-3"><p className="text-xs">{customer.phone}</p><p className="mt-1 text-[10px] text-muted-foreground">{customer.email}</p></td><td className="numeric px-3 py-3 text-xs">{customer.totalOrders}</td><td className="numeric px-3 py-3 text-xs font-semibold">{formatNpr(customer.totalSpent)}</td><td className="px-3 py-3 text-xs text-muted-foreground">{customer.lastVisit}</td><td className="numeric px-3 py-3 text-xs">{customer.loyaltyPoints}</td><td className="px-5 py-3 text-right"><Button onClick={() => setSelectedCustomer(customer)} size="sm" variant="outline">View</Button></td></tr>)}</tbody></table></TableScroller> : <div className="p-5"><EmptyState title="No customers found" description="Try a different search or add a guest profile." action={<Button onClick={() => setAddOpen(true)} size="sm">Add customer</Button>} /></div>}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span>{visibleCustomers.length} customer profiles</span><span>Demo loyalty: 1 point for every Rs. 100 spent</span></div>
    </Panel>
    {addOpen && <CustomerModal onClose={() => setAddOpen(false)} onSave={(customer) => { addCustomer(customer); setAddOpen(false); showToast(`${customer.name} added to your customer list.`) }} />}
    {selectedCustomer && <Modal title={selectedCustomer.name} description="Guest profile and recent activity" onClose={() => setSelectedCustomer(null)}>
      <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-[#f7f8f6] p-3"><p className="text-[10px] text-muted-foreground">Total spent</p><p className="numeric mt-1 text-sm font-semibold">{formatNpr(selectedCustomer.totalSpent)}</p></div><div className="rounded-lg bg-[#f7f8f6] p-3"><p className="text-[10px] text-muted-foreground">Average order</p><p className="numeric mt-1 text-sm font-semibold">{formatNpr(selectedCustomer.totalOrders ? selectedCustomer.totalSpent / selectedCustomer.totalOrders : 0)}</p></div><div className="rounded-lg bg-[#f7f8f6] p-3"><p className="text-[10px] text-muted-foreground">Loyalty points</p><p className="numeric mt-1 text-sm font-semibold">{selectedCustomer.loyaltyPoints}</p></div></div>
      <div className="mt-5"><h3 className="text-xs font-semibold">Recent orders</h3>{customerOrders.length ? <div className="mt-2 divide-y divide-border rounded-lg border border-border">{customerOrders.map((order) => <div key={order.id} className="flex items-center justify-between gap-3 p-3"><div><p className="text-xs font-semibold text-primary">{order.id}</p><p className="mt-1 text-[10px] text-muted-foreground">{order.time} · {order.items}</p></div><span className="numeric text-xs font-semibold">{formatNpr(order.amount)}</span></div>)}</div> : <p className="mt-2 rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">No matching demo orders yet. New orders appear here when a guest name matches this profile.</p>}</div>
    </Modal>}
  </div>
}

function StaffModal({ onClose, onSave }: { onClose: () => void; onSave: (member: Omit<DemoStaff, 'id'>) => void }) {
  const [form, setForm] = useState({ name: '', role: 'Waiter', phone: '', shift: 'Morning · 7:00 AM–3:00 PM' })
  return <Modal title="Add team member" description="Add a team profile and assign an operational role." onClose={onClose} size="sm"><form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); const name = form.name.trim(); onSave({ ...form, name, phone: form.phone.trim(), status: 'Off duty', initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() }) }}>
    <FormField label="Full name"><input autoFocus className={controlClassName} maxLength={70} onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} /></FormField>
    <FormField label="Role"><select className={controlClassName} onChange={(event) => setForm({ ...form, role: event.target.value })} value={form.role}>{roleNames.filter((role) => role !== 'Owner').map((role) => <option key={role}>{role}</option>)}</select></FormField>
    <FormField label="Phone"><input className={controlClassName} onChange={(event) => setForm({ ...form, phone: event.target.value })} required type="tel" value={form.phone} /></FormField>
    <FormField label="Shift"><select className={controlClassName} onChange={(event) => setForm({ ...form, shift: event.target.value })} value={form.shift}>{['Morning · 7:00 AM–3:00 PM', 'Midday · 11:00 AM–7:00 PM', 'Evening · 3:00 PM–11:00 PM', 'Flexible'].map((shift) => <option key={shift}>{shift}</option>)}</select></FormField>
    <div className="flex justify-end gap-2 border-t border-border pt-3"><Button onClick={onClose} type="button" variant="outline">Cancel</Button><Button type="submit">Add member</Button></div>
  </form></Modal>
}

function createDefaultPermissions(): PermissionMatrix {
  return Object.fromEntries(roleNames.map((role, index) => [role, Object.fromEntries(permissionNames.map((permission) => [permission, permission === 'View' || (index < 3 && ['Create', 'Edit', 'Approve'].includes(permission))]))])) as PermissionMatrix
}

export function StaffView({ initialTab = 'Team' }: { initialTab?: StaffSection }) {
  const { staff, addStaff, updateStaff, showToast } = useDemoStore()
  const [tab, setTab] = useState<StaffSection>(initialTab)
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [permissions, setPermissions] = useState<PermissionMatrix>(createDefaultPermissions)
  const filteredStaff = staff.filter((member) => `${member.name} ${member.role} ${member.phone} ${member.shift}`.toLowerCase().includes(query.toLowerCase()))

  function setPermission(role: string, permission: (typeof permissionNames)[number], enabled: boolean) {
    setPermissions((current) => ({ ...current, [role]: { ...current[role], [permission]: enabled } }))
    showToast(`${permission} access updated for ${role} in this demo.`)
  }

  function setAttendance(member: DemoStaff) {
    const nextStatus: DemoStaff['status'] = member.status === 'Off duty' ? 'On shift' : member.status === 'On break' ? 'On shift' : member.status === 'On shift' ? 'On break' : 'On shift'
    updateStaff(member.id, { status: nextStatus })
    showToast(`${member.name} is now ${nextStatus.toLowerCase()}.`)
  }

  return <div>
    <PageHeader eyebrow="People & permissions" title="Staff & roles" description="Keep your service team organized with clear shifts, attendance, and access." action={tab === 'Team' ? <Button data-icon="inline-start" onClick={() => setAddOpen(true)}><UserPlus /> Add team member</Button> : undefined} />
    <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><MetricCard label="Team members" value={String(staff.length)} icon={<Users />} tone="teal" /><MetricCard label="On shift now" value={String(staff.filter((member) => member.status === 'On shift').length)} icon={<Check />} tone="green" /><MetricCard label="Roles configured" value={String(roleNames.length)} icon={<ClipboardList />} tone="blue" /></section>
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><FilterTabs label="Staff workspace" items={['Team', 'Roles & permissions', 'Attendance'] as const} value={tab} onChange={setTab} />{tab !== 'Roles & permissions' && <SearchField className="w-full sm:max-w-[240px]" onChange={setQuery} placeholder="Search team members" value={query} />}</div>
    {tab === 'Roles & permissions' ? <Panel className="overflow-hidden"><PanelHeading title="Permission matrix" detail="Toggle access for the workspace demo roles." /><TableScroller><table className="mt-4 w-full min-w-[820px] text-left"><thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Role</th>{permissionNames.map((permission) => <th className="px-3 py-3 text-center" key={permission}>{permission}</th>)}</tr></thead><tbody>{roleNames.map((role) => <tr className="border-b border-border/70 last:border-0" key={role}><td className="px-5 py-3 text-xs font-semibold">{role}</td>{permissionNames.map((permission) => <td className="px-3 py-3 text-center" key={permission}><input aria-label={`${permission} permission for ${role}`} checked={permissions[role][permission]} className="size-4 accent-primary" onChange={(event) => setPermission(role, permission, event.target.checked)} type="checkbox" /></td>)}</tr>)}</tbody></table></TableScroller><div className="border-t border-border px-5 py-3 text-[10px] leading-5 text-muted-foreground">Kitchen Staff can focus on the kitchen queue. Cashiers can handle orders without financial settings access. Permission changes are for this in-memory demo only.</div></Panel> : tab === 'Attendance' ? <Panel><div className="flex items-center justify-between gap-3 px-5 py-4"><div><h2 className="text-sm font-semibold">Today's attendance</h2><p className="mt-1 text-[10px] text-muted-foreground">Start a shift, take a break, or clock out.</p></div><span className="rounded-lg bg-secondary px-3 py-2 text-[10px] font-semibold text-primary">{new Intl.DateTimeFormat('en-NP', { dateStyle: 'medium' }).format(new Date())}</span></div><TableScroller><table className="w-full min-w-[670px] text-left"><thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Team member</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Shift</th><th className="px-3 py-3">Attendance</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody>{filteredStaff.map((member) => <tr className="border-b border-border/70 last:border-0" key={member.id}><td className="px-5 py-3 text-xs font-semibold">{member.name}</td><td className="px-3 py-3 text-xs text-muted-foreground">{member.role}</td><td className="px-3 py-3 text-xs text-muted-foreground">{member.shift}</td><td className="px-3 py-3"><StatusBadge status={member.status} /></td><td className="px-5 py-3 text-right"><Button onClick={() => setAttendance(member)} size="sm" variant="outline">{member.status === 'Off duty' ? 'Clock in' : member.status === 'On break' ? 'End break' : 'Start break'}</Button></td></tr>)}</tbody></table></TableScroller></Panel> : <Panel><div className="flex items-center justify-between gap-3 px-5 py-4"><div><h2 className="text-sm font-semibold">Team directory</h2><p className="mt-1 text-[10px] text-muted-foreground">Contact details, role, and current shift status.</p></div><Button onClick={() => setAddOpen(true)} size="sm" variant="outline"><UserPlus data-icon="inline-start" />Add member</Button></div>{filteredStaff.length ? <TableScroller><table className="w-full min-w-[710px] text-left"><thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Team member</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Shift</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{filteredStaff.map((member) => <tr className="border-b border-border/70 last:border-0" key={member.id}><td className="px-5 py-3"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-primary">{member.initials}</span><span><span className="block text-xs font-semibold">{member.name}</span><span className="mt-1 block text-[10px] text-muted-foreground">{member.id}</span></span></div></td><td className="px-3 py-3 text-xs">{member.role}</td><td className="px-3 py-3 text-xs text-muted-foreground">{member.phone}</td><td className="px-3 py-3 text-[10px] text-muted-foreground">{member.shift}</td><td className="px-5 py-3"><StatusBadge status={member.status} /></td></tr>)}</tbody></table></TableScroller> : <div className="p-5"><EmptyState title="No team members found" description="Try a different search or add a new teammate." action={<Button onClick={() => setAddOpen(true)} size="sm">Add member</Button>} /></div>}<div className="border-t border-border px-5 py-3 text-[10px] text-muted-foreground">Role assignment and attendance updates are stored in this demo session.</div></Panel>}
    {addOpen && <StaffModal onClose={() => setAddOpen(false)} onSave={(member) => { addStaff(member); setAddOpen(false); showToast(`${member.name} added to the team.`) }} />}
  </div>
}
