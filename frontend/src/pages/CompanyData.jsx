import React, { useState } from 'react';
import { Database, Building2, FolderKanban, Users, FileText, Download, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CompanyData = () => {
  const [activeCategory, setActiveCategory] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useAuth();

  const dataHubStats = [
    { id: 'customers', label: 'Customer Records', count: 248, icon: Building2, color: 'var(--accent-primary)' },
    { id: 'projects', label: 'Active Projects', count: 32, icon: FolderKanban, color: 'var(--accent-indigo)' },
    { id: 'employees', label: 'Employee Information', count: 186, icon: Users, color: 'var(--accent-emerald)' },
    { id: 'reports', label: 'Business Reports', count: 64, icon: FileText, color: 'var(--accent-amber)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={26} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Company Master Data Hub</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Enterprise data management system, master data records, and export catalog.
              </p>
            </div>
          </div>

          <button onClick={() => showToast('Exporting master data catalog (CSV format)...', 'success')} className="btn btn-secondary">
            <Download size={16} />
            <span>Export Data Catalog</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {dataHubStats.map(stat => {
          const Icon = stat.icon;
          const isActive = activeCategory === stat.id;

          return (
            <div
              key={stat.id}
              onClick={() => setActiveCategory(stat.id)}
              className="glass-card"
              style={{
                cursor: 'pointer',
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Icon size={20} color={stat.color} />
                <span className="badge badge-active" style={{ fontSize: '0.6875rem' }}>ENTERPRISE DATA</span>
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {stat.label}
              </p>
              <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                {stat.count} Records
              </h3>
            </div>
          );
        })}
      </div>

      {/* Search & Data Explorer Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Master Dataset: {dataHubStats.find(s => s.id === activeCategory)?.label}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing verified demo records</span>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.3rem', padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
              placeholder="Filter master records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Entity Name</th>
                <th>Classification</th>
                <th>Owner / Lead</th>
                <th>Status</th>
                <th>Last Synced</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'REC-1092', name: 'Vertex Systems Corporate Data', class: 'Client Portfolio', lead: 'Vikram Raj', status: 'Active', sync: 'Today, 09:30 AM' },
                { id: 'REC-1093', name: 'Aurora Cloud Architecture Schema', class: 'Technical Spec', lead: 'Alex Johnson', status: 'Active', sync: 'Today, 08:15 AM' },
                { id: 'REC-1094', name: 'NexaCore Q3 Financial Audit', class: 'Business Report', lead: 'Ananya Menon', status: 'Archived', sync: 'Yesterday' },
                { id: 'REC-1095', name: 'Engineering Roster & Skill Matrix', class: 'Employee Record', lead: 'Arun Kumar', status: 'Active', sync: 'Today, 10:00 AM' }
              ].map(row => (
                <tr key={row.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)', fontSize: '0.8125rem' }}>
                    {row.id}
                  </td>
                  <td style={{ fontWeight: '700' }}>{row.name}</td>
                  <td><span className="badge badge-progress">{row.class}</span></td>
                  <td>{row.lead}</td>
                  <td><span className="badge badge-active">{row.status}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.sync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
