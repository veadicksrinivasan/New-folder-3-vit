import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building2, Search, UserCheck } from 'lucide-react';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useAuth();

  useEffect(() => {
    fetchAPI('/customers')
      .then(data => setCustomers(data))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.account_manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building2 size={24} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Customer Accounts</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Client portfolio management, assigned account leads, and solution deployment status.
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search client accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Industry Sector</th>
                <th>Active Project</th>
                <th>Account Manager</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust.id}>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Building2 size={16} color="var(--accent-primary)" />
                    <span>{cust.name}</span>
                  </td>
                  <td>{cust.industry}</td>
                  <td style={{ color: 'var(--accent-secondary)', fontWeight: '600' }}>{cust.project}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{cust.account_manager}</td>
                  <td>
                    <span className={`badge ${cust.status === 'Active' ? 'badge-active' : cust.status === 'Onboarding' ? 'badge-onhold' : 'badge-completed'}`}>
                      {cust.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
