import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Edit, Trash2, Search, X, HardHat } from 'lucide-react';

export const Worker = () => {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({
    worker_id: '',
    name: '',
    department: 'Operations',
    role_title: 'Senior Technician',
    email: ''
  });
  const { showToast } = useAuth();

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/workers');
      setWorkers(data);
    } catch (err) {
      showToast('Failed to fetch workers: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const handleOpenAddModal = () => {
    setEditingWorker(null);
    setFormData({
      worker_id: `W00${workers.length + 1}`,
      name: '',
      department: 'Operations',
      role_title: 'Senior Technician',
      email: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (worker) => {
    setEditingWorker(worker);
    setFormData({ ...worker });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await fetchAPI(`/workers/${editingWorker.worker_id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        showToast(`Worker ${formData.name} updated. Event WORKER_UPDATED sent to ZentraSec!`, 'success');
      } else {
        await fetchAPI('/workers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showToast(`Worker ${formData.name} created. Event WORKER_CREATED sent to ZentraSec!`, 'success');
      }
      setIsModalOpen(false);
      loadWorkers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (workerId, workerName) => {
    if (!window.confirm(`Are you sure you want to delete worker ${workerName} (${workerId})? Fires event WORKER_DELETED!`)) {
      return;
    }

    try {
      await fetchAPI(`/workers/${workerId}`, { method: 'DELETE' });
      showToast(`Worker ${workerId} deleted. Event WORKER_DELETED sent to ZentraSec!`, 'warning');
      loadWorkers();
    } catch (err) {
      showToast('Failed to delete worker: ' + err.message, 'error');
    }
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.worker_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HardHat size={24} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Worker Management</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Managing worker records dispatches real-time <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>WORKER_CREATED / WORKER_DELETED</code> telemetry.
              </p>
            </div>
          </div>

          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <UserPlus size={16} />
            <span>Add New Worker</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '320px' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
          placeholder="Search workers by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Workers Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Worker ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Role Title</th>
                <th>Email Address</th>
                <th>Actions (Fires Event)</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No worker records found.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w) => (
                  <tr key={w.worker_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {w.worker_id}
                    </td>
                    <td style={{ fontWeight: '600' }}>{w.name}</td>
                    <td><span className="badge badge-role-teacher">{w.department}</span></td>
                    <td>{w.role_title}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{w.email || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(w)} className="btn btn-secondary btn-sm">
                          <Edit size={14} color="var(--accent-cyan)" />
                          <span>Edit</span>
                        </button>
                        <button onClick={() => handleDelete(w.worker_id, w.name)} className="btn btn-danger btn-sm">
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                {editingWorker ? 'Edit Worker Record' : 'Register New Worker'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Worker ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.worker_id}
                  onChange={(e) => setFormData({ ...formData, worker_id: e.target.value })}
                  disabled={!!editingWorker}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Operations">Operations</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Security Ops">Security Ops</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.role_title}
                    onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingWorker ? 'Save Changes' : 'Create Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
