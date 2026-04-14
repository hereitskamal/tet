# Currency Selector Implementation Guide

## Overview
A complete currency selector system for your e-commerce application with support for multiple currencies, with India (INR) as the default.

## Supported Currencies
- **INR** (₹) - Indian Rupee (Default)
- **USD** ($) - US Dollar
- **EUR** (€) - Euro
- **GBP** (£) - British Pound
- **JPY** (¥) - Japanese Yen
- **AUD** (A$) - Australian Dollar

## Features
✅ Currency selector in Navbar with smooth dropdown
✅ Persistent currency selection (stored in localStorage)
✅ Real-time price conversion based on selected currency
✅ Automatic decimal formatting (JPY uses no decimals)
✅ Locale-aware number formatting
✅ Mobile-responsive design
✅ Custom hook for easy component integration

## Usage

### 1. Display Formatted Prices
Use the `useCurrency` hook in any component to display prices:

```tsx
'use client'

import { useCurrency } from '@/hooks/useCurrency'

export function ProductCard({ product }) {
  const { formatPrice } = useCurrency()
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p className="text-lg font-semibold">
        {formatPrice(product.price)}
      </p>
    </div>
  )
}
```

### 2. Access Currency Information
```tsx
import { useCurrency } from '@/hooks/useCurrency'

export function MyComponent() {
  const { currency, convertPrice, getSymbol } = useCurrency()
  
  // Get current currency code
  console.log(currency) // 'INR', 'USD', etc.
  
  // Convert USD price to selected currency
  const converted = convertPrice(100) // Converts $100 to selected currency
  
  // Get currency symbol
  console.log(getSymbol()) // '₹', '$', '€', etc.
}
```

### 3. Format Prices Directly
Use the formatting utilities from `lib/currency.ts`:

```tsx
import { formatPrice } from '@/lib/currency'

// Format a price in specific currency
const priceInINR = formatPrice(100, 'INR') // ₹ 8,350.00
const priceInUSD = formatPrice(100, 'USD') // $ 100.00
```

### 4. Update Cart Total Display
Example for updating cart display:

```tsx
'use client'

import { useCurrency } from '@/hooks/useCurrency'
import { useCartStore } from '@/store/cart'

export function CartSummary() {
  const { formatPrice } = useCurrency()
  const { total } = useCartStore()
  
  return (
    <div>
      <h2>Cart Total</h2>
      <p className="text-xl font-bold">
        {formatPrice(total())}
      </p>
    </div>
  )
}
```

## Implementation Examples

### ProductCard Component (Updated)
```tsx
'use client'

import { useCurrency } from '@/hooks/useCurrency'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useCurrency()
  
  return (
    <div className="product-card">
      <img src={product.images[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="text-lg font-semibold">
        {formatPrice(product.price)}
      </p>
      {product.compareAt && (
        <p className="text-sm line-through text-gray-500">
          {formatPrice(product.compareAt)}
        </p>
      )}
    </div>
  )
}
```

### Cart Drawer (Updated)
```tsx
'use client'

import { useCurrency } from '@/hooks/useCurrency'
import { useCartStore } from '@/store/cart'

export default function CartDrawer() {
  const { formatPrice } = useCurrency()
  const { items, total } = useCartStore()
  
  return (
    <div>
      {items.map((item) => (
        <div key={item.product.id}>
          <p>{item.product.name}</p>
          <p>{formatPrice(item.product.price)} × {item.quantity}</p>
        </div>
      ))}
      <div className="total">
        <strong>Total: {formatPrice(total())}</strong>
      </div>
    </div>
  )
}
```

## Currency Storage & Persistence

The selected currency is automatically saved to browser's localStorage with the key `tht-currency`. This means:
- User's currency preference persists across sessions
- Defaults to INR if not set
- Works with Zustand's persist middleware

## Exchange Rates

Exchange rates are stored in `store/currency.ts` and are relative to USD:
- All product prices are stored in USD in the database
- Prices are converted on the fly based on exchange rates
- To update rates, modify `SUPPORTED_CURRENCIES` in `store/currency.ts`

**Note:** For production, consider fetching real-time exchange rates from an API like:
- Open Exchange Rates
- Fixer.io
- CurrencyAPI

## Mobile Support
The currency selector:
- Shows only the currency code on mobile (compact view)
- Shows full code + name on desktop
- Fully responsive dropdown menu
- Accessible with keyboard navigation

## Styling & Customization

The component uses Tailwind CSS classes and Framer Motion for animations. To customize:

1. **Change default currency:** Edit `useCurrencyStore` in `store/currency.ts`
2. **Adjust styling:** Modify CSS classes in `components/ui/CurrencySelector.tsx`
3. **Update exchange rates:** Modify `SUPPORTED_CURRENCIES` in `store/currency.ts`
4. **Add more currencies:** Add entries to `SUPPORTED_CURRENCIES` and `CurrencyCode` type

## Files Structure
```
store/
  └── currency.ts          # Currency store & configurations
lib/
  └── currency.ts          # Utility functions for conversion & formatting
hooks/
  └── useCurrency.ts       # Custom hook for easy integration
components/
  └── ui/
      └── CurrencySelector.tsx  # Dropdown component
components/
  └── layout/
      └── Navbar.tsx       # Updated with selector
```

## Next Steps

1. **Update components** to use the `useCurrency` hook:
   - ProductCard.tsx
   - CartDrawer.tsx
   - Any other price display components

2. **Connect to real exchange rates** (optional):
   - Create an API route to fetch live rates
   - Update the store to refresh rates periodically

3. **Test in different browsers** to ensure localStorage persistence works

4. **Customize styling** if needed to match your design system

## Accessibility
- Proper ARIA labels on button and dropdown
- Keyboard accessible (click outside to close)
- Screen reader friendly
- Semantic HTML structure
