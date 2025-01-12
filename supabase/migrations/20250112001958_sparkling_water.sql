/*
  # Schéma initial pour l'application de livraison

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `role` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `deliveries`
      - `id` (uuid, primary key)
      - `pickup_address` (text)
      - `delivery_address` (text)
      - `status` (text)
      - `price` (integer)
      - `distance` (float)
      - `client_id` (uuid, foreign key)
      - `driver_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS sur toutes les tables
    - Policies pour les profils et les livraisons
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('client', 'driver')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deliveries table
CREATE TABLE deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_address text NOT NULL,
  delivery_address text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'picked', 'delivered', 'cancelled')),
  price integer NOT NULL CHECK (price >= 0),
  distance float NOT NULL CHECK (distance >= 0),
  client_id uuid REFERENCES profiles(id) NOT NULL,
  driver_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Deliveries policies
CREATE POLICY "Clients can view their own deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR driver_id = auth.uid());

CREATE POLICY "Clients can create deliveries"
  ON deliveries FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid() AND role() = 'authenticated');

CREATE POLICY "Drivers can view available deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (status = 'pending' OR driver_id = auth.uid());

CREATE POLICY "Drivers can update assigned deliveries"
  ON deliveries FOR UPDATE
  TO authenticated
  USING (driver_id = auth.uid());