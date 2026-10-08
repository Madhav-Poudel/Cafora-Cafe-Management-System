'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, ChefHat, Coffee, Globe2, MapPin, Plus, Store, Utensils, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandMark } from './shared'

const steps = ['Your restaurant', 'Service style', 'Set the basics', 'Your floor', 'Your menu']
const serviceStyles = [
  { name: 'Full service', detail: 'Guests are welcomed and served at the table', icon: Utensils },
  { name: 'Quick service', detail: 'Counter service, takeaway, or fast casual', icon: Store },
  { name: 'Café & bakery', detail: 'Coffee, light meals, and a steady counter', icon: Coffee },
  { name: 'Cloud kitchen', detail: 'Delivery and pickup, built around the kitchen', icon: ChefHat },
]
const suggestedItems = ['Chicken momo', 'Nepali thali', 'Masala chai']

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [style, setStyle] = useState('Full service')
  const [restaurant, setRestaurant] = useState('')
  const [owner, setOwner] = useState('')
  const [city, setCity] = useState('Kathmandu')
  const [branch, setBranch] = useState('Main location')
  const [tableCount, setTableCount] = useState('12')
  const [menuItems, setMenuItems] = useState(suggestedItems)
  const [newItem, setNewItem] = useState('')

  function addSuggestedItem() {
    const trimmed = newItem.trim()
    if (!trimmed) return
    setMenuItems((current) => [...current, trimmed])
    setNewItem('')
  }

  async function finishSetup() {
    await fetch('/api/auth/onboarding', { method: 'POST' })
    router.push('/app/dashboard')
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="flex h-[68px] items-center justify-between border-b border-border px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Cafora home"><BrandMark /></Link>
        <p className="text-xs text-muted-foreground">Setting up your workspace <span className="px-1">·</span> <span className="font-semibold text-foreground">Step {step + 1} of {steps.length}</span></p>
        <Link href="/app/dashboard" className="text-xs font-semibold text-muted-foreground hover:text-primary">Skip setup</Link>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[240px_1fr] lg:gap-16 lg:px-12">
        <aside className="hidden lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Workspace setup</p>
          <div className="mt-6 flex flex-col gap-2">
            {steps.map((label, index) => <div key={label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${index === step ? 'bg-secondary text-primary' : index < step ? 'text-foreground' : 'text-muted-foreground'}`}><span className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold ${index < step ? 'bg-primary text-white' : index === step ? 'bg-white text-primary' : 'bg-muted text-muted-foreground'}`}>{index < step ? <Check className="size-3.5" /> : index + 1}</span><span className="text-xs font-semibold">{label}</span></div>)}
          </div>
          <div className="mt-12 rounded-xl border border-border bg-[#f7f8f6] p-4"><span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground"><Globe2 className="size-4" /></span><p className="mt-3 text-xs font-semibold">A note about this preview</p><p className="mt-2 text-[10px] leading-5 text-muted-foreground">Your setup stays in this browser session. You can explore every screen with sample restaurant data.</p></div>
        </aside>
        <section className="mx-auto w-full max-w-[720px]">
          <div className="mb-6 flex items-center gap-1.5 lg:hidden">{steps.map((label, index) => <span key={label} aria-label={`Step ${index + 1}: ${label}`} className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-primary' : 'bg-muted'}`} />)}</div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Step {step + 1} <span className="px-1">·</span> {steps[step]}</p>
          <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.055em] sm:text-[38px]">{[
            'Tell us about your restaurant.',
            'How do you like to serve?',
            'Set up the everyday details.',
            'Give your guests a place.',
            'Add a few menu favorites.',
          ][step]}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{[
            'We’ll shape your workspace around your restaurant and the people who run it.',
            'Choose the service style that feels closest. You can change it later.',
            'These details help your team start with the right defaults.',
            'Map out a simple version of your floor to make dine-in orders easier.',
            'A few dishes are all you need to start exploring the demo.',
          ][step]}</p>

          <div className="mt-8 min-h-[280px]">
            {step === 0 && <div className="grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-1.5 text-xs font-medium">Restaurant name<input value={restaurant} onChange={(event) => setRestaurant(event.target.value)} required placeholder="Juniper Table" className="h-11 rounded-lg border border-input px-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></label><label className="flex flex-col gap-1.5 text-xs font-medium">Your name<input value={owner} onChange={(event) => setOwner(event.target.value)} required placeholder="Aarya K.C." className="h-11 rounded-lg border border-input px-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></label><label className="flex flex-col gap-1.5 text-xs font-medium sm:col-span-2">City or neighborhood<span className="relative"><MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={city} onChange={(event) => setCity(event.target.value)} className="h-11 w-full rounded-lg border border-input pl-9 pr-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></span></label></div>}
            {step === 1 && <div className="grid gap-3 sm:grid-cols-2">{serviceStyles.map(({ name, detail, icon: Icon }) => <button type="button" key={name} onClick={() => setStyle(name)} className={`flex min-h-28 items-start gap-3 rounded-xl border p-4 text-left transition-colors ${style === name ? 'border-primary bg-[#f2f7f5] ring-1 ring-primary/15' : 'border-border hover:bg-muted/60'}`}><span className={`grid size-9 shrink-0 place-items-center rounded-lg ${style === name ? 'bg-primary text-white' : 'bg-secondary text-primary'}`}><Icon className="size-4" /></span><span><span className="block text-sm font-semibold">{name}</span><span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{detail}</span></span>{style === name && <Check className="ml-auto size-4 shrink-0 text-primary" />}</button>)}</div>}
            {step === 2 && <div className="grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-1.5 text-xs font-medium">Location name<input value={branch} onChange={(event) => setBranch(event.target.value)} className="h-11 rounded-lg border border-input px-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></label><label className="flex flex-col gap-1.5 text-xs font-medium">Currency<select defaultValue="NPR" className="h-11 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-primary/45"><option value="NPR">NPR — Nepalese rupee</option><option value="INR">INR — Indian rupee</option><option value="USD">USD — US dollar</option></select></label><label className="flex flex-col gap-1.5 text-xs font-medium">Tax rate<input type="number" defaultValue="13" min="0" max="100" className="h-11 rounded-lg border border-input px-3 text-sm outline-none focus:border-primary/45" /></label><div className="flex flex-col gap-1.5 text-xs font-medium">Restaurant type<div className="flex h-11 items-center gap-2 rounded-lg border border-border bg-[#f7f8f6] px-3 text-sm font-normal text-foreground"><Utensils className="size-4 text-muted-foreground" />{style}</div></div></div>}
            {step === 3 && <div><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-semibold">Tables at {branch || 'your location'}</p><p className="mt-1 text-xs text-muted-foreground">Add a starting count. You can edit every table later.</p></div><label className="flex w-28 flex-col gap-1 text-[10px] font-medium">Table count<input type="number" min="1" max="100" value={tableCount} onChange={(event) => setTableCount(event.target.value)} className="h-10 rounded-lg border border-input px-3 text-sm outline-none focus:border-primary/45" /></label></div><div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">{Array.from({ length: Math.min(12, Number(tableCount) || 1) }, (_, index) => <div key={index} className="flex min-h-[82px] flex-col items-center justify-center rounded-xl border border-border bg-white"><span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary"><Utensils className="size-4" /></span><span className="mt-2 text-[10px] font-semibold">T-{String(index + 1).padStart(2, '0')}</span><span className="mt-0.5 text-[9px] text-muted-foreground">4 seats</span></div>)}</div></div>}
            {step === 4 && <div><div className="flex flex-col gap-3">{menuItems.map((item, index) => <div key={`${item}-${index}`} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"><span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground"><Utensils className="size-4" /></span><span className="flex-1 text-sm font-medium">{item}</span><span className="text-[10px] text-muted-foreground">Starter item</span><button type="button" aria-label={`Remove ${item}`} onClick={() => setMenuItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"><X className="size-4" /></button></div>)}</div><div className="mt-4 flex gap-2"><input value={newItem} onChange={(event) => setNewItem(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); addSuggestedItem() } }} placeholder="Add a dish" className="h-11 min-w-0 flex-1 rounded-lg border border-input px-3 text-sm outline-none focus:border-primary/45" /><Button type="button" variant="outline" onClick={addSuggestedItem}><Plus data-icon="inline-start" />Add item</Button></div></div>}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5"><Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft data-icon="inline-start" />Back</Button>{step < steps.length - 1 ? <Button type="button" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Continue<ArrowRight data-icon="inline-end" /></Button> : <Button type="button" onClick={finishSetup}>Open workspace<ArrowRight data-icon="inline-end" /></Button>}</div>
          <p className="mt-5 text-center text-[10px] text-muted-foreground">Demo only — these details are not saved to an account.</p>
        </section>
      </div>
    </main>
  )
}
