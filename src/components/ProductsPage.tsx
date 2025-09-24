import React, { useState } from 'react';
import { Search, Filter, FolderOpen, FileText, Download, Plus, Star, Trash2, AlertTriangle, X } from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ProductsPageProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onAddProduct, onEditProduct }) => {
  const { products, loading, error, deleteProduct, refetchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockNotification, setShowLowStockNotification] = useState(true);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalCost = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockCount = products.filter(product => product.stock <= product.minStock).length;
  const outOfStockCount = products.filter(product => product.stock === 0).length;
  const lowStockProducts = products.filter(product => product.stock > 0 && product.stock <= product.minStock);
  const outOfStockProducts = products.filter(product => product.stock === 0);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetchProducts} />;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Items</h1>
            <p className="text-sm text-gray-500">{products.length} registered items</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <span className="text-sm">Help</span>
            </button>
            
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">KL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {/* Low Stock Notification */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && showLowStockNotification && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  {outOfStockProducts.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-red-800">
                        Out of Stock Alert
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {outOfStockProducts.length} product{outOfStockProducts.length > 1 ? 's are' : ' is'} out of stock:
                      </p>
                      <div className="mt-2 space-y-1">
                        {outOfStockProducts.slice(0, 3).map((product) => (
                          <div key={product.id} className="text-sm text-red-700">
                            • <span className="font-medium">{product.name}</span> - Out of stock
                          </div>
                        ))}
                        {outOfStockProducts.length > 3 && (
                          <div className="text-sm text-red-700">
                            • and {outOfStockProducts.length - 3} more out of stock...
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {lowStockProducts.length > 0 && (
                    <>
                      <h3 className={`text-sm font-medium ${outOfStockProducts.length > 0 ? 'mt-4' : ''} text-orange-800`}>
                        Low Stock Alert
                      </h3>
                      <p className="text-sm text-orange-700 mt-1">
                        {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's are' : ' is'} running low on stock:
                      </p>
                      <div className="mt-2 space-y-1">
                        {lowStockProducts.slice(0, 3).map((product) => (
                          <div key={product.id} className="text-sm text-orange-700">
                            • <span className="font-medium">{product.name}</span> - {product.stock} left (min: {product.minStock})
                          </div>
                        ))}
                        {lowStockProducts.length > 3 && (
                          <div className="text-sm text-orange-700">
                            • and {lowStockProducts.length - 3} more running low...
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowLowStockNotification(false)}
                className="text-orange-400 hover:text-orange-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Out of Stock Notification - Separate red notification for critical items */}
        {outOfStockProducts.length > 0 && !showLowStockNotification && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Critical: Out of Stock
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {outOfStockProducts.length} product{outOfStockProducts.length > 1 ? 's are' : ' is'} completely out of stock and cannot be sold.
                  </p>
                  <div className="mt-2 space-y-1">
                    {outOfStockProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="text-sm text-red-700">
                        • <span className="font-medium">{product.name}</span> - Needs restocking
                      </div>
                    ))}
                    {outOfStockProducts.length > 5 && (
                      <div className="text-sm text-red-700">
                        • and {outOfStockProducts.length - 5} more out of stock...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {/* Could add separate state for this notification */}}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Item or code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
              />
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderOpen className="w-4 h-4" />
              <span className="text-sm">Categories</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Generate Report</span>
            </button>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onAddProduct}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Product</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total in stock</div>
            <div className="text-lg font-semibold">د.ج {totalValue.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Cost of stock</div>
            <div className="text-lg font-semibold">د.ج {totalCost.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Projected profit</div>
            <div className="text-lg font-semibold">د.ج 0.00</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Low in stock
            </div>
            <div className={`text-lg font-semibold ${lowStockProducts.length > 0 ? 'text-orange-600' : ''}`}>
              {lowStockProducts.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Out of stock
            </div>
            <div className={`text-lg font-semibold ${outOfStockCount > 0 ? 'text-red-600' : ''}`}>
              {outOfStockCount}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-1"></div>
              <div className="col-span-3">Products</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Catalog</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className={`w-4 h-4 ${product.highlighted ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="col-span-3 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {product.name.substring(0, 6)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description || 'No description'}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </div>
                  
                  <div className="col-span-1">
                    <span className="text-sm text-gray-900">{product.stock}</span>
                    {product.stock === 0 && (
                      <div className="text-xs text-red-600 font-medium">Out of stock</div>
                    )}
                    {product.stock > 0 && product.stock <= product.minStock && (
                      <div className="text-xs text-orange-600 font-medium">Low stock</div>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-900">د.ج {product.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        product.onlineCatalog ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          product.onlineCatalog ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {product.onlineCatalog ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No products found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;