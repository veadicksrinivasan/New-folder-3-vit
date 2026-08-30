import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  Users,
  Building2,
  BarChart3,
  Code2,
  Database,
  Activity,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Employees', path: '/employees', icon: Users },
    { label: 'Customers', path: '/customers', icon: Building2 },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Developer Portal', path: '/developer', icon: Code2 },
    { label: 'Company Data', path: '/company-data', icon: Database },
    { label: 'Activity Feed', path: '/activity', icon: Activity },
    { label: 'Admin Console', path: '/admin', icon: ShieldCheck }
  ];

  const bottomItems = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside style={{
      width: collapsed ? '80px' : '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      zIndex: 50
    }}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '28px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)'
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.1rem',
            flexShrink: 0
          }}>
            N
          </div>
          {!collapsed && (
            <div>
              <h1 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                NexaCore
              </h1>
              <p style={{ fontSize: '0.6875rem', color: 'var(--accent-secondary)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                Employee Portal
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                whiteSpace: 'nowrap'
              })}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
              })}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* User Card & Logout */}
        <div style={{
          marginTop: '0.5rem',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap' }}>{user?.name || 'helloVIT'}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{user?.role === 'admin' ? 'Administrator' : (user?.title || 'Developer')}</p>
            </div>
          )}
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-rose)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
