/*
  # Add User Details Tracking Table

  1. New Tables
    - `user_details`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text, unique)
      - `username` (text, unique)
      - `status` (text) - Active, Inactive, Pending, Banned, Suspended
      - `role` (text) - Admin, User, Moderator, Guest
      - `joined_date` (timestamptz)
      - `last_active` (timestamptz)
      - `avatar_url` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_details` table
    - Add policies for:
      - Admins can read all user details
      - Users can read their own details
      - Admins can update all user details
      - Users can update their own details (except role and status)
      - Admins can insert new user details
*/

CREATE TABLE IF NOT EXISTS user_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Pending', 'Banned', 'Suspended')),
  role text NOT NULL DEFAULT 'User' CHECK (role IN ('Admin', 'User', 'Moderator', 'Guest')),
  joined_date timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all user details"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.access_level = 'admin'
    )
  );

CREATE POLICY "Users can read own user details"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update all user details"
  ON user_details
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.access_level = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.access_level = 'admin'
    )
  );

CREATE POLICY "Users can update own user details"
  ON user_details
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND status = (SELECT status FROM user_details WHERE user_id = auth.uid())
    AND role = (SELECT role FROM user_details WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can insert user details"
  ON user_details
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.access_level = 'admin'
    )
  );

CREATE POLICY "Admins can delete user details"
  ON user_details
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.access_level = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_user_details_user_id ON user_details(user_id);
CREATE INDEX IF NOT EXISTS idx_user_details_email ON user_details(email);
CREATE INDEX IF NOT EXISTS idx_user_details_username ON user_details(username);
CREATE INDEX IF NOT EXISTS idx_user_details_status ON user_details(status);
CREATE INDEX IF NOT EXISTS idx_user_details_role ON user_details(role);
