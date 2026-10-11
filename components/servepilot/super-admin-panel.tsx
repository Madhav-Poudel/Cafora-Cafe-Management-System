'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, Users, CreditCard, TrendingUp, LogOut, CheckCircle2 } from 'lucide-react'
import { BrandMark, MetricCard, Panel, PanelHeading } from './shared'

type Plan = 'Free' | 'Starter' | 'Growth' | 'Pro'
type Status = 'Active' | 'Trial' | 'Past due' | 'Cancelled'
type AdminUser = {
  name: string
  restaurant: string
  email: string
  onboardingCompleted: boolean
  subscription: { plan: Plan; status: Status; renewsAt?: string }
}

export function SuperAdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [savingEmail, setSavingEmail] = useState('')

  useEffect(() => {
    fetch('/api/super-admin')
      .then(async (response) => {
        if (response.status === 403) {
          window.location.href = '/login?next=/super-admin&error=admin'
          return null
        }
        if (!response.ok) throw new Error('Unable to load admin data')
        return response.json()
      })
      .then((result) => {
        if (result) setUsers(result.users)
      })
      .catch(() => setMessage('Could not load subscription data. Please refresh and try again.'))
      .finally(() => setLoading(false))
  }, [])

  const activeSubscriptions = users.filter((user) => user.subscription.status === 'Active' && user.subscription.plan !== 'Free').length
  const paidRevenue = users.reduce((total, user) => total + (user.subscription.plan === 'Pro' ? 49 : user.subscription.plan === 'Growth' ? 29 : user.subscription.plan === 'Starter' ? 15 : 0), 0)
  const onboarded = users.filter((user) => user.onboardingCompleted).length

  async function updateSubscription(email: string, plan: Plan, status: Status) {
    setSavingEmail(email)
    setMessage('')
    const response = await fetch('/api/super-admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan, status }),
    })
    if (!response.ok) {
      setMessage('Could not save this subscription.')
      setSavingEmail('')
      return
    }
    setUsers((current) => current.map((user) => user.email === email ? { ...user, subscription: { ...user.subscription, plan, status } } : user))
    setMessage('Subscription updated successfully.')
    setSavingEmail('')
  }

  const planSummary = useMemo(() => ['Free', 'Starter', 'Growth', 'Pro'].map((plan) => ({ plan, count: users.filter((user) => user.subscription.plan === plan).length })), [users])

  return (
    <main className="min-h-screen bg-[#f7f8f8] text-foreground">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4"><BrandMark /><span className="hidden rounded-full bg-[#fff1f3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary sm:inline-flex">Super Admin</span></div>
          <button type="button" onClick={() => { fetch('/api/auth/logout', { method: 'POST' }).then(() => { window.location.href = '/login' }) }} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><LogOut className="size-4" /> Sign out</button>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Cafora control centre</p><h1 className="text-3xl font-semibold tracking-[-0.05em]">Subscriptions</h1><p className="mt-2 text-sm text-muted-foreground">Manage every Cafora workspace from one secure place.</p></div>
          <span className="hidden items-center gap-2 rounded-full border border-[#cce2d2] bg-[#f2faf4] px-3 py-2 text-xs font-semibold text-[#32734d] sm:inline-flex"><ShieldCheck className="size-4" /> Owner access only</span>
        </div>
        {message && <div role="status" className="mb-5 rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground">{message}</div>}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total workspaces" value={loading ? '-' : String(users.length)} caption="Registered accounts" icon={<Users className="size-4" />} />
          <MetricCard label="Paid subscriptions" value={loading ? '-' : String(activeSubscriptions)} caption="Active paid plans" icon={<CreditCard className="size-4" />} tone="orange" />
          <MetricCard label="Monthly run rate" value={loading ? '-' : `$${paidRevenue}`} caption="Based on current plans" icon={<TrendingUp className="size-4" />} tone="green" />
          <MetricCard label="Onboarded" value={loading ? '-' : String(onboarded)} caption="Workspaces ready to serve" icon={<CheckCircle2 className="size-4" />} tone="blue" />
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
          <Panel className="overflow-hidden">
            <PanelHeading title="All workspaces" detail="Change a plan or billing status and it is saved instantly." />
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs"><thead className="border-y border-border bg-muted/50 text-[10px] uppercase tracking-[0.1em] text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">Workspace</th><th className="px-5 py-3 font-semibold">Owner</th><th className="px-5 py-3 font-semibold">Plan</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Action</th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Loading workspaces…</td></tr> : users.map((user) => <tr key={user.email} className="border-b border-border last:border-0"><td className="px-5 py-4"><p className="font-semibold">{user.restaurant}</p><p className="mt-1 text-[10px] text-muted-foreground">{user.name}</p></td><td className="px-5 py-4 text-muted-foreground">{user.email}</td><td className="px-5 py-4"><select value={user.subscription.plan} onChange={(event) => updateSubscription(user.email, event.target.value as Plan, user.subscription.status)} className="rounded-lg border border-input bg-white px-2.5 py-2 outline-none focus:border-primary">{['Free', 'Starter', 'Growth', 'Pro'].map((plan) => <option key={plan}>{plan}</option>)}</select></td><td className="px-5 py-4"><select value={user.subscription.status} onChange={(event) => updateSubscription(user.email, user.subscription.plan, event.target.value as Status)} className="rounded-lg border border-input bg-white px-2.5 py-2 outline-none focus:border-primary">{['Active', 'Trial', 'Past due', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-5 py-4 text-muted-foreground">{savingEmail === user.email ? 'Saving…' : 'Saved automatically'}</td></tr>)}</tbody></table>
            </div>
          </Panel>
          <Panel className="p-5"><PanelHeading title="Plan mix" detail="Current distribution" /><div className="mt-5 space-y-4">{planSummary.map(({ plan, count }) => <div key={plan}><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium">{plan}</span><span className="text-muted-foreground">{count}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: users.length ? `${Math.max(4, count / users.length * 100)}%` : '0%' }} /></div></div>)}</div></Panel>
        </div>
      </div>
    </main>
  )
}
