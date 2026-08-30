import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Bell, Shield, Moon, Sun, Globe, User } from 'lucide-react';

export const Settings = () => {
  const { theme, toggleTheme, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    task_notifications: true,
    project_updates: true,
    security_alerts: false
  });

  const [language, setLanguage] = useState('English (US)');

  const handleToggleNotification = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`Preference '${key.replace('_', ' ')}' updated`, 'success');
      return updated;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Banner Header */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SettingsIcon size={24} color="var(--accent-primary)" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Portal Settings</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Configure account preferences, notifications, theme appearance, and language defaults.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {['Account', 'Profile', 'Preferences', 'Notifications', 'Appearance'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`btn btn-sm ${activeTab === tab.toLowerCase() ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Settings Card Content */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Appearance Section */}
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sun size={18} color="var(--accent-amber)" /> Theme & Appearance
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Interface Theme</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current theme: <b>{theme.toUpperCase()}</b></p>
            </div>
            <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
              Switch to {theme === 'dark' ? 'Light Theme ☀️' : 'Dark Theme 🌙'}
            </button>
          </div>
        </div>

        {/* Notifications Controls */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--accent-primary)" /> Notification Preferences
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive daily digests for critical task updates' },
              { key: 'task_notifications', label: 'Task Notifications', desc: 'Alert when a task is assigned or moved' },
              { key: 'project_updates', label: 'Project Updates', desc: 'Notify on milestone progress and deadline alerts' }
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => handleToggleNotification(item.key)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="var(--accent-indigo)" /> Regional & Language
          </h4>
          <div style={{ maxWidth: '300px' }}>
            <label className="form-label">Portal Language</label>
            <select
              className="form-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                showToast(`Language set to ${e.target.value}`, 'info');
              }}
            >
              <option value="English (US)">English (US)</option>
              <option value="English (UK)">English (UK)</option>
              <option value="Spanish">Spanish</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
