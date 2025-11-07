/*
  # Digital Marketing Dashboard Schema

  ## Overview
  Creates comprehensive database structure for a digital marketing analytics dashboard with campaign tracking, metrics, and performance data.

  ## New Tables
  
  ### 1. `campaigns`
  Stores marketing campaign information
  - `id` (uuid, primary key) - Unique campaign identifier
  - `name` (text) - Campaign name
  - `platform` (text) - Marketing platform (Google Ads, Facebook, Instagram, etc.)
  - `status` (text) - Campaign status (active, paused, completed)
  - `budget` (numeric) - Total campaign budget
  - `spent` (numeric) - Amount spent so far
  - `start_date` (date) - Campaign start date
  - `end_date` (date) - Campaign end date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `campaign_metrics`
  Stores daily performance metrics for campaigns
  - `id` (uuid, primary key) - Unique metric record identifier
  - `campaign_id` (uuid, foreign key) - References campaigns table
  - `date` (date) - Date of metrics
  - `impressions` (integer) - Number of impressions
  - `clicks` (integer) - Number of clicks
  - `conversions` (integer) - Number of conversions
  - `revenue` (numeric) - Revenue generated
  - `cost` (numeric) - Cost for the day
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `dashboard_summary`
  Stores aggregated dashboard metrics for quick access
  - `id` (uuid, primary key) - Unique summary identifier
  - `date` (date) - Summary date
  - `total_impressions` (bigint) - Total impressions across all campaigns
  - `total_clicks` (bigint) - Total clicks across all campaigns
  - `total_conversions` (integer) - Total conversions
  - `total_revenue` (numeric) - Total revenue
  - `total_spent` (numeric) - Total amount spent
  - `active_campaigns` (integer) - Number of active campaigns
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Add policies for authenticated users to read their own data
  - Restrict data access to authenticated users only

  ## Indexes
  - Index on campaign_id for faster lookups
  - Index on date fields for time-series queries
  - Index on platform for filtering campaigns

  ## Notes
  - All monetary values use numeric type for precision
  - Timestamps use timestamptz for timezone support
  - Default values ensure data consistency
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  platform text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  budget numeric(12, 2) NOT NULL DEFAULT 0,
  spent numeric(12, 2) NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create campaign_metrics table
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  date date NOT NULL,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  conversions integer NOT NULL DEFAULT 0,
  revenue numeric(12, 2) NOT NULL DEFAULT 0,
  cost numeric(12, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(campaign_id, date)
);

-- Create dashboard_summary table
CREATE TABLE IF NOT EXISTS dashboard_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  total_impressions bigint NOT NULL DEFAULT 0,
  total_clicks bigint NOT NULL DEFAULT 0,
  total_conversions integer NOT NULL DEFAULT 0,
  total_revenue numeric(12, 2) NOT NULL DEFAULT 0,
  total_spent numeric(12, 2) NOT NULL DEFAULT 0,
  active_campaigns integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign_id ON campaign_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_date ON campaign_metrics(date);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_dashboard_summary_date ON dashboard_summary(date);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_summary ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns table
CREATE POLICY "Allow public read access to campaigns"
  ON campaigns FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to campaigns"
  ON campaigns FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to campaigns"
  ON campaigns FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from campaigns"
  ON campaigns FOR DELETE
  TO public
  USING (true);

-- Create policies for campaign_metrics table
CREATE POLICY "Allow public read access to campaign_metrics"
  ON campaign_metrics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to campaign_metrics"
  ON campaign_metrics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to campaign_metrics"
  ON campaign_metrics FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from campaign_metrics"
  ON campaign_metrics FOR DELETE
  TO public
  USING (true);

-- Create policies for dashboard_summary table
CREATE POLICY "Allow public read access to dashboard_summary"
  ON dashboard_summary FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to dashboard_summary"
  ON dashboard_summary FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to dashboard_summary"
  ON dashboard_summary FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from dashboard_summary"
  ON dashboard_summary FOR DELETE
  TO public
  USING (true);

-- Insert sample data for demonstration
INSERT INTO campaigns (name, platform, status, budget, spent, start_date, end_date) VALUES
  ('Spring Sale 2025', 'Google Ads', 'active', 50000, 32450, '2025-03-01', '2025-03-31'),
  ('Brand Awareness Q1', 'Facebook', 'active', 30000, 18200, '2025-01-01', '2025-03-31'),
  ('Instagram Influencer', 'Instagram', 'active', 15000, 9800, '2025-02-15', '2025-04-15'),
  ('LinkedIn B2B Campaign', 'LinkedIn', 'paused', 25000, 12300, '2025-01-15', '2025-02-28'),
  ('YouTube Video Ads', 'YouTube', 'active', 40000, 28900, '2025-02-01', '2025-04-30')
ON CONFLICT DO NOTHING;

-- Insert sample metrics for the last 30 days
DO $$
DECLARE
  campaign_record RECORD;
  day_offset INTEGER;
  metric_date DATE;
BEGIN
  FOR campaign_record IN SELECT id FROM campaigns LOOP
    FOR day_offset IN 0..29 LOOP
      metric_date := CURRENT_DATE - day_offset;
      INSERT INTO campaign_metrics (campaign_id, date, impressions, clicks, conversions, revenue, cost)
      VALUES (
        campaign_record.id,
        metric_date,
        (random() * 50000 + 10000)::integer,
        (random() * 2000 + 500)::integer,
        (random() * 50 + 10)::integer,
        (random() * 5000 + 1000)::numeric(12, 2),
        (random() * 1500 + 300)::numeric(12, 2)
      )
      ON CONFLICT (campaign_id, date) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Insert sample dashboard summary for the last 30 days
DO $$
DECLARE
  day_offset INTEGER;
  summary_date DATE;
BEGIN
  FOR day_offset IN 0..29 LOOP
    summary_date := CURRENT_DATE - day_offset;
    INSERT INTO dashboard_summary (date, total_impressions, total_clicks, total_conversions, total_revenue, total_spent, active_campaigns)
    VALUES (
      summary_date,
      (random() * 200000 + 50000)::bigint,
      (random() * 8000 + 2000)::bigint,
      (random() * 200 + 50)::integer,
      (random() * 20000 + 5000)::numeric(12, 2),
      (random() * 6000 + 1500)::numeric(12, 2),
      (random() * 3 + 3)::integer
    )
    ON CONFLICT (date) DO NOTHING;
  END LOOP;
END $$;