'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowRight, Check, Copy, ExternalLink, Minus, Plus, QrCode, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DemoStoreProvider, useDemoStore } from './demo-store'
import { formatNpr, type MenuProduct } from './data'
import { EmptyState, LabeledField, Modal, PageHeader, Panel, PanelHeading, SearchField, StatusBadge, controlClassName } from './shared'

function QrMenuWorkspaceView() {
  const { tables, menuItems, categories, showToast } = useDemoStore()
  const [table, setTable] = useState(tables[0]?.label ?? 'T-01')
  const [origin, setOrigin] = useState('')
  const [showPrices, setShowPrices] = useState(true)
  const menuUrl = `${origin || 'https://servepilot.demo'}/menu/${encodeURIComponent(table)}`

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl)
      showToast('Public menu link copied.')
    } catch {
      showToast(menuUrl)
    }
  }

  return <div>
    <PageHeader eyebrow="Guest experience" title="QR menu" description="Create a table-specific menu link guests can scan from their seat." action={<Button onClick={() => window.print()} size="sm" variant="outline"><QrCode data-icon="inline-start" /> Print QR</Button>} />
    <div className="grid items-start gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><QrCode className="size-6" /></span>
          <h2 className="mt-4 text-lg font-semibold tracking-[-0.03em]">Your menu, one scan away</h2>
          <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">Each table gets a link that opens the live demo menu with the right table already selected.</p>
          <div className="mt-5 w-full max-w-xs text-left"><LabeledField htmlFor="qr-table" label="Table QR code"><select className={controlClassName} id="qr-table" onChange={(event) => setTable(event.target.value)} value={table}>{tables.map((item) => <option key={item.id} value={item.label}>{item.label} · {item.section}</option>)}</select></LabeledField></div>
          <div className="mt-5 rounded-2xl border border-border bg-white p-4"><QRCodeSVG aria-label={`QR code for the menu at ${table}`} bgColor="#ffffff" fgColor="#173b3f" includeMargin level="M" size={196} title={`ServePilot menu for ${table}`} value={menuUrl} /></div>
          <div className="mt-4 w-full rounded-lg bg-[#f7f8f6] px-3 py-2.5 text-left"><p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Public menu link</p><p className="mt-1 break-all text-[11px] font-medium text-primary">{menuUrl}</p></div>
          <div className="mt-4 flex w-full flex-wrap justify-center gap-2"><Button onClick={copyLink} size="sm" variant="outline"><Copy data-icon="inline-start" /> Copy link</Button><Link className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-brand-800" href={`/menu/${encodeURIComponent(table)}`} rel="noreferrer" target="_blank">Preview menu <ExternalLink className="size-3.5" /></Link></div>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold">Guest menu options</span><StatusBadge status="Live preview" /></div>
          <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><input checked={showPrices} className="size-4 accent-primary" onChange={(event) => setShowPrices(event.target.checked)} type="checkbox" /> Show prices in the preview</label>
          <p className="mt-3 text-[10px] leading-4 text-muted-foreground">{categories.length} menu categories · {menuItems.filter((item) => item.available).length} available items</p>
        </div>
      </Panel>
      <Panel className="overflow-hidden">
        <PanelHeading title="Guest preview" detail="What the QR code opens on a phone" />
        <div className="mx-auto my-5 w-full max-w-[390px] overflow-hidden rounded-[28px] border-[7px] border-[#202927] bg-[#f7f8f6] shadow-sm">
          <div className="flex items-center justify-between bg-white px-4 py-3"><span className="text-xs font-semibold">ServePilot</span><span className="rounded-full bg-secondary px-2.5 py-1 text-[9px] font-semibold text-primary">{table}</span></div>
          <div className="bg-primary px-4 py-5 text-white"><p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70">Thamel Kitchen</p><h3 className="mt-1 text-lg font-semibold">A little taste of Nepal</h3><p className="mt-1 text-[10px] text-white/75">Freshly made, just for your table.</p></div>
          <div className="subtle-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-3">{['All items', ...categories].map((item, index) => <span className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-semibold ${index === 0 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`} key={item}>{item}</span>)}</div>
          <div className="flex max-h-[410px] flex-col gap-2.5 overflow-y-auto p-3">{menuItems.filter((item) => item.available).slice(0, 5).map((item) => <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-2.5" key={item.id}><img alt="" className="size-14 rounded-lg object-cover" height="56" src={item.image} width="56" /><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold">{item.name}</span><span className="mt-1 block text-[9px] text-muted-foreground">{item.category}</span>{showPrices && <span className="numeric mt-1 block text-[10px] font-semibold text-primary">{formatNpr(item.price)}</span>}</span><Plus className="size-4 shrink-0 text-primary" /></div>)}</div>
          <div className="border-t border-border bg-white px-3 py-2 text-center text-[9px] text-muted-foreground">Menu preview · No payment is collected</div>
        </div>
      </Panel>
    </div>
  </div>
}

export function QrMenuView() {
  return <QrMenuWorkspaceView />
}

type PublicCartLine = { product: MenuProduct; quantity: number }

function PublicCart({
  lines,
  total,
  guest,
  note,
  setGuest,
  setNote,
  onQuantity,
  onSubmit,
  onClose,
  idPrefix,
}: {
  lines: PublicCartLine[]
  total: number
  idPrefix: string
  guest: string
  note: string
  setGuest: (value: string) => void
  setNote: (value: string) => void
  onQuantity: (id: string, delta: number) => void
  onSubmit: () => void
  onClose?: () => void
}) {
  return <div className="flex flex-col gap-4">
    {lines.length ? <div className="max-h-64 divide-y divide-border overflow-y-auto">{lines.map(({ product, quantity }) => <div className="flex items-center gap-2 py-3 first:pt-0 last:pb-0" key={product.id}><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{product.name}</span><span className="numeric mt-1 block text-[10px] text-muted-foreground">{formatNpr(product.price)} each</span></span><div className="flex items-center gap-1"><button aria-label={`Remove one ${product.name}`} className="grid size-7 place-items-center rounded-md border border-border" onClick={() => onQuantity(product.id, -1)} type="button"><Minus className="size-3" /></button><span className="numeric w-5 text-center text-xs font-semibold">{quantity}</span><button aria-label={`Add one ${product.name}`} className="grid size-7 place-items-center rounded-md border border-border" onClick={() => onQuantity(product.id, 1)} type="button"><Plus className="size-3" /></button></div><span className="numeric w-16 text-right text-[10px] font-semibold">{formatNpr(product.price * quantity)}</span></div>)}</div> : <EmptyState title="Your order is empty" description="Add a dish from the menu to get started." />}
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <LabeledField htmlFor={`${idPrefix}-guest-name`} label="Name for the order"><input className={controlClassName} id={`${idPrefix}-guest-name`} maxLength={60} onChange={(event) => setGuest(event.target.value)} placeholder="Optional" value={guest} /></LabeledField>
      <LabeledField htmlFor={`${idPrefix}-guest-note`} label="Kitchen note"><textarea className={`${controlClassName} min-h-16 resize-y py-2`} id={`${idPrefix}-guest-note`} maxLength={120} onChange={(event) => setNote(event.target.value)} placeholder="Allergies or preparation notes" value={note} /></LabeledField>
    </div>
    <div className="flex items-center justify-between border-t border-border pt-3"><span className="text-xs text-muted-foreground">Total incl. VAT</span><span className="numeric text-base font-semibold">{formatNpr(total)}</span></div>
    <div className="flex gap-2">{onClose && <Button className="flex-1" onClick={onClose} type="button" variant="outline">Keep browsing</Button>}<Button className="flex-1" disabled={!lines.length} onClick={onSubmit} type="button"><Check data-icon="inline-start" /> Send order</Button></div>
    <p className="text-center text-[9px] leading-4 text-muted-foreground">Demo request only. No payment details are collected.</p>
  </div>
}

function PublicMenuContent({ table }: { table: string }) {
  const { menuItems, categories, tables, addOrder, updateTable, showToast } = useDemoStore()
  const [activeCategory, setActiveCategory] = useState('All items')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Array<{ id: string; quantity: number }>>([])
  const [guest, setGuest] = useState('')
  const [note, setNote] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const menuTable = decodeURIComponent(table)
  const availableItems = menuItems.filter((item) => item.available && (activeCategory === 'All items' || item.category === activeCategory) && `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase()))
  const selectedLines: PublicCartLine[] = cart.flatMap((line) => {
    const product = menuItems.find((item) => item.id === line.id)
    return product ? [{ product, quantity: line.quantity }] : []
  })
  const subtotal = selectedLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const total = Math.round(subtotal * 1.13)
  const itemCount = selectedLines.reduce((sum, line) => sum + line.quantity, 0)

  function adjustQuantity(id: string, delta: number) {
    setCart((current) => {
      const entry = current.find((line) => line.id === id)
      if (!entry && delta > 0) return [...current, { id, quantity: 1 }]
      return current.map((line) => line.id === id ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0)
    })
  }

  function placeOrder() {
    if (!selectedLines.length) return
    const currentTime = new Intl.DateTimeFormat('en-NP', { hour: 'numeric', minute: '2-digit' }).format(new Date())
    const created = addOrder({
      time: currentTime,
      type: 'Dine in',
      table: menuTable,
      customer: guest.trim() || 'QR guest',
      items: selectedLines.map(({ product, quantity }) => `${product.name}${quantity > 1 ? ` × ${quantity}` : ''}`).join(', '),
      amount: total,
      paymentStatus: 'Pending',
      status: 'New',
      lines: selectedLines.map(({ product, quantity }) => ({ name: product.name, quantity, price: product.price })),
      specialInstructions: note.trim() || undefined,
    })
    const tableRecord = tables.find((entry) => entry.label === menuTable)
    if (tableRecord) updateTable(tableRecord.id, { status: 'Occupied', guest: guest.trim() || 'QR guest', since: currentTime, amount: total })
    setOrderId(created.id)
    setCart([])
    setCartOpen(false)
    showToast(`${created.id} sent to the kitchen.`)
  }

  const renderCart = (idPrefix: string) => <PublicCart guest={guest} idPrefix={idPrefix} lines={selectedLines} note={note} onQuantity={adjustQuantity} onSubmit={placeOrder} setGuest={setGuest} setNote={setNote} total={total} />

  return <main className="min-h-screen bg-background pb-24 lg:pb-10">
    <header className="border-b border-border bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"><Link className="flex items-center gap-2 text-sm font-semibold tracking-[-0.03em]" href="/"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><QrCode className="size-4" /></span>ServePilot</Link><span className="rounded-lg bg-secondary px-3 py-1.5 text-[10px] font-semibold text-primary">Table {menuTable}</span></div></header>
    <div className="mx-auto grid grid-cols-1 max-w-6xl items-start gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:py-8">
      <section className="min-w-0">
        <div className="rounded-2xl bg-primary px-5 py-6 text-white sm:px-7 sm:py-8"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">Thamel Kitchen · Kathmandu</p><h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.05em] sm:text-3xl">A little taste of Nepal.</h1><p className="mt-2 max-w-lg text-xs leading-5 text-white/75">Freshly made favorites, prepared with care. Browse the menu and send your order straight to our team.</p><div className="mt-4 flex items-center gap-2 text-[10px] text-white/75"><span className="size-1.5 rounded-full bg-[#94d2a9]" />Open for dine-in <span className="px-1">·</span> 14–22 min average prep</div></div>
        {orderId ? <Panel className="mt-5 p-5 sm:p-6"><span className="grid size-11 place-items-center rounded-xl bg-[#e8f4ec] text-success"><Check className="size-5" /></span><h2 className="mt-4 text-lg font-semibold">Your order is with the kitchen</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Order <span className="font-semibold text-primary">{orderId}</span> has been sent to the team. You can keep browsing while it is prepared.</p><Button className="mt-4" onClick={() => { setOrderId(null); setNote('') }} variant="outline">Start another order</Button></Panel> : <>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold tracking-[-0.03em]">Menu</h2><p className="mt-1 text-[10px] text-muted-foreground">{menuItems.filter((item) => item.available).length} freshly prepared items</p></div><SearchField className="w-full sm:max-w-[260px]" onChange={setQuery} placeholder="Search dishes" value={query} /></div>
          <div className="subtle-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Menu categories">{['All items', ...categories].map((item) => <button aria-selected={activeCategory === item} className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold ${activeCategory === item ? 'bg-primary text-white' : 'border border-border bg-white text-muted-foreground'}`} key={item} onClick={() => setActiveCategory(item)} role="tab" type="button">{item}</button>)}</div>
          {availableItems.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{availableItems.map((item) => <article className="overflow-hidden rounded-xl border border-border bg-white" key={item.id}><img alt={item.name} className="aspect-[1.7] w-full object-cover" height="220" loading="lazy" src={item.image} width="380" /><div className="p-3.5"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="text-xs font-semibold">{item.name}</h3><p className="mt-1 line-clamp-2 min-h-8 text-[10px] leading-4 text-muted-foreground">{item.description}</p></div><span className="rounded-md bg-secondary px-2 py-1 text-[9px] font-semibold text-primary">{item.preparationTime} min</span></div><div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3"><span className="numeric text-sm font-semibold">{formatNpr(item.price)}</span><Button aria-label={`Add ${item.name} to order`} onClick={() => adjustQuantity(item.id, 1)} size="sm"><Plus data-icon="inline-start" /> Add</Button></div></div></article>)}</div> : <div className="mt-4 rounded-xl bg-white p-4"><EmptyState title="No dishes found" description="Try a different search or browse another category." action={<Button onClick={() => { setActiveCategory('All items'); setQuery('') }} size="sm" variant="outline">Clear filters</Button>} /></div>}
          <p className="mt-5 text-center text-[10px] leading-5 text-muted-foreground">Prices are in Nepalese Rupees and include 13% VAT at checkout. Please tell our team about allergies before ordering.</p>
        </>}
      </section>
      <aside className="hidden lg:block lg:sticky lg:top-5"><Panel className="p-5"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-sm font-semibold">Your order</h2><p className="mt-1 text-[10px] text-muted-foreground">Table {menuTable}</p></div><span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><ShoppingBag className="size-4" /></span></div>{renderCart('desktop')}</Panel></aside>
    </div>
    {selectedLines.length > 0 && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur lg:hidden"><Button className="w-full justify-between" onClick={() => setCartOpen(true)}><span className="flex items-center gap-2"><ShoppingBag className="size-4" /> Your order · {itemCount} {itemCount === 1 ? 'item' : 'items'}</span><span className="numeric">{formatNpr(total)} <ArrowRight className="ml-1 inline size-3" /></span></Button></div>}
    {cartOpen && <Modal description={`Review your order for table ${menuTable}.`} onClose={() => setCartOpen(false)} title="Your order">{renderCart('mobile')}</Modal>}
  </main>
}

export function PublicMenuPage({ table }: { table: string }) {
  return <DemoStoreProvider><PublicMenuContent table={table} /></DemoStoreProvider>
}
