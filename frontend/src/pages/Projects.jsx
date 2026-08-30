import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, FolderKanban, Calendar, Users, X, Check } from 'lucide-react';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    manager: 'Alex Johnson',
    team_count: 5,
    deadline: '2026-11-15',
    progress: 10,
    status: 'Active',
    description: '',
    document: null
  });
  const { showToast } = useAuth();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/projects');
      setProjects(data);
    } catch (err) {
      showToast('Failed to load projects: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('manager', formData.manager);
      submitData.append('team_count', formData.team_count);
      submitData.append('deadline', formData.deadline);
      submitData.append('progress', formData.progress);
      submitData.append('status', formData.status);
      submitData.append('description', formData.description);
      if (formData.document) {
        submitData.append('document', formData.document);
      }

      const token = localStorage.getItem('nexacore_token') || localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: submitData,
        headers: headers
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create project');
      }
      
      showToast(`Project '${formData.name}' created successfully!`, 'success');
      setIsModalOpen(false);
      setFormData({
        name: '',
        manager: 'Alex Johnson',
        team_count: 5,
        deadline: '2026-11-15',
        progress: 10,
        status: 'Active',
        description: '',
        document: null
      });
      loadProjects();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search projects or managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['ALL', 'Active', 'In Progress', 'Completed', 'On Hold'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>+ New Project</span>
        </button>
      </div>

      {/* Projects Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredProjects.map((p) => {
          const badgeClass = p.status === 'Active' ? 'badge-active' :
                             p.status === 'In Progress' ? 'badge-progress' :
                             p.status === 'Completed' ? 'badge-completed' : 'badge-onhold';

          return (
            <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span className={`badge ${badgeClass}`}>{p.status}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ID: PRJ-00{p.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {p.description || 'Enterprise software development project.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Project Manager</span>
                    <b style={{ color: 'var(--text-primary)' }}>{p.manager}</b>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Team Size</span>
                    <b style={{ color: 'var(--text-primary)' }}>{p.team_count} Members</b>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Start Date</span>
                    <b>{p.start_date}</b>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Deadline</span>
                    <b style={{ color: 'var(--accent-amber)' }}>{p.deadline}</b>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Overall Progress</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{p.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Create New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apollo Data Sync"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Project Manager</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Team Members</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.team_count}
                    onChange={(e) => setFormData({ ...formData, team_count: parseInt(e.target.value, 10) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px' }}
                  placeholder="Short summary of project objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Project Document (.doc, .docx)</label>
                <input
                  type="file"
                  className="form-input"
                  accept=".doc,.docx"
                  onChange={(e) => setFormData({ ...formData, document: e.target.files[0] })}
                />
                {formData.document && (
                  <small style={{ color: 'var(--accent-primary)', display: 'block', marginTop: '0.5rem' }}>
                    ✓ File selected: {formData.document.name}
                  </small>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
