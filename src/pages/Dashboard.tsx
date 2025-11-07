import { useEffect, useState } from 'react';
import {
  TrendingUp,
  MousePointerClick,
  Eye,
  DollarSign,
  Target,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { supabase, Campaign, DashboardSummary } from '../lib/supabase';
import MetricCard from '../components/MetricCard';
import CampaignTable from '../components/CampaignTable';
import PerformanceChart from '../components/PerformanceChart';
import FilterSidebar, { Filters } from '../components/FilterSidebar';

interface AggregatedMetrics {
  totalRevenue: number;
  totalSpent: number;
  totalClicks: number;
  totalImpressions: number;
  totalConversions: number;
  roi: number;
  ctr: number;
}

export default function Dashboard() {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [summaryData, setSummaryData] = useState<DashboardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    platform: 'all',
    status: 'all',
    city: 'all',
    region: 'all',
    bxType: 'all',
    trafficSource: 'all',
    channel: 'all',
    conversionType: 'all',
    centerName: 'all',
    rh: 'all',
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      label: 'Last 30 Days',
    },
  });

  const [filterOptions, setFilterOptions] = useState({
    platforms: [] as string[],
    cities: [] as string[],
    regions: [] as string[],
    bxTypes: [] as string[],
    trafficSources: [] as string[],
    channels: [] as string[],
    conversionTypes: [] as string[],
    centerNames: [] as string[],
    rhs: [] as string[],
  });

  const fetchData = async () => {
    try {
      const [campaignsRes, summaryRes] = await Promise.all([
        supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('dashboard_summary')
          .select('*')
          .order('date', { ascending: false })
          .limit(30)
      ]);

      if (campaignsRes.data) {
        setAllCampaigns(campaignsRes.data);

        const uniquePlatforms = [...new Set(campaignsRes.data.map((c) => c.platform))];
        const uniqueCities = [...new Set(campaignsRes.data.map((c) => c.city).filter(Boolean))] as string[];
        const uniqueRegions = [...new Set(campaignsRes.data.map((c) => c.region).filter(Boolean))] as string[];
        const uniqueBxTypes = [...new Set(campaignsRes.data.map((c) => c.bx_type).filter(Boolean))] as string[];
        const uniqueTrafficSources = [...new Set(campaignsRes.data.map((c) => c.traffic_source).filter(Boolean))] as string[];
        const uniqueChannels = [...new Set(campaignsRes.data.map((c) => c.channel).filter(Boolean))] as string[];
        const uniqueConversionTypes = [...new Set(campaignsRes.data.map((c) => c.conversion_type).filter(Boolean))] as string[];
        const uniqueCenterNames = [...new Set(campaignsRes.data.map((c) => c.center_name).filter(Boolean))] as string[];
        const uniqueRhs = [...new Set(campaignsRes.data.map((c) => c.rh).filter(Boolean))] as string[];

        setFilterOptions({
          platforms: uniquePlatforms,
          cities: uniqueCities,
          regions: uniqueRegions,
          bxTypes: uniqueBxTypes,
          trafficSources: uniqueTrafficSources,
          channels: uniqueChannels,
          conversionTypes: uniqueConversionTypes,
          centerNames: uniqueCenterNames,
          rhs: uniqueRhs,
        });
      }

      if (summaryRes.data && summaryRes.data.length > 0) {
        setSummaryData(summaryRes.data);

        const latest = summaryRes.data[0];
        const previous = summaryRes.data[7] || summaryRes.data[summaryRes.data.length - 1];

        const roi = latest.total_revenue > 0
          ? ((latest.total_revenue - latest.total_spent) / latest.total_spent) * 100
          : 0;

        const ctr = latest.total_impressions > 0
          ? (latest.total_clicks / latest.total_impressions) * 100
          : 0;

        const prevRoi = previous.total_revenue > 0
          ? ((previous.total_revenue - previous.total_spent) / previous.total_spent) * 100
          : 0;

        const prevCtr = previous.total_impressions > 0
          ? (previous.total_clicks / previous.total_impressions) * 100
          : 0;

        setMetrics({
          totalRevenue: latest.total_revenue,
          totalSpent: latest.total_spent,
          totalClicks: latest.total_clicks,
          totalImpressions: latest.total_impressions,
          totalConversions: latest.total_conversions,
          roi,
          ctr,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [allCampaigns, filters]);

  const filterCampaigns = () => {
    let filtered = [...allCampaigns];

    if (filters.search) {
      filtered = filtered.filter((campaign) =>
        campaign.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.platform !== 'all') {
      filtered = filtered.filter((campaign) => campaign.platform === filters.platform);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((campaign) => campaign.status === filters.status);
    }

    if (filters.city !== 'all') {
      filtered = filtered.filter((campaign) => campaign.city === filters.city);
    }

    if (filters.region !== 'all') {
      filtered = filtered.filter((campaign) => campaign.region === filters.region);
    }

    if (filters.bxType !== 'all') {
      filtered = filtered.filter((campaign) => campaign.bx_type === filters.bxType);
    }

    if (filters.trafficSource !== 'all') {
      filtered = filtered.filter((campaign) => campaign.traffic_source === filters.trafficSource);
    }

    if (filters.channel !== 'all') {
      filtered = filtered.filter((campaign) => campaign.channel === filters.channel);
    }

    if (filters.conversionType !== 'all') {
      filtered = filtered.filter((campaign) => campaign.conversion_type === filters.conversionType);
    }

    if (filters.centerName !== 'all') {
      filtered = filtered.filter((campaign) => campaign.center_name === filters.centerName);
    }

    if (filters.rh !== 'all') {
      filtered = filtered.filter((campaign) => campaign.rh === filters.rh);
    }

    setCampaigns(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = summaryData.map(s => ({
    date: s.date,
    revenue: s.total_revenue,
    cost: s.total_spent,
  }));

  return (
    <>
      <FilterSidebar filters={filters} onFilterChange={setFilters} filterOptions={filterOptions} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Marketing Dashboard</h1>
              <p className="text-gray-600">Track and analyze your campaign performance</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium text-gray-700">Refresh</span>
            </button>
          </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(metrics.totalRevenue)}
              change={12.5}
              icon={DollarSign}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <MetricCard
              title="Total Spent"
              value={formatCurrency(metrics.totalSpent)}
              change={8.2}
              icon={TrendingUp}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <MetricCard
              title="Impressions"
              value={formatNumber(metrics.totalImpressions)}
              change={15.3}
              icon={Eye}
              iconColor="text-violet-600"
              iconBg="bg-violet-50"
            />
            <MetricCard
              title="Clicks"
              value={formatNumber(metrics.totalClicks)}
              change={9.7}
              icon={MousePointerClick}
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PerformanceChart data={chartData} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics ? ((metrics.totalConversions / metrics.totalClicks) * 100).toFixed(2) : 0}%
                  </p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{ width: `${metrics ? Math.min(((metrics.totalConversions / metrics.totalClicks) * 100), 100) : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">ROI</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics ? metrics.roi.toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Return on investment across all campaigns
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Active Campaigns</h3>
              <p className="text-4xl font-bold mb-1">{campaigns.filter(c => c.status === 'active').length}</p>
              <p className="text-sm opacity-80">out of {campaigns.length} total</p>
            </div>
          </div>
        </div>

          <CampaignTable campaigns={campaigns} />
        </div>
      </div>
    </>
  );
}
