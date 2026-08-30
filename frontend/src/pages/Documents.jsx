import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Eye, Filter, Download, Plus, X } from 'lucide-react';

export const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    category: 'Company Documents',
    owner: 'Alex Johnson',
    size: '2.5 MB'
  });
  const { showToast } = useAuth();

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI('/documents');
      setDocuments(data);
    } catch (err) {
      showToast('Failed to load documents: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI('/documents', {
        method: 'POST',
        body: JSON.stringify(newDoc)
      });
      showToast(`Document '${newDoc.name}' uploaded successfully!`, 'success');
      setIsModalOpen(false);
      setNewDoc({ name: '', category: 'Company Documents', owner: 'Alex Johnson', size: '2.5 MB' });
      loadDocs();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const categories = [
    'ALL',
    'Company Documents',
    'Project Documents',
    'Technical Documents',
    'Client Documents',
    'Reports'
  ];

  const filteredDocs = documents.filter(d => selectedCategory === 'ALL' || d.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Document Repository</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Centralized storage for company assets, technical specifications, and client proposals</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Owner</th>
                <th>Last Modified</th>
                <th>File Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <FileText size={18} color="var(--accent-primary)" />
                    <span>{doc.name}</span>
                  </td>
                  <td><span className="badge badge-progress">{doc.category}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{doc.owner}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{doc.last_modified}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{doc.size}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => showToast(`Opening preview for ${doc.name}`, 'info')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => showToast(`Downloading ${doc.name}`, 'success')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Upload New Document</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Document Title (with extension)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Q4 Business Report.pdf"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                >
                  <option value="Company Documents">Company Documents</option>
                  <option value="Project Documents">Project Documents</option>
                  <option value="Technical Documents">Technical Documents</option>
                  <option value="Client Documents">Client Documents</option>
                  <option value="Reports">Reports</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Owner</label>
                <input
                  type="text"
                  className="form-input"
                  value={newDoc.owner}
                  onChange={(e) => setNewDoc({ ...newDoc, owner: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
