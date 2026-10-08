'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, BarChart3, Boxes, Check, ChefHat, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandMark } from './shared'

export type AuthMode = 'login' | 'signup' | 'forgot' | 'verify'

const proofPoints = [
  { icon: BarChart3, title: 'The numbers make sense', text: 'Sales and costs in one clear daily picture.' },
  { icon: ChefHat, title: 'The team stays in sync', text: 'Orders move from the floor to the kitchen.' },
  { icon: Boxes, title: 'Fewer last-minute surprises', text: 'Know what is running low before service.' },
]

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'
  const isVerify = mode === 'verify'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setIsSubmitting(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    if (mode === 'login') {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        setNotice(result?.error ?? 'Unable to sign in right now. Please try again.')
        setIsSubmitting(false)
        return
      }
      const result = await response.json()
      router.push(result.user?.onboardingCompleted ? '/app/dashboard' : '/onboarding')
      return
    }
    if (mode === 'signup') {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? '').trim(),
          restaurant: String(form.get('restaurant') ?? '').trim(),
          email,
          phone: String(form.get('phone') ?? '').trim(),
          password,
        }),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        setNotice(result?.error ?? 'Unable to create your workspace right now.')
        setIsSubmitting(false)
        return
      }
      router.push('/login?created=1')
      return
    }
    setIsComplete(true)
    setIsSubmitting(false)
  }

  const heading = isSignup ? 'Create your workspace' : isForgot ? 'Reset your password' : isVerify ? 'Check your inbox' : 'Welcome back'
  const subheading = isSignup
    ? 'Start with a few details. You can set up the rest as you go.'
    : isForgot
      ? 'Enter the email address on your account and we’ll send a reset link.'
      : isVerify
        ? 'We’ve sent a sign-in link to your email address.'
        : 'Sign in to pick up where your team left off.'

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-primary px-10 py-9 text-white lg:flex xl:px-14">
        <div className="absolute right-[-120px] top-[22%] size-[360px] rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute right-[-70px] top-[29%] size-[250px] rounded-full border border-white/10" aria-hidden="true" />
        <div className="relative z-10">
          <Link href="/" aria-label="Cafora home" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white p-1"><BrandMark compact /></span>
            <span className="text-lg font-semibold tracking-[-0.04em]">Cafora</span>
          </Link>
          <div className="mt-24 max-w-lg">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#f7bd76]">The calm behind a great service</p>
            <h1 className="mt-4 text-[43px] font-semibold leading-[1.04] tracking-[-0.06em] xl:text-[52px]">A clearer day starts with one shared view.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">Cafora brings orders, kitchen, stock, and people together so your team can focus on the moments that matter.</p>
          </div>
          <div className="mt-12 flex max-w-lg flex-col gap-3">
            {proofPoints.map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3.5"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-[#f7bd76]"><Icon className="size-4" /></span><span><span className="block text-xs font-semibold">{title}</span><span className="mt-1 block text-[10px] text-white/60">{text}</span></span><Check className="ml-auto size-4 text-[#93c8a3]" aria-hidden="true" /></div>)}
          </div>
        </div>
        <p className="relative z-10 text-[10px] text-white/55">Made with care in Kathmandu <span className="px-1">·</span> Cafora Technologies Pvt. Ltd.</p>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-10 xl:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Cafora home" className="lg:hidden"><BrandMark /></Link>
          <Link href="/" aria-label="Back to website" className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="size-3.5" /> Back to website</Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[420px]">
            {!isVerify && <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-[#f7f8f6] px-3 py-1.5 text-[10px] font-medium text-muted-foreground"><span className="size-1.5 rounded-full bg-success" /> Demo workspace available <Link href="/app/dashboard" className="ml-1 font-semibold text-primary">Open demo <ArrowRight className="inline size-3" /></Link></div>}
            <h2 className="text-[31px] font-semibold tracking-[-0.05em]">{heading}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{subheading}</p>

            {isVerify ? (
              <div className="mt-8 rounded-xl border border-border bg-[#f7f8f6] p-5">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><ShieldCheck className="size-5" /></span>
                <p className="mt-4 text-sm font-semibold">One quick step</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Open the message from Cafora and follow its link to continue. This preview does not send real email.</p>
                <Link href="/login" className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white hover:bg-brand-800">Back to sign in</Link>
              </div>
            ) : (
              <form className="mt-7 flex flex-col gap-4" onSubmit={handleSubmit}>
                {isSignup && <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-xs font-medium">Your name<input name="name" type="text" autoComplete="name" required placeholder="Aarya K.C." className="h-11 rounded-lg border border-input bg-white px-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></label>
                  <label className="flex flex-col gap-1.5 text-xs font-medium">Restaurant name<input name="restaurant" type="text" required placeholder="Juniper Table" className="h-11 rounded-lg border border-input bg-white px-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></label>
                </div>}
                <label className="flex flex-col gap-1.5 text-xs font-medium">Work email<input name="email" type="email" autoComplete="email" required placeholder="you@restaurant.com" className="h-11 rounded-lg border border-input bg-white px-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></label>
                {isSignup && <label className="flex flex-col gap-1.5 text-xs font-medium">Phone number <span className="font-normal text-muted-foreground">Optional</span><input name="phone" type="tel" autoComplete="tel" placeholder="+977 980 000 0000" className="h-11 rounded-lg border border-input bg-white px-3 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /></label>}
                {!isForgot && <label className="flex flex-col gap-1.5 text-xs font-medium">Password<div className="relative"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={8} required placeholder="At least 8 characters" className="h-11 w-full rounded-lg border border-input bg-white px-3 pr-11 text-sm font-normal outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>}
                {mode === 'login' && <div className="flex items-center justify-between text-xs"><label className="inline-flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="size-3.5 rounded border-border accent-primary" /> Remember me</label><Link href="/forgot-password" className="font-semibold text-primary">Forgot password?</Link></div>}
                {isSignup && <label className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground"><input type="checkbox" required className="mt-1 size-3.5 shrink-0 rounded border-border accent-primary" />I agree to the <Link href="/terms" className="font-semibold text-primary">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-primary">Privacy Policy</Link>.</label>}
                {notice && <p aria-live="polite" className="rounded-lg border border-[#f1d7b7] bg-accent px-3 py-2.5 text-xs leading-5 text-accent-foreground">{notice}</p>}
                {isComplete && <p role="status" className="rounded-lg border border-[#cce2d2] bg-[#e8f4ec] px-3 py-2.5 text-xs leading-5 text-[#32734d]">Demo mode: no email was sent. You can continue into the sample workspace.</p>}
                <Button className="mt-1 h-11 w-full" disabled={isSubmitting} type="submit" size="lg">{isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : isForgot ? isComplete ? 'Send another link' : 'Send reset link' : 'Sign in'} {!isSubmitting && <ArrowRight data-icon="inline-end" />}</Button>
                {isSignup ? <p className="text-center text-xs text-muted-foreground">Already have a workspace? <Link href="/login" className="font-semibold text-primary">Sign in</Link></p> : mode === 'login' ? <p className="text-center text-xs text-muted-foreground">New to Cafora? <Link href="/signup" className="font-semibold text-primary">Sign up</Link></p> : <Link href="/login" className="text-center text-xs font-semibold text-primary">Return to sign in</Link>}
              </form>
            )}
            <p className="mt-8 border-t border-border pt-5 text-center text-[10px] leading-5 text-muted-foreground">Your account is handled by the Cafora Node.js backend. MongoDB persistence can be added later.</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>© 2026 Cafora</span><span>Privacy <span className="px-1">·</span> Terms <span className="px-1">·</span> Help</span></div>
      </section>
    </main>
  )
}
