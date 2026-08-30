import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#f43f5e" />,
    info: <Info size={18} color="#3b82f6" />
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 300,
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
      backdropFilter: 'blur(8px)'
    }}>
      {icons[toast.type] || icons.info}
      <span>{toast.message}</span>
    </div>
  );
};
