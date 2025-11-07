import { Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  {
    startDate: new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear() - 1, 11, 31).toISOString().split('T')[0],
    label: 'Last Year',
  },
];

export default function DateRangeSelector({ onRangeChange, selectedRange }: DateRangeSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustomDateInputs, setShowCustomDateInputs] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowCustomDateInputs(false);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handlePresetSelect = (range: DateRange) => {
    onRangeChange(range);
    setShowModal(false);
    setShowCustomDateInputs(false);
  };

  const handleCustomRangeClick = () => {
    setShowCustomDateInputs(true);
    setCustomStart('');
    setCustomEnd('');
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onRangeChange({
        startDate: customStart,
        endDate: customEnd,
        label: 'Custom Range',
      });
      setShowModal(false);
      setShowCustomDateInputs(false);
    }
  };

  const handleBackdropClick = () => {
    setShowModal(false);
    setShowCustomDateInputs(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="font-medium text-gray-700 text-sm truncate">{selectedRange.label}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0 ${showModal ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showModal && (
        <>
          <div
            className="date-panel-backdrop fixed inset-0 bg-black bg-opacity-50 z-[999] animate-fadeIn"
            onClick={handleBackdropClick}
          />
          <div
            className="date-panel-modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white rounded-lg shadow-2xl animate-fadeIn w-[calc(100%-32px)] sm:w-[90%] max-w-[400px] max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Date Range</h3>
                <button
                  onClick={handleBackdropClick}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {!showCustomDateInputs ? (
                <div className="space-y-1">
                  {presetRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(range)}
                      className={`w-full px-4 py-3 text-left rounded-lg transition-colors text-base min-h-[44px] ${
                        selectedRange.label === range.label
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <button
                      onClick={handleCustomRangeClick}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-base min-h-[44px]"
                    >
                      Custom Range
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span>Start Date</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span>End Date</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => setShowCustomDateInputs(false)}
                      className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-base font-medium min-h-[44px]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCustomApply}
                      disabled={!customStart || !customEnd}
                      className="flex-1 px-4 py-3 rounded-lg transition-colors text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                      style={{
                        backgroundColor: customStart && customEnd ? '#7BA3E8' : '#7BA3E8',
                        color: 'white'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </>
  );
}
