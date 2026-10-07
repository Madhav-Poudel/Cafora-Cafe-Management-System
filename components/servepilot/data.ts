export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled'
export type OrderType = 'Dine in' | 'Takeaway' | 'Delivery' | 'Online'
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded'
export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning'

export interface OrderLine {
  name: string
  quantity: number
  price: number
}

export interface DemoOrder {
  id: string
  time: string
  type: OrderType
  table: string
  customer: string
  items: string
  amount: number
  paymentStatus: PaymentStatus
  paymentMethod?: string
  status: OrderStatus
  lines?: OrderLine[]
  specialInstructions?: string
}

export interface MenuProduct {
  id: string
  name: string
  description: string
  category: string
  price: number
  costPrice: number
  sku: string
  available: boolean
  preparationTime: number
  image: string
  taxRate: number
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string
  stock: number
  unit: string
  cost: number
  sellingPrice: number
  reorderLevel: number
}

export interface DemoTable {
  id: string
  label: string
  section: string
  capacity: number
  status: TableStatus
  guest: string
  since: string
  amount: number
}

export interface DemoCustomer {
  id: string
  name: string
  phone: string
  email: string
  totalOrders: number
  totalSpent: number
  lastVisit: string
  loyaltyPoints: number
  favorite: string
}

export interface DemoExpense {
  id: string
  category: string
  amount: number
  date: string
  method: string
  reference: string
  notes: string
}

export interface DemoIncome {
  id: string
  source: string
  amount: number
  date: string
  method: string
  notes: string
}

export interface DemoPurchase {
  id: string
  supplier: string
  itemName: string
  quantity: number
  unitCost: number
  amount: number
  date: string
  status: 'Draft' | 'Ordered' | 'Received' | 'Partially received' | 'Cancelled'
  paymentStatus: 'Paid' | 'Pending' | 'Partially paid'
}

export interface DemoSupplier {
  id: string
  name: string
  contact: string
  phone: string
  category: string
  balance: number
  status: 'Active' | 'On hold'
}

export interface DemoStaff {
  id: string
  name: string
  role: string
  phone: string
  shift: string
  status: 'On shift' | 'Off duty' | 'On break'
  initials: string
}

export const branches = [
  'Thamel Kitchen',
  'Patan Garden',
  'Lalitpur Express',
  'All branches',
]

export const revenueByDay = [
  { day: 'Thu', revenue: 32600, orders: 48 },
  { day: 'Fri', revenue: 41800, orders: 61 },
  { day: 'Sat', revenue: 56200, orders: 82 },
  { day: 'Sun', revenue: 48900, orders: 74 },
  { day: 'Mon', revenue: 37100, orders: 53 },
  { day: 'Tue', revenue: 43600, orders: 67 },
  { day: 'Wed', revenue: 52480, orders: 79 },
]

export const hourlySales = [
  { hour: '8a', sales: 3200 },
  { hour: '10a', sales: 6100 },
  { hour: '12p', sales: 15200 },
  { hour: '2p', sales: 9800 },
  { hour: '4p', sales: 7200 },
  { hour: '6p', sales: 18400 },
  { hour: '8p', sales: 22100 },
  { hour: '10p', sales: 10300 },
]

export const paymentMix = [
  { name: 'Cash', value: 34, color: '#173b3f' },
  { name: 'Card', value: 29, color: '#f28c28' },
  { name: 'eSewa', value: 22, color: '#4b7bec' },
  { name: 'Khalti', value: 15, color: '#3f8f62' },
]

