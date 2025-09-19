import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronUp, ChevronDown, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { CartItem, Customer } from '../types';
import { useNotification } from '../hooks/useNotification';

interface CheckoutPageProps {
  items: CartItem[];
  selectedCustomer?: Customer;
  customers: Customer[];
  onBack: () => void;
  onFinishSale: (orderData: {
    customerId?: string;
    notes?: string;
    paymentMethod: string;
    amountReceived?: number;
  }) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  items, 
  selectedCustomer, 
  customers,
  onBack, 
  onFinishSale 
}) => {
  const [notes, setNotes] = useState('');
  const [showOnReceipt, setShowOnReceipt] = useState(false);
  const [showItems, setShowItems] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const { showSuccess, showError } = useNotification();

  const handleFinishSale = () => {
    try {
      onFinishSale({
        customerId: selectedCustomer?.id,
        notes: showOnReceipt ? notes : undefined,
        paymentMethod: selectedPaymentMethod,
        amountReceived: selectedPaymentMethod === 'cash' ? parseFloat(amountReceived) || undefined : undefined,
      });
    } catch (error) {
      showError('Failed to process sale. Please try again.');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal; // No discounts for now

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'debit', label: 'Debit Card', icon: CreditCard },
    { id: 'credit', label: 'Credit Card', icon: CreditCard },
    { id: 'others', label: 'Others', icon: Smartphone },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-semibold text-gray-900">Sell</h1>
              <span className="text-lg text-gray-600">د.ج {total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <span className="text-sm">Help</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">KL</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">klizo</div>
                <div className="text-xs text-gray-500">elvizoj@tmail.edu.rs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Customer Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Customer</h2>
                <div className="relative">
                  <button 
                    onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                    className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                  
                  {showCustomerDropdown && (
                    <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowCustomerDropdown(false);
                            // Quick add walk-in customer
                            const walkInCustomer = {
                              name: 'Walk-in Customer',
                              email: '',
                              phone: ''
                            };
                            // You can add logic here to quickly create or select walk-in customer
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Walk-in Customer
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomerDropdown(false);
                            // Open customer form for new customer
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          New Customer
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <div className="px-4 py-2">
                          <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                        {customers.slice(0, 3).map((customer) => (
                          <button
                            key={customer.id}
                            onClick={() => {
                              setShowCustomerDropdown(false);
                              // Select this customer
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {customer.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter a note here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="showOnReceipt"
                  checked={showOnReceipt}
                  onChange={(e) => setShowOnReceipt(e.target.checked)}
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="showOnReceipt" className="ml-2 text-sm text-gray-600">
                  Show on receipt
                </label>
              </div>
            </div>

            {/* Items Section */}
            <div>
              <button
                onClick={() => setShowItems(!showItems)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-medium text-gray-900">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </h2>
                {showItems ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {showItems && (
                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {item.product.name.substring(0, 6)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {item.quantity}x {item.product.name}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        د.ج {(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order summary</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Products subtotal</span>
                  <span className="font-medium">د.ج {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discounts</span>
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Add Discount
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">د.ج {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select the payment method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPaymentMethod === method.id;
                  
                  return (
                    <div key={method.id}>
                      <button
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`w-full flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{method.label}</span>
                      </button>
                      
                      {isSelected && method.id === 'cash' && (
                        <div className="mt-3 ml-7">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Amount received</span>
                            <span className="text-sm font-medium">د.ج {amountReceived || '0.00'}</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6">
              <button
                onClick={onBack}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Discard sale
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Save Order
              </button>
              <button
                onClick={handleFinishSale}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>💰</span>
                <span>Finish sale</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;