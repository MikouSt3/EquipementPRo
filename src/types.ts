export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  minStock: number;
  image?: string;
  description?: string;
  highlighted?: boolean;
  onlineCatalog?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Order {
  id: string;
  customer?: Customer;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
}