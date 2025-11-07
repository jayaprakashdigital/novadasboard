import { useMemo } from 'react';

interface ChartData {
  date: string;
  revenue: number;
  cost: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sortedData.slice(-14);
  }, [data]);

  const maxValue = useMemo(() => {
    const allValues = chartData.flatMap(d => [d.revenue, d.cost]);
    return Math.max(...allValues, 1);
  }, [chartData]);

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Revenue vs Cost (Last 14 Days)</h2>
        <p className="text-sm text-gray-500 mt-1">Daily performance metrics</p>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-medium text-gray-700">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-sm font-medium text-gray-700">Cost</span>
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span className="text-right">{formatCurrency(maxValue)}</span>
          <span className="text-right">{formatCurrency(maxValue * 0.75)}</span>
          <span className="text-right">{formatCurrency(maxValue * 0.5)}</span>
          <span className="text-right">{formatCurrency(maxValue * 0.25)}</span>
          <span className="text-right">$0</span>
        </div>

        <div className="absolute inset-0 pl-12 pr-2">
          <div className="h-full border-l border-b border-gray-200 relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-gray-100"></div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-end justify-around px-2">
              {chartData.map((point, index) => {
                const revenueHeight = (point.revenue / maxValue) * 100;
                const costHeight = (point.cost / maxValue) * 100;

                return (
                  <div key={index} className="flex-1 flex items-end justify-center gap-1 group">
                    <div className="relative flex flex-col items-center">
                      <div
                        className="w-3 bg-emerald-500 rounded-t hover:bg-emerald-600 transition-colors relative group"
                        style={{ height: `${revenueHeight}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {formatCurrency(point.revenue)}
                        </div>
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div
                        className="w-3 bg-rose-500 rounded-t hover:bg-rose-600 transition-colors relative group"
                        style={{ height: `${costHeight}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {formatCurrency(point.cost)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-around text-xs text-gray-600 pl-12">
        {chartData.map((point, index) => (
          <span key={index} className="flex-1 text-center">
            {index % 2 === 0 ? formatDate(point.date) : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
