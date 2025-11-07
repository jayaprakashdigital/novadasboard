import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  city?: string;
  region?: string;
  bx_type?: string;
  traffic_source?: string;
  channel?: string;
  conversion_type?: string;
  center_name?: string;
  rh?: string;
}

export interface CampaignMetric {
  id: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  created_at: string;
}

export interface DashboardSummary {
  id: string;
  date: string;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_revenue: number;
  total_spent: number;
  active_campaigns: number;
  created_at: string;
}
