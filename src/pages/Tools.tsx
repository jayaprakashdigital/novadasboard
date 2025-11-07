import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, Percent, MousePointerClick, Users, BarChart3 } from 'lucide-react';

interface CalculatorResult {
  label: string;
  value: string | number;
  highlighted?: boolean;
}

export default function Tools() {
  const [activeTab, setActiveTab] = useState('calculator');

  const [roiInputs, setRoiInputs] = useState({ revenue: '', cost: '' });
  const [roiResult, setRoiResult] = useState<CalculatorResult[]>([]);

  const [ctrInputs, setCtrInputs] = useState({ clicks: '', impressions: '' });
  const [ctrResult, setCtrResult] = useState<CalculatorResult[]>([]);

  const [cpcInputs, setCpcInputs] = useState({ cost: '', clicks: '' });
  const [cpcResult, setCpcResult] = useState<CalculatorResult[]>([]);

  const [conversionInputs, setConversionInputs] = useState({ conversions: '', visitors: '' });
  const [conversionResult, setConversionResult] = useState<CalculatorResult[]>([]);

  const [cpaInputs, setCpaInputs] = useState({ cost: '', conversions: '' });
  const [cpaResult, setCpaResult] = useState<CalculatorResult[]>([]);

  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperation, setCalcOperation] = useState<string | null>(null);
  const [calcNewNumber, setCalcNewNumber] = useState(true);

  const calculateROI = () => {
    const revenue = parseFloat(roiInputs.revenue);
    const cost = parseFloat(roiInputs.cost);

    if (isNaN(revenue) || isNaN(cost) || cost === 0) {
      alert('Please enter valid numbers');
      return;
    }

    const profit = revenue - cost;
    const roi = ((profit / cost) * 100).toFixed(2);
    const roiRatio = (revenue / cost).toFixed(2);

    setRoiResult([
      { label: 'Total Revenue', value: `₹${revenue.toLocaleString('en-IN')}` },
      { label: 'Total Cost', value: `₹${cost.toLocaleString('en-IN')}` },
      { label: 'Profit', value: `₹${profit.toLocaleString('en-IN')}` },
      { label: 'ROI', value: `${roi}%`, highlighted: true },
      { label: 'ROI Ratio', value: `${roiRatio}:1` },
    ]);
  };

  const calculateCTR = () => {
    const clicks = parseFloat(ctrInputs.clicks);
    const impressions = parseFloat(ctrInputs.impressions);

    if (isNaN(clicks) || isNaN(impressions) || impressions === 0) {
      alert('Please enter valid numbers');
      return;
    }

    const ctr = ((clicks / impressions) * 100).toFixed(2);
    const engagementRate = ((clicks / impressions) * 100).toFixed(2);

    setCtrResult([
      { label: 'Total Clicks', value: clicks.toLocaleString('en-IN') },
      { label: 'Total Impressions', value: impressions.toLocaleString('en-IN') },
      { label: 'Click-Through Rate (CTR)', value: `${ctr}%`, highlighted: true },
      { label: 'Engagement Rate', value: `${engagementRate}%` },
    ]);
  };

  const calculateCPC = () => {
    const cost = parseFloat(cpcInputs.cost);
    const clicks = parseFloat(cpcInputs.clicks);

    if (isNaN(cost) || isNaN(clicks) || clicks === 0) {
      alert('Please enter valid numbers');
      return;
    }

    const cpc = (cost / clicks).toFixed(2);
    const cpm = ((cost / clicks) * 1000).toFixed(2);

    setCpcResult([
      { label: 'Total Ad Spend', value: `₹${cost.toLocaleString('en-IN')}` },
      { label: 'Total Clicks', value: clicks.toLocaleString('en-IN') },
      { label: 'Cost Per Click (CPC)', value: `₹${cpc}`, highlighted: true },
      { label: 'Estimated CPM', value: `₹${cpm}` },
    ]);
  };

  const calculateConversion = () => {
    const conversions = parseFloat(conversionInputs.conversions);
    const visitors = parseFloat(conversionInputs.visitors);

    if (isNaN(conversions) || isNaN(visitors) || visitors === 0) {
      alert('Please enter valid numbers');
      return;
    }

    const conversionRate = ((conversions / visitors) * 100).toFixed(2);
    const bounceRate = (100 - parseFloat(conversionRate)).toFixed(2);

    setConversionResult([
      { label: 'Total Conversions', value: conversions.toLocaleString('en-IN') },
      { label: 'Total Visitors', value: visitors.toLocaleString('en-IN') },
      { label: 'Conversion Rate', value: `${conversionRate}%`, highlighted: true },
      { label: 'Non-Conversion Rate', value: `${bounceRate}%` },
    ]);
  };

  const calculateCPA = () => {
    const cost = parseFloat(cpaInputs.cost);
    const conversions = parseFloat(cpaInputs.conversions);

    if (isNaN(cost) || isNaN(conversions) || conversions === 0) {
      alert('Please enter valid numbers');
      return;
    }

    const cpa = (cost / conversions).toFixed(2);
    const costPerLead = cpa;

    setCpaResult([
      { label: 'Total Ad Spend', value: `₹${cost.toLocaleString('en-IN')}` },
      { label: 'Total Conversions', value: conversions.toLocaleString('en-IN') },
      { label: 'Cost Per Acquisition (CPA)', value: `₹${cpa}`, highlighted: true },
      { label: 'Cost Per Lead (CPL)', value: `₹${costPerLead}` },
    ]);
  };

  const handleCalcNumber = (num: string) => {
    if (calcNewNumber) {
      setCalcDisplay(num);
      setCalcNewNumber(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? num : calcDisplay + num);
    }
  };

  const handleCalcOperation = (op: string) => {
    const currentValue = parseFloat(calcDisplay);

    if (calcPrevValue !== null && calcOperation && !calcNewNumber) {
      const result = performCalculation(calcPrevValue, currentValue, calcOperation);
      setCalcDisplay(String(result));
      setCalcPrevValue(result);
    } else {
      setCalcPrevValue(currentValue);
    }

    setCalcOperation(op);
    setCalcNewNumber(true);
  };

  const performCalculation = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleCalcEquals = () => {
    if (calcPrevValue !== null && calcOperation) {
      const currentValue = parseFloat(calcDisplay);
      const result = performCalculation(calcPrevValue, currentValue, calcOperation);
      setCalcDisplay(String(result));
      setCalcPrevValue(null);
      setCalcOperation(null);
      setCalcNewNumber(true);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcPrevValue(null);
    setCalcOperation(null);
    setCalcNewNumber(true);
  };

  const handleCalcDecimal = () => {
    if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
      setCalcNewNumber(false);
    }
  };

  const tools = [
    {
      id: 'calculator',
      name: 'General Calculator',
      icon: Calculator,
      description: 'Basic calculator for quick calculations',
      color: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'roi',
      name: 'ROI Calculator',
      icon: TrendingUp,
      description: 'Calculate Return on Investment for your campaigns',
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'ctr',
      name: 'CTR Calculator',
      icon: MousePointerClick,
      description: 'Calculate Click-Through Rate for your ads',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'cpc',
      name: 'CPC Calculator',
      icon: DollarSign,
      description: 'Calculate Cost Per Click for your campaigns',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'conversion',
      name: 'Conversion Rate Calculator',
      icon: Target,
      description: 'Calculate conversion rate from visitors to leads',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'cpa',
      name: 'CPA Calculator',
      icon: BarChart3,
      description: 'Calculate Cost Per Acquisition for your campaigns',
      color: 'bg-red-100 text-red-600',
    },
  ];

  const renderCalculator = () => {
    switch (activeTab) {
      case 'calculator':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Calculator className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">General Calculator</h3>
                <p className="text-sm text-gray-600">Basic calculator for quick calculations</p>
              </div>
            </div>

            <div className="max-w-sm mx-auto">
              <div className="bg-slate-900 rounded-t-2xl p-6 shadow-xl">
                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                  <div className="text-right">
                    <div className="text-slate-400 text-sm h-6 overflow-hidden">
                      {calcOperation && calcPrevValue !== null ? `${calcPrevValue} ${calcOperation}` : ''}
                    </div>
                    <div className="text-white text-4xl font-light mt-2 overflow-auto">
                      {calcDisplay}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={handleCalcClear}
                    className="col-span-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-4 font-semibold transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => handleCalcOperation('÷')}
                    className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-4 font-semibold text-2xl transition-colors"
                  >
                    ÷
                  </button>
                  <button
                    onClick={() => handleCalcOperation('×')}
                    className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-4 font-semibold text-2xl transition-colors"
                  >
                    ×
                  </button>

                  {['7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleCalcNumber(num)}
                      className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-4 font-semibold text-xl transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCalcOperation('-')}
                    className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-4 font-semibold text-2xl transition-colors"
                  >
                    −
                  </button>

                  {['4', '5', '6'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleCalcNumber(num)}
                      className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-4 font-semibold text-xl transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCalcOperation('+')}
                    className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-4 font-semibold text-2xl transition-colors"
                  >
                    +
                  </button>

                  {['1', '2', '3'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleCalcNumber(num)}
                      className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-4 font-semibold text-xl transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={handleCalcEquals}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-4 font-semibold text-2xl row-span-2 transition-colors"
                  >
                    =
                  </button>

                  <button
                    onClick={() => handleCalcNumber('0')}
                    className="col-span-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-4 font-semibold text-xl transition-colors"
                  >
                    0
                  </button>
                  <button
                    onClick={handleCalcDecimal}
                    className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-4 font-semibold text-xl transition-colors"
                  >
                    .
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'roi':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">ROI Calculator</h3>
                <p className="text-sm text-gray-600">Calculate your marketing return on investment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Revenue (₹)</label>
                <input
                  type="number"
                  value={roiInputs.revenue}
                  onChange={(e) => setRoiInputs({ ...roiInputs, revenue: e.target.value })}
                  placeholder="Enter total revenue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost (₹)</label>
                <input
                  type="number"
                  value={roiInputs.cost}
                  onChange={(e) => setRoiInputs({ ...roiInputs, cost: e.target.value })}
                  placeholder="Enter total cost"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateROI}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Calculate ROI
            </button>

            {roiResult.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">Results:</h4>
                {roiResult.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 ${
                      item.highlighted ? 'bg-green-100 px-4 rounded-lg' : ''
                    }`}
                  >
                    <span className={`${item.highlighted ? 'font-bold text-green-700' : 'text-gray-700'}`}>
                      {item.label}:
                    </span>
                    <span className={`${item.highlighted ? 'font-bold text-green-700 text-xl' : 'font-semibold text-gray-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'ctr':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MousePointerClick className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">CTR Calculator</h3>
                <p className="text-sm text-gray-600">Calculate your click-through rate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Clicks</label>
                <input
                  type="number"
                  value={ctrInputs.clicks}
                  onChange={(e) => setCtrInputs({ ...ctrInputs, clicks: e.target.value })}
                  placeholder="Enter total clicks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Impressions</label>
                <input
                  type="number"
                  value={ctrInputs.impressions}
                  onChange={(e) => setCtrInputs({ ...ctrInputs, impressions: e.target.value })}
                  placeholder="Enter total impressions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateCTR}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Calculate CTR
            </button>

            {ctrResult.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">Results:</h4>
                {ctrResult.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 ${
                      item.highlighted ? 'bg-blue-100 px-4 rounded-lg' : ''
                    }`}
                  >
                    <span className={`${item.highlighted ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                      {item.label}:
                    </span>
                    <span className={`${item.highlighted ? 'font-bold text-blue-700 text-xl' : 'font-semibold text-gray-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'cpc':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">CPC Calculator</h3>
                <p className="text-sm text-gray-600">Calculate your cost per click</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Ad Spend (₹)</label>
                <input
                  type="number"
                  value={cpcInputs.cost}
                  onChange={(e) => setCpcInputs({ ...cpcInputs, cost: e.target.value })}
                  placeholder="Enter total ad spend"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Clicks</label>
                <input
                  type="number"
                  value={cpcInputs.clicks}
                  onChange={(e) => setCpcInputs({ ...cpcInputs, clicks: e.target.value })}
                  placeholder="Enter total clicks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateCPC}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Calculate CPC
            </button>

            {cpcResult.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">Results:</h4>
                {cpcResult.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 ${
                      item.highlighted ? 'bg-purple-100 px-4 rounded-lg' : ''
                    }`}
                  >
                    <span className={`${item.highlighted ? 'font-bold text-purple-700' : 'text-gray-700'}`}>
                      {item.label}:
                    </span>
                    <span className={`${item.highlighted ? 'font-bold text-purple-700 text-xl' : 'font-semibold text-gray-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'conversion':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Conversion Rate Calculator</h3>
                <p className="text-sm text-gray-600">Calculate your conversion rate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Conversions</label>
                <input
                  type="number"
                  value={conversionInputs.conversions}
                  onChange={(e) => setConversionInputs({ ...conversionInputs, conversions: e.target.value })}
                  placeholder="Enter total conversions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Visitors</label>
                <input
                  type="number"
                  value={conversionInputs.visitors}
                  onChange={(e) => setConversionInputs({ ...conversionInputs, visitors: e.target.value })}
                  placeholder="Enter total visitors"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateConversion}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Calculate Conversion Rate
            </button>

            {conversionResult.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">Results:</h4>
                {conversionResult.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 ${
                      item.highlighted ? 'bg-orange-100 px-4 rounded-lg' : ''
                    }`}
                  >
                    <span className={`${item.highlighted ? 'font-bold text-orange-700' : 'text-gray-700'}`}>
                      {item.label}:
                    </span>
                    <span className={`${item.highlighted ? 'font-bold text-orange-700 text-xl' : 'font-semibold text-gray-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'cpa':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">CPA Calculator</h3>
                <p className="text-sm text-gray-600">Calculate your cost per acquisition</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Ad Spend (₹)</label>
                <input
                  type="number"
                  value={cpaInputs.cost}
                  onChange={(e) => setCpaInputs({ ...cpaInputs, cost: e.target.value })}
                  placeholder="Enter total ad spend"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Conversions</label>
                <input
                  type="number"
                  value={cpaInputs.conversions}
                  onChange={(e) => setCpaInputs({ ...cpaInputs, conversions: e.target.value })}
                  placeholder="Enter total conversions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateCPA}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Calculate CPA
            </button>

            {cpaResult.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">Results:</h4>
                {cpaResult.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 ${
                      item.highlighted ? 'bg-red-100 px-4 rounded-lg' : ''
                    }`}
                  >
                    <span className={`${item.highlighted ? 'font-bold text-red-700' : 'text-gray-700'}`}>
                      {item.label}:
                    </span>
                    <span className={`${item.highlighted ? 'font-bold text-red-700 text-xl' : 'font-semibold text-gray-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:ml-16 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Marketing Tools</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Essential calculators and tools for digital marketing performance analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Tools</h2>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTab(tool.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                        activeTab === tool.id
                          ? 'bg-primary text-white shadow-md'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${activeTab === tool.id ? 'bg-white/20' : tool.color}`}>
                        <Icon className={`w-5 h-5 ${activeTab === tool.id ? 'text-white' : ''}`} />
                      </div>
                      <div>
                        <h3 className={`font-medium text-sm ${activeTab === tool.id ? 'text-white' : 'text-gray-900'}`}>
                          {tool.name}
                        </h3>
                        <p className={`text-xs mt-1 ${activeTab === tool.id ? 'text-white/80' : 'text-gray-600'}`}>
                          {tool.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {renderCalculator()}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Percent className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Industry Benchmarks</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>Avg. CTR (Search):</span>
                <span className="font-medium text-gray-900">3-5%</span>
              </li>
              <li className="flex justify-between">
                <span>Avg. CTR (Display):</span>
                <span className="font-medium text-gray-900">0.5-1%</span>
              </li>
              <li className="flex justify-between">
                <span>Avg. Conversion Rate:</span>
                <span className="font-medium text-gray-900">2-5%</span>
              </li>
              <li className="flex justify-between">
                <span>Good ROI:</span>
                <span className="font-medium text-gray-900">&gt;200%</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Healthcare Marketing</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>Avg. CPC (Healthcare):</span>
                <span className="font-medium text-gray-900">₹50-200</span>
              </li>
              <li className="flex justify-between">
                <span>Avg. CPA (Healthcare):</span>
                <span className="font-medium text-gray-900">₹2000-5000</span>
              </li>
              <li className="flex justify-between">
                <span>Lead-to-Patient:</span>
                <span className="font-medium text-gray-900">10-20%</span>
              </li>
              <li className="flex justify-between">
                <span>Ideal ROAS:</span>
                <span className="font-medium text-gray-900">3:1 to 5:1</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Optimization Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Test multiple ad variations</li>
              <li>• Track conversion funnels</li>
              <li>• Use negative keywords</li>
              <li>• Optimize landing pages</li>
              <li>• Monitor quality scores</li>
              <li>• A/B test regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