export const initialOrders: DemoOrder[] = [
  {
    id: 'SP-2489',
    time: '12:42 PM',
    type: 'Dine in',
    table: 'T-08',
    customer: 'Anisha Sharma',
    items: 'Chicken momo, Masala chai',
    amount: 1150,
    paymentStatus: 'Paid',
    status: 'Preparing',
    lines: [
      { name: 'Steamed chicken momo', quantity: 2, price: 520 },
      { name: 'Masala chai', quantity: 1, price: 110 },
    ],
  },
  {
    id: 'SP-2488',
    time: '12:36 PM',
    type: 'Takeaway',
    table: '—',
    customer: 'Walk-in guest',
    items: 'Nepali thali, Lemon soda',
    amount: 890,
    paymentStatus: 'Paid',
    status: 'Ready',
    lines: [
      { name: 'Nepali thali', quantity: 1, price: 720 },
      { name: 'Fresh lemon soda', quantity: 1, price: 170 },
    ],
  },
  {
    id: 'SP-2487',
    time: '12:27 PM',
    type: 'Delivery',
    table: '—',
    customer: 'Rohan Karki',
    items: 'Chicken sekuwa, Steamed momo',
    amount: 1440,
    paymentStatus: 'Pending',
    status: 'New',
    lines: [
      { name: 'Chicken sekuwa', quantity: 1, price: 680 },
      { name: 'Steamed chicken momo', quantity: 2, price: 520 },
    ],
    specialInstructions: 'Keep achar on the side.',
  },
  {
    id: 'SP-2486',
    time: '12:18 PM',
    type: 'Dine in',
    table: 'T-03',
    customer: 'Sujan Gurung',
    items: 'Paneer tikka, Butter naan',
    amount: 1320,
    paymentStatus: 'Paid',
    status: 'Completed',
    lines: [
      { name: 'Paneer tikka', quantity: 1, price: 750 },
      { name: 'Butter naan', quantity: 2, price: 180 },
    ],
  },
  {
    id: 'SP-2485',
    time: '12:04 PM',
    type: 'Online',
    table: '—',
    customer: 'Prakriti Rai',
    items: 'Veg chowmein, Iced americano',
    amount: 720,
    paymentStatus: 'Paid',
    status: 'Completed',
    lines: [
      { name: 'Veg chowmein', quantity: 1, price: 390 },
      { name: 'Iced americano', quantity: 1, price: 330 },
    ],
  },
  {
    id: 'SP-2484',
    time: '11:51 AM',
    type: 'Dine in',
    table: 'T-11',
    customer: 'Walk-in guest',
    items: 'Buff momo, Milk tea',
    amount: 820,
    paymentStatus: 'Paid',
    status: 'Completed',
    lines: [
      { name: 'Buff momo', quantity: 1, price: 490 },
      { name: 'Milk tea', quantity: 2, price: 140 },
    ],
  },
]

export const initialMenuItems: MenuProduct[] = [
  {
    id: 'menu-1',
    name: 'Steamed chicken momo',
    description: 'Hand-folded dumplings with tomato achar',
    category: 'Momo & Snacks',
    price: 520,
    costPrice: 210,
    sku: 'MOM-101',
    available: true,
    preparationTime: 14,
    image: '/servepilot/momo.png',
    taxRate: 13,
  },
  {
    id: 'menu-2',
    name: 'Nepali thali',
    description: 'Dal, rice, seasonal tarkari and pickle',
    category: 'Mains',
    price: 720,
    costPrice: 310,
    sku: 'THA-201',
    available: true,
    preparationTime: 18,
    image: '/servepilot/thali.png',
    taxRate: 13,
  },
  {
    id: 'menu-3',
    name: 'Chicken sekuwa',
    description: 'Chargrilled marinated chicken skewers',
    category: 'Mains',
    price: 680,
    costPrice: 270,
    sku: 'SEK-204',
    available: true,
    preparationTime: 16,
    image: '/servepilot/sekuwa.png',
    taxRate: 13,
  },
  {
    id: 'menu-4',
    name: 'Masala chai',
    description: 'Slow-brewed with cardamom and ginger',
    category: 'Drinks',
    price: 110,
    costPrice: 34,
    sku: 'DRK-301',
    available: true,
    preparationTime: 4,
    image: '/servepilot/masala-chai.png',
    taxRate: 13,
  },
  {
    id: 'menu-5',
    name: 'Buff momo',
    description: 'Juicy buffalo momo with house achar',
    category: 'Momo & Snacks',
    price: 490,
    costPrice: 190,
    sku: 'MOM-102',
    available: true,
    preparationTime: 13,
    image: '/servepilot/momo.png',
    taxRate: 13,
  },
  {
    id: 'menu-6',
    name: 'Paneer tikka',
    description: 'Tandoor-seared paneer with mint chutney',
    category: 'Mains',
    price: 750,
    costPrice: 325,
    sku: 'MAI-210',
    available: true,
    preparationTime: 15,
    image: '/servepilot/thali.png',
    taxRate: 13,
  },
  {
    id: 'menu-7',
    name: 'Veg chowmein',
    description: 'Wok-tossed noodles with crisp vegetables',
    category: 'Mains',
    price: 390,
    costPrice: 155,
    sku: 'MAI-215',
    available: false,
    preparationTime: 11,
    image: '/servepilot/sekuwa.png',
    taxRate: 13,
  },
  {
    id: 'menu-8',
    name: 'Fresh lemon soda',
    description: 'Fresh lime, soda and a pinch of black salt',
    category: 'Drinks',
    price: 170,
    costPrice: 45,
    sku: 'DRK-306',
    available: true,
    preparationTime: 3,
    image: '/servepilot/masala-chai.png',
    taxRate: 13,
  },
]

