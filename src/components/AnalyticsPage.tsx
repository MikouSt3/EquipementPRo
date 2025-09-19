import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Target,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Sample data for demonstration
const generateHourlyData = () => {
  const hours = [];
  for (let i = 0; i <= 23; i++) {
    hours.push({
      hour: `${i}h`,
      revenue: Math.random() * 3000,
      sales: Math.floor(Math.random() * 10),
      averageTicket: Math.random() * 500 + 100,
    });
  }
  return hours;
};

const generateDailyData = () => {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    days.push({
      day: i,
      revenue: Math.random() * 5000 + 1000,
      sales: Math.floor(Math.random() * 50) + 10,
      customers: Math.floor(Math.random() * 30) + 5,
    });
  }
  return days;
};

const generateWeeklyData = () => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return weekDays.map(day => ({
    day,
    revenue: Math.random() * 8000 + 2000,
    sales: Math.floor(Math.random() * 100) + 20,
    customers: Math.floor(Math.random() * 50) + 10,
  }));
};

const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    revenue: Math.random() * 50000 + 10000,
    sales: Math.floor(Math.random() * 500) + 100,
    customers: Math.floor(Math.random() * 200) + 50,
  }));
};

const categoryData = [
  { name: 'Electronics', value: 35, color: '#10B981' },
  { name: 'Clothing', value: 25, color: '#3B82F6' },
  { name: 'Food', value: 20, color: '#F59E0B' },
  { name: 'Books', value: 12, color: '#EF4444' },
  { name: 'Others', value: 8, color: '#8B5CF6' },
];

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'HOUR' | 'DAY' | 'WEEK DAY' | 'MONTH'>('HOUR');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample KPI data
  const [kpiData, setKpiData] = useState({
    revenue: 3000.00,
    sales: 1,
    averageTicket: 3000.00,
    profits: 0.00,
    customers: 156,
    conversionRate: 2.5,
    bestHour: '13h',
    worstHour: '3h',
  });

  const [chartData, setChartData] = useState(generateHourlyData());

  // Simulate data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      switch (selectedPeriod) {
        case 'HOUR':
          setChartData(generateHourlyData());
          break;
        case 'DAY':
          setChartData(generateDailyData());
          break;
        case 'WEEK DAY':
          setChartData(generateWeeklyData());
          break;
        case 'MONTH':
          setChartData(generateMonthlyData());
          break;
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const exportData = () => {
    // Simulate export functionality
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${selectedPeriod.toLowerCase()}-${currentDate.toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: د.ج ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Analytics</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              aria-label="Export analytics data"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <HelpCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">Help</span>
            </button>
            
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">KL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Date Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Previous day"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    Today: {formatDate(currentDate)}
                  </span>
                </div>
                <button 
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Next day"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - KPIs */}
            <div className="space-y-4">
              {/* Revenue Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Revenue</h3>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  د.ج {kpiData.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Best month September</div>
              </div>

              {/* Sales Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Sales</h3>
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kpiData.sales}
                </div>
                <div className="text-sm text-gray-500">Best month September</div>
              </div>

              {/* Average Ticket Size Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Average Ticket Size</h3>
                  <Target className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  د.ج {kpiData.averageTicket.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Best month September</div>
              </div>

              {/* Profits Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Profits</h3>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  د.ج {kpiData.profits.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Best month September</div>
              </div>

              {/* Additional KPIs */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Customers</h3>
                  <Users className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kpiData.customers}
                </div>
                <div className="text-sm text-gray-500">Total registered</div>
              </div>
            </div>

            {/* Right Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                  
                  {/* Period Selector */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {(['HOUR', 'DAY', 'WEEK DAY', 'MONTH'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                          selectedPeriod === period
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        aria-label={`View ${period.toLowerCase()} analytics`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey={selectedPeriod === 'HOUR' ? 'hour' : selectedPeriod === 'DAY' ? 'day' : selectedPeriod === 'WEEK DAY' ? 'day' : 'month'}
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Performance Table */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Hour</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Average Ticket Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                            {kpiData.bestHour} BEST HOUR
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-emerald-600">د.ج {kpiData.revenue.toFixed(2)}</td>
                        <td className="py-3 px-4">{kpiData.sales}</td>
                        <td className="py-3 px-4">د.ج {kpiData.averageTicket.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            {kpiData.worstHour} WORST HOUR
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">د.ج 0.00</td>
                        <td className="py-3 px-4">0</td>
                        <td className="py-3 px-4">د.ج 0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sales by Category Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`${value}%`, 'Percentage']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-3">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{category.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;