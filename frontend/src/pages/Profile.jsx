import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Code, Briefcase, Award } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  const profileData = {
    name: user?.name || 'helloVIT',
    position: user?.title || 'Senior Software Engineer',
    department: user?.department || 'Engineering Department',
    email: user?.email || 'helloVIT',
    phone: '+1 (555) 890-1234',
    joining_date: 'January 15, 2023',
    current_projects: ['Project Aurora', 'Project Atlas'],
    skills: ['React', 'Node.js', 'Python', 'Cloud Computing', 'TypeScript', 'GraphQL', 'Docker']
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Profile Overview Card */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '2.2rem',
          fontWeight: '800',
          boxShadow: 'var(--shadow-md)',
          flexShrink: 0
        }}>
          {profileData.name.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profileData.name}</h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '2px' }}>
            {profileData.position}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {profileData.department} • NexaCore Technologies
          </p>
        </div>

        <span className="badge badge-active" style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}>
          FULL-TIME EMPLOYEE
        </span>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Contact & Organization Details */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Employment Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} color="var(--accent-primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Corporate Email</span>
                <b style={{ color: 'var(--text-primary)' }}>{profileData.email}</b>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} color="var(--accent-primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Direct Phone</span>
                <b style={{ color: 'var(--text-primary)' }}>{profileData.phone}</b>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} color="var(--accent-primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Joining Date</span>
                <b style={{ color: 'var(--text-primary)' }}>{profileData.joining_date}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Projects & Skills */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Current Assigned Projects
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {profileData.current_projects.map(p => (
                <span key={p} className="badge badge-progress" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}>
                  <Briefcase size={14} /> {p}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Core Technical Competencies
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {profileData.skills.map(skill => (
                <span key={skill} style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
