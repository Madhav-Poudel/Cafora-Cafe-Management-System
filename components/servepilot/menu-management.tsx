"use client"

import { useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowDownUp, Check, CirclePlus, Download, Ellipsis, Eye, EyeOff, Layers3, ListFilter, Pencil, Plus, Search, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/components/servepilot/demo-store'
import { formatNpr, type MenuProduct } from '@/components/servepilot/data'
import { EmptyState, LabeledField, Modal, PageHeader, Panel, PanelHeading, SearchField, StatusBadge, TableScroller, controlClassName } from '@/components/servepilot/shared'

const allFilter = 'All items'
type EditorValue = MenuProduct | 'new' | null

function MenuEditor({
  item,
  categories,
  onSave,
  onClose,
}: {
  item: Exclude<EditorValue, null>
  categories: string[]
  onSave: (value: Omit<MenuProduct, 'id'>) => void
  onClose: () => void
}) {
  const initial = item === 'new' ? {
    name: '', description: '', category: categories[0] ?? 'Mains', price: 0, costPrice: 0, sku: '',
    available: true, preparationTime: 10, image: '/servepilot/momo.png', taxRate: 13,
  } : item
  const [form, setForm] = useState(initial)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ ...form, price: Number(form.price), costPrice: Number(form.costPrice), preparationTime: Number(form.preparationTime), taxRate: Number(form.taxRate) })
  }

  return (
    <Modal title={item === 'new' ? 'Add menu item' : 'Edit menu item'} description="Set up pricing, preparation details and availability." onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledField label="Item name" htmlFor="menu-name">
            <input id="menu-name" className={controlClassName} maxLength={70} onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} />
          </LabeledField>
          <LabeledField label="Category" htmlFor="menu-category">
            <select id="menu-category" className={controlClassName} onChange={(event) => setForm({ ...form, category: event.target.value })} value={form.category}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </LabeledField>
        </div>
        <LabeledField label="Description" htmlFor="menu-description">
          <textarea id="menu-description" className={`${controlClassName} min-h-20 resize-y py-2`} maxLength={160} onChange={(event) => setForm({ ...form, description: event.target.value })} value={form.description} />
        </LabeledField>
        <div className="grid gap-4 sm:grid-cols-3">
          <LabeledField label="Selling price (Rs.)" htmlFor="menu-price">
            <input id="menu-price" className={controlClassName} min="0" onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} required type="number" value={form.price || ''} />
          </LabeledField>
          <LabeledField label="Cost price (Rs.)" htmlFor="menu-cost">
            <input id="menu-cost" className={controlClassName} min="0" onChange={(event) => setForm({ ...form, costPrice: Number(event.target.value) })} type="number" value={form.costPrice || ''} />
          </LabeledField>
          <LabeledField label="Prep time (min)" htmlFor="menu-prep">
            <input id="menu-prep" className={controlClassName} min="1" onChange={(event) => setForm({ ...form, preparationTime: Number(event.target.value) })} type="number" value={form.preparationTime} />
          </LabeledField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledField label="SKU" htmlFor="menu-sku">
            <input id="menu-sku" className={controlClassName} maxLength={24} onChange={(event) => setForm({ ...form, sku: event.target.value })} required value={form.sku} />
          </LabeledField>
          <LabeledField label="VAT rate" htmlFor="menu-tax">
            <select id="menu-tax" className={controlClassName} onChange={(event) => setForm({ ...form, taxRate: Number(event.target.value) })} value={form.taxRate}>
              <option value={13}>13% VAT</option><option value={0}>Tax exempt</option>
            </select>
          </LabeledField>
        </div>
        <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-3 text-sm">
          <input checked={form.available} className="size-4 accent-primary" onChange={(event) => setForm({ ...form, available: event.target.checked })} type="checkbox" />
          Available to order
        </label>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button onClick={onClose} type="button" variant="outline">Cancel</Button>
          <Button data-icon="inline-start" type="submit"><Check /> Save item</Button>
        </div>
      </form>
    </Modal>
  )
}

