// ============================================================================
// CURRENCY SELECTOR INTEGRATION EXAMPLES
// ============================================================================
// Use these examples to update other components in your application

// ============================================================================
// EXAMPLE 1: Admin Products Table
// ============================================================================
// File: app/admin/products/AdminProductsClient.tsx

import { useCurrency } from '@/hooks/useCurrency'

export function AdminProductsClient() {
  const { formatPrice } = useCurrency()

  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Compare At</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{formatPrice(product.price)}</td>
            <td>
              {product.compareAt ? formatPrice(product.compareAt) : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ============================================================================
// EXAMPLE 2: Admin Orders Table
// ============================================================================
// File: app/admin/orders/AdminOrdersClient.tsx

import { useCurrency } from '@/hooks/useCurrency'

export function AdminOrdersClient() {
  const { formatPrice } = useCurrency()

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>#{order.id}</td>
            <td>{order.customer.name}</td>
            <td className="font-semibold">
              {formatPrice(order.total)}
            </td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ============================================================================
// EXAMPLE 3: Checkout Page
// ============================================================================
// File: app/checkout/page.tsx

'use client'

import { useCurrency } from '@/hooks/useCurrency'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'

export default function CheckoutPage() {
  const { formatPrice } = useCurrency()
  const { selectedCurrency } = useCurrencyStore()
  const { items, total } = useCartStore()

  const handlePayment = async () => {
    const cartTotal = total()
    
    // Pass currency info to payment provider
    const paymentData = {
      amount: cartTotal,
      currency: selectedCurrency,
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    }
    
    // Send to your payment processor (Stripe, PayPal, etc.)
    // Make sure to pass the currency code to the API
    console.log('Payment data:', paymentData)
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      
      <div className="order-summary">
        <h2>Order Summary</h2>
        {items.map(item => (
          <div key={item.product.id} className="item">
            <span>{item.product.name} x{item.quantity}</span>
            <span>{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
        
        <div className="total">
          <strong>Total: {formatPrice(total())}</strong>
          <small>Currency: {selectedCurrency}</small>
        </div>
      </div>
      
      <button onClick={handlePayment}>
        Pay {formatPrice(total())}
      </button>
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Order Confirmation Email
// ============================================================================
// File: lib/email-templates.ts

import { formatPrice } from '@/lib/currency'
import type { CurrencyCode } from '@/store/currency'

export function generateOrderConfirmationEmail(
  order: Order,
  currency: CurrencyCode
) {
  return `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    
    <h2>Order Details</h2>
    <table>
      ${order.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>Qty: ${item.quantity}</td>
          <td>${formatPrice(item.price * item.quantity, currency)}</td>
        </tr>
      `).join('')}
    </table>
    
    <h3>Total: ${formatPrice(order.total, currency)}</h3>
  `
}

// ============================================================================
// EXAMPLE 5: Product Grid Component
// ============================================================================
// File: components/shop/ProductGrid.tsx

'use client'

import { useCurrency } from '@/hooks/useCurrency'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { currency } = useCurrency()
  
  return (
    <div className="grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
      <small>Prices shown in {currency}</small>
    </div>
  )
}

// ============================================================================
// EXAMPLE 6: API Route for Price Display
// ============================================================================
// File: app/api/products/[id]/price/route.ts

import { SUPPORTED_CURRENCIES } from '@/store/currency'
import { convertPrice } from '@/lib/currency'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url)
  const currency = searchParams.get('currency') as any || 'USD'
  
  const product = await db.product.findUnique({
    where: { id: params.id },
  })
  
  if (!product) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  
  return Response.json({
    id: product.id,
    name: product.name,
    price: convertPrice(product.price, currency),
    currency,
    symbol: SUPPORTED_CURRENCIES[currency].symbol,
  })
}

// ============================================================================
// EXAMPLE 7: Price Display Component (Reusable)
// ============================================================================
// File: components/ui/PriceDisplay.tsx

'use client'

import { useCurrency } from '@/hooks/useCurrency'

interface PriceDisplayProps {
  usdPrice: number
  compareAtPrice?: number | null
  showCurrency?: boolean
}

export function PriceDisplay({
  usdPrice,
  compareAtPrice,
  showCurrency = false,
}: PriceDisplayProps) {
  const { formatPrice, currency } = useCurrency()

  return (
    <div className="price-display">
      <div className="current-price text-lg font-bold">
        {formatPrice(usdPrice)}
      </div>
      
      {compareAtPrice && compareAtPrice > usdPrice && (
        <div className="compare-price text-sm text-gray-500 line-through">
          {formatPrice(compareAtPrice)}
        </div>
      )}
      
      {showCurrency && (
        <div className="currency-info text-xs text-gray-400">
          Showing prices in {currency}
        </div>
      )}
    </div>
  )
}

// Usage:
// <PriceDisplay usdPrice={99.99} compareAtPrice={129.99} showCurrency />

// ============================================================================
// EXAMPLE 8: Collection Page with Prices
// ============================================================================
// File: app/collections/page.tsx

'use client'

import { useCurrency } from '@/hooks/useCurrency'

export default function CollectionsPage() {
  const { formatPrice } = useCurrency()
  
  return (
    <div>
      {collections.map(collection => (
        <div key={collection.id} className="collection">
          <h2>{collection.name}</h2>
          <p>Starting from: {formatPrice(collection.minPrice)}</p>
          <div className="products">
            {collection.products.map(product => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// SUMMARY: Integration Pattern
// ============================================================================
/*
  
  Every component that displays prices should follow this pattern:

  1. Import the hook:
     import { useCurrency } from '@/hooks/useCurrency'

  2. Use it in the component:
     const { formatPrice } = useCurrency()

  3. Format prices with:
     {formatPrice(product.price)}

  4. Optional: Get currency info:
     const { currency, getSymbol } = useCurrency()

  That's it! The component will automatically update whenever 
  the user changes the selected currency.

*/
