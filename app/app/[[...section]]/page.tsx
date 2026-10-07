import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DashboardView } from '@/components/servepilot/dashboard'
import { FinanceView } from '@/components/servepilot/finance'
import { MenuView, CategoriesView } from '@/components/servepilot/menu-management'
import { CustomersView, InventoryView, PurchasesView, StaffView, SuppliersView } from '@/components/servepilot/operations-management'
import { KitchenView, OrdersView, PosView, TablesView } from '@/components/servepilot/operations'
import { QrMenuView } from '@/components/servepilot/qr-menu'
import { ReportsView } from '@/components/servepilot/reports'
import { SettingsView } from '@/components/servepilot/settings'

type PageProps = {
  params: Promise<{ section?: string[] }>
}

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  pos: 'Point of sale',
  kitchen: 'Kitchen display',
  tables: 'Tables & reservations',
  menu: 'Menu items',
  'menu/items': 'Menu items',
  'menu/categories': 'Menu categories',
  'menu/qr': 'QR menu',
  inventory: 'Inventory',
  'inventory/low-stock': 'Low stock',
  purchases: 'Purchasing',
  'purchases/history': 'Purchase history',
  suppliers: 'Suppliers',
  customers: 'Customers',
  staff: 'Staff & roles',
  'staff/roles': 'Roles & permissions',
  'staff/attendance': 'Staff attendance',
  finance: 'Finance',
  reports: 'Reports & analytics',
  settings: 'Settings',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section = [] } = await params
  const path = section.join('/') || 'dashboard'
  return { title: pageTitles[path] ?? 'Restaurant workspace' }
}

export default async function ApplicationPage({ params }: PageProps) {
  const { section = [] } = await params
  const path = section.join('/') || 'dashboard'

  switch (path) {
    case 'dashboard': return <DashboardView />
    case 'orders': return <OrdersView />
    case 'pos': return <PosView />
    case 'kitchen': return <KitchenView />
    case 'tables': return <TablesView />
    case 'menu':
    case 'menu/items': return <MenuView />
    case 'menu/categories': return <CategoriesView />
    case 'menu/qr': return <QrMenuView />
    case 'inventory': return <InventoryView />
    case 'inventory/low-stock': return <InventoryView initialFilter="Low stock" />
    case 'purchases': return <PurchasesView />
    case 'purchases/history': return <PurchasesView initialTab="Purchase history" />
    case 'suppliers': return <SuppliersView />
    case 'customers': return <CustomersView />
    case 'staff': return <StaffView />
    case 'staff/roles': return <StaffView initialTab="Roles & permissions" />
    case 'staff/attendance': return <StaffView initialTab="Attendance" />
    case 'finance': return <FinanceView />
    case 'reports': return <ReportsView />
    case 'settings': return <SettingsView />
    default: notFound()
  }
}
