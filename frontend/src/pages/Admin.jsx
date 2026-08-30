import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, AlertTriangle, Cpu, Terminal, RefreshCw } from 'lucide-react';

export const Admin = () => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorizedError, setUnauthorizedError] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    setUnauthorizedError(null);
    try {
      const data = await fetchAPI('/admin/dashboard-stats');
      setStats(data);
    } catch (err) {
      if (err.status === 403) {
        setUnauthorizedError(err.message || 'Access Denied: Only Administrator users can access this page.');
        showToast('🚨 Access Denied! Event UNAUTHORIZED_ACCESS dispatched to ZentraSec.', 'error');
      } else {
        showToast(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleTriggerAdminAction = async (actionName) => {
    try {
      const res = await fetchAPI('/admin/system-action', {
        method: 'POST',
        body: JSON.stringify({ action_name: actionName })
      });
      showToast(`⚡ Admin Action executed: ${res.message}. Event ADMIN_ACTION sent to ZentraSec!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // If role is teacher or unauthorized error returned from backend API
  if (unauthorizedError || user?.role !== 'admin') {
    return (
      <div className="glass-card" style={{
        textAlign: 'center',
        padding: '3.5rem 2rem',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        background: 'rgba(244, 63, 94, 0.05)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <Lock size={32} color="var(--accent-rose)" />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f87171' }}>
          403 FORBIDDEN - UNAUTHORIZED ACCESS ATTEMPT
        </h2>

        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0.75rem auto 1.5rem' }}>
          {unauthorizedError || `User '${user?.username}' with role '${user?.role}' does not possess administrative privileges.`}
        </p>

        <div style={{
          padding: '1rem',
          background: '#0b0f19',
          borderRadius: 'var(--radius-md)',
          display: 'inline-block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          color: '#fca5a5',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          textAlign: 'left'
        }}>
          <div>🚨 Telemetry Status: <b>UNAUTHORIZED_ACCESS</b></div>
          <div>Resource: <b>/admin</b></div>
          <div>User: <b>{user?.username}</b></div>
          <div>Action: Rejected by backend RBAC middleware & sent to ZentraSec.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={28} color="var(--accent-purple)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>Administrator Security Console</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                System configuration, privilege management, and administrative event generator.
              </p>
            </div>
          </div>
          <span className="badge badge-role-admin" style={{ fontSize: '0.8125rem', padding: '0.4rem 0.8rem' }}>
            ADMIN ACCESS CONFIRMED
          </span>
        </div>
      </div>

      {/* Admin Operations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Cpu size={20} color="var(--accent-cyan)" />
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Security Telemetry Relay</h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Relay security events to configured ZentraSec threat intelligence endpoint.
          </p>
          <button onClick={() => handleTriggerAdminAction('FLUSH_TELEMETRY_CACHE')} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            Flush Local Telemetry Queue
          </button>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Terminal size={20} color="var(--accent-purple)" />
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Audit & Diagnostics</h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Execute administrative audit routines and log ADMIN_ACTION event to ZentraSec engine.
          </p>
          <button onClick={() => handleTriggerAdminAction('EXECUTE_SECURITY_AUDIT')} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            Trigger Security Audit
          </button>
        </div>
      </div>
    </div>
  );
};
