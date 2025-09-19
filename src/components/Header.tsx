import React from 'react';
import { Search, ChevronDown, HelpCircle, User } from 'lucide-react';
import { Customer } from '../types';

interface HeaderProps {
  title: string;
  selectedCustomer?: Customer;
  onCustomerSelect: (customer: Customer | undefined) => void;
}

const Header: React.FC<HeaderProps> = ({ title, selectedCustomer, onCustomerSelect }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-500 hover:text-gray-700">
            <HelpCircle className="w-5 h-5 mr-1" />
            <span className="text-sm">Help</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onCustomerSelect(undefined)}
              className="flex items-center space-x-2 px-4 py-2 text-teal-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">
                {selectedCustomer ? selectedCustomer.name : 'Select customer'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">KL</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">klizo</div>
                <div className="text-xs text-gray-500">elvizoj@tmail.edu.rs</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;