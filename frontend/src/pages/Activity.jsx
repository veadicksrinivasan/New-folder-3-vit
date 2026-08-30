import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { Activity as ActivityIcon, Clock, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAuth();

  useEffect(() => {
    fetchAPI('/activities')
      .then(data => setActivities(data))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px' }}>
      {/* Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ActivityIcon size={24} color="var(--accent-primary)" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Recent Activity Feed</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Real-time audit log of team actions, document uploads, and project updates.
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Activity Event</th>
                <th>Initiated By</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id}>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-primary)" />
                    <span>{act.activity}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {act.user}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{act.date}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-secondary)' }}>{act.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
