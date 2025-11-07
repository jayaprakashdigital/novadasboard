/*
  # Add Filter Fields to Campaigns Table

  ## Overview
  Adds additional filter fields to support comprehensive campaign filtering including
  city, region, business type, traffic source, channel, conversion type, center name, and RH.

  ## Changes to Tables
  
  ### `campaigns` table modifications
  - Add `city` (text) - City where campaign is targeted
  - Add `region` (text) - Geographic region
  - Add `bx_type` (text) - Business type/model
  - Add `traffic_source` (text) - Paid or Organic traffic
  - Add `channel` (text) - Marketing channel (Search, Display, Social, etc.)
  - Add `conversion_type` (text) - Call or Form conversion
  - Add `center_name` (text) - Center/location name
  - Add `rh` (text) - RH identifier

  ## Notes
  - All new fields are nullable to support existing records
  - Fields will be populated with sample data for demonstration
*/

-- Add new filter fields to campaigns table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'city'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'region'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN region text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'bx_type'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN bx_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'traffic_source'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN traffic_source text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'channel'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN channel text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'conversion_type'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN conversion_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'center_name'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN center_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'rh'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN rh text;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_city ON campaigns(city);
CREATE INDEX IF NOT EXISTS idx_campaigns_region ON campaigns(region);
CREATE INDEX IF NOT EXISTS idx_campaigns_bx_type ON campaigns(bx_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_traffic_source ON campaigns(traffic_source);
CREATE INDEX IF NOT EXISTS idx_campaigns_channel ON campaigns(channel);
CREATE INDEX IF NOT EXISTS idx_campaigns_conversion_type ON campaigns(conversion_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_center_name ON campaigns(center_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_rh ON campaigns(rh);

-- Update existing campaigns with sample data
UPDATE campaigns
SET 
  city = CASE 
    WHEN name LIKE '%Spring%' THEN 'New York'
    WHEN name LIKE '%Brand%' THEN 'Los Angeles'
    WHEN name LIKE '%Instagram%' THEN 'Chicago'
    WHEN name LIKE '%LinkedIn%' THEN 'San Francisco'
    ELSE 'Miami'
  END,
  region = CASE 
    WHEN name LIKE '%Spring%' THEN 'Northeast'
    WHEN name LIKE '%Brand%' THEN 'West Coast'
    WHEN name LIKE '%Instagram%' THEN 'Midwest'
    WHEN name LIKE '%LinkedIn%' THEN 'West Coast'
    ELSE 'Southeast'
  END,
  bx_type = CASE 
    WHEN platform = 'Google Ads' THEN 'B2C'
    WHEN platform = 'LinkedIn' THEN 'B2B'
    WHEN platform = 'Facebook' THEN 'B2C'
    WHEN platform = 'Instagram' THEN 'B2C'
    ELSE 'B2B'
  END,
  traffic_source = CASE 
    WHEN MOD(CAST(EXTRACT(epoch FROM created_at) AS INTEGER), 2) = 0 THEN 'Paid'
    ELSE 'Organic'
  END,
  channel = CASE 
    WHEN platform = 'Google Ads' THEN 'Search'
    WHEN platform = 'Facebook' THEN 'Social'
    WHEN platform = 'Instagram' THEN 'Social'
    WHEN platform = 'LinkedIn' THEN 'Social'
    WHEN platform = 'YouTube' THEN 'Video'
    ELSE 'Display'
  END,
  conversion_type = CASE 
    WHEN MOD(CAST(EXTRACT(epoch FROM created_at) AS INTEGER), 3) = 0 THEN 'Call'
    ELSE 'Form'
  END,
  center_name = CASE 
    WHEN name LIKE '%Spring%' THEN 'Downtown Center'
    WHEN name LIKE '%Brand%' THEN 'West Side Center'
    WHEN name LIKE '%Instagram%' THEN 'North Center'
    WHEN name LIKE '%LinkedIn%' THEN 'Tech Hub Center'
    ELSE 'South Center'
  END,
  rh = CASE 
    WHEN platform = 'Google Ads' THEN 'RH-001'
    WHEN platform = 'Facebook' THEN 'RH-002'
    WHEN platform = 'Instagram' THEN 'RH-003'
    WHEN platform = 'LinkedIn' THEN 'RH-004'
    ELSE 'RH-005'
  END
WHERE city IS NULL;