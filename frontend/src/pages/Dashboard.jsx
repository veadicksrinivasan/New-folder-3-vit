import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats] = useState({
    active_projects: 12,
    pending_tasks: 8,
    team_members: 48,
    documents: 126
  });

  const [myProjects, setMyProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAPI('/projects').catch(() => []),
      fetchAPI('/tasks').catch(() => [])
    ]).then(([projData, taskData]) => {
      setMyProjects(projData.slice(0, 3));
      setRecentTasks(taskData.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Active Projects', value: stats.active_projects, icon: FolderKanban, color: 'var(--accent-primary)' },
    { label: 'Pending Tasks', value: stats.pending_tasks, icon: CheckSquare, color: 'var(--accent-amber)' },
    { label: 'Team Members', value: stats.team_members, icon: Users, color: 'var(--accent-emerald)' },
    { label: 'Documents', value: stats.documents, icon: FileText, color: 'var(--accent-indigo)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner Greeting */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Good morning, {user?.name ? user.name.split(' ')[0] : 'Alex'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Here's what's happening across your workspace today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/projects')} className="btn btn-primary">
              <FolderKanban size={16} />
              <span>View Projects</span>
            </button>
            <button onClick={() => navigate('/tasks')} className="btn btn-secondary">
              <CheckSquare size={16} />
              <span>My Tasks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corporate KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${card.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={24} color={card.color} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.label}
                </p>
                <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* "My Work" Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>My Work</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Current active project assignments and deadlines</p>
          </div>
          <button onClick={() => navigate('/projects')} className="btn btn-secondary btn-sm">
            <span>Explore All Projects</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {myProjects.map((p) => (
            <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{p.name}</h4>
                  <span className={`badge ${p.status === 'Active' ? 'badge-active' : p.status === 'In Progress' ? 'badge-progress' : 'badge-completed'}`}>
                    {p.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {p.description || 'Enterprise platform engineering initiative.'}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Manager: <b style={{ color: 'var(--text-primary)' }}>{p.manager}</b></span>
                  <span>Deadline: <b style={{ color: 'var(--accent-amber)' }}>{p.deadline}</b></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{p.progress}%</span>
                </div>

                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Summary & Recent Operations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Pending Tasks */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Assigned Tasks</h3>
            <button onClick={() => navigate('/tasks')} className="btn btn-secondary btn-sm">
              <span>View Tasks</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentTasks.map((t) => (
              <div key={t.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project: {t.project_name}</p>
                </div>
                <span className={`badge ${t.status === 'Completed' ? 'badge-completed' : 'badge-progress'}`} style={{ fontSize: '0.7rem' }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links & Enterprise Shortcuts */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Enterprise Portals</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <button onClick={() => navigate('/developer')} className="btn btn-secondary" style={{ padding: '1rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>💻</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Developer Portal</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Repos & Build logs</span>
            </button>

            <button onClick={() => navigate('/documents')} className="btn btn-secondary" style={{ padding: '1rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📁</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Documents</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Corporate Assets</span>
            </button>

            <button onClick={() => navigate('/employees')} className="btn btn-secondary" style={{ padding: '1rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>👥</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Employees</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company Roster</span>
            </button>

            <button onClick={() => navigate('/reports')} className="btn btn-secondary" style={{ padding: '1rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📊</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Reports</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
