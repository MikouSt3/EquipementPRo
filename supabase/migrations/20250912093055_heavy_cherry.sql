/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `price` (decimal, required)
      - `category` (text, default 'General')
      - `stock` (integer, default 0)
      - `min_stock` (integer, default 5)
      - `image` (text, optional)
      - `description` (text, optional)
      - `highlighted` (boolean, default false)
      - `online_catalog` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for authenticated users to manage products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  category text DEFAULT 'General',
  stock integer DEFAULT 0,
  min_stock integer DEFAULT 5,
  image text,
  description text,
  highlighted boolean DEFAULT false,
  online_catalog boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample product
INSERT INTO products (name, price, category, stock, min_stock, description, highlighted, online_catalog)
VALUES ('Accouplement', 3000.00, 'Parts', 15, 5, 'Automotive coupling part', false, true)
ON CONFLICT DO NOTHING;