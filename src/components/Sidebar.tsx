import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  TrendingUp, 
  PieChart,
  Home,
  CheckCircle
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'sell', label: 'Sell', icon: CheckCircle },
    { id: 'sales-history', label: 'Sales History', icon: ShoppingBag, badge: '0' },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'catalog', label: 'Online Catalog', icon: Home },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reparation', label: 'Reparation', icon: CreditCard },
    { id: 'finances', label: 'Finances', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <div className="w-64 bg-slate-800 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <div className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-medium">PRO</div>
            <div className="text-xs text-slate-400 mt-1">Subscribe</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                isActive ? 'bg-slate-700 border-r-2 border-emerald-500' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className={`text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-auto bg-slate-600 text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="text-xs text-slate-400">
            Users
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;