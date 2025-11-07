/*
  # Add User Management Fields

  1. Changes to user_profiles table
    - Add `phone` field for contact information
    - Add `department` field to track user department
    - Add `role` field for job title/role
    - Add `last_login` timestamp field
    - Add `created_by` field to track who created the user
    - Add `notes` field for additional information about the user

  2. Security
    - Maintains existing RLS policies
    - All fields are optional except those already required
*/

DO $$
BEGIN
  -- Add phone column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone text;
  END IF;

  -- Add department column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'department'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN department text;
  END IF;

  -- Add role column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role text;
  END IF;

  -- Add last_login column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_login timestamptz;
  END IF;

  -- Add created_by column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN created_by uuid REFERENCES user_profiles(id);
  END IF;

  -- Add notes column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'notes'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN notes text;
  END IF;
END $$;
