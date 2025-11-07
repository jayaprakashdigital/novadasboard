import { Calendar, Clock, TrendingUp, ArrowRight, Check } from 'lucide-react';
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

const getRangeIcon = (label: string) => {
  if (label.includes('7 Days')) return Clock;
  if (label.includes('30 Days')) return TrendingUp;
  if (label.includes('90 Days')) return TrendingUp;
  if (label.includes('Month')) return Calendar;
  if (label.includes('Year')) return Calendar;
  return Calendar;
};

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
        className="flex items-center gap-2 px-3 py-2.5 bg-white/95 border border-white/30 rounded-lg hover:bg-white transition-all shadow-sm w-full justify-between group"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#A53758] flex-shrink-0" />
          <span className="font-medium text-gray-800 text-sm truncate">{selectedRange.label}</span>
        </div>
        <svg
          className={`w-4 h-4 text-[#A53758] transition-transform flex-shrink-0 ${showModal ? 'rotate-180' : ''}`}
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
            className="date-panel-backdrop fixed inset-0 bg-[#A53758] bg-opacity-40 z-[999] animate-fadeIn backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
          <div
            className="date-panel-modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white rounded-2xl shadow-2xl animate-fadeIn w-[calc(100%-32px)] sm:w-[90%] max-w-[420px] max-h-[90vh] overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(165, 55, 88, 0.3)' }}
          >
            {!showCustomDateInputs ? (
              <div className="p-2">
                {presetRanges.map((range, index) => {
                  const Icon = getRangeIcon(range.label);
                  const isSelected = selectedRange.label === range.label;

                  return (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(range)}
                      className={`w-full px-4 py-3.5 text-left rounded-xl transition-all text-base min-h-[56px] flex items-center gap-3 group relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#A53758] to-[#8B2F4A] text-white shadow-lg scale-[1.02]'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-white/20'
                          : 'bg-gray-100 group-hover:bg-[#A53758] group-hover:bg-opacity-10'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isSelected ? 'text-white' : 'text-[#A53758]'
                        }`} />
                      </div>
                      <span className={`font-semibold flex-1 ${
                        isSelected ? 'text-white' : 'text-gray-800'
                      }`}>
                        {range.label}
                      </span>
                      {isSelected && (
                        <div className="bg-white/20 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={handleCustomRangeClick}
                  className="w-full px-4 py-3.5 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all text-base min-h-[56px] flex items-center gap-3 group hover:shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#A53758] group-hover:bg-opacity-10 transition-all">
                    <Calendar className="w-5 h-5 text-[#A53758]" />
                  </div>
                  <span className="font-semibold text-gray-800 flex-1">Custom Range</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#A53758] transition-colors" />
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[#A53758] bg-opacity-10">
                          <Calendar className="w-4 h-4 text-[#A53758]" />
                        </div>
                        <span>Start Date</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-[#A53758] focus:border-[#A53758] min-h-[48px] font-medium text-gray-800 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[#A53758] bg-opacity-10">
                          <Calendar className="w-4 h-4 text-[#A53758]" />
                        </div>
                        <span>End Date</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-[#A53758] focus:border-[#A53758] min-h-[48px] font-medium text-gray-800 transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => setShowCustomDateInputs(false)}
                      className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-base font-semibold min-h-[48px]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCustomApply}
                      disabled={!customStart || !customEnd}
                      className="flex-1 px-4 py-3 rounded-xl transition-all text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] bg-gradient-to-r from-[#A53758] to-[#8B2F4A] text-white hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100"
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </>
  );
}
