import React from 'react';
import { X, FileText, Calendar, User, CreditCard, Package } from 'lucide-react';
import { Order } from '../hooks/useOrders';

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  customers: any[];
}

const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ 
  order, 
  isOpen, 
  onClose,
  customers 
}) => {
  if (!isOpen || !order) return null;

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'Walk-in Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const generateReceiptNumber = (orderId: string) => {
    return `#RCP-${orderId.slice(-8).toUpperCase()}`;
  };

  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = 0; // No tax for now
  const total = order.total;

  const handlePrint = () => {
    window.print();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Order Receipt</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Business Header */}
          <div className="text-center border-b border-gray-200 pb-4">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">EquipementPro</h3>
            <p className="text-sm text-gray-600">Point of Sale System</p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Receipt Number:</span>
              <span className="text-sm font-medium text-gray-900">
                {generateReceiptNumber(order.id)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Date:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(order.created_at)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-1" />
                Customer:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {getCustomerName(order.customer_id)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <CreditCard className="w-4 h-4 mr-1" />
                Payment:
              </span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {order.payment_method}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-900">Items Purchased</h4>
            </div>
            
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {item.products?.name || 'Unknown Product'}
                    </div>
                    <div className="text-xs text-gray-500">
                      د.ج {item.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    د.ج {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              )) || (
                <div className="text-sm text-gray-500 text-center py-4">
                  No items found
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm text-gray-900">د.ج {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tax:</span>
              <span className="text-sm text-gray-900">د.ج {tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-2">
              <span className="text-base font-semibold text-gray-900">Total:</span>
              <span className="text-base font-bold text-gray-900">د.ج {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          {order.payment_method === 'cash' && order.amount_received && (
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount Received:</span>
                <span className="text-sm text-gray-900">د.ج {order.amount_received.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Change:</span>
                <span className="text-sm text-gray-900">
                  د.ج {(order.amount_received - total).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600 mb-1">Notes:</div>
              <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                {order.notes}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-xs text-gray-500">Thank you for your business!</p>
            <p className="text-xs text-gray-400 mt-1">
              Powered by EquipementPro POS System
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrint}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceiptModal;