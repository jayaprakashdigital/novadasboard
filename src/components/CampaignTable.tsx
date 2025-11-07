import { Campaign } from '../lib/supabase';

interface CampaignTableProps {
  campaigns: Campaign[];
}

const platformColors: Record<string, string> = {
  'Google Ads': 'bg-blue-100 text-blue-700',
  'Facebook': 'bg-blue-100 text-blue-800',
  'Instagram': 'bg-pink-100 text-pink-700',
  'LinkedIn': 'bg-sky-100 text-sky-700',
  'YouTube': 'bg-red-100 text-red-700',
  'Twitter': 'bg-cyan-100 text-cyan-700',
};

const statusColors: Record<string, string> = {
  'active': 'bg-green-100 text-green-700',
  'paused': 'bg-yellow-100 text-yellow-700',
  'completed': 'bg-gray-100 text-gray-700',
};

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Active Campaigns</h2>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((campaign) => {
              const progress = calculateProgress(campaign.spent, campaign.budget);
              return (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(campaign.start_date).toLocaleDateString()}
                      {campaign.end_date && ` - ${new Date(campaign.end_date).toLocaleDateString()}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${platformColors[campaign.platform] || 'bg-gray-100 text-gray-700'}`}>
                      {campaign.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status] || 'bg-gray-100 text-gray-700'}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(campaign.spent)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress >= 90 ? 'bg-red-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-gray-100">
        {campaigns.map((campaign) => {
          const progress = calculateProgress(campaign.spent, campaign.budget);
          return (
            <div key={campaign.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{campaign.name}</h3>
                  <div className="text-xs text-gray-500">
                    {new Date(campaign.start_date).toLocaleDateString()}
                    {campaign.end_date && ` - ${new Date(campaign.end_date).toLocaleDateString()}`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Platform</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${platformColors[campaign.platform] || 'bg-gray-100 text-gray-700'}`}>
                    {campaign.platform}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status] || 'bg-gray-100 text-gray-700'}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Budget</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(campaign.budget)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Spent</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(campaign.spent)}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-gray-700">{progress.toFixed(0)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress >= 90 ? 'bg-red-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
