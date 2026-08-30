import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckSquare, Clock, User, ArrowRight, X } from 'lucide-react';

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assigned_employee: 'Alex Johnson',
    priority: 'High',
    due_date: '2026-09-15',
    status: 'To Do',
    project_name: 'Aurora Cloud Platform'
  });
  const { showToast } = useAuth();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/tasks');
      setTasks(data);
    } catch (err) {
      showToast('Failed to load tasks: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await fetchAPI(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...task, status: newStatus })
      });
      showToast(`Task '${task.title}' moved to ${newStatus}`, 'success');
      loadTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI('/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask)
      });
      showToast(`Task '${newTask.title}' created successfully!`, 'success');
      setIsModalOpen(false);
      setNewTask({
        title: '',
        assigned_employee: 'Alex Johnson',
        priority: 'High',
        due_date: '2026-09-15',
        status: 'To Do',
        project_name: 'Aurora Cloud Platform'
      });
      loadTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const columns = ['To Do', 'In Progress', 'Review', 'Completed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Task Kanban Board</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Track task lifecycle across development stages</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>+ Create Task</span>
        </button>
      </div>

      {/* Kanban Board Columns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);

          return (
            <div key={col} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              minHeight: '400px'
            }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>{col}</span>
                <span className="badge badge-progress" style={{ fontSize: '0.7rem' }}>{colTasks.length}</span>
              </div>

              {/* Task Cards in Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                {colTasks.map(t => (
                  <div key={t.id} style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: '700',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: t.priority === 'High' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: t.priority === 'High' ? '#f87171' : '#fbbf24'
                      }}>
                        {t.priority} Priority
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.project_name}</span>
                    </div>

                    <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-primary)' }}>{t.title}</h4>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>👤 {t.assigned_employee}</span>
                      <span>📅 {t.due_date}</span>
                    </div>

                    {/* Move Status Action Bar */}
                    <div style={{ display: 'flex', gap: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                      {columns.filter(c => c !== col).map(targetCol => (
                        <button
                          key={targetCol}
                          onClick={() => handleUpdateStatus(t.id, targetCol)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', flex: 1, justifyContent: 'center' }}
                          title={`Move to ${targetCol}`}
                        >
                          → {targetCol}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Create New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. API Integration"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Employee</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTask.assigned_employee}
                    onChange={(e) => setNewTask({ ...newTask, assigned_employee: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status Stage</label>
                  <select
                    className="form-select"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
