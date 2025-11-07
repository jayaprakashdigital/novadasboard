import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FilterSidebar, { Filters } from '../components/FilterSidebar';

interface CenterData {
  center_name: string;
  city: string;
  region: string;
  month: string;
  year: number;
  value: number;
}

interface CenterSummary {
  center_name: string;
  city: string;
  [key: string]: string | number;
}

export default function CenterWiseData() {
  const [centerData, setCenterData] = useState<CenterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
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
      startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      label: 'Last Year',
    },
  });

  const filterOptions = {
    platforms: [],
    cities: ['Bangalore', 'Chennai', 'Delhi', 'Mumbai', 'Pune'],
    regions: ['South', 'North', 'West', 'East'],
    bxTypes: [],
    trafficSources: [],
    channels: [],
    conversionTypes: [],
    centerNames: ['Bangalore', 'Bannerghatta', 'Kalyan Nagar', 'Koramangala', 'Anna Nagar'],
    rhs: [],
  };

  useEffect(() => {
    fetchCenterData();
  }, []);

  const fetchCenterData = async () => {
    try {
      setLoading(true);
      const demoData: CenterData[] = [
        { center_name: 'Bangalore', city: 'Bangalore', region: 'South', month: 'Apr', year: 2025, value: 4 },
        { center_name: 'Bangalore', city: 'Bangalore', region: 'South', month: 'May', year: 2025, value: 3 },
        { center_name: 'Bangalore', city: 'Bangalore', region: 'South', month: 'Jun', year: 2025, value: 6 },
        { center_name: 'Bangalore', city: 'Bangalore', region: 'South', month: 'Jul', year: 2025, value: 6 },
        { center_name: 'Bangalore', city: 'Bangalore', region: 'South', month: 'Sep', year: 2025, value: 1 },
        { center_name: 'Bangalore', city: 'Bangalore', region: 'South', month: 'Oct', year: 2025, value: 1 },
        { center_name: 'Bannerghatta', city: 'Bangalore', region: 'South', month: 'Apr', year: 2025, value: 7 },
        { center_name: 'Bannerghatta', city: 'Bangalore', region: 'South', month: 'May', year: 2025, value: 2 },
        { center_name: 'Bannerghatta', city: 'Bangalore', region: 'South', month: 'Jun', year: 2025, value: 2 },
        { center_name: 'Bannerghatta', city: 'Bangalore', region: 'South', month: 'Jul', year: 2025, value: 5 },
        { center_name: 'Bannerghatta', city: 'Bangalore', region: 'South', month: 'Sep', year: 2025, value: 3 },
        { center_name: 'Bannerghatta', city: 'Bangalore', region: 'South', month: 'Oct', year: 2025, value: 3 },
        { center_name: 'Kalyan Nagar', city: 'Bangalore', region: 'South', month: 'Apr', year: 2025, value: 17 },
        { center_name: 'Kalyan Nagar', city: 'Bangalore', region: 'South', month: 'May', year: 2025, value: 7 },
        { center_name: 'Kalyan Nagar', city: 'Bangalore', region: 'South', month: 'Jun', year: 2025, value: 13 },
        { center_name: 'Kalyan Nagar', city: 'Bangalore', region: 'South', month: 'Jul', year: 2025, value: 5 },
        { center_name: 'Kalyan Nagar', city: 'Bangalore', region: 'South', month: 'Aug', year: 2025, value: 5 },
        { center_name: 'Kalyan Nagar', city: 'Bangalore', region: 'South', month: 'Sep', year: 2025, value: 3 },
        { center_name: 'Kalyan Nagar', city: 'Bangalore', region: 'South', month: 'Oct', year: 2025, value: 3 },
        { center_name: 'Koramangala', city: 'Bangalore', region: 'South', month: 'Apr', year: 2025, value: 14 },
        { center_name: 'Koramangala', city: 'Bangalore', region: 'South', month: 'May', year: 2025, value: 19 },
        { center_name: 'Koramangala', city: 'Bangalore', region: 'South', month: 'Jun', year: 2025, value: 10 },
        { center_name: 'Koramangala', city: 'Bangalore', region: 'South', month: 'Jul', year: 2025, value: 16 },
        { center_name: 'Koramangala', city: 'Bangalore', region: 'South', month: 'Aug', year: 2025, value: 12 },
        { center_name: 'Koramangala', city: 'Bangalore', region: 'South', month: 'Sep', year: 2025, value: 12 },
        { center_name: 'Koramangala', city: 'Bangalore', region: 'South', month: 'Oct', year: 2025, value: 16 },
        { center_name: 'Anna Nagar', city: 'Chennai', region: 'South', month: 'Apr', year: 2025, value: 10 },
        { center_name: 'Anna Nagar', city: 'Chennai', region: 'South', month: 'May', year: 2025, value: 3 },
        { center_name: 'Anna Nagar', city: 'Chennai', region: 'South', month: 'Jun', year: 2025, value: 5 },
        { center_name: 'Anna Nagar', city: 'Chennai', region: 'South', month: 'Jul', year: 2025, value: 6 },
        { center_name: 'Anna Nagar', city: 'Chennai', region: 'South', month: 'Aug', year: 2025, value: 3 },
        { center_name: 'Anna Nagar', city: 'Chennai', region: 'South', month: 'Sep', year: 2025, value: 3 },
        { center_name: 'Anna Nagar', city: 'Chennai', region: 'South', month: 'Oct', year: 2025, value: 4 },
      ];
      setCenterData(demoData);
    } catch (error) {
      console.error('Error fetching center data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = centerData.filter((data) => {
    if (filters.city !== 'all' && data.city !== filters.city) return false;
    if (filters.region !== 'all' && data.region !== filters.region) return false;
    if (filters.centerName !== 'all' && data.center_name !== filters.centerName) return false;
    if (filters.search && !data.center_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const groupedData = filteredData.reduce((acc, item) => {
    const existing = acc.find((x) => x.center_name === item.center_name);
    const monthKey = `${item.month}'${item.year.toString().slice(2)}`;

    if (existing) {
      existing[monthKey] = (existing[monthKey] as number || 0) + item.value;
      existing.total = (existing.total as number || 0) + item.value;
    } else {
      acc.push({
        center_name: item.center_name,
        city: item.city,
        [monthKey]: item.value,
        total: item.value,
      });
    }
    return acc;
  }, [] as CenterSummary[]);

  const months = ['Apr\'25', 'May\'25', 'Jun\'25', 'Jul\'25', 'Aug\'25', 'Sep\'25', 'Oct\'25'];

  const cityGroups = groupedData.reduce((acc, item) => {
    if (!acc[item.city]) {
      acc[item.city] = [];
    }
    acc[item.city].push(item);
    return acc;
  }, {} as Record<string, CenterSummary[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:ml-64 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading center data...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:ml-64 pt-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Center-wise Data</h1>
              <p className="text-sm sm:text-base text-gray-600">Monthly performance metrics by center location</p>
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Centre Name
                    </th>
                    {months.map((month) => (
                      <th
                        key={month}
                        className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {month}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-primary-light">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(cityGroups).map(([city, centers]) => {
                    const cityTotal = centers.reduce((sum, c) => sum + (c.total as number || 0), 0);
                    const cityMonthTotals = months.reduce((acc, month) => {
                      acc[month] = centers.reduce((sum, c) => sum + (c[month] as number || 0), 0);
                      return acc;
                    }, {} as Record<string, number>);

                    return (
                      <>
                        <tr key={city} className="bg-primary-light font-semibold hover:bg-pink-100 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{city}</td>
                          {months.map((month) => (
                            <td key={month} className="px-4 py-4 text-sm text-center text-gray-900">
                              {cityMonthTotals[month] || ''}
                            </td>
                          ))}
                          <td className="px-6 py-4 text-sm text-center font-bold text-primary bg-pink-100">
                            {cityTotal}
                          </td>
                        </tr>
                        {centers.map((center) => (
                          <tr key={center.center_name} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900 pl-12">{center.center_name}</td>
                            {months.map((month) => (
                              <td key={month} className="px-4 py-4 text-sm text-center text-gray-700">
                                {center[month] || ''}
                              </td>
                            ))}
                            <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900 bg-gray-50">
                              {center.total}
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {groupedData.length} centers
          </div>
        </div>
      </div>
    </>
  );
}
