import { ShoppingCart } from 'lucide-react'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {product.image && (
        <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">${product.price?.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{product.category}</p>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
          >
            <ShoppingCart className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
