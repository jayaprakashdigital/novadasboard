import { X, Filter } from 'lucide-react';
import { useState } from 'react';
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
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ filters, onFilterChange, filterOptions, isOpen, onClose }: FilterSidebarProps) {
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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={`w-64 bg-black text-white fixed left-0 top-16 overflow-y-auto shadow-xl z-50 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } h-[calc(100vh-4rem)]`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Date Range</label>
            <DateRangeSelector
              selectedRange={filters.dateRange}
              onRangeChange={(range) => updateFilter('dateRange', range)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Paid/Organic</label>
            <select
              value={filters.trafficSource}
              onChange={(e) => updateFilter('trafficSource', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
            <label className="block text-xs font-medium text-gray-300 mb-2">Channel</label>
            <select
              value={filters.channel}
              onChange={(e) => updateFilter('channel', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
            <label className="block text-xs font-medium text-gray-300 mb-2">Region</label>
            <select
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
            <label className="block text-xs font-medium text-gray-300 mb-2">Call/Form</label>
            <select
              value={filters.conversionType}
              onChange={(e) => updateFilter('conversionType', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
            <label className="block text-xs font-medium text-gray-300 mb-2">Bx Type</label>
            <select
              value={filters.bxType}
              onChange={(e) => updateFilter('bxType', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
            <label className="block text-xs font-medium text-gray-300 mb-2">Centre Name</label>
            <select
              value={filters.centerName}
              onChange={(e) => updateFilter('centerName', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
            <label className="block text-xs font-medium text-gray-300 mb-2">RH</label>
            <select
              value={filters.rh}
              onChange={(e) => updateFilter('rh', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
            <label className="block text-xs font-medium text-gray-300 mb-2">Campaign</label>
            <select
              value={filters.platform}
              onChange={(e) => updateFilter('platform', e.target.value)}
              className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#4A2C5C] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
          <div className="mt-6 p-3 bg-[#2D1B3D] rounded-lg border border-[#4A2C5C]">
            <div className="text-xs text-gray-400 mb-1">Active Filters</div>
            <div className="text-lg font-bold">{activeFiltersCount}</div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
