'use client'

import { useState, useEffect, useRef } from 'react'
import { certificatesAPI, uploadAPI } from '@/lib/api'

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCert, setEditingCert] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    year: '',
    icon: 'fas fa-award',
    file: '',
    credentialUrl: '',
    order: 0
  })
  const [saving, setSaving] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const response = await certificatesAPI.getAll()
      setCertificates(response.data.data || [])
    } catch (error) {
      console.error('Failed to load certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (cert = null) => {
    if (cert) {
      setEditingCert(cert)
      setFormData({
        title: cert.title || '',
        issuer: cert.issuer || '',
        year: cert.year || '',
        icon: cert.icon || 'fas fa-award',
        file: cert.file || '',
        credentialUrl: cert.credentialUrl || '',
        order: cert.order || 0
      })
    } else {
      setEditingCert(null)
      setFormData({
        title: '',
        issuer: '',
        year: new Date().getFullYear().toString(),
        icon: 'fas fa-award',
        file: '',
        credentialUrl: '',
        order: (certificates.length + 1)
      })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCert(null)
    setUploadError('')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    setUploadError('')
    try {
      const res = await uploadAPI.uploadFile(file)
      const uploadedUrl = res.data?.data?.url || res.data?.url
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, file: uploadedUrl }))
      }
    } catch (err) {
      setUploadError(err.message || 'File upload failed')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingCert) {
        await certificatesAPI.update(editingCert._id, formData)
      } else {
        await certificatesAPI.create(formData)
      }
      handleCloseForm()
      loadCertificates()
    } catch (err) {
      alert('Error saving certificate: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    try {
      await certificatesAPI.delete(id)
      setCertificates((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      alert('Failed to delete certificate')
    }
  }

  if (loading) {
    return <div className="admin-loading-container"><div className="admin-spinner"></div><p>Loading certifications...</p></div>
  }

  return (
    <div className="admin-projects">
      <div className="page-header">
        <div>
          <h1>Manage Certifications</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Total {certificates.length} credentials stored in MongoDB
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>
          <i className="fas fa-plus"></i> Add New Certificate
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '600px', background: 'white', padding: '2rem', borderRadius: '12px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>{editingCert ? 'Edit Certificate' : 'Add New Certificate'}</h2>
              <button onClick={handleCloseForm} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Development"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Issuer *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. GeeksForGeeks, Apna College"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Year *</label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 2025"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>FontAwesome Icon Class</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. fas fa-award, fab fa-java, fas fa-code"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Certificate Document / PDF / Image
                </label>
                
                {formData.file ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                      <i className="fas fa-file-pdf" style={{ fontSize: '1.5rem', color: '#dc2626' }}></i>
                      <span style={{ fontSize: '0.85rem', color: '#1e293b', wordBreak: 'break-all' }}>
                        {formData.file}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, file: '' })}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: uploadingFile ? 'wait' : 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                    />
                    {uploadingFile ? (
                      <div style={{ color: '#6366f1', fontWeight: 600 }}>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                        Uploading file from system...
                      </div>
                    ) : (
                      <div>
                        <i className="fas fa-cloud-arrow-up" style={{ fontSize: '1.75rem', color: '#64748b', marginBottom: '0.5rem' }}></i>
                        <p style={{ margin: 0, fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                          Click to upload certificate from your computer
                        </p>
                        <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
                          PDF, PNG, JPG, or WEBP up to 15MB
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {uploadError && (
                  <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>{uploadError}</p>
                )}

                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Or enter custom path/URL manually:</span>
                  <input
                    type="text"
                    value={formData.file}
                    onChange={(e) => setFormData({ ...formData, file: e.target.value })}
                    placeholder="/certificates/my_cert.pdf or https://..."
                    style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Credential URL (Optional Link)</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={handleCloseForm} className="btn" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editingCert ? 'Save Changes' : 'Create Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="projects-list" style={{ marginTop: '1.5rem' }}>
        {certificates.map((cert) => (
          <div key={cert._id} className="project-item" style={{ gridTemplateColumns: '60px 1fr auto' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem' }}>
              <i className={cert.icon || 'fas fa-award'}></i>
            </div>
            <div className="project-details">
              <h3>{cert.title}</h3>
              <p style={{ margin: '0.2rem 0' }}><strong>{cert.issuer}</strong> · <span style={{ color: '#64748b' }}>{cert.year}</span></p>
              {cert.file && <code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{cert.file}</code>}
            </div>
            <div className="project-actions">
              <button onClick={() => handleOpenForm(cert)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button onClick={() => handleDelete(cert._id)}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
          <i className="fas fa-award" style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
          <h3>No certificates found</h3>
          <p>Click above to add your first certificate to MongoDB.</p>
        </div>
      )}
    </div>
  )
}
