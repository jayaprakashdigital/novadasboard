import { X } from 'lucide-react';
import DateRangeSelector, { DateRange } from './DateRangeSelector';

export interface Filters {
  search: string;
  platform: string;
  status: string;
  city: string;
  region: string;
  bxType: string;
  trafficSource: string;
  channel: string;
  conversionType: string;
  centerName: string;
  rh: string;
  dateRange: DateRange;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  filterOptions: {
    platforms: string[];
    cities: string[];
    regions: string[];
    bxTypes: string[];
    trafficSources: string[];
    channels: string[];
    conversionTypes: string[];
    centerNames: string[];
    rhs: string[];
  };
}

export default function FilterSidebar({ filters, onFilterChange, filterOptions }: FilterSidebarProps) {
  const updateFilter = (key: keyof Filters, value: string | DateRange) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
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
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    if (key === 'dateRange') return false;
    return value !== 'all';
  }).length;

  return (
    <div className="w-64 bg-gradient-to-b from-[#4A2C6D] to-[#3D1F5C] text-white h-screen fixed left-0 top-16 overflow-y-auto shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-purple-200 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Date Range</label>
            <DateRangeSelector
              selectedRange={filters.dateRange}
              onRangeChange={(range) => updateFilter('dateRange', range)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Paid/Organic</label>
            <select
              value={filters.trafficSource}
              onChange={(e) => updateFilter('trafficSource', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All Traffic Sources</option>
              {filterOptions.trafficSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Channel</label>
            <select
              value={filters.channel}
              onChange={(e) => updateFilter('channel', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All Channels</option>
              {filterOptions.channels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Region</label>
            <select
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All Regions</option>
              {filterOptions.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Call/Form</label>
            <select
              value={filters.conversionType}
              onChange={(e) => updateFilter('conversionType', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All Conversion Types</option>
              {filterOptions.conversionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Bx Type</label>
            <select
              value={filters.bxType}
              onChange={(e) => updateFilter('bxType', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All Bx Types</option>
              {filterOptions.bxTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Centre Name</label>
            <select
              value={filters.centerName}
              onChange={(e) => updateFilter('centerName', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All Centres</option>
              {filterOptions.centerNames.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">RH</label>
            <select
              value={filters.rh}
              onChange={(e) => updateFilter('rh', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All RH</option>
              {filterOptions.rhs.map((rh) => (
                <option key={rh} value={rh}>
                  {rh}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-2">Campaign</label>
            <select
              value={filters.platform}
              onChange={(e) => updateFilter('platform', e.target.value)}
              className="w-full px-3 py-2 bg-[#3D1F5C] border border-[#5C3A85] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">All Campaigns</option>
              {filterOptions.platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="mt-6 p-3 bg-[#3D1F5C] rounded-lg border border-[#5C3A85]">
            <div className="text-xs text-purple-200 mb-1">Active Filters</div>
            <div className="text-lg font-bold">{activeFiltersCount}</div>
          </div>
        )}
      </div>
    </div>
  );
}
