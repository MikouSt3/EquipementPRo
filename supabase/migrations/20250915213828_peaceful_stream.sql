/*
  # Fix Customers Table RLS Policy

  1. Security Updates
    - Drop existing restrictive policies on customers table
    - Create permissive policies for authenticated users
    - Add policies for anonymous users (demo purposes)
    - Enable full CRUD operations for customers

  2. Policy Changes
    - Allow authenticated users full access to customers
    - Allow anonymous users to read, insert, update, and delete customers
    - Remove policy restrictions that were blocking operations
*/

-- Drop existing policies for customers table
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON customers;
DROP POLICY IF EXISTS "Users can read own data" ON customers;
DROP POLICY IF EXISTS "Users can insert own data" ON customers;
DROP POLICY IF EXISTS "Users can update own data" ON customers;
DROP POLICY IF EXISTS "Users can delete own data" ON customers;

-- Create new permissive policies for customers
CREATE POLICY "Allow all operations for authenticated users"
  ON customers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users"
  ON customers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert for anonymous users"
  ON customers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update for anonymous users"
  ON customers
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anonymous users"
  ON customers
  FOR DELETE
  TO anon
  USING (true);