export const initialInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Chicken breast', category: 'Meat & poultry', sku: 'RAW-041', stock: 8.4, unit: 'kg', cost: 420, sellingPrice: 0, reorderLevel: 12 },
  { id: 'inv-2', name: 'Basmati rice', category: 'Dry goods', sku: 'RAW-012', stock: 24, unit: 'kg', cost: 145, sellingPrice: 0, reorderLevel: 15 },
  { id: 'inv-3', name: 'Buffalo mince', category: 'Meat & poultry', sku: 'RAW-038', stock: 6.2, unit: 'kg', cost: 610, sellingPrice: 0, reorderLevel: 8 },
  { id: 'inv-4', name: 'Cooking oil', category: 'Dry goods', sku: 'RAW-018', stock: 3, unit: 'liter', cost: 290, sellingPrice: 0, reorderLevel: 5 },
  { id: 'inv-5', name: 'Fresh tomatoes', category: 'Produce', sku: 'RAW-025', stock: 11, unit: 'kg', cost: 90, sellingPrice: 0, reorderLevel: 8 },
  { id: 'inv-6', name: 'Paneer', category: 'Dairy', sku: 'RAW-033', stock: 0, unit: 'kg', cost: 520, sellingPrice: 0, reorderLevel: 4 },
  { id: 'inv-7', name: 'Milk', category: 'Dairy', sku: 'RAW-031', stock: 12, unit: 'liter', cost: 115, sellingPrice: 0, reorderLevel: 8 },
  { id: 'inv-8', name: 'Ginger', category: 'Produce', sku: 'RAW-028', stock: 1.5, unit: 'kg', cost: 220, sellingPrice: 0, reorderLevel: 2 },
]

export const initialTables: DemoTable[] = [
  { id: 'table-1', label: 'T-01', section: 'Window', capacity: 2, status: 'Occupied', guest: 'Anisha Sharma', since: '12:18 PM', amount: 1150 },
  { id: 'table-2', label: 'T-02', section: 'Window', capacity: 2, status: 'Available', guest: '', since: '', amount: 0 },
  { id: 'table-3', label: 'T-03', section: 'Main room', capacity: 4, status: 'Occupied', guest: 'Sujan Gurung', since: '12:05 PM', amount: 1320 },
  { id: 'table-4', label: 'T-04', section: 'Main room', capacity: 4, status: 'Cleaning', guest: '', since: '12:31 PM', amount: 0 },
  { id: 'table-5', label: 'T-05', section: 'Main room', capacity: 4, status: 'Available', guest: '', since: '', amount: 0 },
  { id: 'table-6', label: 'T-06', section: 'Main room', capacity: 6, status: 'Reserved', guest: 'Nisha & party', since: '1:00 PM', amount: 0 },
  { id: 'table-7', label: 'T-07', section: 'Patio', capacity: 2, status: 'Available', guest: '', since: '', amount: 0 },
  { id: 'table-8', label: 'T-08', section: 'Patio', capacity: 4, status: 'Occupied', guest: 'Prakriti Rai', since: '11:56 AM', amount: 890 },
  { id: 'table-9', label: 'T-09', section: 'Patio', capacity: 4, status: 'Available', guest: '', since: '', amount: 0 },
  { id: 'table-10', label: 'T-10', section: 'Patio', capacity: 6, status: 'Occupied', guest: 'Rohan Karki', since: '11:48 AM', amount: 1710 },
  { id: 'table-11', label: 'T-11', section: 'Main room', capacity: 2, status: 'Reserved', guest: 'Bikash Thapa', since: '1:20 PM', amount: 0 },
  { id: 'table-12', label: 'T-12', section: 'Main room', capacity: 4, status: 'Available', guest: '', since: '', amount: 0 },
]

export const initialCustomers: DemoCustomer[] = [
  { id: 'cus-1', name: 'Anisha Sharma', phone: '+977 981-112-4086', email: 'anisha.sharma@mail.com', totalOrders: 28, totalSpent: 24650, lastVisit: 'Today', loyaltyPoints: 246, favorite: 'Chicken momo' },
  { id: 'cus-2', name: 'Sujan Gurung', phone: '+977 984-203-1190', email: 'sujan.g@mail.com', totalOrders: 17, totalSpent: 18340, lastVisit: 'Yesterday', loyaltyPoints: 183, favorite: 'Paneer tikka' },
  { id: 'cus-3', name: 'Prakriti Rai', phone: '+977 980-770-2241', email: 'prakriti.rai@mail.com', totalOrders: 12, totalSpent: 10880, lastVisit: '2 days ago', loyaltyPoints: 108, favorite: 'Veg chowmein' },
  { id: 'cus-4', name: 'Rohan Karki', phone: '+977 986-042-8177', email: 'rohan.karki@mail.com', totalOrders: 9, totalSpent: 8290, lastVisit: '4 days ago', loyaltyPoints: 82, favorite: 'Chicken sekuwa' },
  { id: 'cus-5', name: 'Nisha Adhikari', phone: '+977 985-114-3093', email: 'nisha.a@mail.com', totalOrders: 7, totalSpent: 6450, lastVisit: '1 week ago', loyaltyPoints: 64, favorite: 'Nepali thali' },
]

