import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Mail, Phone, Plus, X } from 'lucide-react';

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: '',
    department: 'Engineering',
    position: 'Software Engineer',
    email: '',
    phone: '+1 (555) 123-4567',
    status: 'Active'
  });
  const { showToast } = useAuth();

  const loadEmps = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/employees');
      setEmployees(data);
    } catch (err) {
      showToast('Failed to load employees: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmps();
  }, []);

  const handleCreateEmp = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI('/employees', {
        method: 'POST',
        body: JSON.stringify(newEmp)
      });
      showToast(`Employee '${newEmp.name}' added to roster!`, 'success');
      setIsModalOpen(false);
      setNewEmp({ name: '', department: 'Engineering', position: 'Software Engineer', email: '', phone: '+1 (555) 123-4567', status: 'Active' });
      loadEmps();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const departments = ['ALL', 'Engineering', 'Design', 'HR', 'Finance', 'Marketing', 'Management'];

  const filteredEmps = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || e.department === deptFilter;
    return matchesSearch && matchesDept;
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
              placeholder="Search by name, position, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {departments.map(d => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={`btn btn-sm ${deptFilter === d ? 'btn-primary' : 'btn-secondary'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>+ Add Employee</span>
        </button>
      </div>

      {/* Employee Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredEmps.map((emp) => (
          <div key={emp.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: '800',
                flexShrink: 0
              }}>
                {emp.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{emp.name}</h4>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>{emp.status}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem' }}>
              <p style={{ fontWeight: '700', color: 'var(--accent-secondary)' }}>{emp.position}</p>
              <p style={{ color: 'var(--text-muted)' }}>Department: {emp.department}</p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.78125rem',
              color: 'var(--text-secondary)',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} color="var(--text-muted)" />
                <span>{emp.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--text-muted)" />
                <span>{emp.phone || '+1 (555) 000-0000'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Add New Employee</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEmp}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Arun Kumar"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Position Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newEmp.position}
                    onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@nexacore.local"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
