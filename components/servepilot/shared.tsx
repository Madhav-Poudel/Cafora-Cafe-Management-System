import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, ChevronDown, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <span className="relative block size-[18px]" aria-hidden="true">
          <span className="absolute left-0 top-0 size-2.5 rounded-[3px] bg-white" />
          <span className="absolute bottom-0 right-0 size-2.5 rounded-[3px] bg-brand-orange" />
          <span className="absolute right-0 top-0 size-1.5 rounded-full border border-white/80" />
          <span className="absolute bottom-0 left-0 size-1.5 rounded-full border border-white/80" />
        </span>
      </span>
      {!compact && (
        <span className="text-[18px] font-semibold tracking-[-0.04em] text-foreground">
          Serve<span className="font-normal text-muted-foreground">Pilot</span>
        </span>
      )}
    </span>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.045em] text-foreground sm:text-[29px]">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}

export function Panel({
  children,
  className,
  as: Component = 'section',
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
}) {
  return <Component className={cn('panel min-w-0', className)}>{children}</Component>
}

export function PanelHeading({
  title,
  detail,
  action,
}: {
  title: string
  detail?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="min-w-0">
        <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
        {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function MetricCard({
  label,
  value,
  change,
  caption,
  icon,
  tone = 'teal',
}: {
  label: string
  value: string
  change?: string
  caption?: string
  icon?: ReactNode
  tone?: 'teal' | 'orange' | 'blue' | 'green'
}) {
  const toneClass = {
    teal: 'bg-secondary text-primary',
    orange: 'bg-accent text-accent-foreground',
    blue: 'bg-[#edf2ff] text-info',
    green: 'bg-[#e8f4ec] text-success',
  }[tone]

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="numeric mt-2 text-[23px] font-semibold leading-none tracking-[-0.045em] text-foreground sm:text-[25px]">
            {value}
          </p>
        </div>
        {icon && <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', toneClass)}>{icon}</span>}
      </div>
      {(change || caption) && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px]">
          {change && (
            <span className={cn('inline-flex items-center gap-0.5 font-semibold', change.startsWith('-') ? 'text-destructive' : 'text-success')}>
              {change.startsWith('-') ? <ArrowDownRight aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
              {change.replace('-', '')}
            </span>
          )}
          {caption && <span className="text-muted-foreground">{caption}</span>}
        </div>
      )}
    </Panel>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const className =
    normalized.includes('paid') || normalized === 'completed' || normalized === 'available' || normalized === 'active'
      ? 'bg-[#e8f4ec] text-[#32734d]'
      : normalized.includes('pending') || normalized.includes('new') || normalized.includes('reserved') || normalized.includes('ordered')
        ? 'bg-[#fff1df] text-[#9a5118]'
        : normalized.includes('prepar') || normalized.includes('ready') || normalized.includes('shift')
          ? 'bg-[#edf2ff] text-[#3b62c7]'
          : normalized.includes('cancel') || normalized.includes('out') || normalized.includes('refunded') || normalized.includes('hold')
            ? 'bg-[#fceceb] text-[#ad4541]'
            : normalized.includes('clean') || normalized.includes('break')
              ? 'bg-[#f0f3f1] text-[#68737a]'
              : 'bg-secondary text-secondary-foreground'

  return (
    <span className={cn('inline-flex max-w-full items-center rounded-md px-2 py-1 text-[10px] font-semibold leading-none', className)}>
      {status}
    </span>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search',
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <label className={cn('flex h-10 min-w-0 items-center gap-2.5 rounded-lg border border-border bg-white px-3 text-muted-foreground transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10', className)}>
      <Search className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
      />
    </label>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  className?: string
}) {
  return (
    <label className={cn('relative flex min-w-0 items-center', className)}>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-border bg-white py-2 pl-3 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" aria-hidden="true" />
    </label>
  )
}

export function Modal({
  title,
  description,
  onClose,
  children,
  size = 'md',
}: {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const titleId = `dialog-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const sizeClass = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#101719]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}
      onKeyDown={(event) => { if (event.key === 'Escape') onClose() }}
      role="presentation"
    >
      <section aria-labelledby={titleId} aria-modal="true" className={cn('max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-white shadow-xl sm:rounded-2xl', sizeClass)} role="dialog">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-[-0.03em] text-foreground">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <Button aria-label="Close dialog" className="shrink-0" onClick={onClose} size="icon-sm" variant="ghost">
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </section>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 py-8 text-center">
      <span className="mb-3 grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Search aria-hidden="true" /></span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function TableScroller({ children }: { children: ReactNode }) {
  return <div className="subtle-scrollbar w-full overflow-x-auto">{children}</div>
}

export function TableCellText({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <span className={cn('text-sm', muted ? 'text-muted-foreground' : 'text-foreground')}>{children}</span>
}

export function LabeledField({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <span className="text-[11px] leading-4 text-muted-foreground">{hint}</span>}
    </div>
  )
}

export function FormField({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] leading-4 text-muted-foreground">{hint}</span>}
    </div>
  )
}

export const controlClassName =
  'h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary/45 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted'

export function DetailLink({ children }: { children: ReactNode }) {
  return <span className="text-xs font-semibold text-primary">{children}</span>
}
