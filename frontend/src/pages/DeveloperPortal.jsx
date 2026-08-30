import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Code2, GitBranch, CheckCircle2, XCircle, Terminal, Cpu, Server, FileCode2 } from 'lucide-react';

export const DeveloperPortal = () => {
  const [repos, setRepos] = useState([]);
  const [activeTab, setActiveTab] = useState('repositories');
  const [loading, setLoading] = useState(true);
  const { showToast } = useAuth();

  useEffect(() => {
    fetchAPI('/developer/repositories')
      .then(data => setRepos(data))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Code2 size={26} color="var(--accent-secondary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Developer Portal</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Internal engineering workspace, CI/CD build pipelines, microservices, and API documentation.
              </p>
            </div>
          </div>

          <span className="badge badge-active" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            CI/CD PIPELINE: ONLINE
          </span>
        </div>
      </div>

      {/* Developer Portal Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {[
          { id: 'repositories', label: 'Repositories' },
          { id: 'builds', label: 'Builds & CI/CD' },
          { id: 'deployments', label: 'Deployments' },
          { id: 'environments', label: 'Environments' },
          { id: 'apidocs', label: 'API Documentation' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Repositories Tab Content */}
      {activeTab === 'repositories' && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Repository Name</th>
                  <th>Active Branch</th>
                  <th>Last Commit Message</th>
                  <th>Build Number</th>
                  <th>CI/CD Status</th>
                  <th>Target Environment</th>
                </tr>
              </thead>
              <tbody>
                {repos.map((r) => {
                  const isPassed = r.build_status === 'Passed';
                  return (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Terminal size={16} color="var(--accent-secondary)" />
                        <span>{r.name}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <GitBranch size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {r.branch}
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>{r.last_commit}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-indigo)' }}>
                        {r.build_number}
                      </td>
                      <td>
                        <span className={`badge ${isPassed ? 'badge-active' : 'badge-onhold'}`}>
                          {isPassed ? <><CheckCircle2 size={12} /> {r.build_status}</> : <><XCircle size={12} /> {r.build_status}</>}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <Server size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {r.environment}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Builds Log Tab */}
      {activeTab === 'builds' && (
        <div className="glass-card">
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Recent Build Pipeline Executions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { id: 'Build #1842', status: 'Passed', repo: 'aurora-platform', duration: '2m 14s', time: '10 mins ago' },
              { id: 'Build #1841', status: 'Passed', repo: 'atlas-dashboard', duration: '1m 45s', time: '45 mins ago' },
              { id: 'Build #1840', status: 'Failed', repo: 'nova-mobile', duration: '48s', time: '2 hours ago' },
              { id: 'Build #1839', status: 'Passed', repo: 'internal-tools', duration: '3m 05s', time: '5 hours ago' }
            ].map(b => (
              <div key={b.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className={`badge ${b.status === 'Passed' ? 'badge-active' : 'badge-onhold'}`}>
                    {b.status}
                  </span>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)' }}>{b.id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>({b.repo})</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  <span>Duration: {b.duration}</span>
                  <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>{b.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployments & API Docs Fallback info */}
      {(activeTab === 'deployments' || activeTab === 'environments' || activeTab === 'apidocs') && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <FileCode2 size={36} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            NexaCore API Documentation & Environment Gateway
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0.5rem auto 1.25rem' }}>
            Production endpoints and GraphQL schema definitions are served automatically via NexaCore Gateway at <code style={{ color: 'var(--accent-secondary)' }}>https://api.nexacore.local/v2/docs</code>.
          </p>
          <button onClick={() => showToast('Opening internal API docs viewer...', 'info')} className="btn btn-primary">
            Explore Open API Specifications
          </button>
        </div>
      )}
    </div>
  );
};
