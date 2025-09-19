import React, { useState } from 'react';
import { ArrowLeft, Camera, Star, Globe, HelpCircle, ChevronDown, Image, Palette } from 'lucide-react';
import { Product } from '../types';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0,
    minStock: product?.minStock || 5,
    description: product?.description || '',
    highlighted: product?.highlighted || false,
    onlineCatalog: product?.onlineCatalog || false,
    image: product?.image || '',
  });

  const [stockManagement, setStockManagement] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add a product
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <HelpCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">Help</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
              <span className="text-sm">Duplicate</span>
            </button>
            
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">KL</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Toggle Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-base font-medium text-gray-900">Highlight product</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.highlighted}
                    onChange={(e) => setFormData(prev => ({ ...prev, highlighted: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-base font-medium text-gray-900">Show on Online Catalog</div>
                    <div className="text-sm text-gray-500">You haven't got a catalog yet</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.onlineCatalog}
                    onChange={(e) => setFormData(prev => ({ ...prev, onlineCatalog: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            {/* Product Preview */}
            <div className="bg-gray-200 rounded-xl p-8 flex items-center justify-center" style={{ minHeight: '300px' }}>
              <div className="bg-slate-600 text-white px-8 py-12 rounded-lg text-center min-w-[200px]">
                <div className="text-lg font-medium mb-2">Label</div>
                <div className="text-xl font-semibold mb-2">
                  {formData.name || 'Product name'}
                </div>
                <div className="text-sm opacity-90">
                  د.ج {formData.price.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Label Color and Photos */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-4 h-4 bg-slate-600 rounded"></div>
                <span className="text-sm">Label color</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Image className="w-4 h-4" />
                <span className="text-sm">Photos</span>
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Feature */}
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center space-x-2 mb-3">
                <span className="font-semibold text-emerald-800 text-lg">Automatic registration</span>
                <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">BETA</span>
                <button className="text-emerald-600 hover:text-emerald-700">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-emerald-700 mb-4 leading-relaxed">
                <strong>Just upload a photo:</strong> the AI quickly fills in the name, price, category, and description.
                Everything's ready in seconds, and you can still adjust it as you like.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Select a photo</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  placeholder="Product name"
                  required
                />
              </div>

              <div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  placeholder="Price"
                  required
                />
              </div>
            </div>

            {/* Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-4">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-base"
                  rows={4}
                  placeholder="Product description..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stock Section - Full Width */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div></div> {/* Empty left column for alignment */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Stock</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Manage stock for this product</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={stockManagement}
                    onChange={(e) => setStockManagement(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            {stockManagement && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                    placeholder="On hand"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                    placeholder="Minimum"
                  />
                </div>
              </div>
            )}

            {/* Stock Movement */}
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-900 mb-3">Stock Movement</h4>
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-sm">Show results</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;