export const initialExpenses: DemoExpense[] = [
  { id: 'EXP-0814', category: 'Fresh produce', amount: 4200, date: 'Today, 10:16 AM', method: 'eSewa', reference: 'PUR-0892', notes: 'Morning market delivery' },
  { id: 'EXP-0813', category: 'Staff meal', amount: 1650, date: 'Today, 9:40 AM', method: 'Cash', reference: 'CASH-0321', notes: 'Breakfast for kitchen team' },
  { id: 'EXP-0812', category: 'Utilities', amount: 12400, date: 'Yesterday', method: 'Bank', reference: 'BILL-4412', notes: 'Monthly electricity' },
  { id: 'EXP-0811', category: 'Packaging', amount: 2850, date: 'Yesterday', method: 'Card', reference: 'POS-2089', notes: 'Takeaway boxes and bags' },
]

export const initialIncome: DemoIncome[] = [
  { id: 'INC-0318', source: 'Catering deposit', amount: 15000, date: 'Today, 11:10 AM', method: 'Bank', notes: 'Private dining, 18 Oct' },
  { id: 'INC-0317', source: 'Event booking', amount: 8000, date: 'Yesterday', method: 'eSewa', notes: 'Patio birthday booking' },
]

export const initialPurchases: DemoPurchase[] = [
  { id: 'PO-1028', supplier: 'Kathmandu Fresh Co.', itemName: 'Chicken breast', quantity: 12, unitCost: 420, amount: 5040, date: 'Today', status: 'Ordered', paymentStatus: 'Pending' },
  { id: 'PO-1027', supplier: 'Himalayan Pantry', itemName: 'Basmati rice', quantity: 25, unitCost: 145, amount: 3625, date: 'Yesterday', status: 'Received', paymentStatus: 'Paid' },
  { id: 'PO-1026', supplier: 'Dairy Valley', itemName: 'Paneer', quantity: 8, unitCost: 520, amount: 4160, date: '6 Oct 2026', status: 'Partially received', paymentStatus: 'Partially paid' },
]

export const initialSuppliers: DemoSupplier[] = [
  { id: 'SUP-018', name: 'Kathmandu Fresh Co.', contact: 'Ramesh Adhikari', phone: '+977 980-145-2110', category: 'Produce & poultry', balance: 5040, status: 'Active' },
  { id: 'SUP-014', name: 'Himalayan Pantry', contact: 'Sita Thapa', phone: '+977 984-227-9080', category: 'Dry goods', balance: 0, status: 'Active' },
  { id: 'SUP-012', name: 'Dairy Valley', contact: 'Amit Shrestha', phone: '+977 981-440-7321', category: 'Dairy', balance: 2080, status: 'Active' },
  { id: 'SUP-009', name: 'Valley Beverage Supply', contact: 'Kiran Rai', phone: '+977 985-113-0410', category: 'Beverages', balance: 0, status: 'On hold' },
]

export const initialStaff: DemoStaff[] = [
  { id: 'ST-04', name: 'Aarya K.C.', role: 'Manager', phone: '+977 980-123-4567', shift: '9:00 AM – 5:00 PM', status: 'On shift', initials: 'AK' },
  { id: 'ST-08', name: 'Suman Lama', role: 'Kitchen staff', phone: '+977 984-777-1200', shift: '10:00 AM – 6:00 PM', status: 'On shift', initials: 'SL' },
  { id: 'ST-12', name: 'Rita Shrestha', role: 'Cashier', phone: '+977 981-778-3490', shift: '11:00 AM – 7:00 PM', status: 'On break', initials: 'RS' },
  { id: 'ST-16', name: 'Kamal Thapa', role: 'Waiter', phone: '+977 986-701-4468', shift: '12:00 PM – 8:00 PM', status: 'On shift', initials: 'KT' },
  { id: 'ST-19', name: 'Mina Gurung', role: 'Waiter', phone: '+977 980-114-2089', shift: '12:00 PM – 8:00 PM', status: 'Off duty', initials: 'MG' },
]

export function formatNpr(amount: number) {
  return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`
}

export function formatQuantity(amount: number) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(1)
}

export function makeId(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
}

export const orderTypes: OrderType[] = ['Dine in', 'Takeaway', 'Delivery', 'Online']
export const menuCategories = ['All items', 'Momo & Snacks', 'Mains', 'Drinks', 'Desserts']
export const inventoryUnits = ['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'packet']
export const paymentMethods = ['Cash', 'Card', 'eSewa', 'Khalti', 'Bank', 'Other']
