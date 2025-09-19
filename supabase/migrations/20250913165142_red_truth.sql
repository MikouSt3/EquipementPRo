/*
  # Fix Row Level Security Policies

  1. Security Updates
    - Drop existing restrictive policies
    - Add permissive policies for authenticated users
    - Allow full CRUD operations on all tables
    - Ensure proper access for the application

  2. Tables Updated
    - products: Allow all operations for authenticated users
    - customers: Allow all operations for authenticated users  
    - orders: Allow all operations for authenticated users
    - order_items: Allow all operations for authenticated users
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON products;
DROP POLICY IF EXISTS "Users can manage products" ON products;
DROP POLICY IF EXISTS "Users can manage customers" ON customers;
DROP POLICY IF EXISTS "Users can manage orders" ON orders;
DROP POLICY IF EXISTS "Users can manage order items" ON order_items;

-- Create permissive policies for products table
CREATE POLICY "Enable all operations for authenticated users" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for customers table
CREATE POLICY "Enable all operations for authenticated users" ON customers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for orders table
CREATE POLICY "Enable all operations for authenticated users" ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for order_items table
CREATE POLICY "Enable all operations for authenticated users" ON order_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anonymous access for demo purposes (remove in production)
CREATE POLICY "Enable read for anonymous users" ON products
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Enable insert for anonymous users" ON products
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Enable update for anonymous users" ON products
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for anonymous users" ON products
  FOR DELETE
  TO anon
  USING (true);