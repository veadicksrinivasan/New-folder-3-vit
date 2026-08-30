import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAuth();

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/attendance');
      setAttendance(data);
    } catch (err) {
      showToast('Failed to load attendance: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleStatusChange = async (record, newStatus) => {
    if (record.status === newStatus) return;

    try {
      const updated = await fetchAPI(`/attendance/${record.id}`, {
        method: 'PUT',
        body: JSON.stringify({ new_status: newStatus })
      });

      showToast(
        `⚡ Attendance modified for ${record.student_name}: ${record.status} → ${newStatus}. Event ATTENDANCE_MODIFIED sent to ZentraSec!`,
        'success'
      );
      loadAttendance();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarCheck size={24} color="var(--accent-emerald)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Attendance Registry</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Modifying student attendance emits <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>ATTENDANCE_MODIFIED</code> telemetry event to ZentraSec.
              </p>
            </div>
          </div>

          <button onClick={loadAttendance} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Date</th>
                <th>Current Status</th>
                <th>Modify Status (Emits Security Event)</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((rec) => {
                const isPresent = rec.status === 'Present';
                return (
                  <tr key={rec.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {rec.student_id}
                    </td>
                    <td style={{ fontWeight: '600' }}>{rec.student_name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{rec.date}</td>
                    <td>
                      <span className={`badge ${isPresent ? 'badge-sent' : 'badge-failed'}`}>
                        {isPresent ? <><CheckCircle2 size={12} /> Present</> : <><XCircle size={12} /> Absent</>}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleStatusChange(rec, 'Present')}
                          className={`btn btn-sm ${rec.status === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          Mark Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(rec, 'Absent')}
                          className={`btn btn-sm ${rec.status === 'Absent' ? 'btn-danger' : 'btn-secondary'}`}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          Mark Absent
                        </button>
                      </div>
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
