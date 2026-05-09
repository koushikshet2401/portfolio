'use client'

import { useState, useEffect } from 'react'
import { internshipsAPI } from '@/lib/api'

export default function InternshipForm({ internship, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    duration: '',
    descriptionDesktop: '',
    descriptionMobile: '',
    technologies: [],
    order: 0
  })
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (internship) {
      setFormData(internship)
    }
  }, [internship])

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
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (internship) {
        await internshipsAPI.update(internship._id, formData)
      } else {
        await internshipsAPI.create(formData)
      }
      onClose()
    } catch (error) {
      alert('Failed to save internship')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{internship ? 'Edit Internship' : 'Add New Internship'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-row">
            <div className="form-group">
              <label>Role/Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Web Developer Intern"
                required
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Sash Info Services"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. Mar 2026 - Present"
                required
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Desktop Description (Detailed)</label>
            <textarea
              value={formData.descriptionDesktop}
              onChange={(e) => setFormData({ ...formData, descriptionDesktop: e.target.value })}
              rows="4"
              placeholder="Full detailed paragraph shown on desktop viewports..."
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Description (Brief)</label>
            <textarea
              value={formData.descriptionMobile}
              onChange={(e) => setFormData({ ...formData, descriptionMobile: e.target.value })}
              rows="2"
              placeholder="Short description shown on mobile viewports..."
              required
            />
          </div>

          <div className="form-group">
            <label>Technologies/Tags used</label>
            <div className="tech-input-group">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="e.g., Python, RAG"
              />
              <button type="button" onClick={handleAddTech}>Add</button>
            </div>
            <div className="tech-list">
              {formData.technologies.map((tech, idx) => (
                <span key={idx} className="tech-tag">
                  {tech}
                  <button type="button" onClick={() => handleRemoveTech(tech)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
