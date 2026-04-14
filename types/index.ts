export type Role = 'USER' | 'ADMIN'
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAt?: number | null
  images: string[]
  stock: number
  featured: boolean
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string | null
  role: Role
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface OrderAddress {
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  userId: string
  user?: User
  items: OrderItem[]
  total: number
  status: OrderStatus
  address: OrderAddress
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}
