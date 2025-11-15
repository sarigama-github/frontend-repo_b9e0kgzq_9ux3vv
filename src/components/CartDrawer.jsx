import { X, Trash2 } from 'lucide-react'

export default function CartDrawer({ open, onClose, cart, onRemove, onCheckout }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* panel */}
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-200px)]">
          {cart.items?.length ? (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center border rounded-lg p-3">
                {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                  <button onClick={() => onRemove(item)} className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-sm mt-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          )}
        </div>
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-lg font-semibold">${(cart.total || 0).toFixed(2)}</span>
          </div>
          <button
            disabled={!cart.items?.length}
            onClick={onCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded-md"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
