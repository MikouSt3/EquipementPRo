import { useState, useCallback } from 'react';

interface NotificationState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showSuccess = useCallback((message: string = "Operation completed successfully!") => {
    setNotification({
      isVisible: true,
      message,
      type: 'success'
    });
  }, []);

  const showError = useCallback((message: string = "An error occurred. Please try again.") => {
    setNotification({
      isVisible: true,
      message,
      type: 'error'
    });
  }, []);

  const showWarning = useCallback((message: string = "Warning: Please check your input.") => {
    setNotification({
      isVisible: true,
      message,
      type: 'warning'
    });
  }, []);

  const showInfo = useCallback((message: string = "Information updated.") => {
    setNotification({
      isVisible: true,
      message,
      type: 'info'
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification
  };
};