import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, Store } from 'lucide-react'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useSessionId() {
  const [sid, setSid] = useState('')
  useEffect(() => {
    let existing = localStorage.getItem('session_id')
    if (!existing) {
      existing = Math.random().toString(36).slice(2)
      localStorage.setItem('session_id', existing)
    }
    setSid(existing)
  }, [])
  return sid
}

function App() {
  const sessionId = useSessionId()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/api/products`)
    const data = await res.json()
    setProducts(data)
  }

  const fetchCart = async () => {
    if (!sessionId) return
    const res = await fetch(`${API_BASE}/api/cart?session_id=${sessionId}`)
    const data = await res.json()
    setCart(data)
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchProducts()
      await fetchCart()
      setLoading(false)
    }
    init()
  }, [sessionId])

  const handleAdd = async (product) => {
    if (!sessionId) return
    await fetch(`${API_BASE}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, product_id: product.id, quantity: 1 }),
    })
    await fetchCart()
    setOpen(true)
  }

  const handleRemove = async (item) => {
    // For simplicity, set quantity to 0 by deleting item
    // Quick approach: set quantity negative to trigger update to at least 0 removed
    await fetch(`${API_BASE}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, product_id: item.product_id, quantity: -item.quantity }),
    })
    // Clean up any zero/negative quantities
    await fetch(`${API_BASE}/api/cart?session_id=${sessionId}`)
      .then(r => r.json())
      .then(async data => {
        // Remove items with qty <= 0 from DB
        for (const it of data.items) {
          if (it.quantity <= 0) {
            await fetch(`${API_BASE}/api/cart/cleanup?session_id=${sessionId}`)
          }
        }
      })
    await fetchCart()
  }

  const checkout = async () => {
    const name = prompt('Your name')
    const email = prompt('Your email')
    const address = prompt('Shipping address')
    if (!name || !email || !address) return
    const res = await fetch(`${API_BASE}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, customer_name: name, customer_email: email, customer_address: address }),
    })
    const data = await res.json()
    alert(`Order placed! ID: ${data.order_id}`)
    await fetchCart()
    setOpen(false)
  }

  const seed = async () => {
    await fetch(`${API_BASE}/api/products/seed`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ force: true }) })
    await fetchProducts()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">Blue Shop</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={seed} className="text-sm text-gray-600 hover:text-gray-900">Seed products</button>
            <button onClick={() => setOpen(true)} className="relative inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md">
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {cart.items?.length ? (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.items.length}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        cart={cart}
        onRemove={handleRemove}
        onCheckout={checkout}
      />
    </div>
  )
}

export default App
