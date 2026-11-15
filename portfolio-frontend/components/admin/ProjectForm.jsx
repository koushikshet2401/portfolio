'use client'

import { useState, useEffect, useRef } from 'react'
import { projectsAPI, uploadAPI, resolveAssetUrl } from '@/lib/api'

export default function ProjectForm({ project, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    githubLink: '',
    liveLink: '',
    technologies: [],
    badges: [],
    featured: false,
    order: 0
  })
  const [techInput, setTechInput] = useState('')
  const [badgeInput, setBadgeInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showManualUrl, setShowManualUrl] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: project.image || '',
        githubLink: project.githubLink || '',
        liveLink: project.liveLink || '',
        technologies: project.technologies || [],
        badges: project.badges || [],
        featured: !!project.featured,
        order: project.order ?? 0,
        _id: project._id
      })
    }
  }, [project])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP)')
      return
    }

    setUploadError('')
    setUploading(true)

    try {
      const response = await uploadAPI.uploadFile(file)
      const isSuccess = response.success || response.data?.success
      const uploadedPath =
        response.url ||
        response.data?.url ||
        response.data?.data?.url ||
        response.fullUrl ||
        response.data?.fullUrl

      if (isSuccess && uploadedPath) {
        setFormData((prev) => ({
          ...prev,
          image: uploadedPath
        }))
      } else {
        throw new Error(response.message || response.data?.message || 'Server could not process image')
      }
    } catch (err) {
      console.error('File upload failed:', err)
      setUploadError(err.message || err.response?.data?.message || 'Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech)
    })
  }

  const handleAddBadge = () => {
    if (badgeInput.trim() && !formData.badges.includes(badgeInput.trim())) {
      setFormData({
        ...formData,
        badges: [...formData.badges, badgeInput.trim()]
      })
      setBadgeInput('')
    }
  }

  const handleRemoveBadge = (badge) => {
    setFormData({
      ...formData,
      badges: formData.badges.filter((b) => b !== badge)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.image) {
      alert('Please upload an image or provide an image URL for the project.')
      return
    }

    setSaving(true)
    try {
      if (project && project._id) {
        await projectsAPI.update(project._id, formData)
      } else {
        await projectsAPI.create(formData)
      }
      onClose()
    } catch (error) {
      alert('Failed to save project: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="modal-header">
          <div>
            <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Changes will save directly to MongoDB and reflect on your public portfolio.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          {/* Project Title */}
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. KnowBridge — AI-Powered Customer Support Platform"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Project Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              placeholder="Brief summary of engineering challenge, architecture, and features..."
              required
            />
          </div>

          {/* System Image Upload Box (Requested: upload directly from computer) */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Project Cover Image *</span>
              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.775rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {showManualUrl ? 'Switch to File Upload' : 'Or enter URL / path'}
              </button>
            </label>

            {!showManualUrl ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  style={{ display: 'none' }}
                />

                {/* Upload Drag & Drop / Click Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb'
                    e.currentTarget.style.background = '#f0f7ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1'
                    e.currentTarget.style.background = '#f8fafc'
                  }}
                >
                  {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
                      <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.75rem' }}></i>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Uploading image to server...</span>
                    </div>
                  ) : formData.image ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                      <img
                        src={resolveAssetUrl(formData.image)}
                        alt="Preview"
                        style={{
                          width: '90px',
                          height: '65px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                          Image Selected
                        </p>
                        <p style={{ margin: '0.15rem 0 0.4rem 0', fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>
                          {formData.image}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                          Click to browse and replace from system
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: '#e0e7ff',
                          color: '#4338ca',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          marginBottom: '0.25rem'
                        }}
                      >
                        <i className="fas fa-cloud-upload-alt"></i>
                      </div>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                        Click to upload an image from your computer
                      </span>
                      <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                        Supports PNG, JPG, JPEG, WEBP up to 10MB
                      </span>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 500 }}>
                    <i className="fas fa-exclamation-circle"></i> {uploadError}
                  </p>
                )}
              </div>
            ) : (
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="e.g. /imgs/aiSupport-dark.png or https://..."
                required
              />
            )}
          </div>

          {/* GitHub and Live Links */}
          <div className="form-row">
            <div className="form-group">
              <label>GitHub Repository URL *</label>
              <input
                type="url"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/koushikshet2401/..."
                required
              />
            </div>
            <div className="form-group">
              <label>Live URL (Optional)</label>
              <input
                type="url"
                value={formData.liveLink}
                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Featured Checkbox & Display Order */}
          <div className="form-row" style={{ alignItems: 'center' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                />
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  Mark as Flagship / Featured Project
                </span>
              </label>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.2rem' }}>
                Featured projects are highlighted at the top of your portfolio
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Display Priority Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Technologies Tags */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Technologies / Tools Stack</label>
            <div className="tech-input-group">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="e.g. React, Node.js, pgvector (Press Enter)"
              />
              <button type="button" onClick={handleAddTech}>Add Tech</button>
            </div>
            <div className="tech-list" style={{ marginTop: '0.5rem' }}>
              {formData.technologies.map((tech, idx) => (
                <span key={idx} className="tech-tag">
                  {tech}
                  <button type="button" onClick={() => handleRemoveTech(tech)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Badges / Pill Tags */}
          <div className="form-group">
            <label>Category Badges (Optional)</label>
            <div className="tech-input-group">
              <input
                type="text"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBadge())}
                placeholder="e.g. AI / RAG, DISTRIBUTED SYSTEMS (Press Enter)"
              />
              <button type="button" onClick={handleAddBadge}>Add Badge</button>
            </div>
            <div className="tech-list" style={{ marginTop: '0.5rem' }}>
              {formData.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="tech-tag"
                  style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}
                >
                  {badge}
                  <button type="button" onClick={() => handleRemoveBadge(badge)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions" style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? 'Saving to Database...' : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
