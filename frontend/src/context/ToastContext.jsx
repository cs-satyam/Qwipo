import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  const show = useCallback((message, { variant = 'success', timeout = 3000 } = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, variant }]);
    if (timeout) setTimeout(() => remove(id), timeout);
    return id;
  }, [remove]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
        <div className="d-flex flex-column gap-2">
          {toasts.map(t => (
            <div key={t.id} className={`alert alert-${t.variant} shadow-sm mb-0`} role="alert">
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
