import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, CartItem } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new product
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: productData.price,
          category: productData.category || 'General',
          stock: productData.stock || 0,
          min_stock: productData.minStock || 5,
          image: productData.image,
          description: productData.description,
          highlighted: productData.highlighted || false,
          online_catalog: productData.onlineCatalog || false,
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newProduct: Product = {
          id: data.id,
          name: data.name,
          price: data.price,
          category: data.category,
          stock: data.stock,
          minStock: data.min_stock,
          image: data.image,
          description: data.description,
          highlighted: data.highlighted,
          onlineCatalog: data.online_catalog,
        };
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      console.error('Error adding product:', err);
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          min_stock: productData.minStock,
          image: productData.image,
          description: productData.description,
          highlighted: productData.highlighted,
          online_catalog: productData.onlineCatalog,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const updatedProduct: Product = {
          id: data.id,
          name: data.name,
          price: data.price,
          category: data.category,
          stock: data.stock,
          minStock: data.min_stock,
          image: data.image,
          description: data.description,
          highlighted: data.highlighted,
          onlineCatalog: data.online_catalog,
        };
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      setCart(prev => prev.filter(item => item.product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Create order
  const createOrder = async (orderData: {
    customerId?: string;
    notes?: string;
    paymentMethod: string;
    amountReceived?: number;
  }) => {
    try {
      const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: orderData.customerId,
          total,
          notes: orderData.notes,
          payment_method: orderData.paymentMethod,
          amount_received: orderData.amountReceived,
          status: 'completed',
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of cart) {
        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock: Math.max(0, item.product.stock - item.quantity),
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.product.id);

        if (stockError) console.error('Error updating stock:', stockError);
      }

      // Refresh products to get updated stock
      await fetchProducts();
      clearCart();

      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      console.error('Error creating order:', err);
      throw err;
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    cart,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    refetchProducts: fetchProducts,
  };
};