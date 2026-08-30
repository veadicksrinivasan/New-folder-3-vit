import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { X, RefreshCw, CheckCircle2, AlertTriangle, Shield, Clock, Send } from 'lucide-react';

export const SecurityMonitorDrawer = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/security/events?limit=30');
      setEvents(data);
    } catch (err) {
      console.error('Failed to load security events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEvents();
    }
  }, [isOpen]);

  // Auto polling every 3 seconds when drawer is open
  useEffect(() => {
    let interval;
    if (isOpen && autoRefresh) {
      interval = setInterval(() => {
        loadEvents();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, autoRefresh]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '440px',
      maxWidth: '100vw',
      background: '#0f172a',
      borderLeft: '1px solid var(--border-color)',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Security Telemetry</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time ZentraSec Event Feed</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={loadEvents}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem' }}
            title="Refresh events"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Auto Refresh Bar */}
      <div style={{
        padding: '0.5rem 1.5rem',
        background: 'rgba(30, 41, 59, 0.4)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span>Polling: {autoRefresh ? 'Active (3s)' : 'Paused'}</span>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          {autoRefresh ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Event Stream List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Send size={32} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
            <p>No security events generated yet.</p>
            <span style={{ fontSize: '0.75rem' }}>Perform actions in the app to fire events!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.map((ev) => {
              const isAlert = ['LOGIN_FAILED', 'UNAUTHORIZED_ACCESS', 'RESULT_DELETED'].includes(ev.event_type);
              const isSuccess = ev.delivery_status === 'SENT';

              return (
                <div
                  key={ev.event_id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${isAlert ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    fontSize: '0.8125rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className={`event-pill ${isAlert ? 'event-pill-alert' : 'event-pill-success'}`}>
                      {ev.event_type}
                    </span>
                    <span className={`badge ${isSuccess ? 'badge-sent' : 'badge-local'}`}>
                      {isSuccess ? <><CheckCircle2 size={12} /> Sent to ZentraSec</> : <><AlertTriangle size={12} /> Saved locally</>}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>👤 {ev.username} ({ev.user_role})</span>
                    <span>•</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>📍 {ev.resource}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                    <Clock size={12} />
                    <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                  </div>

                  {ev.metadata && Object.keys(ev.metadata).length > 0 && (
                    <details style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                        Metadata Payload
                      </summary>
                      <pre style={{
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        background: '#0b0f19',
                        borderRadius: '4px',
                        fontSize: '0.6875rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#a5f3fc',
                        overflowX: 'auto'
                      }}>
                        {JSON.stringify(ev.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
