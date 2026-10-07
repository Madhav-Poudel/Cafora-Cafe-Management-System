'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import {
  initialCustomers,
  initialExpenses,
  initialIncome,
  initialInventory,
  initialMenuItems,
  initialOrders,
  initialPurchases,
  initialStaff,
  initialSuppliers,
  initialTables,
  makeId,
  type DemoCustomer,
  type DemoExpense,
  type DemoIncome,
  type DemoOrder,
  type DemoPurchase,
  type DemoStaff,
  type DemoSupplier,
  type DemoTable,
  type InventoryItem,
  type MenuProduct,
  type OrderStatus,
} from './data'

interface DemoStoreValue {
  orders: DemoOrder[]
  menuItems: MenuProduct[]
  categories: string[]
  inventory: InventoryItem[]
  tables: DemoTable[]
  customers: DemoCustomer[]
  expenses: DemoExpense[]
  income: DemoIncome[]
  purchases: DemoPurchase[]
  suppliers: DemoSupplier[]
  staff: DemoStaff[]
  branch: string
  setBranch: Dispatch<SetStateAction<string>>
  toast: string | null
  showToast: (message: string) => void
  addOrder: (order: Omit<DemoOrder, 'id'>) => DemoOrder
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateOrderPayment: (id: string, paymentStatus: DemoOrder['paymentStatus']) => void
  addMenuItem: (item: Omit<MenuProduct, 'id'>) => void
  updateMenuItem: (id: string, changes: Partial<MenuProduct>) => void
  addCategory: (category: string) => void
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  adjustInventory: (id: string, delta: number) => void
  addTable: (table: Omit<DemoTable, 'id'>) => void
  updateTable: (id: string, changes: Partial<DemoTable>) => void
  addCustomer: (customer: Omit<DemoCustomer, 'id'>) => void
  addExpense: (expense: Omit<DemoExpense, 'id'>) => void
  addIncome: (entry: Omit<DemoIncome, 'id'>) => void
  addPurchase: (purchase: Omit<DemoPurchase, 'id'>) => void
  updatePurchase: (id: string, changes: Partial<DemoPurchase>) => void
  receivePurchase: (id: string) => void
  addSupplier: (supplier: Omit<DemoSupplier, 'id'>) => void
  addStaff: (member: Omit<DemoStaff, 'id'>) => void
  updateStaff: (id: string, changes: Partial<DemoStaff>) => void
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null)

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState(initialOrders)
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [categories, setCategories] = useState(['Momo & Snacks', 'Mains', 'Drinks', 'Desserts'])
  const [inventory, setInventory] = useState(initialInventory)
  const [tables, setTables] = useState(initialTables)
  const [customers, setCustomers] = useState(initialCustomers)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [income, setIncome] = useState(initialIncome)
  const [purchases, setPurchases] = useState(initialPurchases)
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [staff, setStaff] = useState(initialStaff)
  const [branch, setBranch] = useState('Thamel Kitchen')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const showToast = useCallback((message: string) => setToast(message), [])

  const addOrder = useCallback((order: Omit<DemoOrder, 'id'>) => {
    const savedOrder = { ...order, id: makeId('SP') }
    setOrders((current) => [savedOrder, ...current])
    return savedOrder
  }, [])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order))
  }, [])

  const updateOrderPayment = useCallback((id: string, paymentStatus: DemoOrder['paymentStatus']) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, paymentStatus } : order))
  }, [])

  const addMenuItem = useCallback((item: Omit<MenuProduct, 'id'>) => {
    setMenuItems((current) => [{ ...item, id: makeId('menu') }, ...current])
  }, [])

  const updateMenuItem = useCallback((id: string, changes: Partial<MenuProduct>) => {
    setMenuItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item))
  }, [])

  const addCategory = useCallback((category: string) => {
    const normalized = category.trim()
    if (!normalized) return
    setCategories((current) => current.some((item) => item.toLowerCase() === normalized.toLowerCase()) ? current : [...current, normalized])
  }, [])

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    setInventory((current) => [{ ...item, id: makeId('inv') }, ...current])
  }, [])

  const adjustInventory = useCallback((id: string, delta: number) => {
    setInventory((current) => current.map((item) => item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item))
  }, [])

  const addTable = useCallback((table: Omit<DemoTable, 'id'>) => {
    setTables((current) => [...current, { ...table, id: makeId('table') }])
  }, [])

  const updateTable = useCallback((id: string, changes: Partial<DemoTable>) => {
    setTables((current) => current.map((table) => table.id === id ? { ...table, ...changes } : table))
  }, [])

  const addCustomer = useCallback((customer: Omit<DemoCustomer, 'id'>) => {
    setCustomers((current) => [{ ...customer, id: makeId('cus') }, ...current])
  }, [])

  const addExpense = useCallback((expense: Omit<DemoExpense, 'id'>) => {
    setExpenses((current) => [{ ...expense, id: makeId('EXP') }, ...current])
  }, [])

  const addIncome = useCallback((entry: Omit<DemoIncome, 'id'>) => {
    setIncome((current) => [{ ...entry, id: makeId('INC') }, ...current])
  }, [])

  const addPurchase = useCallback((purchase: Omit<DemoPurchase, 'id'>) => {
    setPurchases((current) => [{ ...purchase, id: makeId('PO') }, ...current])
  }, [])

  const updatePurchase = useCallback((id: string, changes: Partial<DemoPurchase>) => {
    setPurchases((current) => current.map((purchase) => purchase.id === id ? { ...purchase, ...changes } : purchase))
  }, [])

  const receivePurchase = useCallback((id: string) => {
    const purchase = purchases.find((entry) => entry.id === id)
    if (!purchase) return
    setPurchases((current) => current.map((entry) => entry.id === id ? { ...entry, status: 'Received' } : entry))
    setInventory((current) => {
      const item = current.find((entry) => entry.name.toLowerCase() === purchase.itemName.toLowerCase())
      if (item) {
        return current.map((entry) => entry.id === item.id ? { ...entry, stock: entry.stock + purchase.quantity } : entry)
      }
      return [{
        id: makeId('inv'),
        name: purchase.itemName,
        category: 'Purchased goods',
        sku: makeId('RAW'),
        stock: purchase.quantity,
        unit: 'kg',
        cost: purchase.unitCost,
        sellingPrice: 0,
        reorderLevel: Math.max(2, purchase.quantity / 2),
      }, ...current]
    })
  }, [purchases])

  const addSupplier = useCallback((supplier: Omit<DemoSupplier, 'id'>) => {
    setSuppliers((current) => [{ ...supplier, id: makeId('SUP') }, ...current])
  }, [])

  const addStaff = useCallback((member: Omit<DemoStaff, 'id'>) => {
    setStaff((current) => [{ ...member, id: makeId('ST') }, ...current])
  }, [])

  const updateStaff = useCallback((id: string, changes: Partial<DemoStaff>) => {
    setStaff((current) => current.map((member) => member.id === id ? { ...member, ...changes } : member))
  }, [])

  const value = useMemo<DemoStoreValue>(() => ({
    orders,
    menuItems,
    categories,
    inventory,
    tables,
    customers,
    expenses,
    income,
    purchases,
    suppliers,
    staff,
    branch,
    setBranch,
    toast,
    showToast,
    addOrder,
    updateOrderStatus,
    updateOrderPayment,
    addMenuItem,
    updateMenuItem,
    addCategory,
    addInventoryItem,
    adjustInventory,
    addTable,
    updateTable,
    addCustomer,
    addExpense,
    addIncome,
    addPurchase,
    updatePurchase,
    receivePurchase,
    addSupplier,
    addStaff,
    updateStaff,
  }), [
    orders,
    menuItems,
    categories,
    inventory,
    tables,
    customers,
    expenses,
    income,
    purchases,
    suppliers,
    staff,
    branch,
    toast,
    showToast,
    addOrder,
    updateOrderStatus,
    updateOrderPayment,
    addMenuItem,
    updateMenuItem,
    addCategory,
    addInventoryItem,
    adjustInventory,
    addTable,
    updateTable,
    addCustomer,
    addExpense,
    addIncome,
    addPurchase,
    updatePurchase,
    receivePurchase,
    addSupplier,
    addStaff,
    updateStaff,
  ])

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore() {
  const store = useContext(DemoStoreContext)
  if (!store) throw new Error('useDemoStore must be used inside DemoStoreProvider')
  return store
}
