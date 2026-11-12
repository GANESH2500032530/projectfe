import React from 'react';
import { useToast } from '../../context/ToastContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let icon = 'ℹ️';
        if (toast.type === 'success') icon = '✅';
        if (toast.type === 'warning') icon = '⚠️';
        if (toast.type === 'danger' || toast.type === 'error') icon = '❌';

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <span className="toast-icon">{icon}</span>
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};
