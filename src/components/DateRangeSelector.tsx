import { Calendar } from 'lucide-react';
import { useState } from 'react';

export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange) => void;
  selectedRange: DateRange;
}

const presetRanges: DateRange[] = [
  {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'Last 7 Days',
  },
  {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'Last 30 Days',
  },
  {
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'Last 90 Days',
  },
  {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'This Month',
  },
  {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0],
    label: 'Last Month',
  },
];

export default function DateRangeSelector({ onRangeChange, selectedRange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetSelect = (range: DateRange) => {
    onRangeChange(range);
    setIsOpen(false);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onRangeChange({
        startDate: customStart,
        endDate: customEnd,
        label: 'Custom Range',
      });
      setIsOpen(false);
      setShowCustom(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto justify-between sm:justify-start"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="font-medium text-gray-700 text-sm sm:text-base truncate">{selectedRange.label}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setShowCustom(false);
            }}
          />
          <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden max-w-sm">
            {!showCustom ? (
              <div className="py-2">
                {presetRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(range)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors text-sm sm:text-base ${
                      selectedRange.label === range.label ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => setShowCustom(true)}
                    className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Custom Range
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Custom Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowCustom(false)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCustomApply}
                      disabled={!customStart || !customEnd}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
