import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessNotificationProps {
  isVisible: boolean;
  message?: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  isVisible,
  message = "Sale Completed Successfully!",
  onClose,
  autoCloseDelay = 4000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-dismiss after specified delay
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for fade-out animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-notification-title"
      aria-describedby="success-notification-message"
    >
      <div
        className={`
          bg-white rounded-lg shadow-2xl border-l-4 border-emerald-500 p-6 max-w-sm w-full
          pointer-events-auto transform transition-all duration-300 ease-in-out
          ${isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
        role="alert"
        aria-live="polite"
      >
        {/* Header with icon and close button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle 
                className="w-8 h-8 text-emerald-500" 
                aria-hidden="true"
              />
            </div>
            <div className="flex-1">
              <h3 
                id="success-notification-title"
                className="text-lg font-semibold text-gray-900"
              >
                Success!
              </h3>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Close notification"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Message content */}
        <div className="mb-4">
          <p 
            id="success-notification-message"
            className="text-gray-700 text-sm leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Success indicators */}
        <div className="flex items-center space-x-2 text-sm text-emerald-600">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Transaction processed</span>
        </div>

        {/* Progress bar for auto-close */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all ease-linear"
            style={{
              animation: isAnimating ? `shrink ${autoCloseDelay}ms linear` : 'none'
            }}
          ></div>
        </div>
      </div>

      {/* Custom CSS for progress bar animation */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessNotification;