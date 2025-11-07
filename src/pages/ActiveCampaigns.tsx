import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Filter, Upload } from 'lucide-react';
import { supabase, Campaign, CampaignMetric } from '../lib/supabase';
import FilterSidebar, { Filters } from '../components/FilterSidebar';
import ExcelUpload from '../components/ExcelUpload';

interface CampaignWithMetrics extends Campaign {
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    totalCost: number;
    ctr: number;
    conversionRate: number;
    roi: number;
  };
}

export default function ActiveCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignWithMetrics[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
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

  useEffect(() => {
    fetchCampaigns();
  }, [filters.dateRange]);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, filters]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsData) {
        const campaignsWithMetrics = await Promise.all(
          campaignsData.map(async (campaign) => {
            const { data: metricsData } = await supabase
              .from('campaign_metrics')
              .select('*')
              .eq('campaign_id', campaign.id)
              .gte('date', filters.dateRange.startDate)
              .lte('date', filters.dateRange.endDate);

            const metrics = calculateMetrics(metricsData || []);

            return {
              ...campaign,
              metrics,
            };
          })
        );

        setCampaigns(campaignsWithMetrics);

        const uniquePlatforms = [...new Set(campaignsData.map((c) => c.platform))];
        const uniqueCities = [...new Set(campaignsData.map((c) => c.city).filter(Boolean))] as string[];
        const uniqueRegions = [...new Set(campaignsData.map((c) => c.region).filter(Boolean))] as string[];
        const uniqueBxTypes = [...new Set(campaignsData.map((c) => c.bx_type).filter(Boolean))] as string[];
        const uniqueTrafficSources = [...new Set(campaignsData.map((c) => c.traffic_source).filter(Boolean))] as string[];
        const uniqueChannels = [...new Set(campaignsData.map((c) => c.channel).filter(Boolean))] as string[];
        const uniqueConversionTypes = [...new Set(campaignsData.map((c) => c.conversion_type).filter(Boolean))] as string[];
        const uniqueCenterNames = [...new Set(campaignsData.map((c) => c.center_name).filter(Boolean))] as string[];
        const uniqueRhs = [...new Set(campaignsData.map((c) => c.rh).filter(Boolean))] as string[];

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
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (metricsData: CampaignMetric[]) => {
    const totals = metricsData.reduce(
      (acc, metric) => ({
        totalImpressions: acc.totalImpressions + metric.impressions,
        totalClicks: acc.totalClicks + metric.clicks,
        totalConversions: acc.totalConversions + metric.conversions,
        totalRevenue: acc.totalRevenue + Number(metric.revenue),
        totalCost: acc.totalCost + Number(metric.cost),
      }),
      {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalRevenue: 0,
        totalCost: 0,
      }
    );

    const ctr = totals.totalImpressions > 0 ? (totals.totalClicks / totals.totalImpressions) * 100 : 0;
    const conversionRate = totals.totalClicks > 0 ? (totals.totalConversions / totals.totalClicks) * 100 : 0;
    const roi = totals.totalCost > 0 ? ((totals.totalRevenue - totals.totalCost) / totals.totalCost) * 100 : 0;

    return {
      ...totals,
      ctr,
      conversionRate,
      roi,
    };
  };

  const filterCampaigns = () => {
    let filtered = [...campaigns];

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

    setFilteredCampaigns(filtered);
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        filterOptions={filterOptions}
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
      <ExcelUpload
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => {
          fetchCampaigns();
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:ml-64 pt-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Active Campaigns</h1>
              <p className="text-sm sm:text-base text-gray-600">Monitor and analyze your campaign performance</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Upload Excel</span>
                <span className="font-medium sm:hidden">Upload</span>
              </button>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Campaign Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Platform
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Region
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    BX Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Traffic
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Channel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Conv. Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Center
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Spent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    ROI
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    CTR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-xs text-gray-500">{campaign.rh}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
                        {campaign.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : campaign.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{campaign.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{campaign.region}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{campaign.bx_type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                          campaign.traffic_source === 'Paid' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {campaign.traffic_source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{campaign.channel}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{campaign.conversion_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{campaign.center_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {formatCurrency(campaign.spent)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrency(campaign.metrics.totalRevenue)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <span
                          className={`text-sm font-semibold ${
                            campaign.metrics.roi > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {campaign.metrics.roi.toFixed(1)}%
                        </span>
                        {campaign.metrics.roi > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{formatNumber(campaign.metrics.totalClicks)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{campaign.metrics.ctr.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No campaigns found matching your filters</p>
            </div>
          )}
        </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </div>
        </div>
      </div>
    </>
  );
}
