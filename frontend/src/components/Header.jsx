import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Sun, Moon, Shield, Code2 } from 'lucide-react';

export const Header = ({ title, subtitle }) => {
  const { user, theme, toggleTheme, switchRole } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <header style={{
      padding: '1.25rem 2rem',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Global Search Bar */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.3rem', padding: '0.45rem 0.85rem', fontSize: '0.8125rem' }}
            placeholder="Search projects, tasks, employees..."
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '0.3rem',
          padding: '0.25rem',
          borderRadius: '9999px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => switchRole('admin')}
            className="btn btn-sm"
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '9999px',
              border: 'none',
              background: isAdmin ? 'rgba(14, 165, 233, 0.22)' : 'transparent',
              color: isAdmin ? '#38bdf8' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}
            title="Switch to Admin"
          >
            <Shield size={13} />
            Admin
          </button>
          <button
            type="button"
            onClick={() => switchRole('developer')}
            className="btn btn-sm"
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '9999px',
              border: 'none',
              background: !isAdmin ? 'rgba(14, 165, 233, 0.22)' : 'transparent',
              color: !isAdmin ? '#38bdf8' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}
            title="Switch to Developer"
          >
            <Code2 size={13} />
            Developer
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.5rem', borderRadius: '50%' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
        >
          {theme === 'dark' ? <Sun size={16} color="var(--accent-amber)" /> : <Moon size={16} color="var(--accent-indigo)" />}
        </button>

        {/* Notification Bell */}
        <button
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={16} color="var(--text-secondary)" />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--accent-primary)'
          }}></span>
        </button>

        {/* User Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            {user?.name ? user.name.charAt(0) : 'h'}
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            {user?.name || 'helloVIT'}
          </span>
        </div>
      </div>
    </header>
  );
};
