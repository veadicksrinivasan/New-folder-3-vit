import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, ShieldCheck } from 'lucide-react';

export const Manager = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAuth();

  useEffect(() => {
    fetchAPI('/managers')
      .then(data => setManagers(data))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase size={24} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Manager Directory</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Executive managerial team and department heads overseeing operations and security.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {managers.map((m) => (
          <div key={m.manager_id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '0.875rem' }}>
                {m.manager_id}
              </span>
              <span className="badge badge-role-teacher">
                {m.department}
              </span>
            </div>

            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{m.name}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--accent-purple)', fontWeight: '600', marginTop: '2px' }}>
                {m.designation}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78125rem',
              color: 'var(--text-muted)',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <Mail size={14} color="var(--text-dim)" />
              <span>{m.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