export function MenuView() {
  const { menuItems, categories, addMenuItem, updateMenuItem, showToast } = useDemoStore()
  const [selectedCategory, setSelectedCategory] = useState(allFilter)
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<EditorValue>(null)
  const filteredItems = useMemo(() => menuItems.filter((item) => {
    const matchesCategory = selectedCategory === allFilter || item.category === selectedCategory
    const matchesSearch = `${item.name} ${item.sku} ${item.description}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  }), [menuItems, search, selectedCategory])

  function saveItem(value: Omit<MenuProduct, 'id'>) {
    if (editor === 'new') addMenuItem(value)
    else if (editor) updateMenuItem(editor.id, value)
    showToast(editor === 'new' ? 'Menu item added to the demo menu' : 'Menu item updated')
    setEditor(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Menu management"
        title="Menu items"
        description="Keep your menu, prices and availability in sync across every service channel."
        action={<><Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted" href="/app/menu/categories"><Layers3 aria-hidden="true" className="size-4" /> Categories</Link><Button data-icon="inline-start" onClick={() => setEditor('new')}><Plus /> Add item</Button></>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <SearchField className="max-w-md" onChange={setSearch} placeholder="Search item, SKU or description" value={search} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>{menuItems.length} items</span><span aria-hidden="true">·</span><span>{menuItems.filter((item) => item.available).length} active</span></div>
      </div>
      <div aria-label="Filter menu by category" className="subtle-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist">
        {[allFilter, ...categories].map((category) => <button aria-selected={selectedCategory === category} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'border border-border bg-white text-muted-foreground hover:text-foreground'}`} key={category} onClick={() => setSelectedCategory(category)} role="tab" type="button">{category}</button>)}
      </div>
      <Panel className="overflow-hidden">
        {filteredItems.length ? (
          <TableScroller>
            <table className="w-full min-w-[820px] text-left">
              <thead className="border-b border-border bg-[#fafbf9] text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><tr><th className="px-5 py-3">Menu item</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Margin</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const margin = item.price ? Math.round(((item.price - item.costPrice) / item.price) * 100) : 0
                  return <tr className="transition-colors hover:bg-[#fbfcfb]" key={item.id}>
                    <td className="px-5 py-3"><div className="flex items-center gap-3"><img alt="" className="size-11 rounded-lg object-cover" height="44" loading="lazy" src={item.image} width="44" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{item.name}</p><p className="mt-0.5 max-w-xs truncate text-[11px] text-muted-foreground">{item.description}</p></div></div></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.category}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.sku}</td><td className="px-4 py-3 text-sm font-semibold text-foreground">{formatNpr(item.price)}</td><td className="px-4 py-3 text-sm text-foreground">{margin}%</td><td className="px-4 py-3"><StatusBadge status={item.available ? 'Available' : 'Unavailable'} /></td>
                    <td className="px-4 py-3"><div className="flex justify-end gap-1"><Button aria-label={`Edit ${item.name}`} onClick={() => setEditor(item)} size="icon-sm" variant="ghost"><Pencil aria-hidden="true" /></Button><Button aria-label={item.available ? `Mark ${item.name} unavailable` : `Mark ${item.name} available`} onClick={() => { updateMenuItem(item.id, { available: !item.available }); showToast(item.available ? 'Item marked unavailable' : 'Item is available again') }} size="icon-sm" variant="ghost">{item.available ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</Button></div></td>
                  </tr>
                })}
              </tbody>
            </table>
          </TableScroller>
        ) : <div className="p-5"><EmptyState title="No menu items found" description="Try a different search or add a new item to your menu." action={<Button data-icon="inline-start" onClick={() => setEditor('new')}><Plus /> Add item</Button>} /></div>}
      </Panel>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2"><UtensilsCrossed aria-hidden="true" className="size-4 text-primary" /> Changes update your in-app demo menu immediately.</span>
        <Button onClick={() => showToast('Menu CSV export is ready in demo mode')} size="sm" variant="outline"><Download aria-hidden="true" /> Export menu</Button>
      </div>
      {editor && <MenuEditor categories={categories} item={editor} onClose={() => setEditor(null)} onSave={saveItem} />}
    </div>
  )
}

export function CategoriesView() {
  const { categories, menuItems, addCategory, showToast } = useDemoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [notice, setNotice] = useState('')

  function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (categories.some((category) => category.toLowerCase() === categoryName.trim().toLowerCase())) {
      setNotice('That category already exists.')
      return
    }
    addCategory(categoryName)
    showToast(`${categoryName.trim()} category added`)
    setCategoryName('')
    setNotice('')
    setIsOpen(false)
  }

  return (
    <div>
      <PageHeader eyebrow="Menu management" title="Categories" description="Group menu items into clear sections for staff and guests." action={<Button data-icon="inline-start" onClick={() => setIsOpen(true)}><Plus /> Add category</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => {
          const count = menuItems.filter((item) => item.category === category).length
          return <Panel className="p-5" key={category}>
            <div className="flex items-start justify-between gap-3"><span className={`grid size-11 place-items-center rounded-xl ${index % 2 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary'}`}><Layers3 aria-hidden="true" /></span><Button aria-label={`More about ${category}`} size="icon-sm" variant="ghost"><Ellipsis aria-hidden="true" /></Button></div>
            <h2 className="mt-5 text-base font-semibold text-foreground">{category}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{count} menu {count === 1 ? 'item' : 'items'}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">Menu visibility</span><StatusBadge status="Active" /></div>
            <Link className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline" href={`/app/menu/items?category=${encodeURIComponent(category)}`}>View items <ArrowDownUp aria-hidden="true" className="size-3.5" /></Link>
          </Panel>
        })}
        <button className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/60 p-5 text-center transition-colors hover:border-primary/40 hover:bg-white" onClick={() => setIsOpen(true)} type="button"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><CirclePlus aria-hidden="true" /></span><span className="mt-3 text-sm font-semibold text-foreground">Create a category</span><span className="mt-1 text-xs text-muted-foreground">Make your menu easier to browse</span></button>
      </div>
      {isOpen && <Modal description="Create a new section for your menu." onClose={() => { setIsOpen(false); setNotice('') }} title="Add category" size="sm"><form className="flex flex-col gap-4" onSubmit={saveCategory}><LabeledField htmlFor="new-category" label="Category name"><input autoFocus className={controlClassName} id="new-category" maxLength={40} onChange={(event) => setCategoryName(event.target.value)} required value={categoryName} /></LabeledField>{notice && <p className="text-xs text-destructive" role="alert">{notice}</p>}<div className="flex justify-end gap-2"><Button onClick={() => setIsOpen(false)} type="button" variant="outline">Cancel</Button><Button type="submit">Create category</Button></div></form></Modal>}
    </div>
  )
}

export function MenuQuickFilter() {
  return <div className="flex items-center gap-2 text-xs text-muted-foreground"><ListFilter aria-hidden="true" className="size-4" /> Categories and availability can be managed from your menu.</div>
}

export function MenuEmptyAction() {
  return <Button asChild={false} variant="outline"><Search aria-hidden="true" /> Find an item</Button>
}

export function MenuDownloadAction() {
  return <Button onClick={() => window.print()} variant="outline"><Download aria-hidden="true" /> Print menu</Button>
}
