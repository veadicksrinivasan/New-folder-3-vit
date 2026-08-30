import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Award, Edit3, Trash2, Zap, Check, X } from 'lucide-react';

export const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editMarks, setEditMarks] = useState('');
  const { showToast } = useAuth();

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/results');
      setResults(data);
    } catch (err) {
      showToast('Failed to load results: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const handleStartEdit = (rec) => {
    setEditingId(rec.id);
    setEditMarks(rec.marks.toString());
  };

  const handleSaveMarks = async (resultId) => {
    try {
      const res = await fetchAPI(`/results/${resultId}`, {
        method: 'PUT',
        body: JSON.stringify({ marks: parseInt(editMarks, 10) })
      });

      showToast(`⚡ Marks updated! RESULT_MODIFIED event sent to ZentraSec (${res.message})`, 'success');
      setEditingId(null);
      loadResults();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Demo 3 Quick Action: Rahul Raj Mathematics 65 -> 99
  const handleQuickDemo3 = async () => {
    const rahulRecord = results.find(r => r.student_id === 'S002' && r.subject === 'Mathematics');
    if (!rahulRecord) {
      showToast('Rahul Raj Mathematics record not found', 'error');
      return;
    }

    try {
      await fetchAPI(`/results/${rahulRecord.id}`, {
        method: 'PUT',
        body: JSON.stringify({ marks: 99 })
      });
      showToast('🚨 DEMO 3 EXECUTED: Rahul\'s Math marks modified 65 → 99! RESULT_MODIFIED event dispatched to ZentraSec!', 'warning');
      loadResults();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteResult = async (resultId, studentName, subject) => {
    if (!window.confirm(`Delete ${subject} result for ${studentName}? Triggers RESULT_DELETED.`)) return;

    try {
      await fetchAPI(`/results/${resultId}`, { method: 'DELETE' });
      showToast(`Result deleted! RESULT_DELETED event sent to ZentraSec.`, 'warning');
      loadResults();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner + Quick Demo Button */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={24} color="var(--accent-purple)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Examination Marks & Results</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Grade changes automatically dispatch <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>RESULT_MODIFIED</code> telemetry for threat inspection.
              </p>
            </div>
          </div>

          <button onClick={handleQuickDemo3} className="btn btn-amber">
            <Zap size={16} />
            <span>DEMO 3: Tamper Rahul's Marks (65 → 99)</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Modify Grade (Fires RESULT_MODIFIED)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const isEditing = editingId === r.id;
                const isRahulMath = r.student_id === 'S002' && r.subject === 'Mathematics';

                return (
                  <tr key={r.id} style={{ background: isRahulMath ? 'rgba(245, 158, 11, 0.08)' : 'transparent' }}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {r.student_id}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {r.student_name}
                      {isRahulMath && <span className="badge badge-local" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Demo Target</span>}
                    </td>
                    <td>{r.subject}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '80px', padding: '0.3rem 0.5rem' }}
                          value={editMarks}
                          onChange={(e) => setEditMarks(e.target.value)}
                          min="0"
                          max="100"
                        />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem', color: r.marks >= 90 ? '#34d399' : '#fff' }}>
                          {r.marks} / 100
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-role-admin">
                        {r.grade}
                      </span>
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleSaveMarks(r.id)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem' }}>
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleStartEdit(r)} className="btn btn-secondary btn-sm">
                            <Edit3 size={14} color="var(--accent-cyan)" />
                            <span>Modify Marks</span>
                          </button>
                          <button onClick={() => handleDeleteResult(r.id, r.student_name, r.subject)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.5rem' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
