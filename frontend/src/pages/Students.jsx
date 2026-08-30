import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Search, UserPlus, X } from 'lucide-react';

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    department: 'CSE',
    year: '1st Year',
    email: ''
  });
  const { showToast } = useAuth();

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/students');
      setStudents(data);
    } catch (err) {
      showToast('Failed to fetch students: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      student_id: `S00${students.length + 1}`,
      name: '',
      department: 'CSE',
      year: '1st Year',
      email: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Update Student
        await fetchAPI(`/students/${editingStudent.student_id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        showToast(`Student ${formData.name} updated. Event STUDENT_UPDATED sent to ZentraSec!`, 'success');
      } else {
        // Add Student
        await fetchAPI('/students', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showToast(`Student ${formData.name} created. Event STUDENT_CREATED sent to ZentraSec!`, 'success');
      }
      setIsModalOpen(false);
      loadStudents();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student ${studentName} (${studentId})? This will fire event STUDENT_DELETED!`)) {
      return;
    }

    try {
      await fetchAPI(`/students/${studentId}`, { method: 'DELETE' });
      showToast(`Student ${studentId} deleted. Event STUDENT_DELETED sent to ZentraSec!`, 'warning');
      loadStudents();
    } catch (err) {
      showToast('Failed to delete student: ' + err.message, 'error');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Academic Year</th>
                <th>Email Address</th>
                <th>Actions (Triggers Event)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.student_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {st.student_id}
                    </td>
                    <td style={{ fontWeight: '600' }}>{st.name}</td>
                    <td><span className="badge badge-role-teacher">{st.department}</span></td>
                    <td>{st.year}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{st.email || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEditModal(st)}
                          className="btn btn-secondary btn-sm"
                          title="Edit student (fires STUDENT_UPDATED)"
                        >
                          <Edit size={14} color="var(--accent-cyan)" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(st.student_id, st.name)}
                          className="btn btn-danger btn-sm"
                          title="Delete student (DEMO 4: fires STUDENT_DELETED)"
                        >
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

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                {editingStudent ? 'Edit Student Record' : 'Register New Student'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  disabled={!!editingStudent}
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
                    <option value="CSE">CSE</option>
                    <option value="AIML">AIML</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="form-select"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
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
                  {editingStudent ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
