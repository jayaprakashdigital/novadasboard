import { X, Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useState } from 'react';
import DateRangeSelector, { DateRange } from './DateRangeSelector';

export interface Filters {
  search: string;
  platforms: string[];
  status: string;
  cities: string[];
  regions: string[];
  bxTypes: string[];
  trafficSources: string[];
  channels: string[];
  conversionTypes: string[];
  centerNames: string[];
  rhs: string[];
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

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

function MultiSelectDropdown({ label, options, selectedValues, onChange, placeholder }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allSelected = selectedValues.length === options.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const displayText = allSelected
    ? 'All Selected'
    : selectedValues.length > 0
    ? `${selectedValues.length} Selected`
    : placeholder;

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-white/90 mb-2 uppercase tracking-wide">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 bg-white/95 border border-white/30 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#A53758] focus:border-transparent text-sm font-medium flex items-center justify-between hover:bg-white transition-all shadow-sm"
      >
        <span className={selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-800'}>
          {displayText}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-[#A53758] to-[#8B2F4A] border-b border-gray-200 px-3 py-2.5">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-2 w-full text-left hover:bg-white/10 px-2 py-1.5 rounded transition-colors"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                allSelected ? 'bg-white border-white' : 'bg-white/20 border-white/50'
              }`}>
                {allSelected && <Check className="w-3 h-3 text-[#A53758]" strokeWidth={3} />}
              </div>
              <span className="text-sm font-semibold text-white">Select All</span>
            </button>
          </div>

          <div className="p-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors"
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedValues.includes(option)
                    ? 'bg-[#A53758] border-[#A53758]'
                    : 'bg-white border-gray-300'
                }`}>
                  {selectedValues.includes(option) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-gray-700">{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({ filters, onFilterChange, filterOptions, isOpen, onClose }: FilterSidebarProps) {
  const updateMultiSelectFilter = (key: keyof Filters, values: string[]) => {
    onFilterChange({ ...filters, [key]: values });
  };

  const updateFilter = (key: keyof Filters, value: string | DateRange) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      platforms: [...filterOptions.platforms],
      status: 'all',
      cities: [...filterOptions.cities],
      regions: [...filterOptions.regions],
      bxTypes: [...filterOptions.bxTypes],
      trafficSources: [...filterOptions.trafficSources],
      channels: [...filterOptions.channels],
      conversionTypes: [...filterOptions.conversionTypes],
      centerNames: [...filterOptions.centerNames],
      rhs: [...filterOptions.rhs],
      dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        label: 'Last 30 Days',
      },
    });
  };

  const activeFiltersCount =
    (filters.search !== '' ? 1 : 0) +
    (filters.platforms.length < filterOptions.platforms.length ? 1 : 0) +
    (filters.trafficSources.length < filterOptions.trafficSources.length ? 1 : 0) +
    (filters.channels.length < filterOptions.channels.length ? 1 : 0) +
    (filters.regions.length < filterOptions.regions.length ? 1 : 0) +
    (filters.conversionTypes.length < filterOptions.conversionTypes.length ? 1 : 0) +
    (filters.bxTypes.length < filterOptions.bxTypes.length ? 1 : 0) +
    (filters.centerNames.length < filterOptions.centerNames.length ? 1 : 0) +
    (filters.rhs.length < filterOptions.rhs.length ? 1 : 0);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#A53758] bg-opacity-40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div className={`w-72 bg-gradient-to-b from-[#A53758] via-[#8B2F4A] to-[#6B2138] text-white fixed left-0 top-16 overflow-y-auto shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } h-[calc(100vh-4rem)]`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-bold tracking-wide">FILTERS</h2>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded transition-colors font-medium"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2 uppercase tracking-wide">Date Range</label>
            <DateRangeSelector
              selectedRange={filters.dateRange}
              onRangeChange={(range) => updateFilter('dateRange', range)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2 uppercase tracking-wide">Search</label>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full px-3 py-2.5 bg-white/95 border border-white/30 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent text-sm shadow-sm"
            />
          </div>

          <MultiSelectDropdown
            label="Paid/Organic"
            options={filterOptions.trafficSources}
            selectedValues={filters.trafficSources}
            onChange={(values) => updateMultiSelectFilter('trafficSources', values)}
            placeholder="Select Traffic Source"
          />

          <MultiSelectDropdown
            label="Channel"
            options={filterOptions.channels}
            selectedValues={filters.channels}
            onChange={(values) => updateMultiSelectFilter('channels', values)}
            placeholder="Select Channel"
          />

          <MultiSelectDropdown
            label="Region"
            options={filterOptions.regions}
            selectedValues={filters.regions}
            onChange={(values) => updateMultiSelectFilter('regions', values)}
            placeholder="Select Region"
          />

          <MultiSelectDropdown
            label="Call/Form"
            options={filterOptions.conversionTypes}
            selectedValues={filters.conversionTypes}
            onChange={(values) => updateMultiSelectFilter('conversionTypes', values)}
            placeholder="Select Conversion Type"
          />

          <MultiSelectDropdown
            label="Bx Type"
            options={filterOptions.bxTypes}
            selectedValues={filters.bxTypes}
            onChange={(values) => updateMultiSelectFilter('bxTypes', values)}
            placeholder="Select Bx Type"
          />

          <MultiSelectDropdown
            label="Centre Name"
            options={filterOptions.centerNames}
            selectedValues={filters.centerNames}
            onChange={(values) => updateMultiSelectFilter('centerNames', values)}
            placeholder="Select Centre"
          />

          <MultiSelectDropdown
            label="RH"
            options={filterOptions.rhs}
            selectedValues={filters.rhs}
            onChange={(values) => updateMultiSelectFilter('rhs', values)}
            placeholder="Select RH"
          />

          <MultiSelectDropdown
            label="Campaign"
            options={filterOptions.platforms}
            selectedValues={filters.platforms}
            onChange={(values) => updateMultiSelectFilter('platforms', values)}
            placeholder="Select Campaign"
          />
        </div>

        {activeFiltersCount > 0 && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/30 backdrop-blur-sm">
            <div className="text-xs text-white/80 mb-1 font-medium uppercase tracking-wide">Active Filters</div>
            <div className="text-2xl font-bold">{activeFiltersCount}</div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
