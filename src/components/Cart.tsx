import React from 'react';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="w-80 bg-white h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty.</h3>
            <p className="text-gray-500 text-sm">
              Click on the products to add them<br />
              to the sale.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white h-full flex flex-col">
      {/* Cart Items */}
      <div className="flex-1 p-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-medium text-gray-700">{item.quantity}</span>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    د.ج {item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  د.ج {(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Footer */}
      <div className="border-t border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          <div className="text-right">
            <div className="text-gray-600">Subtotal: د.ج {total.toFixed(2)}</div>
            <button className="text-teal-600 text-sm hover:text-teal-700">Add Discount</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>د.ج {total.toFixed(2)}</span>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onCheckout}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Go to payment →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;