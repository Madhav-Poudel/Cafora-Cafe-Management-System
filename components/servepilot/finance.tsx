'use client'

import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDownToLine,
  CreditCard,
  Plus,
  ReceiptText,
  Wallet,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { useDemoStore } from './demo-store'
import { formatNpr, initialOrders, paymentMethods, revenueByDay } from './data'
import {
  EmptyState,
  LabeledField,
  MetricCard,
  Modal,
  PageHeader,
  Panel,
  PanelHeading,
  SearchField,
  TableScroller,
  controlClassName,
} from './shared'

type LedgerKind = 'Income' | 'Expense'
type LedgerRow = {
  id: string
  label: string
  kind: LedgerKind
  amount: number
  date: string
  method: string
  reference: string
  notes: string
}

type EntryFormValue = {
  label: string
  amount: number
  date: string
  method: string
  reference: string
  notes: string
}

function FinanceEntryModal({
  kind,
  onClose,
  onSave,
}: {
  kind: LedgerKind
  onClose: () => void
  onSave: (entry: EntryFormValue) => void
}) {
  const [form, setForm] = useState({ label: '', amount: '', method: 'Cash', reference: '', notes: '' })
  const [notice, setNotice] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice('Enter an amount greater than zero.')
      return
    }
    onSave({
      label: form.label.trim(),
      amount: Math.round(amount),
      date: `Today, ${new Intl.DateTimeFormat('en-NP', { hour: 'numeric', minute: '2-digit' }).format(new Date())}`,
      method: form.method,
      reference: form.reference.trim(),
      notes: form.notes.trim(),
    })
  }

  return <Modal title={kind === 'Expense' ? 'Record an expense' : 'Record other income'} description={kind === 'Expense' ? 'Log a business cost for this branch.' : 'Capture deposits, events, and other non-order income.'} onClose={onClose} size="sm">
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <LabeledField htmlFor="ledger-label" label={kind === 'Expense' ? 'Expense category' : 'Income source'}>
        <input autoFocus className={controlClassName} id="ledger-label" maxLength={60} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder={kind === 'Expense' ? 'e.g. Produce delivery' : 'e.g. Catering deposit'} required value={form.label} />
      </LabeledField>
      <div className="grid grid-cols-2 gap-3">
        <LabeledField htmlFor="ledger-amount" label="Amount (Rs.)">
          <input className={controlClassName} id="ledger-amount" min="1" onChange={(event) => setForm({ ...form, amount: event.target.value })} required step="1" type="number" value={form.amount} />
        </LabeledField>
        <LabeledField htmlFor="ledger-method" label="Payment method">
          <select className={controlClassName} id="ledger-method" onChange={(event) => setForm({ ...form, method: event.target.value })} value={form.method}>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select>
        </LabeledField>
      </div>
      <LabeledField htmlFor="ledger-reference" label="Reference">
        <input className={controlClassName} id="ledger-reference" maxLength={40} onChange={(event) => setForm({ ...form, reference: event.target.value })} placeholder="Optional receipt or bill number" value={form.reference} />
      </LabeledField>
      <LabeledField htmlFor="ledger-notes" label="Notes">
        <textarea className={`${controlClassName} min-h-20 resize-y py-2`} id="ledger-notes" maxLength={140} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Add a short note" value={form.notes} />
      </LabeledField>
      {notice && <p className="text-xs text-destructive" role="alert">{notice}</p>}
      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <Button onClick={onClose} type="button" variant="outline">Cancel</Button>
        <Button type="submit">Save {kind.toLowerCase()}</Button>
      </div>
    </form>
  </Modal>
}

