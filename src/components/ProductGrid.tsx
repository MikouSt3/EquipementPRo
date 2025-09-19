import React from 'react';
import { Plus } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductGridProps {
  products: Product[];
  cart: CartItem[];
  onProductSelect: (product: Product) => void;
  onAddProduct: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, cart, onProductSelect, onAddProduct }) => {
  const getCartQuantity = (productId: string) => {
    const cartItem = cart.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {/* Products */}
      {products.map((product) => {
        const cartQuantity = getCartQuantity(product.id);
        
        return (
        <button
          key={product.id}
          onClick={() => onProductSelect(product)}
          className="aspect-square bg-slate-600 text-white rounded-xl p-4 hover:bg-slate-500 transition-all duration-200 hover:scale-105 group relative"
        >
          <div className="flex flex-col h-full justify-between">
            <div className="text-left">
              <div className="text-xs opacity-75 mb-1">accoup</div>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-white text-sm mb-1">
                {product.name}
              </h3>
              <p className="text-white text-xs opacity-90">
                د.ج {product.price.toFixed(2)}
              </p>
            </div>
          </div>
          {cartQuantity > 0 && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{cartQuantity}</span>
            </div>
          )}
        </button>
        );
      })}

      {/* Add Product Button */}
      <button
        onClick={onAddProduct}
        className="aspect-square bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-colors group"
      >
        <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default ProductGrid;