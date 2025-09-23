import React, { useState, useEffect } from 'react';
import { Lock, Delete, Check } from 'lucide-react';

interface PinLoginProps {
  onLogin: (success: boolean) => void;
}

const PinLogin: React.FC<PinLoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Default PIN - in production, this should be configurable
  const CORRECT_PIN = '1234';
  const PIN_LENGTH = 4;

  const handleNumberClick = (number: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(prev => prev + number);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = () => {
    if (pin.length !== PIN_LENGTH) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    if (pin === CORRECT_PIN) {
      onLogin(true);
    } else {
      setError('Incorrect PIN. Please try again.');
      setIsShaking(true);
      setPin('');
      
      // Remove shake animation after it completes
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pin]);

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">EquipementPro</h1>
          <p className="text-gray-600">Enter your PIN to access the system</p>
        </div>

        {/* PIN Display */}
        <div className={`mb-6 ${isShaking ? 'animate-shake' : ''}`}>
          <div className="flex justify-center space-x-3 mb-4">
            {Array.from({ length: PIN_LENGTH }).map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                  index < pin.length
                    ? 'border-teal-500 bg-teal-50 text-teal-600'
                    : 'border-gray-300 bg-gray-50 text-gray-400'
                }`}
              >
                {index < pin.length ? '●' : ''}
              </div>
            ))}
          </div>
          
          {error && (
            <div className="text-center">
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Number Pad */}
        <div className="space-y-3 mb-6">
          {numbers.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-3">
              {row.map((number, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => number && handleNumberClick(number)}
                  disabled={!number}
                  className={`w-16 h-16 rounded-xl text-xl font-semibold transition-all duration-200 ${
                    number
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-95 hover:shadow-md'
                      : 'invisible'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95"
          >
            <Delete className="w-5 h-5" />
            <span>Delete</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={pin.length !== PIN_LENGTH}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 ${
              pin.length === PIN_LENGTH
                ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>Enter</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Use keyboard or touch the numbers above
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Default PIN: 1234
          </p>
        </div>
      </div>

      {/* Custom CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PinLogin;