export function FinanceView() {
  const { orders, expenses, income, addExpense, addIncome, showToast } = useDemoStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All activity' | LedgerKind>('All activity')
  const [entryKind, setEntryKind] = useState<LedgerKind | null>(null)

  const rows: LedgerRow[] = useMemo(() => [
    ...income.map((entry) => ({ id: entry.id, label: entry.source, kind: 'Income' as const, amount: entry.amount, date: entry.date, method: entry.method, reference: '—', notes: entry.notes })),
    ...expenses.map((entry) => ({ id: entry.id, label: entry.category, kind: 'Expense' as const, amount: entry.amount, date: entry.date, method: entry.method, reference: entry.reference, notes: entry.notes })),
  ].sort((a, b) => b.id.localeCompare(a.id)), [expenses, income])

  const visibleRows = rows.filter((row) => {
    const matchesFilter = filter === 'All activity' || row.kind === filter
    const matchesQuery = `${row.id} ${row.label} ${row.method} ${row.reference} ${row.notes}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })
  const additionalOrders = Math.max(0, orders.length - initialOrders.length)
  const orderRevenue = 52480 + orders.slice(0, additionalOrders).reduce((total, order) => total + order.amount, 0)
  const otherIncome = income.reduce((total, entry) => total + entry.amount, 0)
  const totalExpenses = expenses.reduce((total, entry) => total + entry.amount, 0)
  const cashflowData = revenueByDay.map((day, index) => ({
    day: day.day,
    income: day.revenue,
    expenses: [17800, 20500, 23400, 22100, 19400, 21600, totalExpenses][index],
  }))

  function saveEntry(entry: EntryFormValue) {
    if (entryKind === 'Expense') {
      addExpense({ category: entry.label, amount: entry.amount, date: entry.date, method: entry.method, reference: entry.reference || '—', notes: entry.notes })
      showToast(`${entry.label} expense recorded.`)
    } else {
      addIncome({ source: entry.label, amount: entry.amount, date: entry.date, method: entry.method, notes: entry.notes })
      showToast(`${entry.label} income recorded.`)
    }
    setEntryKind(null)
  }

  function exportLedger() {
    const header = ['ID', 'Type', 'Description', 'Amount (NPR)', 'Date', 'Method', 'Reference', 'Notes']
    const csvRows = visibleRows.map((row) => [row.id, row.kind, row.label, row.amount, row.date, row.method, row.reference, row.notes])
    const csv = [header, ...csvRows].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'servepilot-finance-demo.csv'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Finance activity exported as CSV.')
  }

  return <div>
    <PageHeader eyebrow="Money & reconciliation" title="Finance" description="Keep daily sales, business expenses, and other income visible in one clear ledger." action={<div className="flex flex-wrap gap-2"><Button onClick={exportLedger} size="sm" variant="outline"><ArrowDownToLine data-icon="inline-start" /> Export CSV</Button><Button onClick={() => setEntryKind('Expense')} size="sm" variant="outline"><Plus data-icon="inline-start" /> Expense</Button><Button onClick={() => setEntryKind('Income')} size="sm"><Plus data-icon="inline-start" /> Record income</Button></div>} />

    <section aria-label="Finance summary" className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
      <MetricCard label="Net sales today" value={formatNpr(orderRevenue)} caption="Orders before tax" icon={<Wallet />} tone="teal" />
      <MetricCard label="Other income" value={formatNpr(otherIncome)} caption="Deposits and events" icon={<CreditCard />} tone="blue" />
      <MetricCard label="Recorded expenses" value={formatNpr(totalExpenses)} caption={`${expenses.length} entries this period`} icon={<ReceiptText />} tone="orange" />
      <MetricCard label="Estimated net" value={formatNpr(orderRevenue + otherIncome - totalExpenses)} caption="Sales + income − expenses" icon={<Wallet />} tone="green" />
    </section>

    <section className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
      <Panel>
        <PanelHeading title="Cash flow" detail="Daily sales and recorded operating expenses" action={<span className="rounded-md border border-border bg-white px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">Last 7 days</span>} />
        <div className="h-[260px] px-2 pb-4 pt-5 sm:px-5" role="img" aria-label="Area chart comparing daily restaurant income and operating expenses">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={cashflowData} margin={{ top: 5, right: 4, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="#e9eeeb" strokeDasharray="3 5" vertical={false} />
              <XAxis axisLine={false} dataKey="day" dy={8} tick={{ fill: '#7d8987', fontSize: 10 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7d8987', fontSize: 9 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} tickLine={false} />
              <Tooltip formatter={(value) => formatNpr(Number(value))} />
              <Area dataKey="income" fill="#dce9e6" name="Sales" stroke="#173b3f" strokeWidth={2.5} type="monotone" />
              <Area dataKey="expenses" fill="#fff1df" name="Expenses" stroke="#f28c28" strokeWidth={2} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel>
        <PanelHeading title="Payment reconciliation" detail="Methods configured for this workspace" />
        <div className="flex flex-col gap-1 px-5 pb-5 pt-4">
          {paymentMethods.slice(0, 5).map((method, index) => {
            const share = [34, 29, 22, 15, 0][index]
            return <div className="flex items-center gap-3 border-b border-border/70 py-3 last:border-0" key={method}>
              <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary"><CreditCard className="size-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{method}</span><span className="mt-1 block text-[10px] text-muted-foreground">{share}% of today&apos;s payment mix</span></span>
              <span className="numeric text-xs font-semibold">{formatNpr(Math.round(orderRevenue * share / 100))}</span>
            </div>
          })}
        </div>
      </Panel>
    </section>

    <Panel className="mt-4 overflow-hidden">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div><h2 className="text-sm font-semibold">Income & expense activity</h2><p className="mt-1 text-[10px] text-muted-foreground">Sales orders are summarized above; this ledger tracks other entries.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row"><div className="flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Filter ledger activity">{(['All activity', 'Income', 'Expense'] as const).map((item) => <button className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${filter === item ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}</div><SearchField className="w-full sm:w-[220px]" onChange={setQuery} placeholder="Search activity" value={query} /></div>
      </div>
      {visibleRows.length ? <TableScroller><table className="w-full min-w-[780px] text-left">
        <thead><tr className="border-y border-border bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-3">Activity</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Method</th><th className="px-3 py-3">Reference</th><th className="px-5 py-3 text-right">Amount</th></tr></thead>
        <tbody>{visibleRows.map((row) => <tr className="border-b border-border/70 last:border-0 hover:bg-[#fbfcfb]" key={row.id}><td className="px-5 py-3"><p className="text-xs font-semibold">{row.label}</p><p className="mt-1 text-[10px] text-muted-foreground">{row.notes || row.id}</p></td><td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${row.kind === 'Income' ? 'bg-[#e8f4ec] text-[#32734d]' : 'bg-[#fff1df] text-[#9a5118]'}`}>{row.kind}</span></td><td className="px-3 py-3 text-[10px] text-muted-foreground">{row.date}</td><td className="px-3 py-3 text-xs">{row.method}</td><td className="px-3 py-3 font-mono text-[10px] text-muted-foreground">{row.reference}</td><td className={`numeric px-5 py-3 text-right text-xs font-semibold ${row.kind === 'Income' ? 'text-success' : 'text-foreground'}`}>{row.kind === 'Income' ? '+' : '−'}{formatNpr(row.amount)}</td></tr>)}</tbody>
      </table></TableScroller> : <div className="p-5"><EmptyState title="No finance activity found" description="Try another search or add an income or expense entry." action={<Button onClick={() => { setQuery(''); setFilter('All activity') }} size="sm" variant="outline">Clear filters</Button>} /></div>}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span>{visibleRows.length} of {rows.length} ledger entries</span><span>Demo figures are held in memory for this session.</span></div>
    </Panel>

    {entryKind && <FinanceEntryModal kind={entryKind} onClose={() => setEntryKind(null)} onSave={saveEntry} />}
  </div>
}
