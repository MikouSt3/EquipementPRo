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
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { useCustomers } from '../hooks/useCustomers';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';



const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'HOUR' | 'DAY' | 'WEEK DAY' | 'MONTH'>('HOUR');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  // Get real data from hooks
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();

  const loading = ordersLoading || productsLoading || customersLoading;
  const error = ordersError;

  // Process real data for analytics
  useEffect(() => {
    if (!orders.length) return;

    const processedData = processOrdersForChart(orders, selectedPeriod);
    setChartData(processedData);

    // Process category data
    const categoryStats = processCategoryData(orders, products);
    setCategoryData(categoryStats);
  }, [orders, products, selectedPeriod]);

  const processOrdersForChart = (orders: any[], period: string) => {
    const now = new Date();
    const data: any[] = [];

    switch (period) {
      case 'HOUR':
        // Generate hourly data for today
        for (let i = 0; i <= 23; i++) {
          const hourOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.toDateString() === now.toDateString() && 
                   orderDate.getHours() === i;
          });
          
          const revenue = hourOrders.reduce((sum, order) => sum + order.total, 0);
          const sales = hourOrders.length;
          const averageTicket = sales > 0 ? revenue / sales : 0;
          
          data.push({
            hour: `${i}h`,
            revenue,
            sales,
            averageTicket,
          });
        }
        break;
        
      case 'DAY':
        // Generate daily data for last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.toDateString() === date.toDateString();
          });
          
          const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
          const sales = dayOrders.length;
          const customers = new Set(dayOrders.map(order => order.customer_id)).size;
          
          data.push({
            day: date.getDate(),
            revenue,
            sales,
            customers,
          });
        }
        break;
        
      case 'WEEK DAY':
        // Generate weekly data
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        weekDays.forEach((day, index) => {
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.getDay() === (index + 1) % 7; // Adjust for Monday start
          });
          
          const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
          const sales = dayOrders.length;
          const customers = new Set(dayOrders.map(order => order.customer_id)).size;
          
          data.push({
            day,
            revenue,
            sales,
            customers,
          });
        });
        break;
        
      case 'MONTH':
        // Generate monthly data for last 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          
          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === date.getMonth() && 
                   orderDate.getFullYear() === date.getFullYear();
          });
          
          const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
          const sales = monthOrders.length;
          const customers = new Set(monthOrders.map(order => order.customer_id)).size;
          
          data.push({
            month: months[date.getMonth()],
            revenue,
            sales,
            customers,
          });
        }
        break;
    }
    
    return data;
  };

  const processCategoryData = (orders: any[], products: any[]) => {
    const categoryStats: { [key: string]: number } = {};
    let totalValue = 0;

    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const product = products.find(p => p.id === item.product_id);
        const category = product?.category || 'Others';
        const value = item.price * item.quantity;
        
        categoryStats[category] = (categoryStats[category] || 0) + value;
        totalValue += value;
      });
    });

    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280', '#EC4899'];
    
    return Object.entries(categoryStats)
      .map(([name, value], index) => ({
        name,
        value: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate KPIs from real data
  const calculateKPIs = () => {
    const today = new Date();
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === today.toDateString();
    });

    const revenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const sales = todayOrders.length;
    const averageTicket = sales > 0 ? revenue / sales : 0;
    const profits = 0; // Would need cost data to calculate
    const totalCustomers = customers.length;
    
    // Find best and worst hours
    const hourlyStats: { [key: number]: { revenue: number, sales: number } } = {};
    todayOrders.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { revenue: 0, sales: 0 };
      }
      hourlyStats[hour].revenue += order.total;
      hourlyStats[hour].sales += 1;
    });
    
    let bestHour = '0h';
    let worstHour = '0h';
    let maxRevenue = 0;
    let minRevenue = Infinity;
    
    Object.entries(hourlyStats).forEach(([hour, stats]) => {
      if (stats.revenue > maxRevenue) {
        maxRevenue = stats.revenue;
        bestHour = `${hour}h`;
      }
      if (stats.revenue < minRevenue) {
        minRevenue = stats.revenue;
        worstHour = `${hour}h`;
      }
    });
    
    return {
      revenue,
      sales,
      averageTicket,
      profits,
      customers: totalCustomers,
      conversionRate: 0, // Would need visitor data
      bestHour,
      worstHour,
    };
  };

  const kpiData = calculateKPIs();
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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        </div>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
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
                
                {categoryData.length > 0 ? (
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
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500">No sales data available</div>
                    <p className="text-sm text-gray-400 mt-1">Complete some sales to see category breakdown</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;