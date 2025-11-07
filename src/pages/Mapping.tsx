import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { supabase, Campaign, CampaignMetric } from '../lib/supabase';

interface MappingData extends Campaign {
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    totalSpent: number;
    totalRevenue: number;
    ctr: number;
    cpc: number;
    cpa: number;
    roi: number;
  };
}

export default function Mapping() {
  const [mappingData, setMappingData] = useState<MappingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMappingData();
  }, []);

  const fetchMappingData = async () => {
    try {
      setLoading(true);
      const { data: campaigns, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignError) throw campaignError;

      const campaignsWithMetrics = await Promise.all(
        (campaigns || []).map(async (campaign) => {
          const { data: metrics } = await supabase
            .from('campaign_metrics')
            .select('*')
            .eq('campaign_id', campaign.id);

          const aggregatedMetrics = (metrics || []).reduce(
            (acc, metric: CampaignMetric) => ({
              totalImpressions: acc.totalImpressions + metric.impressions,
              totalClicks: acc.totalClicks + metric.clicks,
              totalConversions: acc.totalConversions + metric.conversions,
              totalSpent: acc.totalSpent + metric.spent,
              totalRevenue: acc.totalRevenue + metric.revenue,
              ctr: 0,
              cpc: 0,
              cpa: 0,
              roi: 0,
            }),
            {
              totalImpressions: 0,
              totalClicks: 0,
              totalConversions: 0,
              totalSpent: 0,
              totalRevenue: 0,
              ctr: 0,
              cpc: 0,
              cpa: 0,
              roi: 0,
            }
          );

          aggregatedMetrics.ctr = aggregatedMetrics.totalImpressions > 0
            ? (aggregatedMetrics.totalClicks / aggregatedMetrics.totalImpressions) * 100
            : 0;
          aggregatedMetrics.cpc = aggregatedMetrics.totalClicks > 0
            ? aggregatedMetrics.totalSpent / aggregatedMetrics.totalClicks
            : 0;
          aggregatedMetrics.cpa = aggregatedMetrics.totalConversions > 0
            ? aggregatedMetrics.totalSpent / aggregatedMetrics.totalConversions
            : 0;
          aggregatedMetrics.roi = aggregatedMetrics.totalSpent > 0
            ? ((aggregatedMetrics.totalRevenue - aggregatedMetrics.totalSpent) / aggregatedMetrics.totalSpent) * 100
            : 0;

          return {
            ...campaign,
            metrics: aggregatedMetrics,
          };
        })
      );

      setMappingData(campaignsWithMetrics);
    } catch (error) {
      console.error('Error fetching mapping data:', error);
    } finally {
      setLoading(false);
    }
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
    return num.toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mapping data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaign Mapping</h1>
          <p className="text-gray-600">Complete campaign data mapping and analysis</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Campaign Name
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Spent
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CPC
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CPA
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mappingData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
                      No mapping data available
                    </td>
                  </tr>
                ) : (
                  mappingData.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 sticky left-0 bg-white">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{campaign.name}</div>
                            <div className="text-xs text-gray-500">{campaign.campaign_type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {campaign.platform}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900 font-medium">
                        {formatNumber(campaign.metrics.totalImpressions)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900 font-medium">
                        {formatNumber(campaign.metrics.totalClicks)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900">
                        {campaign.metrics.ctr.toFixed(2)}%
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900 font-medium">
                        {campaign.metrics.totalConversions}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900 font-medium">
                        {formatCurrency(campaign.metrics.totalSpent)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900 font-medium">
                        {formatCurrency(campaign.metrics.totalRevenue)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900">
                        {formatCurrency(campaign.metrics.cpc)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900">
                        {formatCurrency(campaign.metrics.cpa)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span
                            className={`text-sm font-semibold ${
                              campaign.metrics.roi >= 0 ? 'text-green-700' : 'text-red-700'
                            }`}
                          >
                            {campaign.metrics.roi.toFixed(1)}%
                          </span>
                          {campaign.metrics.roi >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {mappingData.length} campaigns
        </div>
      </div>
    </div>
  );
}
