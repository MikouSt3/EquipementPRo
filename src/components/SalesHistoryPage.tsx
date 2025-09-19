import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, FileText, Trash2, Eye, Download, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useCustomers } from '../hooks/useCustomers';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import OrderReceiptModal from './OrderReceiptModal';

interface SalesHistoryPageProps {
  onNavigateToProducts?: () => void;
  onEditProduct?: (product: any) => void;
}

const SalesHistoryPage: React.FC<SalesHistoryPageProps> = ({ onNavigateToProducts, onEditProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Get orders and customers from database
  const { orders, loading, error, deleteOrder, refetchOrders } = useOrders();
  const { customers } = useCustomers();

  // Calculate statistics
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate.toDateString() === today.toDateString();
  });

  const yesterdayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate.toDateString() === yesterday.toDateString();
  });

  const thisWeekOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= thisWeekStart;
  });

  const thisMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= thisMonthStart;
  });

  const todayStats = {
    count: todayOrders.length,
    total: todayOrders.reduce((sum, order) => sum + order.total, 0)
  };

  const yesterdayStats = {
    count: yesterdayOrders.length,
    total: yesterdayOrders.reduce((sum, order) => sum + order.total, 0)
  };

  const thisWeekStats = {
    count: thisWeekOrders.length,
    total: thisWeekOrders.reduce((sum, order) => sum + order.total, 0)
  };

  const thisMonthStats = {
    count: thisMonthOrders.length,
    total: thisMonthOrders.reduce((sum, order) => sum + order.total, 0)
  };

  // Get customer name by ID
  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'Walk-in Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generate receipt number
  const generateReceiptNumber = (orderId: string, index: number) => {
    return `#${index + 1}-${orderId.slice(-4)}`;
  };

  const filteredOrders = orders.filter(order => {
    const customerName = getCustomerName(order.customer_id);
    const receiptNumber = generateReceiptNumber(order.id, orders.indexOf(order));
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeller = selectedSeller === 'all' || selectedSeller === 'Klizo'; // Default seller
    return matchesSearch && matchesSeller;
  });

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleViewOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrderForReceipt(order);
      setShowReceiptModal(true);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceiptModal(false);
    setSelectedOrderForReceipt(null);
  };

  const exportOrders = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };
  if (loading) return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Sales history</h1>
      </div>
      <LoadingSpinner />
    </div>
  );
  
  if (error) return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Sales history</h1>
      </div>
      <ErrorMessage message={error} onRetry={refetchOrders} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sales history</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
              <span className="text-sm">Help</span>
            </button>
            
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">KL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Customer name or product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-80"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowSellerDropdown(!showSellerDropdown)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">All sellers</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSellerDropdown && (
                <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedSeller('all');
                        setShowSellerDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      All sellers
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSeller('Klizo');
                        setShowSellerDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Klizo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={exportOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Today: {todayStats.count} sale{todayStats.count !== 1 ? 's' : ''}</div>
            <div className="text-lg font-semibold text-gray-900">د.ج {todayStats.total.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Yesterday: {yesterdayStats.count} sale{yesterdayStats.count !== 1 ? 's' : ''}</div>
            <div className="text-lg font-semibold text-gray-900">د.ج {yesterdayStats.total.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">This week: {thisWeekStats.count} sale{thisWeekStats.count !== 1 ? 's' : ''}</div>
            <div className="text-lg font-semibold text-gray-900">د.ج {thisWeekStats.total.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">This month: {thisMonthStats.count} sale{thisMonthStats.count !== 1 ? 's' : ''}</div>
            <div className="text-lg font-semibold text-gray-900">د.ج {thisMonthStats.total.toLocaleString()}</div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-1">Receipt</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-1">Seller</div>
              <div className="col-span-1">Items</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Obs.</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order, index) => (
              <div key={order.id}>
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {generateReceiptNumber(order.id, index)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <button
                        onClick={() => {
                          onNavigateToProducts?.();
                        }}
                        className="text-sm text-gray-900 hover:text-emerald-600 hover:underline transition-colors cursor-pointer text-left"
                      >
                        {getCustomerName(order.customer_id)}
                      </button>
                    </div>
                    
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            K
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">Klizo</span>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        <span className="text-sm">
                          {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                        </span>
                        {expandedOrders.has(order.id) && (order.order_items?.length || 0) > 0 ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs">💰</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          د.ج {order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-sm text-gray-600">-</span>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-sm text-gray-600">-</span>
                    </div>
                    
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Items */}
                {expandedOrders.has(order.id) && order.order_items && order.order_items.length > 0 && (
                  <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                    <div className="pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Order Items:</span>
                      </div>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {item.products?.name?.substring(0, 2) || 'PR'}
                                </span>
                              </div>
                              <div>
                                <button
                                  onClick={() => onEditProduct && onEditProduct(item.products)}
                                  className="text-sm font-medium text-gray-900 hover:text-emerald-600 hover:underline transition-colors cursor-pointer text-left"
                                >
                                  {item.products?.name || 'Unknown Product'}
                                </button>
                                <div className="text-xs text-gray-500">
                                  Unit price: د.ج {item.price.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {item.quantity}x = د.ج {(item.price * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Order Total:</span>
                          <span className="text-sm font-bold text-gray-900">د.ج {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {orders.length === 0 ? 'No sales recorded yet' : 'No sales found'}
            </div>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Order Receipt Modal */}
      <OrderReceiptModal
        order={selectedOrderForReceipt}
        isOpen={showReceiptModal}
        onClose={handleCloseReceipt}
        customers={customers}
      />
    </div>
  );
};

export default SalesHistoryPage;