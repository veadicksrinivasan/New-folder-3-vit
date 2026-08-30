import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, ShieldCheck } from 'lucide-react';

export const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAuth();

  useEffect(() => {
    fetchAPI('/teachers')
      .then(data => setTeachers(data))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <GraduationCap size={24} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Faculty Directory</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Authorized teaching staff roster with role credentials and departmental assignments.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {teachers.map((t) => (
          <div key={t.teacher_id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '0.875rem' }}>
                {t.teacher_id}
              </span>
              <span className="badge badge-role-teacher">
                {t.department}
              </span>
            </div>

            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{t.name}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--accent-purple)', fontWeight: '600', marginTop: '2px' }}>
                {t.designation}
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
              <span>{t.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
