'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import {
  Bell,
  Building2,
  Check,
  CreditCard,
  Printer,
  QrCode,
  Settings2,
  ShieldCheck,
  Store,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from './demo-store'
import { branches, paymentMethods } from './data'
import { LabeledField, PageHeader, Panel, StatusBadge, controlClassName } from './shared'

const sections = [
  { label: 'Restaurant profile', icon: Store },
  { label: 'Branch settings', icon: Building2 },
  { label: 'Business settings', icon: Settings2 },
  { label: 'Tax settings', icon: Wallet },
  { label: 'Invoice settings', icon: CreditCard },
  { label: 'Payment methods', icon: CreditCard },
  { label: 'Notifications', icon: Bell },
  { label: 'Roles & permissions', icon: Users },
  { label: 'Printer settings', icon: Printer },
  { label: 'QR menu settings', icon: QrCode },
  { label: 'Subscription', icon: Wallet },
  { label: 'Security', icon: ShieldCheck },
] as const

type SectionName = (typeof sections)[number]['label']

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-border/70 py-4 last:border-0">
    <span className="min-w-0"><span className="block text-xs font-semibold">{title}</span><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{description}</span></span>
    <input checked={checked} className="size-4 shrink-0 accent-primary" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
  </label>
}

export function SettingsView() {
  const { branch, setBranch, showToast } = useDemoStore()
  const [activeSection, setActiveSection] = useState<SectionName>('Restaurant profile')
  const [profile, setProfile] = useState({ name: 'Thamel Kitchen', businessType: 'Restaurant', phone: '+977 1-452 2800', email: 'hello@thamelkitchen.example', address: 'Thamel, Kathmandu, Nepal' })
  const [business, setBusiness] = useState({ currency: 'NPR — Nepalese Rupee', timezone: 'Asia/Kathmandu', dateFormat: 'DD MMM YYYY', language: 'English' })
  const [taxRate, setTaxRate] = useState('13')
  const [taxInclusive, setTaxInclusive] = useState(false)
  const [invoicePrefix, setInvoicePrefix] = useState('SP')
  const [invoiceNote, setInvoiceNote] = useState('Thank you for dining with us.')
  const [methods, setMethods] = useState<Record<string, boolean>>({ Cash: true, Card: true, eSewa: true, Khalti: true, Bank: false, Other: false })
  const [notifications, setNotifications] = useState({ orders: true, stock: true, purchases: true, staff: false, dailySummary: true })
  const [qrShowPrices, setQrShowPrices] = useState(true)
  const [qrAllowRequests, setQrAllowRequests] = useState(true)
  const [printerName, setPrinterName] = useState('Front counter receipt printer')
  const [securityAlerts, setSecurityAlerts] = useState(true)

  function save(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    showToast(`${activeSection} updated in this demo workspace.`)
  }

  function renderSection(): ReactNode {
    if (activeSection === 'Restaurant profile') return <form className="grid gap-4 sm:grid-cols-2" onSubmit={save}>
      <LabeledField htmlFor="profile-name" label="Restaurant name"><input className={controlClassName} id="profile-name" onChange={(event) => setProfile({ ...profile, name: event.target.value })} required value={profile.name} /></LabeledField>
      <LabeledField htmlFor="profile-type" label="Business type"><select className={controlClassName} id="profile-type" onChange={(event) => setProfile({ ...profile, businessType: event.target.value })} value={profile.businessType}>{['Restaurant', 'Cafe', 'Cloud kitchen', 'Bakery', 'Fast food', 'Bar & lounge'].map((item) => <option key={item}>{item}</option>)}</select></LabeledField>
      <LabeledField htmlFor="profile-phone" label="Phone"><input className={controlClassName} id="profile-phone" onChange={(event) => setProfile({ ...profile, phone: event.target.value })} type="tel" value={profile.phone} /></LabeledField>
      <LabeledField htmlFor="profile-email" label="Business email"><input className={controlClassName} id="profile-email" onChange={(event) => setProfile({ ...profile, email: event.target.value })} type="email" value={profile.email} /></LabeledField>
      <div className="sm:col-span-2"><LabeledField htmlFor="profile-address" label="Address"><input className={controlClassName} id="profile-address" onChange={(event) => setProfile({ ...profile, address: event.target.value })} value={profile.address} /></LabeledField></div>
      <div className="sm:col-span-2 flex justify-end border-t border-border pt-4"><Button type="submit"><Check data-icon="inline-start" /> Save profile</Button></div>
    </form>

    if (activeSection === 'Branch settings') return <div>
      <div className="mb-4 rounded-lg bg-[#f7f8f6] p-4"><p className="text-xs font-semibold">Selected location</p><p className="mt-1 text-[10px] text-muted-foreground">Switch the workspace view to manage another location.</p><select aria-label="Selected branch" className={`${controlClassName} mt-3 max-w-sm`} onChange={(event) => { setBranch(event.target.value); showToast(`Viewing ${event.target.value}.`) }} value={branch}>{branches.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="divide-y divide-border">{branches.filter((item) => item !== 'All branches').map((item, index) => <div className="flex flex-wrap items-center justify-between gap-3 py-4" key={item}><div><p className="text-xs font-semibold">{item}</p><p className="mt-1 text-[10px] text-muted-foreground">{index === 0 ? 'Current location · Kathmandu' : 'Demo location · Nepal'}</p></div><div className="flex items-center gap-2"><StatusBadge status={item === branch ? 'Active' : 'Available'} /><Button onClick={() => { setBranch(item); showToast(`Viewing ${item}.`) }} size="sm" variant="outline">Open branch</Button></div></div>)}</div>
    </div>

    if (activeSection === 'Business settings') return <form className="grid gap-4 sm:grid-cols-2" onSubmit={save}>
      <LabeledField htmlFor="business-currency" label="Currency"><select className={controlClassName} id="business-currency" onChange={(event) => setBusiness({ ...business, currency: event.target.value })} value={business.currency}><option>NPR — Nepalese Rupee</option><option>USD — US Dollar</option><option>INR — Indian Rupee</option></select></LabeledField>
      <LabeledField htmlFor="business-timezone" label="Time zone"><select className={controlClassName} id="business-timezone" onChange={(event) => setBusiness({ ...business, timezone: event.target.value })} value={business.timezone}><option>Asia/Kathmandu</option><option>Asia/Kolkata</option><option>UTC</option></select></LabeledField>
      <LabeledField htmlFor="business-date" label="Date format"><select className={controlClassName} id="business-date" onChange={(event) => setBusiness({ ...business, dateFormat: event.target.value })} value={business.dateFormat}><option>DD MMM YYYY</option><option>YYYY-MM-DD</option><option>MM/DD/YYYY</option></select></LabeledField>
      <LabeledField htmlFor="business-language" label="Workspace language"><select className={controlClassName} id="business-language" onChange={(event) => setBusiness({ ...business, language: event.target.value })} value={business.language}><option>English</option><option>Nepali</option></select></LabeledField>
      <div className="sm:col-span-2 flex justify-end border-t border-border pt-4"><Button type="submit">Save business settings</Button></div>
    </form>

    if (activeSection === 'Tax settings') return <form className="flex flex-col gap-4" onSubmit={save}>
      <LabeledField htmlFor="tax-rate" label="Default VAT rate"><select className={controlClassName} id="tax-rate" onChange={(event) => setTaxRate(event.target.value)} value={taxRate}><option value="13">13% VAT</option><option value="10">10% tax</option><option value="0">Tax exempt</option></select></LabeledField>
      <PreferenceRow checked={taxInclusive} description="Treat menu prices as VAT-inclusive at checkout." onChange={setTaxInclusive} title="Prices include tax" />
      <div className="rounded-lg border border-border bg-[#fbfcfb] p-3 text-[10px] leading-5 text-muted-foreground">Tax settings apply to new point-of-sale tickets in this demo. Existing orders keep their recorded total.</div>
      <div className="flex justify-end border-t border-border pt-4"><Button type="submit">Save tax settings</Button></div>
    </form>

    if (activeSection === 'Invoice settings') return <form className="flex flex-col gap-4" onSubmit={save}>
      <LabeledField htmlFor="invoice-prefix" label="Invoice number prefix"><input className={controlClassName} id="invoice-prefix" maxLength={8} onChange={(event) => setInvoicePrefix(event.target.value.toUpperCase())} value={invoicePrefix} /></LabeledField>
      <LabeledField htmlFor="invoice-note" label="Footer message"><textarea className={`${controlClassName} min-h-20 resize-y py-2`} id="invoice-note" maxLength={120} onChange={(event) => setInvoiceNote(event.target.value)} value={invoiceNote} /></LabeledField>
      <div className="rounded-lg bg-[#f7f8f6] p-4"><p className="text-[10px] font-medium text-muted-foreground">Invoice preview</p><p className="mt-2 text-sm font-semibold">{invoicePrefix || 'SP'}-2026-002489</p><p className="mt-1 text-[10px] text-muted-foreground">{invoiceNote}</p></div>
      <div className="flex justify-end border-t border-border pt-4"><Button type="submit">Save invoice settings</Button></div>
    </form>

    if (activeSection === 'Payment methods') return <div>
      <p className="mb-2 text-xs text-muted-foreground">Choose which payment options appear in the point-of-sale checkout.</p>
      <div className="divide-y divide-border">{paymentMethods.map((method) => <PreferenceRow checked={methods[method] ?? false} description={`Show ${method} at checkout. Demo mode never collects a real payment.`} key={method} onChange={(checked) => setMethods({ ...methods, [method]: checked })} title={method} />)}</div>
      <div className="mt-4 flex justify-end border-t border-border pt-4"><Button onClick={() => showToast('Payment method preferences saved in demo mode.')}>Save payment methods</Button></div>
    </div>

    if (activeSection === 'Notifications') return <div>
      <p className="mb-2 text-xs text-muted-foreground">Choose the workspace events you want highlighted.</p>
      <div className="divide-y divide-border">
        <PreferenceRow checked={notifications.orders} description="New orders and changes to active tickets." onChange={(checked) => setNotifications({ ...notifications, orders: checked })} title="Order activity" />
        <PreferenceRow checked={notifications.stock} description="Low stock and out-of-stock ingredients." onChange={(checked) => setNotifications({ ...notifications, stock: checked })} title="Inventory alerts" />
        <PreferenceRow checked={notifications.purchases} description="Purchase orders received or awaiting delivery." onChange={(checked) => setNotifications({ ...notifications, purchases: checked })} title="Purchasing updates" />
        <PreferenceRow checked={notifications.staff} description="Clock-ins, breaks, and staff changes." onChange={(checked) => setNotifications({ ...notifications, staff: checked })} title="Staff activity" />
        <PreferenceRow checked={notifications.dailySummary} description="A daily summary of branch sales and service." onChange={(checked) => setNotifications({ ...notifications, dailySummary: checked })} title="Daily summary" />
      </div>
      <div className="mt-4 flex justify-end border-t border-border pt-4"><Button onClick={() => showToast('Notification preferences saved in demo mode.')}>Save preferences</Button></div>
    </div>

    if (activeSection === 'Roles & permissions') return <div>
      <div className="grid gap-3 sm:grid-cols-2">{['Owner', 'Manager', 'Cashier', 'Kitchen Staff'].map((role, index) => <div className="rounded-xl border border-border p-4" key={role}><div className="flex items-center justify-between gap-3"><h3 className="text-xs font-semibold">{role}</h3><StatusBadge status={index === 0 ? 'Full access' : 'Configured'} /></div><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{['Restaurant-wide access and account control.', 'Daily operations, staff and approvals.', 'Orders, payments and customer lookup.', 'Kitchen tickets and preparation status.'][index]}</p></div>)}</div>
      <Link className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline" href="/app/staff/roles">Manage permission matrix <Users className="size-3.5" /></Link>
    </div>

    if (activeSection === 'Printer settings') return <div className="flex flex-col gap-4">
      <LabeledField htmlFor="printer-name" label="Receipt printer"><input className={controlClassName} id="printer-name" onChange={(event) => setPrinterName(event.target.value)} value={printerName} /></LabeledField>
      <div className="rounded-lg bg-[#f7f8f6] p-4"><p className="text-xs font-semibold">Connection status</p><p className="mt-1 text-[10px] text-muted-foreground">Demo printer · Not connected to a physical device</p></div>
      <div className="flex flex-wrap gap-2"><Button onClick={() => showToast(`Test receipt sent to ${printerName || 'demo printer'}.`)} variant="outline"><Printer data-icon="inline-start" /> Test receipt</Button><Button onClick={() => showToast('Printer settings saved in demo mode.')}>Save printer</Button></div>
    </div>

    if (activeSection === 'QR menu settings') return <div>
      <div className="divide-y divide-border"><PreferenceRow checked={qrShowPrices} description="Display item prices to guests browsing the QR menu." onChange={setQrShowPrices} title="Show item prices" /><PreferenceRow checked={qrAllowRequests} description="Allow a guest to send a table order from the public menu demo." onChange={setQrAllowRequests} title="Allow order requests" /></div>
      <div className="mt-4 rounded-lg border border-border bg-[#fbfcfb] p-4"><p className="text-xs font-semibold">Guest menu address</p><p className="mt-1 break-all text-[10px] text-muted-foreground">/menu/T-01</p><Link className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline" href="/app/menu/qr">Manage QR menu <QrCode className="size-3.5" /></Link></div>
      <div className="mt-4 flex justify-end border-t border-border pt-4"><Button onClick={() => showToast('QR menu settings saved in demo mode.')}>Save QR settings</Button></div>
    </div>

    if (activeSection === 'Subscription') return <div className="rounded-2xl border border-border bg-[#f7f8f6] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">Current plan</p><h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Pilot demo</h3><p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">A sample workspace with the core restaurant operations screens enabled. No billing is configured in this demo.</p></div><StatusBadge status="Active" /></div>
      <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">{[['Locations', '4 demo branches'], ['Team seats', 'Unlimited sample users'], ['Renewal', 'No payment method']].map(([label, value]) => <div key={label}><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-xs font-semibold">{value}</p></div>)}</div>
      <Button className="mt-5" onClick={() => showToast('Plan changes are not available in demo mode.')} variant="outline">View plan options</Button>
    </div>

    return <div>
      <div className="rounded-xl border border-border p-4"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><ShieldCheck className="size-4" /></span><div><h3 className="text-xs font-semibold">Workspace security</h3><p className="mt-1 text-[10px] leading-4 text-muted-foreground">This demo uses a sample owner profile. Authentication and session controls are not connected to a live account.</p></div></div></div>
      <div className="mt-3 divide-y divide-border"><PreferenceRow checked={securityAlerts} description="Show an in-app notice when workspace security preferences change." onChange={setSecurityAlerts} title="Security activity alerts" /></div>
      <Button className="mt-4" onClick={() => showToast('Security preferences saved in demo mode.')}>Save security settings</Button>
    </div>
  }

  const sectionDescription: Record<SectionName, string> = {
    'Restaurant profile': 'Business identity and contact details.',
    'Branch settings': 'Locations and branch-specific workspace views.',
    'Business settings': 'Currency, language, time zone, and date format.',
    'Tax settings': 'Default tax behavior for new sales.',
    'Invoice settings': 'Receipt numbering and guest-facing invoice notes.',
    'Payment methods': 'Payment options visible at checkout.',
    'Notifications': 'Operational updates for this workspace.',
    'Roles & permissions': 'Staff roles and access boundaries.',
    'Printer settings': 'Receipt printer preferences and test output.',
    'QR menu settings': 'Guest-facing menu display and ordering options.',
    'Subscription': 'Demo plan and workspace capacity.',
    'Security': 'Account and in-app security preferences.',
  }

  return <div>
    <PageHeader eyebrow="Workspace preferences" title="Settings" description="Configure how Cafora fits your restaurant and your team." />
    <div className="grid items-start gap-4 lg:grid-cols-[235px_minmax(0,1fr)]">
      <Panel className="p-2">
        <nav aria-label="Settings sections" className="subtle-scrollbar flex gap-1 overflow-x-auto lg:flex-col lg:overflow-x-visible">
          {sections.map(({ label, icon: Icon }) => <button aria-current={activeSection === label ? 'page' : undefined} className={`flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 text-left text-xs font-medium transition-colors ${activeSection === label ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} key={label} onClick={() => setActiveSection(label)} type="button"><Icon className="size-4 shrink-0" />{label}</button>)}
        </nav>
      </Panel>
      <Panel className="min-h-[410px] p-4 sm:p-6">
        <div className="mb-5 border-b border-border pb-4"><h2 className="text-base font-semibold">{activeSection}</h2><p className="mt-1 text-xs text-muted-foreground">{sectionDescription[activeSection]}</p></div>
        {renderSection()}
      </Panel>
    </div>
  </div>
}
