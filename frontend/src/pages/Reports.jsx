import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, CheckCircle, PieChart } from 'lucide-react';

export const Reports = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>Business Reports & Analytics</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Executive performance metrics, team velocity, monthly revenue growth, and task throughput.
            </p>
          </div>
          <span className="badge badge-active" style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}>
            Q3 FY2026 AUDITED
          </span>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card">
          <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Revenue</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', marginTop: '0.2rem' }}>$485,000</h3>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>↑ +14.2% vs last month</span>
        </div>

        <div className="glass-card">
          <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Task Completion Rate</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>94.8%</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '600' }}>↑ 182 tasks completed</span>
        </div>

        <div className="glass-card">
          <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer Retention</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-indigo)', marginTop: '0.2rem' }}>98.5%</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: '600' }}>248 active enterprises</span>
        </div>

        <div className="glass-card">
          <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Employee Productivity</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-amber)', marginTop: '0.2rem' }}>91.2 / 100</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: '600' }}>High efficiency score</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Monthly Performance Bar Chart (SVG) */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Monthly Revenue Growth ($k)</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2026 H1-H2</span>
          </div>

          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', padding: '0 0.5rem' }}>
            {[
              { month: 'Jan', val: 320, height: '60%' },
              { month: 'Feb', val: 350, height: '65%' },
              { month: 'Mar', val: 390, height: '75%' },
              { month: 'Apr', val: 410, height: '80%' },
              { month: 'May', val: 440, height: '88%' },
              { month: 'Jun', val: 485, height: '100%' }
            ].map(b => (
              <div key={b.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)' }}>${b.val}k</span>
                <div style={{
                  width: '100%',
                  height: b.height,
                  background: 'var(--gradient-brand)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease'
                }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress & Task Status Breakdown */}
        <div className="glass-card">
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Department Task Distribution</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Engineering (45%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>82 active tasks</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Product Design (25%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>45 active tasks</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '25%', background: 'var(--accent-indigo)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Customer Operations (20%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>36 active tasks</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '20%', background: 'var(--accent-emerald)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Quality Assurance (10%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>19 active tasks</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '10%', background: 'var(--accent-amber)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
