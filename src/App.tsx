import React, { useState } from 'react';
import { Search, ChevronDown, BarChart3, List } from 'lucide-react';
import PinLogin from './components/PinLogin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import ProductForm from './components/ProductForm';
import ProductsPage from './components/ProductsPage';
import CustomersPage from './components/CustomersPage';
import CustomerForm from './components/CustomerForm';
import CheckoutPage from './components/CheckoutPage';
import AnalyticsPage from './components/AnalyticsPage';
import SalesHistoryPage from './components/SalesHistoryPage';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import SuccessNotification from './components/SuccessNotification';
import { useProducts } from './hooks/useProducts';
import { useCustomers } from './hooks/useCustomers';
import { useNotification } from './hooks/useNotification';
import { Customer } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('sell');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const { notification, showSuccess, showError, hideNotification } = useNotification();

  const {
    products,
    cart,
    loading: productsLoading,
    error: productsError,
    addProduct,
    updateProduct,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    refetchProducts,
  } = useProducts();

  const {
    customers,
    loading: customersLoading,
    error: customersError,
    addCustomer,
    updateCustomer,
  } = useCustomers();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSave = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCustomerSave = (customerData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setShowCustomerForm(false);
    setEditingCustomer(null);
  };

  const handleCheckout = async () => {
    setShowCheckout(true);
  };

  const handleFinishSale = async (orderData: {
    customerId?: string;
    notes?: string;
    paymentMethod: string;
    amountReceived?: number;
  }) => {
    try {
      await createOrder(orderData);
      showSuccess('Sale completed successfully! 🎉');
      setShowCheckout(false);
    } catch (error) {
      showError('Failed to complete sale. Please try again.');
    }
  };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <PinLogin onLogin={handleLogin} />;
  }

  if (activeSection === 'customers') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        {showCustomerForm ? (
          <CustomerForm
            customer={editingCustomer}
            onSave={handleCustomerSave}
            onCancel={() => {
              setShowCustomerForm(false);
              setEditingCustomer(null);
            }}
          />
        ) : (
          <CustomersPage
            onAddCustomer={() => setShowCustomerForm(true)}
            onEditCustomer={(customer) => {
              setEditingCustomer(customer);
              setShowCustomerForm(true);
            }}
          />
        )}
      </div>
    );
  }

  if (activeSection === 'sales-history') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <SalesHistoryPage 
          onNavigateToProducts={() => setActiveSection('products')}
          onEditProduct={(product) => {
            setEditingProduct(product);
            setShowProductForm(true);
          }}
        />
      </div>
    );
  }

  if (activeSection === 'products') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <ProductsPage
          onAddProduct={() => setShowProductForm(true)}
          onEditProduct={(product) => {
            setEditingProduct(product);
            setShowProductForm(true);
          }}
        />
      </div>
    );
  }

  if (activeSection === 'analytics') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <AnalyticsPage />
      </div>
    );
  }

  if (showCustomerForm) {
    return (
      <CustomerForm
        customer={editingCustomer}
        onSave={handleCustomerSave}
        onCancel={() => {
          setShowCustomerForm(false);
          setEditingCustomer(null);
        }}
      />
    );
  }

  if (showProductForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleProductSave}
        onCancel={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  if (showCheckout) {
    return (
      <CheckoutPage
        items={cart}
        selectedCustomer={selectedCustomer}
        customers={customers}
        onBack={handleBackFromCheckout}
        onFinishSale={handleFinishSale}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Sell"
          selectedCustomer={selectedCustomer}
          onCustomerSelect={setSelectedCustomer}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name or code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm">Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-5 h-5" />
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto">
              {productsLoading ? (
                <LoadingSpinner />
              ) : productsError ? (
                <ErrorMessage 
                  message={productsError} 
                  onRetry={refetchProducts}
                />
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  cart={cart}
                  onProductSelect={addToCart}
                  onAddProduct={() => setShowProductForm(true)}
                />
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="border-l border-gray-200">
            <Cart
              items={cart}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
      
      {/* Success Notification */}
      <SuccessNotification
        isVisible={notification.isVisible && notification.type === 'success'}
        message={notification.message}
        onClose={hideNotification}
        autoCloseDelay={4000}
      />
    </div>
  );
}

export default App;